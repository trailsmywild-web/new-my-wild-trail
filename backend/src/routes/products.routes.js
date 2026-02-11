const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticateUser, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Product not found' });
  }
});

// Create product (Admin only)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image_url, images, is_featured } = req.body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name,
        description,
        price,
        category_id,
        stock,
        image_url,
        images,
        is_featured: is_featured || false,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Product created', data });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image_url, images, is_featured, is_active } = req.body;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        name,
        description,
        price,
        category_id,
        stock,
        image_url,
        images,
        is_featured,
        is_active
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Product updated', data });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;