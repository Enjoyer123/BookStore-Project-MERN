const mongoose = require('mongoose');


const ogDiscountSchema = mongoose.Schema({
    ogdiscount:{
        type: Number,
        required:true
    }

})

ogDiscountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ogDiscountSchema.set('toJSON', {
    virtuals: true,
});

exports.OgDiscount = mongoose.model('OgDiscount', ogDiscountSchema);
exports.ogDiscountSchema = ogDiscountSchema;

