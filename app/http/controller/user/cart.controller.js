function cartController() {
    return {
        cart: (req, res, next) => {
            res.status(200).render('./user/cart', {
                title: 'Cart',
                routePath: '/cart',
            });
        },

        updateCart: (req, res, next) => {
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                };
            }
            const cart = req.session.cart;

            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1,
                };
                cart.totalQty += 1;
                cart.totalPrice += req.body.price;
            } else {
                cart.items[req.body._id].qty += 1;
                cart.totalQty += 1;
                cart.totalPrice += req.body.price;
            }

            return res.status(200).json({
                totalQty: req.session.cart.totalQty,
            });
        },
    };
}

module.exports = cartController;
