const express = require('express');
const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateUser, requireAdmin } = require('../middleware/auth.middleware');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// Upload product image
router.post('/product', authenticateUser, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath);

    res.json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload category image
router.post('/category', authenticateUser, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('category-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('category-images')
      .getPublicUrl(filePath);

    res.json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Upload category image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image - using query parameter instead of path parameter
router.delete('/:bucket', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { bucket } = req.params;
    const { path } = req.query; // Get path from query parameter

    if (!path) {
      return res.status(400).json({ error: 'Path query parameter is required' });
    }

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;