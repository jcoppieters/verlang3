import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { queryOne, insert, execute } from '../config/database';

interface Item {
  id: number;
  list: number;
  name: string;
  url: string | null;
  description: string;
  price: string;
  priority: number;
  givenname: string | null;
  givencomment: string;
  givenat: Date | null;
  showfrom: Date | null;
  status: 'A' | 'R' | 'S';
  givenby: number | null;
}

// Add item to list
export async function addItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.listId);
    const { name, url = '', description = '', price = '', showfrom = null } = req.body;

    // Check list ownership
    const list = await queryOne(
      'SELECT user FROM lists WHERE id = ?',
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
        error: 'You can only add items to your own lists'
      });
      return;
    }

    // Get max priority to add new item at top
    const maxPriorityResult = await queryOne<{ maxPriority: number | null }>(
      'SELECT MAX(priority) as maxPriority FROM items WHERE list = ?',
      [listId]
    );
    const newPriority = (maxPriorityResult?.maxPriority || 0) + 1;

    // Insert item
    const itemId = await insert(
      `INSERT INTO items (list, name, url, description, price, priority, showfrom, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'A')`,
      [listId, name, url, description, price, newPriority, showfrom]
    );

    // Update list lastupdate
    await execute('UPDATE lists SET lastupdate = NOW() WHERE id = ?', [listId]);

    const item = await queryOne<Item>(
      'SELECT * FROM items WHERE id = ?',
      [itemId]
    );

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item'
    });
  }
}

// Update item
export async function updateItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const itemId = parseInt(req.params.id);
    const { name, url, description, price, priority, showfrom } = req.body;

    // Get item and check ownership
    const item = await queryOne<Item>(
      `SELECT i.*, l.user as listOwner
       FROM items i
       JOIN lists l ON i.list = l.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    if ((item as any).listOwner !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only edit items in your own lists'
      });
      return;
    }

    // Update item
    await execute(
      `UPDATE items 
       SET name = ?, url = ?, description = ?, price = ?, priority = ?, showfrom = ?
       WHERE id = ?`,
      [name, url || '', description || '', price || '', priority || 1, showfrom || null, itemId]
    );

    // Update list lastupdate
    await execute('UPDATE lists SET lastupdate = NOW() WHERE id = ?', [item.list]);

    const updatedItem = await queryOne<Item>(
      'SELECT * FROM items WHERE id = ?',
      [itemId]
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update item'
    });
  }
}

// Delete item
export async function deleteItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const itemId = parseInt(req.params.id);

    // Get item and check ownership
    const item = await queryOne<Item>(
      `SELECT i.*, l.user as listOwner
       FROM items i
       JOIN lists l ON i.list = l.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    if ((item as any).listOwner !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only delete items from your own lists'
      });
      return;
    }

    await execute('DELETE FROM items WHERE id = ?', [itemId]);

    // Update list lastupdate
    await execute('UPDATE lists SET lastupdate = NOW() WHERE id = ?', [item.list]);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'
    });
  }
}

// Reserve item
export async function reserveItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const itemId = parseInt(req.params.id);
    const { comment = '' } = req.body;

    // Get item
    const item = await queryOne<Item>(
      `SELECT i.*, l.user as listOwner
       FROM items i
       JOIN lists l ON i.list = l.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    if ((item as any).listOwner === req.user.id) {
      res.status(400).json({
        success: false,
        error: 'You cannot reserve items on your own list'
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

    // Reserve item
    await execute(
      `UPDATE items 
       SET status = 'R', givenby = ?, givencomment = ?, givenat = NOW()
       WHERE id = ?`,
      [req.user.id, comment, itemId]
    );

    const updatedItem = await queryOne<Item>(
      `SELECT i.*, IFNULL(u.name, i.givenname) as username
       FROM items i
       LEFT JOIN users u ON i.givenby = u.id
       WHERE i.id = ?`,
      [itemId]
    );

    res.json({
      success: true,
      message: 'Item reserved successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Reserve item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reserve item'
    });
  }
}

// Donate item (mark as given)
export async function donateItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const itemId = parseInt(req.params.id);
    const { comment = '', showfrom = null } = req.body;

    // Get item
    const item = await queryOne<Item>(
      `SELECT i.*, l.user as listOwner
       FROM items i
       JOIN lists l ON i.list = l.id
       WHERE i.id = ?`,
      [itemId]
    );

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    if ((item as any).listOwner === req.user.id) {
      res.status(400).json({
        success: false,
        error: 'You cannot donate to your own list'
      });
      return;
    }

    // Can donate if available or if you reserved it
    if (item.status === 'S') {
      res.status(400).json({
        success: false,
        error: 'Item already donated'
      });
      return;
    }

    if (item.status === 'R' && item.givenby !== req.user.id) {
      res.status(400).json({
        success: false,
        error: 'Item reserved by someone else'
      });
      return;
    }

    // Mark as donated
    await execute(
      `UPDATE items 
       SET status = 'S', givenby = ?, givencomment = ?, givenat = NOW(), showfrom = ?
       WHERE id = ?`,
      [req.user.id, comment, showfrom || null, itemId]
    );

    const updatedItem = await queryOne<Item>(
      `SELECT i.*, IFNULL(u.name, i.givenname) as username
       FROM items i
       LEFT JOIN users u ON i.givenby = u.id
       WHERE i.id = ?`,
      [itemId]
    );

    res.json({
      success: true,
      message: 'Item marked as donated',
      item: updatedItem
    });
  } catch (error) {
    console.error('Donate item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to donate item'
    });
  }
}

// Take back (unreserve/undo donation)
export async function takebackItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const itemId = parseInt(req.params.id);

    // Get item
    const item = await queryOne<Item>(
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

    if (item.givenby !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only take back your own reservations/donations'
      });
      return;
    }

    // Reset item status
    await execute(
      `UPDATE items 
       SET status = 'A', givenby = NULL, givenname = NULL, givencomment = '', givenat = NULL
       WHERE id = ?`,
      [itemId]
    );

    const updatedItem = await queryOne<Item>(
      'SELECT * FROM items WHERE id = ?',
      [itemId]
    );

    res.json({
      success: true,
      message: 'Reservation/donation cancelled',
      item: updatedItem
    });
  } catch (error) {
    console.error('Takeback item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel reservation/donation'
    });
  }
}

// Reorder items (batch update priorities)
export async function reorderItems(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const listId = parseInt(req.params.listId);
    const { itemIds } = req.body; // Array of item IDs in new order

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Item IDs array is required'
      });
      return;
    }

    // Check list ownership
    const list = await queryOne(
      'SELECT user FROM lists WHERE id = ?',
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
        error: 'You can only reorder items in your own lists'
      });
      return;
    }

    // Update priorities based on position in array
    // Top item gets highest priority (100), bottom gets lowest
    const updatePromises = itemIds.map((itemId: number, index: number) => {
      const priority = 100 - index;
      return execute(
        'UPDATE items SET priority = ? WHERE id = ? AND list = ?',
        [priority, itemId, listId]
      );
    });

    await Promise.all(updatePromises);

    // Update list lastupdate
    await execute('UPDATE lists SET lastupdate = NOW() WHERE id = ?', [listId]);

    res.json({
      success: true,
      message: 'Items reordered successfully'
    });
  } catch (error) {
    console.error('Reorder items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder items'
    });
  }
}
