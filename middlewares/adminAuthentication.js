const sequelize = require('sequelize');
const { Op } = sequelize;
const models = require('../models');
const helper = require('../helpers/helper');

const User = models.user;
const AdminDetail = models.admindetail;

module.exports = async (req, res, next) => {
    const ignoreRoutes = [
        '/',
        '/login',
        '/loginSubmit'
    ];

    if (ignoreRoutes.includes(req.url)) return next();

    // if (![3].includes(req.session.admin.role)) {
    //     req.session.authenticated = false;
    // }

    if (![3].includes(req.session.authenticated && req.session.admin.role)) {
        req.session.authenticated = false;
    }


    // console.log('here');
    // return;

    if (req.session.authenticated == true) {
        const admin = await User.findOne({
            where: {
                id: req.session.admin.id,
                role: {
                    [Op.in]: [3]
                },
            },
            include: [{
                model: AdminDetail,
                attributes: {
                    include: [
                        [sequelize.literal(`(IF (admindetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', admindetail.image)) )`), 'image']
                    ]
                }
            },
            {
                model: models['vendordetail'],
                attributes: {
                    include: [
                        [sequelize.literal(`(IF (vendordetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendordetail.image)) )`), 'image'],
                        [sequelize.literal(`(IF (vendordetail.shopLogo='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendordetail.shopLogo)) )`), 'shopLogo']
                    ]
                }
            }
            ],
            raw: true,
            nest: true
        });
        req.session.admin = admin;
        global.adminData = admin;
        console.log(global.adminData, '===========>adminData');

        return next();
    } else {
        req.flash('flashMessage', { color: 'error', message: 'Please login first.' });
        const originalUrl = req.originalUrl.split('/')[1];
        return res.redirect(`/${originalUrl}`);
    }
}