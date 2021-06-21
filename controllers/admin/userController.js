const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
var crypto = require('crypto')

const PREFIX_BASE_ROUTE = 'admin';
const MODULE_BASE_ROUTE = 'user';
const MODULE_MODEL = "user";
const MODULE_MODEL_FOLDER = "user";
const MODULE_MODEL_TITLE = 'User';
const MODULE_ADD_UPDATE_ENDPOINT = 'addUpdate';
// const model = "user";
global.modelTitle = "User";
global.modelDataTable = "userDataTable";

const EXPORT_CONSTANTS = {
    PREFIX_BASE_ROUTE,
    MODULE_BASE_ROUTE,
    MODULE_ADD_UPDATE_ENDPOINT,
};
// const User = models.user;
// const UserDetail = models.userdetail;
// const DriverDetail = models.driverdetail;
const prefixBaseName = 'admin';
const modelBaseName = 'user';
const model = "user";
global.modelTitle = "User";
global.modelDataTable = "userDataTable";

const roleTypes = {
    0: 'Admin',
    1: 'User',
    2: 'Driver',
    3: 'Vendor'
}
const userRoleModels = {
    0: 'admindetail',
    1: 'userdetail',
    2: 'driverdetail',
    3: 'vendordetail',
}

module.exports = {
        listing: async(req, res) => {
            try {
                const MODULE_ROUTE_ENDPOINT = 'listing';

                global.currentModule = MODULE_MODEL_TITLE;
                global.currentSubModule = 'Listing';
                global.currentSubModuleSidebar = 'listing';

                const listing = await module.exports.findAll({
                    where: {
                        role: 1
                    }
                });
                log({ listing });
                // return;

                const headerColumns = Object.values({
                    sno: '#',
                    image: 'Image',
                    detail: 'Detail',
                    role: 'Role',
                    // regDate: 'Reg. Date',
                    status: 'Status',
                    verified: 'Verified',
                    action: 'Action'
                });

                const data = listing.map((modelRow, index) => {
                    const roleBasedColumnDetail = {
                        1: {
                            image: `<img alt="image" src="${modelRow.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${modelRow.name}">`,
                            user: `Name: ${modelRow.name}<br/>
														 Email: ${modelRow.email}<br/>`,
                            role: '<div class="badge badge-info">User</div>',
                            modelTitle: 'User',
                            editButtonUrl: '/admin/user/edit',
                            viewButonUrl: '/admin/user/view',
                        }
                    }

                    const statusButton = {
                        0: `<button model_id="${modelRow.id}" model="${model}" status="${modelRow.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                        1: `<button model_id="${modelRow.id}" model="${model}" status="${modelRow.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                    }

                    const verifiedButton = {
                        0: `<div class="badge badge-warning">Unverified</div>`,
                        1: `<div class="badge badge-success">Verified</div>`,
                    }

                    const viewButton = `<a href="${roleBasedColumnDetail[modelRow.role]['viewButonUrl']}/${modelRow.id}" class="btn btn-outline-info" >View</a>`;
                    const editButton = `<a href="${roleBasedColumnDetail[modelRow.role]['editButtonUrl']}/${modelRow.id}" class="btn btn-outline-warning" >Edit</a>`;
                    const deleteButton = `<button model_id="${modelRow.id}" model="${model}" model_title="${roleBasedColumnDetail[modelRow.role]['modelTitle']}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                    let action = '';
                    action += viewButton;
                    action += '&nbsp;';
                    action += editButton;
                    action += '&nbsp;';
                    action += deleteButton;


                    return Object.values({
                        sno: parseInt(index) + 1,
                        image: roleBasedColumnDetail[modelRow.role].image,
                        detail: roleBasedColumnDetail[modelRow.role].user,
                        role: roleBasedColumnDetail[modelRow.role].role,
                        // regDate: moment(modelRow.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                        status: statusButton[modelRow.status],
                        verified: verifiedButton[modelRow.verified],
                        action
                    });
                });

                return res.render(`${PREFIX_BASE_ROUTE}/${MODULE_BASE_ROUTE}/${MODULE_ROUTE_ENDPOINT}`, { headerColumns, data, ...EXPORT_CONSTANTS });
            } catch (err) {
                return helper.error(res, err);
            }
        },
        addEditView: (type = 'add') => {
            return async(req, res) => {
                try {
                    const MODULE_ROUTE_ENDPOINT = 'addEditView';

                    global.currentModule = MODULE_MODEL_TITLE;
                    global.currentSubModule = helper.uppercaseFirstLetter(type);
                    global.currentSubModuleSidebar = type;

                    let user = undefined;

                    if (type != 'add') {
                        user = await module.exports.findOne({
                            where: {
                                id: req.params.id,
                            }
                        });
                        global.currentSubModule = `${currentSubModule} ${roleTypes[user.role]}`;
                    }
                    log_old(user, 'user');

                    return res.render(`${PREFIX_BASE_ROUTE}/${MODULE_BASE_ROUTE}/${MODULE_ROUTE_ENDPOINT}`, { user, type, ...EXPORT_CONSTANTS });
                } catch (err) {
                    return helper.error(res, err);
                }
            }
        },
        datatable: async(req, res) => {
            try {
                const queryParameters = req.query;
                const { draw, search, start, length } = queryParameters;
                // console.log(queryParameters, '======================>queryParameters');

                const recordsTotal = await models[model].count({
                    where: {
                        role: {
                            [Op.notIn]: [0],
                            // [Op.in]: [1,2,3],
                        },
                    }
                });
                const listing = await models[model].findAndCountAll({
                    where: {
                        role: {
                            [Op.notIn]: [0],
                            [Op.in]: [1, 2, 3],
                        },
                        [Op.and]: [
                            sequelize.literal(`user.email LIKE '%${search.value}%' || userdetail.name LIKE '%${search.value}%' || businessDetail.name LIKE '%${search.value}%'`)
                        ]
                    },
                    include: [{

                            model: models['userdetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (userdetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userdetail.image)) )`), 'image']
                                ]
                            }
                        },
                        {
                            model: models['businessDetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (businessDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessDetail.image)) )`), 'image']
                                ]
                            }
                        },
                        {
                            model: models['businessProfessionalDetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (businessProfessionalDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessProfessionalDetail.image)) )`), 'image']
                                ]
                            }
                        },
                    ],
                    order: [
                        ['id', 'DESC']
                    ],
                    offset: parseInt(start),
                    limit: parseInt(length),
                    raw: true,
                    nest: true
                });
                // console.log(listing, '===========================================>listing');

                let responseData = [];
                const data = listing.rows.map((user, index) => {
                    const roleBasedColumnDetail = {
                        1: {
                            image: `<img alt="image" src="${user.userdetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userdetail.name}">`,
                            user: `Name: ${user.userdetail.name}<br/>
                               Email: ${user.email}`,
                            role: '<div class="badge badge-info">User</div>',
                            modelTitle: 'User',
                            editButtonUrl: '/admin/user/edit',
                            viewButonUrl: '/admin/user/view',
                        },
                        2: {
                            image: `<img alt="image" src="${user.businessDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.businessDetail.name}">`,
                            user: `Name: ${user.businessDetail.name}<br/>
                               Email: ${user.email}`,
                            role: '<div class="badge badge-danger">Business</div>',
                            modelTitle: 'Business',
                            editButtonUrl: '/admin/user/edit',
                            viewButonUrl: '/admin/user/view',
                        },
                        3: {
                            image: `<img alt="image" src="${user.businessProfessionalDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.businessProfessionalDetail.name}">`,
                            user: `Name: ${user.businessProfessionalDetail.name}<br/>
                               Email: ${user.email}`,
                            role: '<div class="badge badge-dark">Business Professional</div>',
                            modelTitle: 'Business Professional',
                            editButtonUrl: '/admin/user/edit',
                            viewButonUrl: '/admin/user/view',
                        }
                    }

                    const statusButton = {
                        0: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                        1: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                    }

                    const verifiedButton = {
                        0: `<div class="badge badge-warning">Unverified</div>`,
                        1: `<div class="badge badge-success">Verified</div>`,
                    }

                    const viewButton = `<a href="${roleBasedColumnDetail[user.role]['viewButonUrl']}/${user.id}" class="btn btn-outline-info" >View</a>`;
                    const editButton = `<a href="${roleBasedColumnDetail[user.role]['editButtonUrl']}/${user.id}" class="btn btn-outline-warning" >Edit</a>`;
                    const deleteButton = `<button model_id="${user.id}" model="${model}" model_title="${roleBasedColumnDetail[user.role]['modelTitle']}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                    let action = '';
                    action += viewButton;
                    action += '&nbsp;';
                    action += editButton;
                    action += '&nbsp;';
                    action += deleteButton;

                    return Object.values({
                        sno: parseInt(start) + parseInt(index) + 1,
                        image: roleBasedColumnDetail[user.role].image,
                        user: roleBasedColumnDetail[user.role].user,
                        role: roleBasedColumnDetail[user.role].role,
                        regDate: moment(user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                        status: statusButton[user.status],
                        verified: verifiedButton[user.verified],
                        action
                    });
                });

                // console.log(data, '=======================>data');
                // console.log(recordsTotal, '=======================>recordsTotal');

                responseData = {
                    draw: parseInt(draw),
                    recordsTotal,
                    recordsFiltered: listing.count,
                    data
                }

                return res.send(responseData);
            } catch (err) {
                return helper.error(res, err);
            }
        },
        addUpdate: async(req, res) => {

                try {
                    const required = {
                        name: req.body.name,
                        email: req.body.email,
                        role: req.body.role || 1,
                    };
                    var auth_create = crypto.randomBytes(20).toString('hex');
                    const nonRequired = {
                        name: req.body.name,
                        email: req.body.email,
                        role: req.body.role,
                        password: req.body.password,
                        image: req.files && req.files.image,
                        phone: req.body.phone,
                        address: req.body.address,
                        state: req.body.state,
                        authKey: auth_create,
                        // address: req.body.country,  
                        ...req.body,
                    };

                    let requestData = await helper.vaildObject(required, nonRequired);
                    console.log(requestData.auth_key, "==================auth");
                    // return
                    console.log(requestData)
                        // requestData.countryCodePhone = `${requestData.countryCode}${requestData.phone}`;

                    if (requestData.hasOwnProperty('password') && requestData.password) {
                        requestData.password = helper.bcryptHash(requestData.password);
                    }

                    // const imageFolders = {
                    //     0: 'admin',
                    //     1: 'user',
                    //     2: 'user',
                    //     3: 'user',
                    // }

                    if (req.files && req.files.image) {
                        requestData.image = helper.imageUpload(req.files.image, MODULE_MODEL_FOLDER);
                    }

                    const userId = await helper.save(models[model], requestData);
                    const user = await module.exports.findOne({
                        where: {
                            id: userId,
                        }
                    });
                    console.log(user, '=================================================>user');

                    // user[USER_ROLE_MODELS[user.role]].id ? requestData.id = user[USER_ROLE_MODELS[user.role]].id : delete requestData.id;

                    user.hasOwnProperty('detailId') && user.detailId ? requestData.id = user.detailId : delete requestData.id;

                    requestData.userId = user.id;

                    await helper.save(models[USER_ROLE_MODELS[user.role]], requestData);

                    let message = `${roleTypes[user.role]} ${requestData.hasOwnProperty('id') ? `${req.session.admin.id == user.id ? 'Profile ' : ''}Updated` : 'Added'} Successfully.`;

			req.flash('flashMessage', { color: 'success', message });

			if (user.role == 0 || user.role == 4) {
				return helper.success(res, message, user);
			}

			res.redirect('/admin/user/listing');

			// return helper.success(res, message, user);    
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
	manageShop: async (req, res) => {
		try {
			global.currentModule = 'Manage Shop';
			global.currentSubModule = 'Shop Detail';
			global.currentSubModuleSidebar = 'manageShop';

			return res.render('admin/manageShop');
		} catch (err) {
			return helper.error(res, err);
		}
	},
	userEdit: async (req, res) => {
		try {
			global.currentModule = 'User Edit';
			global.currentSubModule = 'Shop Detail';
			global.currentSubModuleSidebar = 'userEdit';

			return res.render('admin/user/edit');
		} catch (err) {
			return helper.error(res, err);
		}
	},
	userList: async (req, res) => {
		try {
			global.currentModule = modelTitle;
			global.currentSubModule = 'Listing';
			global.currentSubModuleSidebar = 'listing';

			const listing = await models[model].findAll({
				order: [['id', 'DESC']],
				// hierarchy: true,
				raw: true,
			});

			// console.log(JSON.stringify(listing, null, 2), '===============>listing');
			// return;


			// console.log(JSON.stringify(listing, null, 2), '======================================>listing');
			// return;

			const parent = await module.exports.getParent();

			const parentCategoryObj = {};

			if (parent.length > 0) {
				parent.forEach(child => {
					parentCategoryObj[child.value] = child.label;
				});
			}

			// console.log(listing, '======>listing');
			// return;

			const data = await Promise.all(listing.map(async (row, index) => {
				const statusButton = {
					0: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
					1: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success status_btn" >Active</button>`,
				}


				const viewButton = `<a href="/${prefixBaseName}/${modelBaseName}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
				const editButton = `<a href="/${prefixBaseName}/${modelBaseName}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
				const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

				let action = '';
				action += viewButton;

				if (row.parentId != null) {
					action += '&nbsp;';
					action += editButton;
					action += '&nbsp;';
					action += deleteButton;
				}

				return Object.values({
					sno: parseInt(index) + 1,
					id: row.id,
					name: row.name,
					// parentCategory: parentCategoryObj[row.id] == row.name ? 'Parent Category' : parentCategoryObj[row.id],
					// dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY'),
					status: statusButton[row.status],
					action
				});
			}));

			const headerColumns = Object.values({
				sno: '#',
				id: 'ID',
				name: 'Name',
				parentCategory: 'Parent Category',
				dateCreated: 'Date Created',
				status: 'Status',
				action: 'Action',
			});

			return res.render(`${prefixBaseName}/${modelBaseName}/listing`, { headerColumns, data });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	taxcategory: async (req, res) => {
		try {
			global.currentModule = 'Tax Category';
			global.currentSubModule = '';
			global.currentSubModuleSidebar = 'taxcategory';

			return res.render('admin/taxcategory');
		} catch (err) {
			return helper.error(res, err);
		}
	},
	updateUser: async (req, res) => {
		try {
			const required = {
				id: adminData.id,
			};
			const nonRequired = {
				name: req.body.name,
				email: req.body.email,
				// role: req.body.role,
				password: req.body.password,
				image: req.files && req.files.image,
				phone: req.body.phone,
				// shopName: req.body.shopName,
				city: req.body.city,
				state: req.body.state,
				country: req.body.country,
				// latitude: req.body.latitude,
				// longitude: req.body.longitude,
				// geoLocation: req.body.geoLocation,
				// shopAddress: req.body.shopAddress,
				// shopDescription: req.body.shopDescription,
				// paymentPolicy: req.body.paymentPolicy,
				// deliveryPolicy: req.body.deliveryPolicy,
				// sellerInformation: req.body.sellerInformation,
				// taxInPercent: req.body.taxInPercent,
				// taxValue: req.body.taxValue,
				// bankName: req.body.bankName,
				// accountHolderName: req.body.accountHolderName,
				// accountNumber: req.body.accountNumber,
				// ifscSwiftCode: req.body.ifscSwiftCode,
				// bankAddress: req.body.bankAddress,
				// shopLogo: req.body.shopLogo,
				// countryCode: req.body.countryCode,
				// phone: req.body.phone,
				redirectUrl: req.body.redirectUrl,
			};

			let requestData = await helper.vaildObject(required, nonRequired);

			// requestData.countryCodePhone = `${requestData.countryCode}${requestData.phone}`;

			if (requestData.hasOwnProperty('password') && requestData.password) {
				requestData.password = helper.bcryptHash(requestData.password);
			}

			// const imageFolders = {
			//     0: 'admin',
			//     1: 'user',
			//     2: 'user',
			//     3: 'user',
			// }

			if (req.files && req.files.image) {
				requestData.image = helper.imageUpload(req.files.image, 'user');
			}

			if (req.files && req.files.shopLogo) {
				requestData.shopLogo = helper.imageUpload(req.files.shopLogo, 'user');
			}

			const userId = await helper.save(models[model], requestData);
			const user = await module.exports.findOneUser(userId);
			console.log(user, '=================================================>user');

			user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
			requestData.userId = user.id;

			await helper.save(models[userRoleModels[user.role]], requestData);

			// let message = `${roleTypes[user.role]} ${requestData.hasOwnProperty('id') ? `${req.session.admin.id == user.id ? 'Profile ' : ''}Updated` : 'Added'} Successfully.`;

			const messageModule = {
				'/admin/manageShop': 'Shop Detail',
				'/admin/taxcategory': 'Tax Category',
				'/admin/setting': 'Setting',
			};

			let message = `${messageModule[requestData.redirectUrl]} Updated Successfully.`;

			req.flash('flashMessage', { color: 'success', message });

			if (messageModule[requestData.redirectUrl] == 'Setting') {
				return helper.success(res, message, user);
			}

			res.redirect(requestData.redirectUrl);

			// return helper.success(res, message, user);    
		} catch (err) {
			err.code = 200;
			return helper.error(res, err);
		}
	},
	findOneUser: async (id) => {
		return await models[model].findOne({
			where: {
				id
			},
			include: [{

				model: models['admindetail'],
				attributes: {
					include: [
						[sequelize.literal(`(IF (admindetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', admindetail.image)) )`), 'image']
					]
				}
			},
			{

				model: models['userdetail'],
				attributes: {
					include: [
						[sequelize.literal(`(IF (userdetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userdetail.image)) )`), 'image']
					]
				}
			},
			{
				model: models['driverdetail'],
				attributes: {
					include: [
						[sequelize.literal(`(IF (driverdetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', driverdetail.image)) )`), 'image']
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
			},
			],
			raw: true,
			nest: true,
		});
	},

	changePasswordSetting: async (req, res) => {
		try {
			const required = {
				id: adminData.id,
				currentPassword: req.body.currentPassword,
				newPassword: req.body.newPassword,
				confirmNewPassword: req.body.confirmNewPassword,
			};
			const nonRequired = {};

			if (required.newPassword != required.confirmNewPassword) throw "New Password and Confirm Password did not match.";

			let requestData = await helper.vaildObject(required, nonRequired);

			let getUser = await models[model].findOne({
				where: {
					id: adminData.id,
				},
				raw: true,
			});
			console.log(getUser, '======================>getUser');

			checkPassword = await helper.comparePass(requestData.currentPassword, getUser.password);

			if (!checkPassword) {
				throw "Current Password did not match, Please try again.";
			}

			if (requestData.hasOwnProperty('newPassword') && requestData.newPassword) {
				requestData.newPassword = helper.bcryptHash(requestData.newPassword);
			}

			const updatedItem = await helper.save(models[model], requestData, true);

			return helper.success(res, 'Password Updated Successfully.', updatedItem);
		} catch (err) {
			if (typeof err == 'string') {
				err = {
					message: err
				}
			}
			err.code = 200;

			return helper.error(res, err);
		}
	},

	changeEmailSetting: async (req, res) => {
		try {
			const required = {
				id: adminData.id,
				currentPassword: req.body.currentPassword,
				newEmail: req.body.newEmail,
				confirmNewEmail: req.body.confirmNewEmail,
			};
			const nonRequired = {};

			if (required.newEmail != required.confirmNewEmail) throw "New Email and Confirm Email did not match.";

			let requestData = await helper.vaildObject(required, nonRequired);

			let getUser = await models[model].findOne({
				where: {
					id: adminData.id,
				},
				raw: true,
			});
			console.log(getUser, '======================>getUser');

			checkPassword = await helper.comparePass(requestData.currentPassword, getUser.password);

			if (!checkPassword) {
				throw "Current Password did not match, Please try again.";
			}

			requestData.email = requestData.newEmail;

			const updatedItem = await helper.save(models[model], requestData, true);

			return helper.success(res, 'Email Updated Successfully.', updatedItem);
		} catch (err) {
			if (typeof err == 'string') {
				err = {
					message: err
				}
			}
			err.code = 200;

			return helper.error(res, err);
		}
	},
	findAll: async ({ where = {}, modifyConditions = {}, modifyDetailConditions = {}, includeUserAttributes = [], ...rest } = {}) => {
		return await models[MODULE_MODEL].findAll({
			where: {
				...where,
			},
			attributes: {
				exclude: "password",
				include: [
					helper.makeImageUrlSql(MODULE_MODEL, 'image', MODULE_MODEL_FOLDER, undefined, `${baseUrl}/uploads/default/avatar-1.png`),
					...includeUserAttributes,
				]
			},
			include: [
				{

					model: models['userdetail'],
					attributes: {
						include: [
							helper.makeImageUrlSql('userdetail', 'image', MODULE_MODEL_FOLDER, undefined, `${baseUrl}/uploads/default/avatar-1.png`),
						]
					}
				},
			],
			order: [['id', 'DESC']],
			...modifyConditions,
			...rest,
			// raw: true,
		}).map(modelRow => {
			if (!modelRow) return modelRow;

			modelRow = modelRow.toJSON();

			Object.values(USER_ROLE_MODELS).forEach(userRoleModel => {
				if (modelRow.hasOwnProperty(userRoleModel) && modelRow[userRoleModel] && Object.keys(modelRow[userRoleModel]).length > 0 && USER_ROLE_MODELS[modelRow.role] == userRoleModel) {
					modelRow.detailId = modelRow[userRoleModel].id;
					delete modelRow[userRoleModel].id;

					modelRow = {
						...modelRow,
						...modelRow[userRoleModel],
					};
				}
				delete modelRow[userRoleModel]
			});

			return modelRow;
		});
	},
	findOneUser: async (id) => {
		return await models[model].findOne({
			where: {
				id
			},
			include: [
				{

					model: models['admindetail'],
					attributes: {
						include: [
							[sequelize.literal(`(IF (admindetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', admindetail.image)) )`), 'image']
						]
					}
				},
				{

					model: models['userdetail'],
					attributes: {
						include: [
							[sequelize.literal(`(IF (userdetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userdetail.image)) )`), 'image']
						]
					}
				},
				// {
				// 	model: models['businessDetail'],
				// 	attributes: {
				// 		include: [
				// 			[sequelize.literal(`(IF (businessDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessDetail.image)) )`), 'image']
				// 		]
				// 	}
				// },
				// {
				// 	model: models['businessProfessionalDetail'],
				// 	attributes: {
				// 		include: [
				// 			[sequelize.literal(`(IF (businessProfessionalDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessProfessionalDetail.image)) )`), 'image']
				// 		]
				// 	}
				// },
			],
			raw: true,
			nest: true,
		});
	},
	findOne: async ({ where = {}, modifyConditions = {}, modifyDetailConditions = {}, includeUserAttributes = [], ...rest } = {}) => {
		return await models[MODULE_MODEL].findOne({
			where: {
				...where,
			},
			attributes: {
				exclude: "password",
				include: [
					helper.makeImageUrlSql(MODULE_MODEL, 'image', MODULE_MODEL_FOLDER, undefined, `${baseUrl}/uploads/default/avatar-1.png`),
					...includeUserAttributes,
				]
			},
			include: [
				{

					model: models['userdetail'],
					attributes: {
						include: [
							helper.makeImageUrlSql('userdetail', 'image', MODULE_MODEL_FOLDER, undefined, `${baseUrl}/uploads/default/avatar-1.png`),
						]
					}
				},
			],
			...modifyConditions,
			...rest,
			// raw: true,
		}).then(modelRow => {
			if (!modelRow) return modelRow;

			modelRow = modelRow.toJSON();

			Object.values(USER_ROLE_MODELS).forEach(userRoleModel => {
				if (modelRow.hasOwnProperty(userRoleModel) && modelRow[userRoleModel] && Object.keys(modelRow[userRoleModel]).length > 0) {
					modelRow.detailId = modelRow[userRoleModel].id;
					delete modelRow[userRoleModel].id;
					modelRow = {
						...modelRow,
						...modelRow[userRoleModel],
					};
				}
				delete modelRow[userRoleModel]
			});

			return modelRow;
		});
	},
}