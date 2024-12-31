const mongoose = require('mongoose');

const bannersSchema = mongoose.Schema({
    images:[
        {
            type:String,
            required:true
        }
    ]
})

bannersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

bannersSchema.set('toJSON', {
    virtuals: true,
});

exports.Banner = mongoose.model('Banners', bannersSchema);
exports.bannersSchema = bannersSchema;
