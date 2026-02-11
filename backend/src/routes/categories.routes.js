const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticateUser, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Category not found' });
  }
});

// Create category (Admin only)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{ name, description, image_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Category created', data });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ name, description, image_url })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Category updated', data });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;