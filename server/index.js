const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
// const authJwt = require('./helper/jwt.js');



app.use(cors());
app.options('*', cors())



//middleware
app.use(bodyParser.json());
app.use(express.json());
// app.use(authJwt());

//Route
const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat');
const productRoutes = require('./routes/products');
const imageUploadRoutes = require('./helper/imageUpload.js');
const userRoutes = require('./routes/user.js');
const cartSchema = require('./routes/cart.js');
const myListSchema = require('./routes/myList.js');
const ordersSchema = require('./routes/orders.js');
const homeBannerSchema = require('./routes/homeBanner.js');
const bannersSchema = require('./routes/banners.js');
const searchRoutes = require('./routes/search.js');
const monthlyDiscountSchema = require('./routes/monthlyDiscount.js') 
const subCatDiscountSchema = require('./routes/subCatDiscount.js') 
const ogDiscount = require('./routes/ogDiscount.js')

app.use(`/api/my-list`, myListSchema);
app.use("/uploads",express.static("uploads"));
app.use(`/api/category`,categoryRoutes);
app.use(`/api/subCat`, subCatRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use("/api/user",userRoutes);
app.use(`/api/cart`, cartSchema);
app.use(`/api/orders`, ordersSchema);
app.use(`/api/homeBanner`, homeBannerSchema);
app.use(`/api/banners`, bannersSchema);
app.use(`/api/search`, searchRoutes);
app.use(`/api/discount`, monthlyDiscountSchema);
app.use(`/api/subdiscount`, subCatDiscountSchema);
app.use(`/api/ogdiscount`, ogDiscount);





//Database
mongoose.connect(process.env.CONNECTION_STRING, {
   
})
    .then(() => {
        console.log('Database Connection is ready...');
        //Server
        app.listen(process.env.PORT, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })


