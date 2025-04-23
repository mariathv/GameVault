const PromoCode = require('../models/promo');

const promoController = {
    createPromo: async (req, res) => {
        try {
            const promo = await PromoCode.create(req.body);
            res.status(201).json({ message: 'Promo code created', status: true, promo });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message, status: false });
        }
    },

    deletePromo: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await PromoCode.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Promo code not found', status: false });
            }
            res.status(200).json({ message: 'Promo code deleted', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete promo code', status: false });
        }
    },

    getAllPromos: async (req, res) => {
        try {
            const promos = await PromoCode.find().sort({ createdAt: -1 });
            res.status(200).json(promos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve promo codes' });
        }
    },

    getPromoById: async (req, res) => {
        try {
            const promo = await PromoCode.findById(req.params.id);
            if (!promo) {
                return res.status(404).json({ error: 'Promo code not found' });
            }
            res.status(200).json(promo);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching promo code' });
        }
    },

    applyPromo: async (req, res) => {
        try {
            const { code, orderTotal } = req.body;
            const userId = req.user?._id;

            const promo = await PromoCode.findValidCode(code);
            if (!promo) {
                return res.status(400).json({ error: 'Invalid or expired promo code.', status: false });
            }

            if (orderTotal < promo.minimumPurchase) {
                return res.status(400).json({ error: `Minimum purchase of $${promo.minimumPurchase} required.`, status: false });
            }

            if (userId && promo.hasUserUsedCode(userId)) {
                return res.status(400).json({ error: 'You have already used this promo code.', status: false });
            }

            let discount = 0;
            if (promo.discountType === 'percentage') {
                discount = (promo.discountValue / 100) * orderTotal;
            } else if (promo.discountType === 'fixed') {
                discount = promo.discountValue;
            }

            const newTotal = Math.max(orderTotal - discount, 0);

            await promo.markAsUsed(userId);

            res.status(200).json({
                valid: true,
                discount: +discount.toFixed(2),
                newTotal: +newTotal.toFixed(2),
                promoCode: promo.code,
                status: true
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong while applying promo code.', status: false });
        }
    }

};

module.exports = promoController;
