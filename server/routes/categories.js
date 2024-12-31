const { Category } = require('../models/category.js');
const {ImageUpload} = require('../models/imageUpload.js')
const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs')


const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});


var imagesArr = [];
var categoryEditId;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
        //imagesArr.push(`${Date.now()}_${file.originalname}`)
       
    },
});

const upload = multer({ storage: storage })
router.post(`/upload`, upload.array("images"), async (req, res) => {
    imagesArr = [];
  
    try {
      for (let i = 0; i < req?.files?.length; i++) {
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        };
  
        const img = await cloudinary.uploader.upload(
          req.files[i].path,
          options,
          function (error, result) {
            imagesArr.push(result.secure_url);
            fs.unlinkSync(`uploads/${req.files[i].filename}`);
          }
        );
      }
  
      let imagesUploaded = new ImageUpload({
        images: imagesArr,
      });
  
      imagesUploaded = await imagesUploaded.save();
      return res.status(200).json(imagesArr);
    } catch (error) {
      console.log(error);
    }
  });


router.get(`/`, async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return res.status(404).json({ mesage: "No data found!!" })
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();


        if (!categoryList) {

            res.status(500).json({ success: false })
        }

        return res.status(200).json({
            "categoryList": categoryList,
            "totalPages": totalPages,
            "page": page,
            

        })

    } catch (error) {
        res.status(500).json({ success: false })
    }



});

router.get('/:id', async (req, res) => {

    categoryEditId = req.params.id;
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })

    }

    return res.status(200).send(category);


});


router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;

 

  const urlArr = imgUrl.split('/');
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split('.')[0];

  const response = await cloudinary.uploader.destroy(imageName,(error, result) => {
      
    }
  );

  if (response) {
    res.status(200).send(response);
  }
});




router.delete("/:id", async (req, res) => {
  
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(404).json({
      message: "Category not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Category Deleted!",
  });
});


router.post("/create", async (req, res) => {
    
  
    let category = new Category({
        name: req.body.name,
        images:imagesArr,
        color:req.body.color
    });
  
    if (!category) {
      res.status(500).json({
        error: err,
        success: false,
      });
    }
  
    category = await category.save();
  
    imagesArr = [];
  
    res.status(201).json(category);
  });




router.put("/:id", async (req, res) => {


    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,

            images: imagesArr,
            color: req.body.color,
        },
        { new: true }
    );

    if (!category) {
        return res.status(500).json({
            message: "Category cannot be updated!",
            success: false,
        });
    }

    imagesArr = [];

    res.send(category);
});


module.exports = router;