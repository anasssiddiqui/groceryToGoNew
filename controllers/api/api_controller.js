const db = require('../../models');
const helper = require('../../config/helper');
const jsonData = require('../../config/jsonData');
var crypto = require('crypto')
const user = db.user;
const product = db.product;
const order = db.order;
const cards = db.cards;
const category = db.category;
const helpers = require("../../helpers/helper");

const favourites = db.favourites;
const orderitem = db.orderitem;
const notifcations = db.notifcations;

const vendordetail = db.vendordetail;

const sequelize = require('sequelize');
// const { raw } = require('express');


var Op = sequelize.Op;


module.exports = {
    get_notification: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const notifcation = await notifcations.findAll({
                    attributes: [`id`, 'message', 'createdAt', 'isRead', [sequelize.literal('(SELECT username FROM user WHERE id = notifcations.senderId)'), 'username'],
                        [sequelize.literal('(SELECT image FROM user WHERE id = notifcations.senderId)'), 'username_image'],
                    ],
                    order: [
                        ['id', 'desc'],
                    ],
                    where: {
                        recieverId: data.dataValues.id,
                        isRead: 0,
                    }
                });
                /* console.log(notifcation);
                 return*/
                let msg = 'notification list';
                jsonData.true_status(res, notifcation, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            throw error
        }
    },
    recomended: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const categorydata = await product.findAll({
                    attributes: ['id', 'description', 'image', 'name', ],

                    where: {
                        categoryId: requestdata.catid,
                    }
                });

                let msg = 'Data get Successfully';
                var save_data = {};
                jsonData.true_status(res, categorydata, msg);

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },



    enable_notification: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                authKey: req.headers.auth_key,
                type: req.body.type,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.authKey
                }
            });
            if (data) {
                const detail_data = await user.update({
                    notificationStatus: requestdata.type,
                }, {
                    where: {
                        id: data.dataValues.id
                    }
                });
                let msg = 'Notification status updated sucessfully';
                let datares = {};
                jsonData.true_status(res, datares, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            throw error
        }
    },
    reset: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const categoryfind = await category.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 43,
                    }
                });
                const todaydata = await product.findOne({
                    attributes: ['image', 'name', ],


                    where: {
                        categoryId: categoryfind.dataValues.id,
                    },

                    limit: 1
                });
                const categorydata = await category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 43,
                    }
                });

                if (requestdata.catid == 0) {
                    for (let i in categorydata) {
                        const productdata = await product.findAll({
                            attributes: ['id', 'description', 'image', 'name', ],

                            where: {
                                categoryId: categorydata[i].id,
                            },
                            order: [
                                ['id', 'DESC'],
                            ],
                        });
                        const todayProduct = {
                            todaydata: todaydata,
                            categorydata: categorydata,
                            productdata: productdata

                        }
                        let msg = 'Data get Successfully';
                        var save_data = {};
                        jsonData.true_status(res, todayProduct, msg);
                    }
                } else {
                    const productdata = await product.findAll({
                        attributes: ['id', 'description', 'image', 'name', ],

                        where: {
                            categoryId: requestdata.catid,
                        },

                        order: [
                            ['id', 'DESC'],
                        ],
                    });

                    const todayProduct = {
                        todaydata: todaydata,
                        categorydata: categorydata,
                        productdata: productdata

                    }
                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, todayProduct, msg);
                }


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    read: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const categoryfind = await category.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 42,
                    }
                });
                const todaydata = await product.findOne({
                    attributes: ['image', 'name', ],


                    where: {
                        categoryId: categoryfind.dataValues.id,
                    },

                    limit: 1
                });
                const categorydata = await category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 42,
                    }
                });

                if (requestdata.catid == 0) {
                    for (let i in categorydata) {
                        const productdata = await product.findAll({
                            attributes: ['id', 'description', 'image', 'name', ],

                            where: {
                                categoryId: categorydata[i].id,
                            },
                            order: [
                                ['id', 'DESC'],
                            ],
                        });
                        const todayProduct = {
                            todaydata: todaydata,
                            categorydata: categorydata,
                            productdata: productdata

                        }
                        let msg = 'Data get Successfully';
                        var save_data = {};
                        jsonData.true_status(res, todayProduct, msg);
                    }
                } else {
                    const productdata = await product.findAll({
                        attributes: ['id', 'description', 'image', 'name', ],

                        where: {
                            categoryId: requestdata.catid,
                        },

                        order: [
                            ['id', 'DESC'],
                        ],
                    });

                    const todayProduct = {
                        todaydata: todaydata,
                        categorydata: categorydata,
                        productdata: productdata

                    }
                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, todayProduct, msg);
                }


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    Retail: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid

            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const categoryfind = await category.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 41,
                    }
                });
                const todaydata = await product.findOne({
                    attributes: ['image', 'name', ],


                    where: {
                        categoryId: categoryfind.dataValues.id,
                    },

                    limit: 1
                });
                const categorydata = await category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 41,
                    }
                });

                if (requestdata.catid == 0) {
                    for (let i in categorydata) {
                        const productdata = await product.findAll({
                            attributes: ['id', 'description', 'image', 'name', ],

                            where: {
                                categoryId: categorydata[i].id,
                            },
                            order: [
                                ['id', 'DESC'],
                            ],
                        });
                        const todayProduct = {
                            todaydata: todaydata,
                            categorydata: categorydata,
                            productdata: productdata

                        }
                        let msg = 'Data get Successfully';
                        var save_data = {};
                        jsonData.true_status(res, todayProduct, msg);
                    }




                } else {
                    const productdata = await product.findAll({
                        attributes: ['id', 'description', 'image', 'name', ],

                        where: {
                            categoryId: requestdata.catid,
                        },

                        order: [
                            ['id', 'DESC'],
                        ],
                    });

                    const todayProduct = {
                        todaydata: todaydata,
                        categorydata: categorydata,
                        productdata: productdata

                    }
                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, todayProduct, msg);
                }



            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    Recipies: async function(req, res) {

        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid

            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const categoryfind = await category.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 40,
                    }
                });
                const todaydata = await product.findOne({
                    attributes: ['image', 'name', ],


                    where: {
                        categoryId: categoryfind.dataValues.id,
                    },

                    limit: 1
                });
                const categorydata = await category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 40,
                    }
                });

                if (requestdata.catid == 0) {
                    for (let i in categorydata) {
                        const productdata = await product.findAll({
                            attributes: ['id', 'description', 'image', 'name', ],

                            where: {
                                categoryId: categorydata[i].id,
                            },
                            order: [
                                ['id', 'DESC'],
                            ],
                        });
                        const todayProduct = {
                            todaydata: todaydata,
                            categorydata: categorydata,
                            productdata: productdata

                        }
                        let msg = 'Data get Successfully';
                        var save_data = {};
                        jsonData.true_status(res, todayProduct, msg);
                    }




                } else {
                    const productdata = await product.findAll({
                        attributes: ['id', 'description', 'image', 'name', ],

                        where: {
                            categoryId: requestdata.catid,
                        },

                        order: [
                            ['id', 'DESC'],
                        ],
                    });

                    const todayProduct = {
                        todaydata: todaydata,
                        categorydata: categorydata,
                        productdata: productdata

                    }
                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, todayProduct, msg);
                }


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    revive_api: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                catid: req.body.catid

            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const categoryfind = await category.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 44,
                    }
                });
                const todaydata = await product.findOne({
                    attributes: ['image', 'name', ],


                    where: {
                        categoryId: categoryfind.dataValues.id,
                    },

                    limit: 1
                });
                const categorydata = await category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        parentId: 44,
                    }
                });

                if (requestdata.catid == 0) {
                    for (let i in categorydata) {
                        // console.log(categorydata[i].id);

                        const productdatas = await product.findAll({
                            attributes: ['id', 'description', 'image', 'name', ],

                            where: {
                                categoryId: categorydata[i].id,
                            },
                            order: [
                                ['id', 'DESC'],
                            ],
                        });


                        const todayProduct = {
                            todaydata: todaydata,
                            categorydata: categorydata,
                            productdata: productdatas

                        }
                        let msg = 'Data get Successfully';
                        var save_data = {};
                        jsonData.true_status(res, todayProduct, msg);
                    }




                } else {
                    const productdata = await product.findAll({
                        attributes: ['id', 'description', 'image', 'name', ],

                        where: {
                            categoryId: requestdata.catid,
                        },

                        order: [
                            ['id', 'DESC'],
                        ],
                    });

                    const todayProduct = {
                        todaydata: todaydata,
                        categorydata: categorydata,
                        productdata: productdata

                    }
                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, todayProduct, msg);
                }


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    category_api: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                type: req.body.type
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                if (requestdata.type == 0) {
                    const categorydata = await category.findOne({
                        attributes: ['id', 'name'],
                        where: {
                            parentId: 40,
                        }
                    });

                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, categorydata, msg);
                } else if (requestdata.type == 1) {
                    const categorydata = await category.findOne({
                        attributes: ['id', 'name'],
                        where: {
                            parentId: 41,
                        }
                    });

                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, categorydata, msg);
                } else
                if (requestdata.type == 2) {
                    const categorydata = await category.findOne({
                        attributes: ['id', 'name'],
                        where: {
                            parentId: 44,
                        }
                    });

                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, categorydata, msg);
                } else
                if (requestdata.type == 3) {
                    const categorydata = await category.findOne({
                        attributes: ['id', 'name'],

                        where: {
                            parentId: 42,
                        }
                    });

                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, categorydata, msg);
                } else {
                    const categorydata = await category.findOne({
                        attributes: ['id', 'name'],
                        where: {
                            parentId: 43,
                        }
                    });

                    let msg = 'Data get Successfully';
                    var save_data = {};
                    jsonData.true_status(res, categorydata, msg);
                }
            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    isNotification_on_off: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                isNotification: req.body.isNotification
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({

                where: {
                    authKey: requestdata.auth_key
                }
            });

            if (data) {

                const save = await user.update({
                    isNotification: requestdata.isNotification,
                }, {
                    where: {
                        id: data.dataValues.id
                    }
                });
                let msg = 'Notification Changed Successfully';
                var save_data = {};
                jsonData.true_status(res, save_data, msg);

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }
    },
    ChangePassword: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                old_password: req.body.old_password,
                new_password: req.body.new_password
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({

                where: {
                    authKey: requestdata.auth_key
                }
            });

            if (data) {
                const password = crypto.createHash('sha1').update(requestdata.old_password).digest('hex');
                const data2 = await user.findOne({
                    where: {
                        password: password,
                        authKey: requestdata.auth_key
                    }
                });
                if (data2) {
                    const new_password = crypto.createHash('sha1').update(requestdata.new_password).digest('hex');
                    const save = await user.update({
                        password: new_password,
                    }, {
                        where: {
                            id: data.dataValues.id
                        }
                    });
                    let msg = 'Password Changed Successfully';
                    var save_data = {};
                    jsonData.true_status(res, save_data, msg);
                } else {
                    let msg = 'Old password does not matched';
                    jsonData.wrong_status(res, msg)
                }

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }
    },
    delete_card: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                cardid: req.body.cardid
            };
            const non_required = {

            };
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const dlt = await cards.destroy({

                    where: {
                        id: requestdata.cardid
                    }
                });

                let data2 = {}
                let msg = 'Delete card details sucessfully';
                jsonData.true_status(res, data2, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            throw error
        }
    },
    get_cards: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,

            };
            const non_required = {

            };
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const crads_info = await cards.findAll({
                    attributes: ['id', 'name', 'cardNo', 'expYear', 'expMonth', 'cvv', 'isdefault', ],

                    where: {
                        userid: data.dataValues.id
                    }
                });

                let msg = 'Data get sucessfully';
                jobs_data = {}
                jsonData.true_status(res, crads_info, msg)

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    make_defaultcard: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                cardid: req.body.cardid
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const detail_data = await cards.update({
                    isdefault: 1,

                }, {
                    where: {
                        id: requestdata.cardid
                    }
                });


                let msg = 'Make this card default sucessfully';
                jobs_data = {}
                jsonData.true_status(res, jobs_data, msg)

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    add_card: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                cardNo: req.body.cardNo,
                expYear: req.body.expYear,
                expMonth: req.body.expMonth,
                cvv: req.body.cvv,
                // name: req.body.name,
                cardType: req.body.cardType
            };
            const non_required = {
                tokken: req.body.tokken,
                isdefault: req.body.isdefault,
            };
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const add_order = await cards.create({
                    userid: data.dataValues.id,
                    name: requestdata.name,
                    cardNo: requestdata.cardNo,
                    expYear: requestdata.expYear,
                    expMonth: requestdata.expMonth,
                    cvv: requestdata.cvv,
                    tokken: requestdata.linkToProduct,
                    isdefault: requestdata.isdefault,
                    cardType: requestdata.cardType

                });


                let msg = 'Add card sucessfully';
                jobs_data = {}
                jsonData.true_status(res, jobs_data, msg)

            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },


    my_favourites: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                const productdata = await favourites.findAll({
                    attributes: ['id', 'productid', [sequelize.literal('(SELECT name FROM product WHERE id = favourites.productid)'), 'name'],
                        [sequelize.literal('(SELECT image FROM product WHERE id = favourites.productid)'), 'image'],
                        [sequelize.literal('(SELECT description FROM product WHERE id = favourites.productid)'), 'description'],
                    ],

                    where: {
                        userid: data.dataValues.id,
                    }
                });

                let msg = 'Favourites list';
                jsonData.true_status(res, productdata, msg)
            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    pastdetails: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const productdata = await order.findAll({

                    attributes: ['id', 'orderStatus', 'orderNo', 'createdAt', 'paymentMethod', [sequelize.literal('(SELECT productId FROM orderitem WHERE orderId = order.id)'), 'id'],
                        [sequelize.literal('(SELECT qty FROM orderitem WHERE orderId = order.id)'), 'qty'],
                    ],

                    where: {
                        customerId: data.dataValues.id,
                        orderStatus: 2
                    }
                });
                // console.log(productdata, "===================");
                // return
                let jobs_data = await Promise.all(productdata.map(async order => {
                    order = order.toJSON();

                    const product_info = await product.findOne({
                        attributes: ['image', 'name', 'minimumSellingPrice', 'weight', 'categoryId'],
                        where: {
                            id: order.id
                        }
                    });
                    // console.log(product_info, "===========");
                    // return
                    const categorys = await category.findOne({
                        attributes: ['name'],
                        where: {
                            id: product_info.dataValues.categoryId
                        }
                    });
                    order.image = product_info.dataValues.image
                    order.name = product_info.dataValues.name
                    order.minimumSellingPrice = product_info.dataValues.minimumSellingPrice
                    order.weight = product_info.dataValues.weight
                    order.categorys_name = categorys.dataValues.name

                    return order;
                }));
                let msg = 'Data get sucessfully';
                jsonData.true_status(res, jobs_data, msg)


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    ongoingdetails: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const productdata = await order.findAll({

                    attributes: ['id', 'orderStatus', [sequelize.literal('(SELECT productId FROM orderitem WHERE orderId = order.id)'), 'ids'],
                        [sequelize.literal('(SELECT qty FROM orderitem WHERE orderId = order.id)'), 'qty'],
                    ],

                    where: {
                        customerId: data.dataValues.id,
                        orderStatus: 1
                    }
                });
                // console.log(productdata, "===================");
                // return
                let jobs_data = await Promise.all(productdata.map(async order => {
                    order = order.toJSON();
                    console.log(order, "==========================")
                    const product_info = await orderitem.findOne({
                        attributes: ['qty', 'total', [sequelize.literal('(SELECT image FROM product WHERE id = orderitem.productId)'), 'image'],
                            [sequelize.literal('(SELECT name FROM product WHERE id = orderitem.productId)'), 'name'],
                            [sequelize.literal('(SELECT weight FROM product WHERE id = orderitem.productId)'), 'weight'],
                            [sequelize.literal('(SELECT description FROM product WHERE id = orderitem.productId)'), 'desc'],
                        ],

                        where: {
                            orderId: order.id
                        }
                    });


                    order.image = product_info.dataValues.image
                    order.name = product_info.dataValues.name
                    order.minimumSellingPrice = product_info.dataValues.minimumSellingPrice
                    order.weight = product_info.dataValues.weight
                    order.price = product_info.dataValues.total
                    order.name = product_info.dataValues.name



                    return order;
                }));
                let msg = 'Data get sucessfully';
                jsonData.true_status(res, jobs_data, msg)
            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    history_orders: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {
                const productdata = await order.findAll({

                    attributes: ['id', 'orderStatus', [sequelize.literal('(SELECT productId FROM orderitem WHERE orderId = order.id)'), 'ids'],
                        [sequelize.literal('(SELECT qty FROM orderitem WHERE orderId = order.id)'), 'qty'],
                    ],

                    where: {
                        customerId: data.dataValues.id,
                    }
                });
                // console.log(productdata, "===================");
                // return
                let jobs_data = await Promise.all(productdata.map(async order => {
                    order = order.toJSON();
                    console.log(order, "==========================")
                    const product_info = await orderitem.findOne({
                        attributes: ['qty', 'total', [sequelize.literal('(SELECT image FROM product WHERE id = orderitem.productId)'), 'image'],
                            [sequelize.literal('(SELECT name FROM product WHERE id = orderitem.productId)'), 'name'],
                            [sequelize.literal('(SELECT weight FROM product WHERE id = orderitem.productId)'), 'weight'],
                            [sequelize.literal('(SELECT description FROM product WHERE id = orderitem.productId)'), 'desc'],
                        ],

                        where: {
                            orderId: order.id
                        }
                    });


                    order.image = product_info.dataValues.image
                    order.name = product_info.dataValues.name
                    order.minimumSellingPrice = product_info.dataValues.minimumSellingPrice
                    order.weight = product_info.dataValues.weight
                    order.price = product_info.dataValues.total
                    order.name = product_info.dataValues.name
                    order.desc = product_info.dataValues.desc

                    return order;
                }));
                let msg = 'Data get sucessfully';
                jsonData.true_status(res, jobs_data, msg)


            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    Fav_unFav: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                productId: req.body.productId,
                isfav: req.body.isfav
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (data) {

                if (requestdata.isfav == 1) {
                    const data_likes = await favourites.findOne({
                        where: {
                            productid: requestdata.productId,
                            userid: data.dataValues.id,
                        }
                    });
                    if (data_likes) {
                        let msg = 'You already liked this product ';
                        jsonData.wrong_status(res, msg)
                    } else {
                        const likeproduct = await favourites.create({
                            productid: requestdata.productId,
                            userid: data.dataValues.id,
                            isfav: requestdata.isfav,
                        });
                        let msg = 'Product liked sucessfully';
                        jobs_data = {}
                        jsonData.true_status(res, jobs_data, msg)
                    }

                }

                if (requestdata.isfav == 0) {
                    const dlt = await favourites.destroy({

                        where: {
                            productid: requestdata.productId
                        }
                    });
                    let msg = 'Product disliked sucessfully';
                    jobs_data = {}
                    jsonData.true_status(res, jobs_data, msg)
                }
            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    viewproduct: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                productId: req.body.productId,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });


            if (data) {


                let productdata = await product.findOne({
                    attributes: ['id', 'name', 'image', 'description', ],

                    where: {
                        id: requestdata.productId
                    },
                });
                let favdata = await favourites.findOne({

                    where: {
                        productid: requestdata.productId,
                        userid: data.dataValues.id
                    }
                });
                if (favdata !== null) {
                    productdata.dataValues.islike = 1;
                } else {
                    productdata.dataValues.islike = 0;

                }
                let msg = 'Data get sucessfully';
                jsonData.true_status(res, productdata, msg)
            } else {
                let msg = 'Invalid authorization Key';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            throw errr
        }

    },
    socialLogin: async function(req, res) {

        try {
            const required = {
                security_key: req.headers.security_key,
                socialId: req.body.socialId,
                loginType: req.body.loginType,

            };
            const non_required = {

            };

            let requestdata = await helper.vaildObject(required, non_required, res);

            const social_data = await user.findOne({

                where: {
                    socialId: requestdata.socialId,

                }
            });
            if (social_data) {
                var auth_create = crypto.randomBytes(40).toString('hex');
                const update_details = await user.update({
                    loginType: requestdata.loginType,
                    authKey: auth_create,
                    deviceType: req.body.deviceType,
                    deviceToken: req.body.deviceToken
                }, {
                    where: {
                        socialId: requestdata.socialId,
                    }
                });
                let data2 = await helper.userdetail(social_data.dataValues.id);
                let msg = 'Login successfully';
                jsonData.true_status(res, data2, msg)

            } else {
                var auth_create = crypto.randomBytes(80).toString('hex');
                const create_user = await user.create({
                    socialId: requestdata.socialId,
                    logintype: requestdata.logintype,

                });
                if (create_user) {
                    let data2 = await helper.userdetail(create_user.dataValues.id);
                    let msg = 'Social login successfully';
                    jsonData.true_status(res, data2, msg)
                } else {
                    let msg = 'Try again Sometime';
                    jsonData.invalid_status(res, msg)
                }

            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    resetPassword: async function(req, res) {
        try {

            const pass = crypto.createHash('sha1').update(req.body.confirm_password).digest('hex');
            const save = await user.update({
                password: pass,
                forgotPassword: '',
            }, {
                where: {
                    forgotPassword: req.body.hash
                }
            });
            if (save) {
                res.render('success_page', { msg: "Password Changed successfully" });
            } else {
                res.render('success_page', { msg: "Invalid user" });
            }

        } catch (errr) {
            throw errr
        }

    },
    url_id: async function(req, res) {
        try {
            //  console.log(req.params.id, "=================req.params.id");
            const data = await user.findOne({
                attributes: ['forgotPassword'],
                where: {
                    forgotPassword: req.params.id,
                }
            });

            if (data) {
                // console.log(data.length); return false;
                res.render("reset_password", {
                    title: "free products",
                    response: data.dataValues.forgotPassword,
                    flash: "",
                    hash: req.params.id
                });
            } else {
                res.status(403).send("Link has been expired!");
            }

        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    forgot_password: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                email: req.body.email
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const data = await user.findOne({
                where: {
                    email: requestdata.email
                }
            });
            if (data) {
                let otp = crypto.randomBytes(20).toString('hex');
                helper.send_email(otp, data);
                const save = await user.update({
                    forgotPassword: otp
                }, {
                    where: {
                        id: data.dataValues.id
                    }
                });
                let msg = 'Email sent successfully';
                var body = {}
                jsonData.true_status(res, body, msg)

            } else {
                let msg = 'Email does not exist';
                jsonData.wrong_status(res, msg)
            }
        } catch (errr) {
            jsonData.wrong_status(res, errr)

        }
    },
    logout: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);
            const user_data = await user.findOne({
                where: {
                    authKey: requestdata.auth_key
                }
            });
            if (user_data) {
                const detail_data = await user.update({
                    authKey: '',
                    deviceToken: ''
                }, {
                    where: {
                        id: user_data.dataValues.id
                    }
                });
                let msg = 'Logout Successfully';
                let data = {};
                jsonData.true_status(res, data, msg)
            } else {
                let msg = 'Invalid authorization key';
                jsonData.invalid_status(res, msg)
            }
        } catch (error) {
            jsonData.wrong_status(res, error)
        }
    },
    // login: async function(req, res) {
    //     try {
    //         const required = {
    //             security_key: req.headers.security_key,
    //             email: req.body.email,
    //             password: req.body.password
    //         };
    //         const non_required = {
    //             deviceType: req.body.deviceType,
    //             deviceToken: req.body.deviceToken
    //         };

    //         let requestdata = await helper.vaildObject(required, non_required, res);

    //         console.log(requestdata, '=============>requestdata');
    //         const checkEmail = await user.findOne({
    //             where: {
    //                 email: requestdata.email,

    //             },
    //             raw: true
    //         });

    //         if (!checkEmail) {
    //             throw "Email did not match, Please try again.";
    //         }
    //         checkPassword = await helpers.comparePass(requestdata.password, checkEmail.password);
    //         // console.log(checkPassword, "==================================");
    //         // return
    //         if (checkPassword == false) {
    //             throw "Password did not match, Please try again.";
    //         }

    //         const newPassword = helpers.bcryptHash(requestdata.password);

    //         var auth_create = crypto.randomBytes(20).toString('hex');
    //         const update_details = await user.update({
    //             authKey: auth_create,
    //             deviceType: req.body.deviceType,
    //             deviceToken: req.body.deviceToken,
    //             password: newPassword
    //         }, {
    //             where: {
    //                 email: requestdata.email,
    //             }
    //         });

    //         let msg = 'User Logged In successfully';
    //         let getUser = await user.findOne({
    //             where: {
    //                 email: requestdata.email,
    //             },
    //             attributes: {
    //                 include: [
    //                     sequelize.literal(`IF (image='', '', CONCAT("${req.protocol}://${req.get('host')}/uploads/users/", image)) as image`),
    //                 ]
    //             },
    //             raw: true
    //         });
    //         jsonData.true_status(res, getUser, msg)
    //     } catch (error) {
    //         console.log(error, '======================>error');
    //         jsonData.wrong_status(res, error)
    //     }
    // },
    // signUp: async function(req, res) {

    //     try {
    //         const required = {
    //             security_key: req.headers.security_key,
    //             username: req.body.username,
    //             email: req.body.email,
    //         };
    //         const non_required = {
    //             deviceType: req.body.deviceType,
    //             password: req.body.password,
    //             deviceToken: req.body.deviceToken,
    //             image: req.body.image,
    //             socialId: req.body.socialId,
    //             loginType: req.body.loginType,
    //             lat: req.body.lat,
    //             lng: req.body.lng,
    //         };
    //         let requestdata = await helper.vaildObject(required, non_required, res);

    //         if (requestdata.socialId) {
    //             const password = helpers.bcryptHash(requestdata.password);
    //             var auth_create = crypto.randomBytes(80).toString('hex');
    //             imageName = '';
    //             if (req.files && req.files.image) {
    //                 imageName = helper.image_upload(req.files.image);
    //             }
    //             const social_data = await user.findOne({
    //                 where: {
    //                     socialId: requestdata.socialId,
    //                 }
    //             });
    //             const update_details = await user.update({
    //                 username: requestdata.username,
    //                 email: requestdata.email,
    //                 deviceType: requestdata.deviceType,
    //                 password: password,
    //                 deviceToken: requestdata.deviceToken,
    //                 image: requestdata.image,
    //                 socialId: requestdata.socialId,
    //                 loginType: requestdata.logintype,
    //                 lat: requestdata.lat,
    //                 lng: requestdata.lng,
    //                 isSociallogin: 1,
    //             }, {
    //                 where: {
    //                     socialId: requestdata.socialId,
    //                 }
    //             });
    //             let data2 = await helper.userdetail(social_data.dataValues.id);
    //             let msg = 'Registered successfully';
    //             jsonData.true_status(res, data2, msg)
    //         } else {
    //             const user_data = await user.findOne({
    //                 where: {
    //                     email: requestdata.email,
    //                 }
    //             });
    //             if (user_data) {
    //                 let msg = 'Email already exist';
    //                 jsonData.wrong_status(res, msg)
    //             } else {
    //                 const password = helpers.bcryptHash(requestdata.password);
    //                 var auth_create = crypto.randomBytes(20).toString('hex');
    //                 imageName = '';
    //                 if (req.files && req.files.image) {
    //                     imageName = helper.image_upload(req.files.image);
    //                 }
    //                 const create_user = await user.create({
    //                     username: requestdata.username,
    //                     email: requestdata.email,
    //                     deviceType: requestdata.deviceType,
    //                     password: password,
    //                     deviceToken: requestdata.deviceToken,
    //                     image: imageName,
    //                     socialId: requestdata.socialId,
    //                     loginType: requestdata.logintype,
    //                     lat: requestdata.lat,
    //                     lng: requestdata.lng,
    //                     authKey: auth_create
    //                 });

    //                 if (create_user) {
    //                     let data = await helper.userdetail(create_user.dataValues.id);
    //                     let msg = 'Sign up successfully';
    //                     jsonData.true_status(res, data, msg)
    //                 } else {
    //                     let msg = 'Try again Sometime';
    //                     jsonData.invalid_status(res, msg)
    //                 }
    //             }

    //         }
    //     } catch (error) {
    //         throw error
    //     }
    // },


}