const bcrypt = require('bcryptjs');
const User = require('../models/user');

//rendering the home page and checking if thier is flash message
exports.getIndex = (req, res, next) => {
    res.render('index', {isAuthenticated:false,
        pageTitle: 'We Talk',
        errorMsg:req.flash('error'),
        successMsg:req.flash('success'),
        warnMsg:req.flash('warn')
    });
}

//creating a new account on the application
exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((userInfo) => {
            //checking if the entered email is already exist in the database
            if (userInfo) {
                req.flash('error', 'This email address is already being used');
                return res.redirect('/')
            }
            //hashing the password before soring it into DB 
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(() => {
                    req.flash('success', 'Account created successfully, You can now login.');
                    res.redirect('/');
                })
        })
        .catch(err => {
            console.error(err);
        });

}

//user authentication
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        //checking if the user exists in DB or not
        if (!user) {
            req.flash('error','Invalid email or password.');
            return res.redirect('/');
        }
        //comparing the password hash against the stored hashed one
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (!doMatch) {
                req.flash('error','Invalid email or password.');
                return res.redirect('/');
            }
            //setting session for the user after login
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session
            .save(() => {
                res.redirect('/rooms');
            })
        })
        .catch(err => {
            console.log(err);
        });
    });
}

//deleting the session if the user logged out 
exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}

//protecting the routes by checking if the user is logged in or not
exports.isAuthed = (req, res, next) => {
    const authStatus = req.session.isLoggedIn;
    if (!authStatus){
        req.flash('warn','Login to your account first.')
        return res.redirect('/');
    }
    next();
}

