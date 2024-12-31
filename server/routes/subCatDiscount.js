const express = require('express');
const router = express.Router();
const { SubCatDiscount } = require('../models/subCatDiscount.js');
const { Product } = require('../models/products.js');

router.post('/create', async (req, res) => {
    const { subCatName, discountPercentage } = req.body;

    // console.log(subCatName)
    // console.log(discountPercentage)


    if (!subCatName || !discountPercentage || discountPercentage <= 0) {
        return res.status(400).json({ error: "Invalid data" });
    }

    try {
        const newDiscount = new SubCatDiscount({ subCatName, discountPercentage });
        await newDiscount.save();
        res.status(201).json({ message: "SubCatDiscount added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const discounts = await SubCatDiscount.find();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {

    const subCatDiscount = await SubCatDiscount.findById(req.params.id);

    if (!subCatDiscount) {
        res.status(500).json({ message: 'The subCatDiscount with the given ID was not found.' })

    }

    return res.status(200).send(subCatDiscount);


});

router.put('/apply-discount-to-subcat', async (req, res) => {
    const { subCatName, discountPercentage } = req.body;
// console.log(subCatName)
// console.log(discountPercentage)

    if (!subCatName || discountPercentage == null) {
        return res.status(400).json({ error: "Subcategory name and discount percentage are required" });
    }

    try {
       
        // ดึงข้อมูลผลิตภัณฑ์ที่ตรงกับชื่อหมวดหมู่ย่อย
        const updatedProducts = await Product.updateMany(
            
            { catName: subCatName}, // ค้นหาผลิตภัณฑ์ตาม subCatName
            [
                {
                    $set: {
                        discountPercentage: discountPercentage,
                        price: {
                            $cond: {
                                if: { $gt: ["$oldPrice", 0] },
                                then: { 
                                    $trunc: [
                                        { $subtract: ["$oldPrice", { $multiply: ["$oldPrice", discountPercentage / 100] }] },
                                        2
                                    ]
                                },
                                else: "$price"
                            }
                        }
                    }
                }
            ]
        );
        console.log(subCatName)
// console.log(discountPercentage)

        if (updatedProducts.modifiedCount > 0) {
            return res.status(200).json({ 
                message: `Discount applied successfully to ${updatedProducts.modifiedCount} products in subcategory "${subCatName}"!`,
                subCatName,
                discountPercentage,
                updatedCount: updatedProducts.modifiedCount
            });
        } else {
            return res.status(404).json({ error: "No products updated" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



router.put("/:id", async (req, res) => {
    const subCatDiscount = await SubCatDiscount.findByIdAndUpdate(
        req.params.id,
        {
           
            subCatName: req.body.subCatName,
            discountPercentage:req.body.discountPercentage   ,
        },
        { new: true }
    );

    if (!subCatDiscount) {
        res.status(404).json({
            message: "the SubCatDiscount can not be updated!",
            status: false,
        });
    }


    res.send(subCatDiscount);
});

router.delete("/:id", async (req, res) => {
    
  
    const deletedUser = await SubCatDiscount.findByIdAndDelete(req.params.id);
  
    if (!deletedUser) {
      res.status(404).json({
        message: "SubCategory not found!",
        success: false,
      });
    }
  
    res.status(200).json({
      success: true,
      message: "Subdiscount Deleted!",
    });
  });
module.exports = router;
