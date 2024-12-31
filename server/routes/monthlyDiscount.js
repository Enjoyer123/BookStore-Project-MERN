const express = require('express');
const router = express.Router();
const { MonthDiscount } = require('../models/monthlyDiscount.js');

const {OgDiscount} = require('../models/ogDiscount.js')
const { Product } = require('../models/products.js');


router.post('/create-monthly-discount', async (req, res) => {
    const { month, discountPercentage } = req.body;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({
            error: "Invalid month. Must be between 1 and 12."
        });
    }

    if (!discountPercentage || discountPercentage <= 0) {
        return res.status(400).json({
            error: "Invalid discount percentage"
        });
    }

    try {
        const newDiscount = new MonthDiscount({
            month: month,
            discountPercentage: discountPercentage
        });

        await newDiscount.save();

        return res.status(201).json({
            message: `Discount created successfully for month ${month}`,
            newDiscount
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
});






router.get('/get-monthly-discount/:month', async (req, res) => {
    const { month } = req.params;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({
            error: "Invalid month. Must be between 1 and 12."
        });
    }

    try {
        const discount = await MonthDiscount.findOne({ month: month });

        if (!discount) {
            return res.status(404).json({
                error: `No discount found for month ${month}`
            });
        }

        return res.status(200).json(discount);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
});



router.get('/', async (req, res) => {
    try {
        const discounts = await MonthDiscount.find();
        return res.status(200).json(discounts);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
});

router.get('/:id', async (req, res) => {

    const discount = await MonthDiscount.findById(req.params.id);

    if (!discount) {
        res.status(500).json({ message: 'The discount with the given ID was not found.' })

    }

    return res.status(200).send(discount);


});




const applyMonthlyDiscount = async () => {
    const currentMonth = new Date().getMonth() + 1; // ดึงเดือนปัจจุบัน (1-12)

    try {
        // ดึงเปอร์เซ็นต์ลดราคาสำหรับเดือนปัจจุบันจาก MonthlyDiscount
        const monthlyDiscount = await MonthDiscount.findOne({ month: currentMonth });
        // console.log(monthlyDiscount)
        if (!monthlyDiscount) {
            console.log(`No discount set for month ${currentMonth}`);
            return;
        }

        const discountPercentage = monthlyDiscount.discountPercentage;

        // อัปเดตราคาสินค้าทั้งหมด
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
                                then: { $add: [discountPercentage, 5] }, // เพิ่ม 5%
                                else: discountPercentage // ถ้าไม่เกิน ใช้เปอร์เซ็นต์ตามที่ตั้งค่า
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
                                                                        then: { $add: [discountPercentage, 5] }, // ใช้เปอร์เซ็นต์ที่เพิ่ม 5%
                                                                        else: discountPercentage
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
            console.log(`Discount applied successfully to ${updatedProducts.modifiedCount} products for month ${currentMonth}!`);

            // คืนค่า discount หลังจาก 24 ชั่วโมง
            setTimeout(async () => {
                try {
                    // ดึงค่า ogDiscount สำหรับผลิตภัณฑ์ที่ถูกอัปเดต
                    const originalDiscounts = await OgDiscount.find();
                    console.log(originalDiscounts[0].ogdiscount)
                   

                    const revertedProducts = await Product.updateMany(
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

                    if (revertedProducts.modifiedCount > 0) {
                        console.log(`Discount reverted back for ${revertedProducts.modifiedCount} products after 24 hours.`);
                    } else {
                        console.log(`No products reverted.`);
                    }
                } catch (err) {
                    console.error(`Error reverting discount:`, err.message);
                }
            },  24 * 60 * 60 * 1000); // ตั้งเวลา 24 ชั่วโมง (1000ms * 60s * 60m * 24h)
        } else {
            console.log(`No products updated for month ${currentMonth}.`);
        }
    } catch (err) {
        console.error(`Error applying discount for month ${currentMonth}:`, err.message);
    }
};


const cron = require('node-cron');

cron.schedule('1 0 1 1 *', () => {
    console.log("Running on January 1st at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 2 2 *', () => {
    console.log("Running on February 2nd at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 3 3 *', () => {
    console.log("Running on March 3rd at 00:01 AM!");
    applyMonthlyDiscount();  
});

// เพิ่มเติมสำหรับเดือนที่เหลือ
cron.schedule('1 0 4 4 *', () => {
    console.log("Running on April 4th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 5 5 *', () => {
    console.log("Running on May 5th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 6 6 *', () => {
    console.log("Running on June 6th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 7 7 *', () => {
    console.log("Running on July 7th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 8 8 *', () => {
    console.log("Running on August 8th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 9 9 *', () => {
    console.log("Running on September 9th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 10 10 *', () => {
    console.log("Running on October 10th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 11 11 *', () => {
    console.log("Running on November 11th at 00:01 AM!");
    applyMonthlyDiscount();  
});

cron.schedule('1 0 12 12 *', () => {
    console.log("Running on December 12th at 00:01 AM!");
    applyMonthlyDiscount();  
});




  // PUT: อัปเดต discount สำหรับเดือนที่กำหนด
router.put('/update-monthly-discount/:month', async (req, res) => {
    const { month } = req.params;
    const { discountPercentage } = req.body;

    if (!discountPercentage || discountPercentage <= 0) {
        return res.status(400).json({
            error: "Invalid discount percentage"
        });
    }

    try {
        const updatedDiscount = await MonthDiscount.findOneAndUpdate(
            { month: month },
            { discountPercentage: discountPercentage },
            { new: true, upsert: true } // upsert: true เพื่อสร้างใหม่หากไม่พบ
        );

        return res.status(200).json({
            message: `Discount updated successfully for month ${month}`,
            updatedDiscount
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
});


router.put("/:id", async (req, res) => {

    const discount = await MonthDiscount.findByIdAndUpdate(
        req.params.id,
        {
            month: req.body.month,

            discountPercentage: req.body.discountPercentage,
        },
        { new: true }
    );

    if (!discount) {
        return res.status(500).json({
            message: "discount cannot be updated!",
            success: false,
        });
    }


    res.send(discount);
});


module.exports = router;