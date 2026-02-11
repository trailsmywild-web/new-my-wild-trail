const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          stock
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    let result;

    if (existingItem) {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('cart')
        .insert([{ user_id: req.user.id, product_id, quantity }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json({ message: 'Item added to cart', data: result });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Cart updated', data });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;