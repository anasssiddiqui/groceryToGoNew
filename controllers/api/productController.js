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

    favouriteProductItems: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);


            const favouritesProducts = await models.favouritesProducts.findAll({
                where: {
                    userId: requestData.loginData.id,
                },
                include: [{
                    model: models.product,
                    required: true,
                    attributes: [
                        'id',
                        'price',
                        'name',
                        'description', [sequelize.literal('ifnull((SELECT (Round(AVG(ratings))) FROM productsRatings WHERE productsRatings.productId = product.id  ),0)'), 'avgRating'],
                        [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.productId= product.id)'), 'ratingsCount'],
                        helper.makeImageUrlSql('product', 'image', 'product'),
                    ]
                }],
                order: [
                    ['id', 'DESC']
                ],
            }).map(favouritesProducts => {
                favouritesProducts = favouritesProducts.toJSON();

                return favouritesProducts.product;
            });


            return helper.success(res, `Favourite category items fetched successfully.`, favouritesProducts);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getFavProducts: async(req, res) => {

        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const nonRequired = {};
            // console.log(required, "==================");

            let requestdata = await helper.vaildObject(required, nonRequired);
            console.log(requestdata)
            const findUser = await models.user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                },
                raw: true,
            });

            if (!findUser) throw "Invalid Auth tokken.";


            var ratings_list = await models.favourites.findAll({
                attributes: ['id', 'productid', [sequelize.literal('(SELECT name FROM userdetail WHERE id = productsRatings.userId)'), 'username'],
                    [sequelize.literal('(SELECT image FROM userdetail WHERE id = productsRatings.userId)'), 'image'],
                ],
                where: {
                    productId: requestdata.productId
                }
            })

            return helper.success(res, `product Ratings data fetched successfully.`, response);

        } catch (err) {
            return helper.error(res, err);
        }
    },
    productsReviews: async(req, res) => {

        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                productId: req.body.productId
            };
            const nonRequired = {};
            // console.log(required, "==================");

            let requestdata = await helper.vaildObject(required, nonRequired);
            console.log(requestdata)
            const findUser = await models.user.findOne({
                where: {
                    auth_key: requestdata.auth_key,
                },
                raw: true,
            });

            if (!findUser) throw "Invalid Auth tokken.";




            var ratings_statistics = await models.productsRatings.findOne({
                attributes: [
                    [sequelize.literal('ifnull((SELECT (Round(AVG(ratings))) FROM productsRatings WHERE productsRatings.productid =' + requestdata.productId + ' ),0)'), 'avg_ratings'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.productId=' + requestdata.productId + ')'), 'user_rating'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.ratings=5 and productsRatings.productId=' + requestdata.productId + ')'), 'five_stars'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.ratings=4 and productsRatings.productId=' + requestdata.productId + ')'), 'four_stars'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.ratings=3 and productsRatings.productId=' + requestdata.productId + ')'), 'three_stars'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.ratings=2 and productsRatings.productId=' + requestdata.productId + ')'), 'two_stars'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.ratings=1 and productsRatings.productId=' + requestdata.productId + ')'), 'one_stars'],
                ],
                where: {
                    productId: requestdata.productId
                }
            })


            var ratings_list = await models.productsRatings.findAll({
                attributes: ['id', 'createdAt', 'ratings', 'comment', [sequelize.literal('(SELECT name FROM userdetail WHERE id = productsRatings.userId)'), 'username'],
                    [sequelize.literal('(SELECT image FROM userdetail WHERE id = productsRatings.userId)'), 'image'],
                ],
                where: {
                    productId: requestdata.productId
                }
            })

            var response = {
                ratingsStatistics: ratings_statistics,
                ratingsList: ratings_list
            }
            return helper.success(res, `product Ratings data fetched successfully.`, response);

        } catch (err) {
            return helper.error(res, err);
        }
    },

    homeCategoryBasedProducts: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryId: req.body.categoryId,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);
            const findUser = await models.user.findOne({
                where: {
                    auth_key: requestData.auth_key,
                },
                raw: true,
            });
            if (!findUser) throw "Invalid Auth tokken.";


            const category = await models.category.findOne({
                where: {
                    id: requestData.categoryId,
                    parentId: null,
                    status: 1,
                },
                attributes: [
                    'id',
                    'name',
                ],
                raw: true,
            });
            if (!category) throw "Invalid categoryId.";

            const findProducts = await models.product.findAll({
                where: {
                    categoryId: requestData.categoryId,
                    status: 1,
                },
                attributes: [
                    'id',
                    'name',
                    'description', 'price', 'taxCharged', [sequelize.literal(`IF ( (SELECT COUNT(*) FROM favouritesProducts AS f WHERE f.userid=${findUser.id} && f.productid=product.id) >= 1, 1, 0)`), 'isFavourite'],
                    [sequelize.literal('ifnull((SELECT (Round(AVG(ratings))) FROM productsRatings WHERE productsRatings.productId = product.id  ),0)'), 'avgRating'],
                    [sequelize.literal('(SELECT count(*) FROM productsRatings WHERE productsRatings.productId= product.id)'), 'ratingsCount'],
                    helper.makeImageUrlSql("product", 'image', "product"),
                ],
                raw: true,
            });


            return helper.success(res, `Category Based data fetched successfully.`, findProducts);
        } catch (err) {
            return helper.error(res, err);
        }
    },
}