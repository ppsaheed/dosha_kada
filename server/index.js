const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize orders file if not exists
if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// Helper to read data
const readData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return [];
    }
};

// Helper to write data
const writeData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${file}:`, err);
    }
};

// GET /api/menu
app.get('/api/menu', (req, res) => {
    const menu = readData(MENU_FILE);
    res.json(menu);
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
    const { items, total, paymentMethod, customer, deviceHash } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
    }

    const orders = readData(ORDERS_FILE);

    const newOrder = {
        id: crypto.randomUUID(),
        items,
        total,
        paymentMethod, // 'UPI' or 'Cash'
        paymentStatus: paymentMethod === 'UPI' ? 'pending' : 'pending', // In a real app, UPI might be pending verification
        customer: customer || {},
        deviceHash,
        status: 'received', // received, cooking, ready, completed
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);

    res.status(201).json(newOrder);
});

// GET /api/orders (Admin)
app.get('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    // Sort by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
});

// PATCH /api/orders/:id (Update status)
app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const orders = readData(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (status) orders[orderIndex].status = status;
    if (paymentStatus) orders[orderIndex].paymentStatus = paymentStatus;

    writeData(ORDERS_FILE, orders);

    res.json(orders[orderIndex]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
