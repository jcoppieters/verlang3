-- Allow long product and tracking URLs on wishlist items.
ALTER TABLE items MODIFY COLUMN url TEXT NULL;