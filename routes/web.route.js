const authController = require('../app/http/controller/auth/auth.controller');
const homeController = require('../app/http/controller/user/home.controller');
const cartController = require('../app/http/controller/user/cart.controller');
const pageNotFound = require('../app/http/controller/404');
const orderController = require('../app/http/controller/user/order.controller');
const adminOrderController = require('../app/http/controller/admin/order.controller');
const adminOrderStatusController = require('../app/http/controller/admin/status.controller');

// middleware
const guestMiddleware = require('../app/http/middleware/guest.middleware');
const authMiddleware = require('../app/http/middleware/auth.middleware');
const adminMiddleware = require('../app/http/middleware/admin.middleware');

function initRoutes(app) {
    // User Route
    app.get('/login', guestMiddleware, authController().login);
    app.post('/login', authController().postLogin);

    app.get('/registration', guestMiddleware, authController().registration);
    app.post('/registration', authController().postRegistration);

    app.post('/logout', authController().logout);

    app.get('/cart', cartController().cart);
    app.post('/update-cart', cartController().updateCart);

    app.get('/orders', authMiddleware, orderController().index);
    app.post('/orders', authMiddleware, orderController().store);
    app.get('/orders/:id', authMiddleware, orderController().show);

    // Admin Route
    app.get('/admin/orders', adminMiddleware, adminOrderController().index);
    app.post(
        '/admin/order/status',
        adminMiddleware,
        adminOrderStatusController().update
    );

    app.get('/', homeController().getProducts);
    app.use('*', pageNotFound().index);
}

module.exports = initRoutes;
