const bcrypt = require('bcrypt');
const User = require('../../../models/user.model');
const passport = require('passport');

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? './admin/orders' : '/';
    };

    return {
        login: (req, res, next) => {
            res.status(200).render('./user/login', {
                title: 'Login',
                routePath: '/login',
            });
        },
        postLogin: (req, res, next) => {
            const { email, password } = req.body;

            if (!email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/login');
            } else {
                passport.authenticate('local', (err, user, info) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }

                    if (!user) {
                        req.flash('error', info.message);
                        return res.redirect('/login');
                    }

                    req.login(user, (err) => {
                        if (err) {
                            req.flash('error', info.message);
                            return next(err);
                        }

                        return res.redirect(_getRedirectUrl(req));
                    });
                })(req, res, next);
            }
        },
        registration: (req, res, next) => {
            res.status(200).render('./user/registration', {
                title: 'Registration',
                routePath: '/registration',
            });
        },
        postRegistration: async (req, res, next) => {
            const { name, email, password, mobile, address } = req.body;

            function redirectPage(path, message) {
                req.flash('error', message);
                req.flash('name', name);
                req.flash('email', email);
                req.flash('mobile', mobile);
                req.flash('address', address);
                return res.redirect(path);
            }

            if (!name || !email || !password || !mobile || !address) {
                redirectPage('/registration', 'All fields are required');
            } else {
                User.exists({ email: email }, (error, result) => {
                    if (result) {
                        redirectPage('/registration', 'Email already used');
                    }
                });

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                    name,
                    email,
                    password: hashedPassword,
                    mobile,
                    address,
                });

                user.save()
                    .then((result) => {
                        return res.redirect('/');
                    })
                    .catch((err) => {
                        redirectPage('/registration', 'Somthing went wrong');
                    });
            }
        },
        logout: (req, res, next) => {
            req.logout();
            req.user = null;
            return res.redirect('/login');
        },
    };
}

module.exports = authController;
