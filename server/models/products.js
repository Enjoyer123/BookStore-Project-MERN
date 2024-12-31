const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    author: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    catName:{
        type:String,
        default:''
    },
    subCatId:{
        type:String,
        default:'',
        require: true
    },
    subCatName:{
        type:String,
        default:''
    },
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isRecommend: {
        type: Boolean,
        default: false,
    },
    isNewrelease: {
        type: Boolean,
        default: false,
    },
    discountPercentage:{
            type: Number,
            require:true
    },
  
    dateCreated: {
        type: Date,
        default: Date.now,
    },

}) 


productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);


// productDiscount:{
//     type: Number,
//     default: true
// },
// productSize:{
//     type: Number,
//     default: 0,
// },
// productPublisher:{
//     type: String,
//     default: 0,
// },
// productWeight:{
//     type: Number,
//     default: 0,
// },
