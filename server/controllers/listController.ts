import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query, queryOne, insert, execute } from '../config/database';
import { encodeShareId } from '../utils/helpers';
import { sendShareEmail } from '../utils/email';

interface List {
  id: number;
  user: number;
  name: string;
  public: 'Y' | 'N';
  lastupdate: Date;
}

interface ListWithOwner extends List {
  username?: string;
  itemCount?: number;
}

// Get all lists (own + followed)
export async function getAllLists(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    // Get user's own lists
    const myLists = await query<ListWithOwner>(
      `SELECT l.*, 
        (SELECT COUNT(*) FROM items WHERE list = l.id AND status != 'D') as itemCount
       FROM lists l 
       WHERE l.user = ? 
       ORDER BY l.lastupdate DESC`,
      [req.user.id]
    );

    // Get followed lists
    const followedLists = await query<ListWithOwner>(
      `SELECT l.*, u.name as username,
        (SELECT COUNT(*) FROM items WHERE list = l.id AND status != 'D') as itemCount
       FROM lists l
       JOIN follows f ON f.list = l.id
       JOIN users u ON l.user = u.id
       WHERE f.user = ?
       ORDER BY u.name, l.name`,
      [req.user.id]
    );

    res.json({
      success: true,
      myLists,
      followedLists
    });
  } catch (error) {
    console.error('Get all lists error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get lists'
    });
  }
}

// Get single list details
export async function getList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);

    // Get list with owner info
    const list = await queryOne<ListWithOwner>(
      `SELECT l.*, u.name as ownerName, u.id as userId
       FROM lists l
       JOIN users u ON l.user = u.id
       WHERE l.id = ?`,
      [listId]
    );

    if (!list) {
      res.status(404).json({
        success: false,
        error: 'List not found'
      });
      return;
    }

    // Check if user has access (owner or list is public or user follows it)
    const isOwner = list.user === req.user.id;
    const isFollowing = await queryOne(
      'SELECT 1 FROM follows WHERE user = ? AND list = ?',
      [req.user.id, listId]
    );

    if (!isOwner && list.public === 'N' && !isFollowing) {
      res.status(403).json({
        success: false,
        error: 'You do not have access to this list'
      });
      return;
    }

    // Get items
    const items = await query(
      `SELECT i.*, 
        IFNULL(u.name, i.givenname) as username,
        IF(i.showfrom IS NULL OR i.showfrom <= DATE(NOW()), 'T', 'F') as shown
       FROM items i
       LEFT JOIN users u ON i.givenby = u.id
       WHERE i.list = ?
       ORDER BY i.priority DESC, i.id DESC`,
      [listId]
    );

    res.json({
      success: true,
      list: {
        ...list,
        isOwner,
        isFollowing: !!isFollowing
      },
      items
    });
  } catch (error) {
    console.error('Get list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get list'
    });
  }
}

// Create new list
export async function createList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const { name, public: isPublic = 'N' } = req.body;

    const listId = await insert(
      'INSERT INTO lists (user, name, public, lastupdate) VALUES (?, ?, ?, NOW())',
      [req.user.id, name, isPublic]
    );

    const list = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list
    });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create list'
    });
  }
}

// Update list
export async function updateList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);
    const { name, public: isPublic } = req.body;

    // Check ownership
    const list = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    if (!list) {
      res.status(404).json({
        success: false,
        error: 'List not found'
      });
      return;
    }

    if (list.user !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only edit your own lists'
      });
      return;
    }

    // Update list
    await execute(
      'UPDATE lists SET name = ?, public = ?, lastupdate = NOW() WHERE id = ?',
      [name, isPublic, listId]
    );

    const updatedList = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    res.json({
      success: true,
      message: 'List updated successfully',
      list: updatedList
    });
  } catch (error) {
    console.error('Update list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update list'
    });
  }
}

// Delete list
export async function deleteList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);

    // Check ownership
    const list = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    if (!list) {
      res.status(404).json({
        success: false,
        error: 'List not found'
      });
      return;
    }

    if (list.user !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only delete your own lists'
      });
      return;
    }

    // Delete items, follows, and list
    await execute('DELETE FROM items WHERE list = ?', [listId]);
    await execute('DELETE FROM follows WHERE list = ?', [listId]);
    await execute('DELETE FROM lists WHERE id = ?', [listId]);

    res.json({
      success: true,
      message: 'List and all items deleted successfully'
    });
  } catch (error) {
    console.error('Delete list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete list'
    });
  }
}

// Follow list
export async function followList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);

    // Check if list exists and is public
    const list = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    if (!list) {
      res.status(404).json({
        success: false,
        error: 'List not found'
      });
      return;
    }

    if (list.user === req.user.id) {
      res.status(400).json({
        success: false,
        error: 'You cannot follow your own list'
      });
      return;
    }

    // Check if already following
    const alreadyFollowing = await queryOne(
      'SELECT 1 FROM follows WHERE user = ? AND list = ?',
      [req.user.id, listId]
    );

    if (alreadyFollowing) {
      res.status(400).json({
        success: false,
        error: 'You are already following this list'
      });
      return;
    }

    // Add follow
    await insert(
      'INSERT INTO follows (user, list) VALUES (?, ?)',
      [req.user.id, listId]
    );

    res.json({
      success: true,
      message: 'Now following this list'
    });
  } catch (error) {
    console.error('Follow list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to follow list'
    });
  }
}

// Unfollow list
export async function unfollowList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);

    await execute(
      'DELETE FROM follows WHERE user = ? AND list = ?',
      [req.user.id, listId]
    );

    res.json({
      success: true,
      message: 'Unfollowed list successfully'
    });
  } catch (error) {
    console.error('Unfollow list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unfollow list'
    });
  }
}

// Share list via email
export async function shareList(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.id);
    const { email, message } = req.body;

    // Check list ownership
    const list = await queryOne<List>(
      'SELECT * FROM lists WHERE id = ?',
      [listId]
    );

    if (!list) {
      res.status(404).json({
        success: false,
        error: 'List not found'
      });
      return;
    }

    if (list.user !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only share your own lists'
      });
      return;
    }

    // Generate share URL
    const encodedId = encodeShareId(listId);
    const shareUrl = `${process.env.APP_URL || 'http://localhost:3000'}/#/share/${encodedId}`;

    // Send email
    const emailSent = await sendShareEmail(
      email,
      req.user.name,
      list.name,
      shareUrl,
      message
    );

    if (!emailSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send email'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Share email sent successfully',
      shareUrl
    });
  } catch (error) {
    console.error('Share list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to share list'
    });
  }
}
