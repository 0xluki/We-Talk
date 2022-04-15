const { name } = require('ejs');
const Contact = require('../models/contact');

//rendering contact us page
exports.getContactUs = (req, res, next) => {
    res.render('contact-us', {pageTitle:'Contact Us',
        isAuthenticated:req.session.isLoggedIn,
        successMsg:req.flash('success')
    })
}

//reciving user's contact us message
exports.postContactUs = (req, res, next) => {
    contactName = req.body.name;
    email = req.body.email;
    message = req.body.message;
    //storing the form in the DB
    const contact = new Contact({
        name:contactName,
        email:email,
        message:message
    })
    return contact
    .save()
    .then(() => {
        req.flash('success','Thanks for contacting us.');
        res.redirect('/contact-us');
    })
    .catch(err => {
        console.log(err);
    });

}