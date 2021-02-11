const Order = require('../../../models/order.model');

function order() {
    return {
        store: (req, res, next) => {
            const { mobile, address } = req.body;

            if (!mobile || !address) {
                req.flash('error', 'All fileds are required');
                return res.redirect('/cart');
            } else {
                const order = new Order({
                    userId: req.user._id,
                    items: req.session.cart.items,
                    mobile,
                    address,
                });

                order
                    .save()
                    .then((result) => {
                        Order.populate(
                            result,
                            { path: 'userId' },
                            (err, newResult) => {
                                req.flash(
                                    'success',
                                    'Order placed successfully'
                                );
                                delete req.session.cart;

                                // Event Emit
                                const eventEmitter = req.app.get(
                                    'eventEmitter'
                                );
                                eventEmitter.emit('orderPlaced', newResult);

                                return res.redirect('/orders');
                            }
                        );
                    })
                    .catch((err) => {
                        req.flash('error', 'Somthing went wrong');
                        return res.redirect('/cart');
                    });
            }
        },
        index: async (req, res, next) => {
            const orderLists = await Order.find(
                { userId: req.user._id },
                null,
                { sort: { createdAt: -1 } }
            );
            return res.status(200).render('./user/order', {
                title: 'Orders',
                routePath: '/orders',
                orders: orderLists,
            });
        },
        show: async (req, res) => {
            const orderList = await Order.findById(req.params.id);

            if (req.user._id.toString() === orderList.userId.toString()) {
                return res.render('./user/singleOrder', {
                    title: 'Single Order',
                    routePath: '',
                    order: orderList,
                });
            } else {
                return res.redirect('/');
            }
        },
    };
}

module.exports = order;
