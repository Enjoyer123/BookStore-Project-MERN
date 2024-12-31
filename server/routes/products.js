const { Category } = require('../models/category.js');
const { Product } = require('../models/products.js');
const { ImageUpload } = require('../models/imageUpload.js')

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
  console.log(req)

  try {
    for (let i = 0; i < req.files?.length; i++) {
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

router.get('/total-product', async (req, res) => {
  try {

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalProducts: totalProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get(`/fiterByPrice`, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 300;
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage)
  let productList = []
  const { subCat, category } = req.query;
  if (req.query.subCat !== "" && req.query.subCat !== undefined) {

    productList = await Product.find({
      subCat: subCat
      // category: category
    }).skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

  } else if (req.query.category !== "" && req.query.category !== undefined) {
    productList = await Product.find({
      // subCat: subCat,
      category: category
    }).skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }
  const filteredProducts = productList.filter((product) => {
    if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
      return false;
    }
    if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    "products": filteredProducts,
    "totalPages": totalPages,
    "page": page,
  });
});


router.get(`/`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 9;
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage)
    if (page > totalPages) {
      return res.status(404).json({ mesage: "No data found!!" })
    }
    const productList = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!productList) {
      res.status(500).json({ success: false })
    }

    return res.status(200).json({
      "products": productList,
      "totalPages": totalPages,
      "page": page,
      "perPage": perPage,
      "totalPosts": totalPosts,
    })

  } catch (error) {
    res.status(500).json({ success: false })
  }
});

router.get(`/subCatNameRelate`, async (req, res) => {
  try {


    const { subCat } = req.query;

    if (!subCat) {
      return res.status(400).json({ message: "subCatId และ category เป็นสิ่งที่จำเป็น" });
    }


    const productList = await Product.find({
      subCat: subCat,

    })

    return res.status(200).json({
      products: productList,

    });

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error); 
    return res.status(500).json({ message: "ข้อผิดพลาดของเซิร์ฟเวอร์ภายใน", success: false });
  }
});

router.get(`/subCatName`, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = 15;


    const { subCat, category } = req.query;
    // console.log(subCat, category)
    if (!subCat || !category) {
      return res.status(400).json({ message: "subCatId และ category เป็นสิ่งที่จำเป็น" });
    }

    const totalPosts = await Product.countDocuments({
      subCat: subCat,
      category: category,
    });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
      return res.status(404).json({ message: "ไม่พบหน้า" });
    }

    const productList = await Product.find({
      subCat: subCat,
      category: category
    })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      "products": productList,
      "totalPages": totalPages,
      "page": page
    });

  } catch (error) {
    console.error("error:", error); // บันทึกข้อผิดพลาดสำหรับการดีบัก
    return res.status(500).json({ message: "error", success: false });
  }
});
router.get(`/rating`, async (req, res) => {


  const page = parseInt(req.query.page) || 1;
  const perPage = 15
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  if (req.query.subCat !== "" && req.query.subCat !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        subCat: req.query.subCat,
        rating: req.query.rating,

      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        subCat: req.query.subCat,
        rating: req.query.rating,

      })
    }

  } else if (req.query.category !== "" && req.query.category !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        category: req.query.category,
        rating: req.query.rating,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        category: req.query.category,
        rating: req.query.rating,
      })
    }

  }

  return res.status(200).json({
    products: productList,
    totalPages: totalPages,
    page: page,
  });
});

router.get(`/CatName`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 15;

    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Error" });
    }

    const totalPosts = await Product.countDocuments({
      category: category
    });

    // console.log("tp",totalPosts)
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
      return res.status(404).json({ message: "ไม่พบหน้า" });
    }

    const productList = await Product.find({
      category: category
    })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      "products": productList,
      "totalPages": totalPages,
      "page": page,
    });

  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "Error fetching", success: false });
  }
});


router.get(`/catName`, async (req, res) => {

  let productList = [];


  productList = await Product.aggregate([
    { $match: { catName: "English Book" } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails"
      }
    }
  ])



  return res.status(200).json({
    products: productList,

  });
})

router.get(`/featured`, async (req, res) => {
  const productList = await Product.find({ isFeatured: true });


  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json({
    products: productList,

  });
});

router.get(`/recommend`, async (req, res) => {
  const productList = await Product.find({ isRecommend: true });


  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json({
    products: productList,

  });
});

router.get(`/newrelease`, async (req, res) => {
  const productList = await Product.find({ isNewrelease: true });


  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json({
    products: productList,

  });
});


router.post('/create', async (req, res) => {


  const category = await Category.findById(req.body.category);

  if (!category) {
    return req.status(404).send("Inalid Category!")
  }

  const images_Array = [];
  const uploadedImages = await ImageUpload.find();

  const images_Arr = uploadedImages?.map((item) => {
    item.images?.map((image) => {
      images_Array.push(image);

    });
  });

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    images: images_Array,
    author: req.body.author,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    category: req.body.category,
    subCat: req.body.subCat,
    catName: req.body.catName,
    subCatId: req.body.subCatId,
    countInStock: req.body.countInStock,
    discountPercentage: req.body.discountPercentage,
    rating: req.body.rating,
    subCatName: req.body.subCatName,
    isFeatured: req.body.isFeatured,
    isRecommend: req.body.isRecommend,
    isNewrelease: req.body.isNewrelease

  });

  product = await product.save();

  if (!product) {
    res.status(500).json({
      error: err,
      success: false
    })
  }
  imagesArr = [];
  res.status(201).json(product)



});


router.get('/:id', async (req, res) => {
  const productEditId = req.params.id;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'The product with the given ID was not found.' });
  }

  return res.status(200).send(product);
});


router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      subCat: req.body.subCat,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
      author: req.body.author,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      category: req.body.category,
      countInStock: req.body.countInStock,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      isRecommend: req.body.isRecommend,
      isNewrelease: req.body.isNewrelease
    },
    { new: true }
  );
  if (!product) {
    res.status(404).json({
      message: "the product can not be updated!",
      status: false,
    });
  }
  imagesArr = [];
  res.status(200).json({
    message: "the product is updated!",
    status: true,
  });
});

router.delete("/deleteImage", async (req, res) => {
  const imgUrl = req.query.img;

  console.log(imgUrl)

  const urlArr = imgUrl.split('/');
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split('.')[0];

  const response = await cloudinary.uploader.destroy(imageName, (error, result) => {
    console.log(error, result)
  }
  );

  if (response) {
    res.status(200).send(response);
  }
});




router.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const images = product.images;
  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];
    cloudinary.uploader.destroy(imageName, (error, result) => {
    });

  }
  const deletedproduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedproduct) {
    res.status(404).json({
      message: "product not found!",
      success: false,
    });
  }
  res.status(200).json({
    success: true,
    message: "product Deleted!",
  });
});





module.exports = router