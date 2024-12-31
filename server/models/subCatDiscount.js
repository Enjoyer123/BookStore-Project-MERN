const mongoose = require('mongoose');

const subCatDiscountSchema = new mongoose.Schema({
    
    subCatName :{
        type: String,
        required: true, 
    },
    discountPercentage: { 
        type: Number, 
        required: true 
    }
});



subCatDiscountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

subCatDiscountSchema.set('toJSON', {
    virtuals: true,
});

exports.SubCatDiscount = mongoose.model('SubCatDiscount', subCatDiscountSchema);
exports.subCatDiscountSchema = subCatDiscountSchema;

