const PassportLocal = require('passport-local').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

function init(passport) {
    passport.use(
        new PassportLocal(
            { usernameField: 'email' },
            async (email, password, done) => {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, {
                        message: 'No user with this email',
                    });
                }

                bcrypt
                    .compare(password, user.password)
                    .then((match) => {
                        if (match) {
                            return done(null, user, {
                                message: 'Logged in succesfully',
                            });
                        }
                        return done(null, false, {
                            message: 'Wrong email or password',
                        });
                    })
                    .catch((err) => {
                        return done(null, false, {
                            message: 'Something went wrong',
                        });
                    });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        User.findOne({ email }, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = init;
