const Order = require('../../../models/order.model');

function order() {
    return {
        index: (req, res, next) => {
            Order.find({ status: { $ne: 'completed' } }, null, {
                sort: { createdAt: -1 },
            })
                .populate('userId', '-password')
                .exec((err, orders) => {
                    if (req.xhr) {
                        res.json(orders);
                    } else {
                        return res.render('./admin/order', {
                            title: '',
                            routePath: '',
                        });
                    }
                });
        },
    };
}

module.exports = order;
