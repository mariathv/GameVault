const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema({
    code: {
        type: String,
        required: [true, 'Promo code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative']
    },
    maxUses: {
        type: Number,
        default: null,
        min: [0, 'Maximum uses cannot be negative']
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    usedBy: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        usedAt: {
            type: Date,
            default: Date.now
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    }],
    minimumPurchase: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

PromoCodeSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiryDate;
});

PromoCodeSchema.virtual('isMaxedOut').get(function () {
    if (this.maxUses === null) return false;
    return this.usedCount >= this.maxUses;
});

PromoCodeSchema.virtual('isValid').get(function () {
    return this.isActive && !this.isExpired && !this.isMaxedOut;
});

PromoCodeSchema.methods.hasUserUsedCode = function (userId) {
    return this.usedBy.some(usage => usage.user.toString() === userId.toString());
};

PromoCodeSchema.methods.markAsUsed = async function (userId, orderId) {
    this.usedCount += 1;

    if (userId) {
        if (!this.hasUserUsedCode(userId)) {
            this.usedBy.push({ user: userId, orderId, usedAt: new Date() });
        }


    }
    return this.save();
};

PromoCodeSchema.statics.findValidCode = function (code) {
    return this.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
    }).then(promoCode => {
        if (!promoCode) return null;
        if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) return null;
        return promoCode;
    });
};

PromoCodeSchema.pre('save', function (next) {
    if (this.isModified('code')) {
        this.code = this.code.toUpperCase();
    }
    this.updatedAt = new Date();
    next();
});

PromoCodeSchema.index({ isActive: 1, expiryDate: 1 });
PromoCodeSchema.index({ 'usedBy.user': 1 });

const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);

module.exports = PromoCode;



// // Optional: track which users have used this code
// usedBy: [{
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     usedAt: {
//         type: Date,
//         default: Date.now
//     },
//     orderId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Order'
//     }
// }],
// // Optional: restrict to specific games or categories
// applicableTo: {
//     type: String,
//     enum: ['all', 'specific'],
//     default: 'all'
// },
// specificGames: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Game'
// }],
// Optional: minimum purchase amount
