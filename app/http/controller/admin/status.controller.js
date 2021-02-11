const Order = require('../../../models/order.model');

function statusController() {
    return {
        update: (req, res, next) => {
            Order.updateOne(
                { _id: req.body.orderId },
                { status: req.body.status },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.redirect('/admin/orders');
                    }

                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderStatusUpdated', {
                        id: req.body.orderId,
                        status: req.body.status,
                    });
                    return res.redirect('/admin/orders');
                }
            );
        },
    };
}

module.exports = statusController;
