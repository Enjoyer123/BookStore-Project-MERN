const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();



router.get(`/`, async (req, res) => {

    try {
        
            let subCategoryList=[]
       

            subCategoryList = await SubCategory.find().populate("category")



        if (!subCategoryList) {

            res.status(500).json({ success: false })
        }

        return res.status(200).json({
            "subCategoryList": subCategoryList,
           
        })

    } catch (error) {
        res.status(500).json({ success: false })
    }



});



router.get('/:id', async (req, res) => {

    const subCat = await SubCategory.findById(req.params.id).populate("category");

    if (!subCat) {
        res.status(500).json({ message: 'The subCategory with the given ID was not found.' })

    }

    return res.status(200).send(subCat);


});

router.post('/create', async (req, res) => {


  
    let subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat,
        
    });

    if (!subCat) {
        res.status(500).json({
            error: err,
            success: false
        })
    }

    subCat = await subCat.save();
   
    res.status(201).json(subCat);


});


router.delete("/:id", async (req, res) => {
    
  
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  
    if (!subCategory) {
      res.status(404).json({
        message: "SubCategory not found!",
        success: false,
      });
    }
  
    res.status(200).json({
      success: true,
      message: "SubCategory Deleted!",
    });
  });

router.put("/:id", async (req, res) => {
    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
           
            category: req.body.category,
            subCat:req.body.subCat   ,
            images:imagesArr  
        },
        { new: true }
    );

    if (!subCat) {
        res.status(404).json({
            message: "the subcategory can not be updated!",
            status: false,
        });
    }


    res.send(subCat);
});

module.exports = router;