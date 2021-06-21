module.exports = async (req, res, next) => {
    if (req.hasOwnProperty('body')) {
        req.body = JSON.parse(JSON.stringify(req.body));
    }
    
    if (req.session.hasOwnProperty('admin')) {
        global.adminData = req.session.admin;
    }

    global.baseUrl = `${req.protocol}://${req.get('host')}`;
    global.flashMessage = req.flash('flashMessage');

    global.PLACEHOLDER_IMAGE = `${baseUrl}/uploads/default/default_image.jpg`;
    global.PLACEHOLDER_IMAGE_USER = `${baseUrl}/uploads/default/avatar-1.png`;

    return next();
}