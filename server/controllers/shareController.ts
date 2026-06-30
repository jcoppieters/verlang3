import { Request, Response } from 'express';
import { query, queryOne, execute } from '../config/database';
import { encodeShareId, decodeShareId } from '../utils/helpers';
import { AuthRequest } from '../middleware/auth';

// Get public shared list
export async function getSharedList(req: Request, res: Response): Promise<void> {
  try {
    const encodedId = parseInt(req.params.encodedId);
    const listId = decodeShareId(encodedId);

    // Get list with owner info
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

// Donate item from public share (no authentication required)
export async function donateFromShare(req: Request, res: Response): Promise<void> {
  try {
    const encodedId = parseInt(req.params.encodedItemId);
    const itemId = decodeShareId(encodedId);
    const { givenname = '', givencomment = '' } = req.body;

    // Get item
    const item = await queryOne(
      'SELECT * FROM items WHERE id = ?',
      [itemId]
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    if (item.status !== 'A') {
      res.status(400).json({
        success: false,
        error: 'Item is not available'
      });
      return;
    }

    // Mark as donated with optional name
    await execute(
      `UPDATE items 
       SET status = 'S', givenname = ?, givencomment = ?, givenat = NOW()
       WHERE id = ?`,
      [givenname || 'Anonymous', givencomment, itemId]
    );

    res.json({
      success: true,
      message: 'Thank you! Item marked as donated',
      listId: item.list
    });
  } catch (error) {
    console.error('Donate from share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to donate item'
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
        (SELECT COUNT(*) FROM items WHERE list = l.id AND status != 'D') as itemCount
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
