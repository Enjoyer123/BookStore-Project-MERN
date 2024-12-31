const { Product } = require('../models/products.js');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' });
        }

        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } }
            ]
        });
        return res.status(200).json({
            "products": items,
          })
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});



module.exports = router;