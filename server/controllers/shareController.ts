import { Request, Response } from 'express';
import { query, queryOne } from '../config/database';
import { encodeShareId, decodeShareId } from '../utils/helpers';
import { AuthRequest } from '../middleware/auth';

// Get public shared list
export async function getSharedList(req: Request, res: Response): Promise<void> {
  try {
    const encodedId = parseInt(req.params.encodedId);
    const listId = decodeShareId(encodedId);

    // Validate the decoded ID by re-encoding
    if (encodeShareId(listId) !== encodedId) {
      res.status(404).json({
        success: false,
        error: 'Invalid share link'
      });
      return;
    }

    // Get list with owner info (share links work for both public and private lists)
    const list = await queryOne(
      `SELECT l.*, u.name as username
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

    // Get items (only show items that should be visible)
    const items = await query(
      `SELECT i.*, 
        IFNULL(u.name, i.givenname) as username,
        IF(i.showfrom <= DATE(NOW()) OR i.showfrom IS NULL, 'T', 'F') as shown
       FROM items i
       LEFT JOIN users u ON i.givenby = u.id
       WHERE i.list = ?
       ORDER BY i.priority DESC, i.id DESC`,
      [listId]
    );

    // Filter out items that shouldn't be shown yet
    const visibleItems = items.filter((item: any) => item.shown === 'T');

    res.json({
      success: true,
      list: {
        id: list.id,
        name: list.name,
        owner: {
          name: list.username
        },
        lastupdate: list.lastupdate
      },
      items: visibleItems.map((item: any) => ({
        ...item,
        sid: encodeShareId(item.id)
      }))
    });
  } catch (error) {
    console.error('Get shared list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get shared list'
    });
  }
}

// Search for users and public lists
// Follow a list via share link (works for both public and private lists)
export async function followFromShare(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const encodedId = parseInt(req.params.encodedId);
    const listId = decodeShareId(encodedId);

    // Validate the decoded ID by re-encoding
    if (encodeShareId(listId) !== encodedId) {
      res.status(404).json({
        success: false,
        error: 'Invalid share link'
      });
      return;
    }

    // Check if list exists
    const list = await queryOne(
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

    // Add follow (works for both public and private lists when via share link)
    await query(
      'INSERT INTO follows (user, list) VALUES (?, ?)',
      [req.user.id, listId]
    );

    res.json({
      success: true,
      message: 'Now following this list',
      listId
    });
  } catch (error) {
    console.error('Follow from share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to follow list'
    });
  }
}

// Search for users and public lists
export async function search(req: AuthRequest, res: Response): Promise<void> {
  try {
    const q = req.query.q as string;
    const userId = req.user?.id;

    if (!q || q.trim().length < 2) {
      res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
      return;
    }

    const searchTerm = `%${q}%`;

    // Search users
    const users = await query(
      `SELECT id, name, username, since
       FROM users
       WHERE name LIKE ? OR username LIKE ?
       LIMIT 50`,
      [searchTerm, searchTerm]
    );

    // Search public lists (excluding current user's own lists)
    const lists = await query(
      `SELECT l.*, u.name as username, u.id as userId,
        (SELECT COUNT(*) FROM items WHERE list = l.id) as itemCount
       FROM lists l
       JOIN users u ON l.user = u.id
       WHERE l.public = 'Y' 
       AND l.user != ?
       AND (l.name LIKE ? OR u.name LIKE ?)
       LIMIT 50`,
      [userId, searchTerm, searchTerm]
    );

    res.json({
      success: true,
      users,
      lists
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
}
