const mongoose = require('mongoose');


const monthlyDiscountSchema = new mongoose.Schema({
    month: { 
        type: Number, 
        required: true 
    }, // ชื่อเดือน เช่น "January", "February", ...
    discountPercentage: { 
        type: Number, 
        required: true 
    }, // เปอร์เซ็นต์การลดราคา
});

monthlyDiscountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

monthlyDiscountSchema.set('toJSON', {
    virtuals: true,
});

exports.MonthDiscount = mongoose.model('MonthDiscount', monthlyDiscountSchema);
exports.monthlyDiscountSchema = monthlyDiscountSchema;

