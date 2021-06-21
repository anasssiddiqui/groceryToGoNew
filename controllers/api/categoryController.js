const models = require("../../models");
const database = require("../../db/db");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const helper = require("../../helpers/helper");
// const constants = require("../../config/constants");
// const secretKey = constants.jwtSecretKey;

const MODEL = 'category';
const MODEL_TITLE = 'Category';
const MODEL_FOLDER = 'category';

module.exports = {
    homeCategories: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const categories = await models[MODEL].findAll({
                where: {
                    parentId: null,
                    status: 1,
                },
                attributes: [
                    'id',
                    'name',
                    helper.makeImageUrlSql(MODEL, 'image', MODEL_FOLDER),
                ],
                order: [
                    ['id', 'ASC']
                ],
            });

            return helper.success(res, "Home categories fetched successfully.", categories);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    categoryItemDetail: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemId: req.body.categoryItemId,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            let categoryItem = await models.categoryitem.findOne({
                where: {
                    status: 1,
                    id: requestData.categoryItemId,
                },
                attributes: {
                    include: [
                        // [
                        //   sequelize.literal(
                        //     "IF (`categoryitem`.`image`='', '', CONCAT('" +
                        //     req.protocol +
                        //     "://" +
                        //     req.get("host") +
                        //     "/uploads/categoryitem/', `categoryitem`.`image`))"
                        //   ),
                        //   "image"
                        // ],
                        [
                            sequelize.literal(
                                "IF (`categoryitem`.`media`='', '', CONCAT('" +
                                req.protocol +
                                "://" +
                                req.get("host") +
                                "/uploads/categoryitem/', `categoryitem`.`media`))"
                            ),
                            "media"
                        ],
                        [
                            sequelize.literal(
                                "IF (`categoryitem`.`previewMedia`='', '', CONCAT('" +
                                req.protocol +
                                "://" +
                                req.get("host") +
                                "/uploads/categoryitem/', `categoryitem`.`previewMedia`))"
                            ),
                            "previewMedia"
                        ],
                        [sequelize.literal(`IF ( (SELECT COUNT(*) FROM favouritecategoryitem AS f WHERE f.userId=${requestData.loginData.id} && f.categoryItemId=categoryitem.id) >= 1, 1, 0)`), 'isFavourite'],
                        [sequelize.literal(`IF ( (SELECT COUNT(*) FROM downloadedcategoryitem AS f WHERE f.userId=${requestData.loginData.id} && f.categoryItemId=categoryitem.id) >= 1, 1, 0)`), 'isDownload'],
                    ]
                },
                include: [{
                    model: models.recipeingredient,
                    attributes: [
                        'name',
                        'value',
                    ]
                }],
            });

            if (!categoryItem) throw "Invalid categoryItemId.";

            categoryItem = categoryItem.toJSON();

            if (categoryItem.categoryId != 1) delete categoryItem.recipeingredients;

            return helper.success(res, "Category item detail fetched successfully.", categoryItem);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    downloadCategoryItem: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemId: req.body.categoryItemId,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);
            // console.log(requestData, '=====+>requestData');
            // return;

            let categoryItem = await models.categoryitem.findOne({
                where: {
                    status: 1,
                    id: requestData.categoryItemId,
                },
            });
            if (!categoryItem) throw "Invalid categoryItemId.";
            categoryItem = categoryItem.toJSON();

            let isDownloaded = await models.downloadedcategoryitem.findOne({
                where: {
                    userId: requestData.loginData.id,
                    categoryItemId: requestData.categoryItemId,
                },
                raw: true,
            });

            if (!isDownloaded) {
                const addToDownloaded = {
                    userId: requestData.loginData.id,
                    categoryItemId: requestData.categoryItemId,
                };

                isDownloaded = await helper.save(models.downloadedcategoryitem, addToDownloaded, true, req)
            }


            const responseData = await models.downloadedcategoryitem.findOne({
                where: {
                    id: isDownloaded.id,
                },
                include: [{
                    model: models.categoryitem,
                    required: true,
                    attributes: [
                        'id',
                        'categoryId',
                        'subCategoryId',
                        'title',
                        'introduction',
                        'description',
                        'mediaType',
                        // [
                        //   sequelize.literal(
                        //     "IF (`categoryitem`.`image`='', '', CONCAT('" +
                        //     req.protocol +
                        //     "://" +
                        //     req.get("host") +
                        //     "/uploads/categoryitem/', `categoryitem`.`image`))"
                        //   ),
                        //   "image",
                        // ],
                        helper.makeImageUrlSql('categoryitem', 'media', 'categoryitem'),
                        helper.makeImageUrlSql('categoryitem', 'previewMedia', 'categoryitem'),
                        'created',
                    ]
                }],
                // order: [['id', 'DESC']],
            })

            return helper.success(res, `Category item downloaded successfully.`, responseData.categoryitem);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    deletedownloadedCategoryItem: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemId: req.body.categoryItemId,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);
            // console.log(requestData, '=====+>requestData');
            // return;

            let categoryItem = await models.categoryitem.findOne({
                where: {
                    status: 1,
                    id: requestData.categoryItemId,
                },
            });
            if (!categoryItem) throw "Invalid categoryItemId.";
            categoryItem = categoryItem.toJSON();

            let isDownloaded = await models.downloadedcategoryitem.findOne({
                where: {
                    userId: requestData.loginData.id,
                    categoryItemId: requestData.categoryItemId,
                },
                raw: true,
            });

            if (!isDownloaded) throw "Invalid id.";

            await helper.delete(models.downloadedcategoryitem, isDownloaded.id);

            return helper.success(res, `Category item deleted successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    downloadedCategoryItems: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);
            // console.log(requestData, '=====+>requestData');
            // return;

            const downloadedcategoryitems = await models.downloadedcategoryitem.findAll({
                where: {
                    userId: requestData.loginData.id,
                },
                include: [{
                    model: models.categoryitem,
                    required: true,
                    attributes: [
                        'id',
                        'categoryId',
                        'subCategoryId',
                        'title',
                        'introduction',
                        'description',
                        'mediaType',
                        // [
                        //   sequelize.literal(
                        //     "IF (`categoryitem`.`image`='', '', CONCAT('" +
                        //     req.protocol +
                        //     "://" +
                        //     req.get("host") +
                        //     "/uploads/categoryitem/', `categoryitem`.`image`))"
                        //   ),
                        //   "image",
                        // ],

                        helper.makeImageUrlSql('categoryitem', 'media', 'categoryitem'),
                        helper.makeImageUrlSql('categoryitem', 'previewMedia', 'categoryitem'),
                        'created',
                    ]
                }],
                order: [
                    ['id', 'DESC']
                ],
            }).map(downloadedcategoryitem => {
                downloadedcategoryitem = downloadedcategoryitem.toJSON();

                return downloadedcategoryitem.categoryitem;
            });


            return helper.success(res, `Downloaded category items fetched successfully.`, downloadedcategoryitems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    favouriteUnfavouriteCategoryItem: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemId: req.body.categoryItemId,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);
            // console.log(requestData, '=====+>requestData');
            // return;

            let categoryItem = await models.categoryitem.findOne({
                where: {
                    status: 1,
                    id: requestData.categoryItemId,
                },
            });
            if (!categoryItem) throw "Invalid categoryItemId.";
            categoryItem = categoryItem.toJSON();

            const isFavourite = await models.favouritecategoryitem.findOne({
                where: {
                    userId: requestData.loginData.id,
                    categoryItemId: requestData.categoryItemId,
                },
                raw: true,
            });

            if (isFavourite) {
                await helper.delete(models.favouritecategoryitem, isFavourite.id);
            } else {
                const addToFavourite = {
                    userId: requestData.loginData.id,
                    categoryItemId: requestData.categoryItemId,
                };

                const addedId = await helper.save(models.favouritecategoryitem, addToFavourite)
            }

            return helper.success(res, `Category item ${!isFavourite ? 'added to' : 'removed from'} favourite successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },

    async share(req, res, next) {
        try {
            const productId = req.params.productId;
            const categoryId = req.params.categoryId;
            if (!(productId && categoryId)) return;

            res.render('share', { productId, categoryId });

            // const product = await models.product.findOne({
            //   where: {
            //     id: productId,
            //   },
            // });


            // const useragent = req.useragent;
            // const appName = constants.appName;
            // // const androidAppLink = `market://details?id=com.Grocery&product_id=${productId}`;
            // const androidAppLink = `intent://#Intent;package=com.Grocery;scheme=http;launchFlags=268435456;end;`;
            // const iosAppLink = `com.Grocery.app://details?product_id=${productId}&category_id=${categoryId}`;
            // const playStoreLink = "http://play.google.com/store/apps/details?id=com.Grocery&hl=en";
            // // const appsStoreLink = "https://apps.apple.com/us/app/Grocery/id1484991256?ls=1";
            // const appsStoreLink = "http://play.google.com/store/apps/details?id=com.Grocery.app&hl=en";

            // const appLink =
            //   useragent.isiPad || useragent.isiPod || useragent.isiPhone
            //     ? iosAppLink
            //     : androidAppLink;
            // const storeLink =
            //   useragent.isiPad ||
            //     useragent.isiPod ||
            //     useragent.isiPhone ||
            //     useragent.isSafari ||
            //     useragent.isMac
            //     ? appsStoreLink
            //     : playStoreLink;

            // console.log(useragent, "=========================++>useragent");
            // console.log(appLink, "=========================++>appLink");
            // console.log(storeLink, "=========================++>storeLink");

            // // const logo = `${req.protocol}://${req.get(
            // //   "host"
            // // )}/assets/logo.png`;

            // // const shareUrl = `${req.protocol}://${req.get(
            // //   "host"
            // // )}/share/${productId}`;

            // res.render("sharePage", {
            //   useragent,
            //   appName,
            //   appLink,
            //   storeLink,
            //   // productId,
            //   // product,
            //   // logo,
            //   // shareUrl
            // });
        } catch (err) {
            return helper.error(res, err);
        }
    }
};