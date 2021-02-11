const menuList = require('../../../models/menu.model');

function homeController() {
    return {
        getProducts: async (req, res, next) => {
            const foods = await menuList.find();
            return res.status(200).render('./user/home', {
                title: 'Home',
                routePath: '/',
                prods: foods,
            });
        },
    };
}

module.exports = homeController;
