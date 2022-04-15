//view 404 page if the user visited unregisterd route
exports.get404 = (req, res, next) => {
    res.status(404).render('404',);
}