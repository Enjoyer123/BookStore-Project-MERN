const express = require('express');
const router = express.Router();
const {OgDiscount} = require('../models/ogDiscount.js')
const {Product} = require('../models/products.js')

const multer = require('multer')
const fs = require('fs')


// เพิ่ม Discount ใหม่
router.post('/create', async (req, res) => {
    try {
        const ogDiscount = req.body;

     
        console.log(ogDiscount);

      
        const newDiscount = new OgDiscount(ogDiscount);

       
        await newDiscount.save();

      
        res.status(201).json({ message: 'Discount created successfully', data: newDiscount });
    } catch (error) {
        console.error(error);
     
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const ogdiscount = await OgDiscount.find();
        res.status(200).json(ogdiscount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {

    const ogdiscount = await OgDiscount.findById(req.params.id);

    if (!ogdiscount) {
        res.status(500).json({ message: 'The ogdiscount with the given ID was not found.' })

    }

    return res.status(200).send(ogdiscount);


});
router.put("/update-all-discount-to-og", async (req, res) => {
    const currentMonth = new Date().getMonth() + 1; // ดึงเดือนปัจจุบัน (1-12)

    try {
        // ดึงเปอร์เซ็นต์ลดราคาสำหรับเดือนปัจจุบันจาก MonthlyDiscount
       
        const originalDiscounts = await OgDiscount.find();
        if (!originalDiscounts.length) {
            return res.status(404).send('No original discounts found.');
        }

        // console.log(originalDiscounts[0].ogdiscount); // ตรวจสอบค่า ogdiscount


        
        const updatedProducts = await Product.updateMany(
            {},
            [
                {
                    $set: {
                        discountPercentage: {
                            $cond: {
                                if: {
                                    $gt: [
                                        { $subtract: [new Date(), "$dateCreated"] },
                                        1000 * 60 * 60 * 24 * 30 * 6 // ถ้าเกิน 6 เดือน
                                    ]
                                },
                                then: { $add: [originalDiscounts[0].ogdiscount, 5] }, // เพิ่ม 5%
                                else: originalDiscounts[0].ogdiscount // ถ้าไม่เกิน ใช้เปอร์เซ็นต์ตามที่ตั้งค่า
                            }
                        },
                        price: {
                            $cond: {
                                if: { $gt: ["$oldPrice", 0] },  // ถ้ามี oldPrice
                                then: {
                                    $trunc: [
                                        { 
                                            $subtract: [
                                                "$oldPrice", 
                                                { 
                                                    $multiply: [
                                                        "$oldPrice", 
                                                        { 
                                                            $divide: [
                                                                {
                                                                    $cond: {
                                                                        if: {
                                                                            $gt: [
                                                                                { $subtract: [new Date(), "$dateCreated"] },
                                                                                1000 * 60 * 60 * 24 * 30 * 6
                                                                            ]
                                                                        },
                                                                        then: { $add: [originalDiscounts[0].ogdiscount, 5] }, // ใช้เปอร์เซ็นต์ที่เพิ่ม 5%
                                                                        else: originalDiscounts[0].ogdiscount
                                                                    }
                                                                },
                                                                100
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        2 // ปัดเป็นทศนิยม 2 ตำแหน่ง
                                    ]
                                },
                                else: "$price" // ถ้าไม่มี oldPrice ให้ใช้ราคาเดิม
                            }
                        }
                    }
                }
            ]
        );

        if (updatedProducts.modifiedCount > 0) {
            console.log(`Discount applied successfully to ${updatedProducts.modifiedCount} products.`);
            return res.status(200).send(`Discount applied to ${updatedProducts.modifiedCount} products.`);
        } else {
            return res.status(400).send(`No products were updated.`);
        }
    } catch (error) {
        console.error('Error updating products:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.put("/:id", async (req, res) => {
    const ogDiscount = await OgDiscount.findByIdAndUpdate(
        req.params.id,
        {
           
            ogdiscount: req.body.ogdiscount,
           
        },
        { new: true }
    );

    if (!ogDiscount) {
        res.status(404).json({
            message: "the ogDiscount can not be updated!",
            status: false,
        });
    }


    res.send(ogDiscount);
});

router.delete("/:id", async (req, res) => {
    
  
    const ogdiscount = await OgDiscount.findByIdAndDelete(req.params.id);
  
    if (!ogdiscount) {
      res.status(404).json({
        message: "ogdiscount not found!",
        success: false,
      });
    }
  
    res.status(200).json({
      success: true,
      message: "ogdiscount Deleted!",
    });
  });




  module.exports = router;
