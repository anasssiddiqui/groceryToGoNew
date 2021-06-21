const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');


const model = 'cart';
const modelName = 'Cart Item';

module.exports = {
    cartItemsListing: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await module.exports.findAll(req, res, {
                userId: requestData.loginData.id
            });

            return helper.success(res, `${modelName}s listing fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addCartItem: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemId: req.body.categoryItemId,
                qty: req.body.qty,
            };
            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (isNaN(Number(requestData.qty))) throw "qty should only be a number.";
            if (parseInt(requestData.qty) <= 0) throw "qty should be greater than 0.";

            const categoryItem = models.categoryitem.findOne({
                where: {
                    id: requestData.categoryItemId,
                    categoryId: 2 // for RE:TAIL
                },
                raw: true,
            });
            if (!categoryItem) throw "Invalid categoryItemId.";

            let modelItemExists = await module.exports.findOne(req, res, {
                userId: requestData.loginData.id,
                categoryItemId: requestData.categoryItemId,
            });
            // if (modelItemExists) throw `${modelName} already exists in the cart.`;

            if (modelItemExists) requestData.id = modelItemExists.id;
            requestData.userId = requestData.loginData.id;

            let modelItemId = await helper.save(models[model], requestData);

            let modelItem = await module.exports.findOne(req, res, {
                id: modelItemId
            });

            return helper.success(res, `${modelName} ${modelItemExists ? 'updated' : 'added'} successfully.`, modelItem);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateCartItem: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                id: req.body.id,
            };
            const nonRequired = {
                // categoryItemId: req.body.categoryItemId,
                qty: req.body.qty,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.hasOwnProperty('qty')) {
                if (isNaN(Number(requestData.qty))) throw "qty should only be a number.";
                if (parseInt(requestData.qty) <= 0) throw "qty should be greater than 0.";
            }

            let modelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: requestData.loginData.id
                },
                raw: true
            });
            if (!modelItem) throw "Invalid id.";

            if (requestData.hasOwnProperty('categoryItemId')) {
                const categoryItem = models.categoryitem.findOne({
                    where: {
                        id: requestData.categoryItemId,
                        categoryId: 2 // for RE:TAIL
                    },
                    raw: true,
                });
                if (!categoryItem) throw "Invalid categoryItemId.";
            }

            requestData.userId = requestData.loginData.id;

            let modelItemId = await helper.save(models[model], requestData);

            modelItem = await module.exports.findOne(req, res, {
                id: modelItemId
            });

            return helper.success(res, `${modelName} updated successfully.`, modelItem);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    deleteCartItem: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const modelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: requestData.loginData.id
                },
                raw: true
            });
            if (!modelItem) throw "Invalid id.";

            await helper.delete(models[model], requestData.id);

            return helper.success(res, `${modelName} deleted successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    findAll: async (req, res, where = {}, modifiedObj = {}) => {
        return await models[model].findAll({
            where,
            order: [['id', 'DESC']],
            include: [
                {
                    model: models.categoryitem,
                    required: true,
                }
            ],
            ...modifiedObj,
        }).map(modelItem => modelItem.toJSON());
    },
    findOne: async (req, res, where = {}, modifiedObj = {}) => {
        let modelItem = await models[model].findOne({
            where,
            include: [
                {
                    model: models.categoryitem,
                    required: true,
                }
            ],
            ...modifiedObj,
        });

        if (modelItem) modelItem = modelItem.toJSON();
        return modelItem;
    }
}