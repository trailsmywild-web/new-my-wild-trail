const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticateUser, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateUser);

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        ),
        addresses (
          address_line1,
          city,
          state,
          postal_code
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        addresses (*)
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Order not found' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { items, shipping_address_id, payment_method, notes } = req.body;

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price, name')
        .eq('id', item.product_id)
        .single();

      const subtotal = product.price * item.quantity;
      total += subtotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: req.user.id,
        order_number: orderNumber,
        total_amount: total,
        shipping_address_id,
        payment_method,
        notes,
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) throw itemsError;

    await supabase
      .from('cart')
      .delete()
      .eq('user_id', req.user.id);

    res.status(201).json({ message: 'Order created', data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (Admin)
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        users (email, full_name),
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (Admin)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, payment_status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status, payment_status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Order status updated', data });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;