const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');


const model = 'card';
const modelName = 'Card';

module.exports = {
    allCards: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await models[model].findAll({
                where: {
                    userId: requestData.loginData.id
                },
                order: [['id', 'DESC']],
            });

            return helper.success(res, `${modelName}s fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addCard: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                cardType: req.body.cardType,
                name: req.body.name,
                cardNumber: req.body.cardNumber,
                month: req.body.month,
                year: req.body.year,
            };
            const nonRequired = {
                isDefault: req.body.isDefault,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (isNaN(Number(requestData.cardType))) throw "cardType should only be a number.";

            requestData.cardNumber = requestData.cardNumber.replace(/\s/g, '');

            const now = moment().unix();
            const cardExpiry = moment(`${requestData.year}/${requestData.month}/01`, 'YYYY/MM/DD').unix();

            // const month = now.format('M');
            // const day = now.format('D');
            // const year = now.format('YYYY');

            // console.log(year, month, day);
            console.log(now, '=========>now');
            console.log(cardExpiry, '=======>cardExpirty');
            
            if (cardExpiry < now) throw "Invalid Expiry.";
            // return;

            if (requestData.cardNumber.length != 16) throw "Card number should be 16 digit long.";
            if (requestData.month.length != 2) throw "Month should be 2 digit long.";
            if (requestData.year.length != 4) throw "Year should be 4 digit long.";



            if (requestData.hasOwnProperty('isDefault') && requestData.isDefault == 1) {
                await models[model].update(
                    {
                        isDefault: 0
                    },
                    {
                        where: {
                            userId: requestData.loginData.id
                        }
                    }
                );

                requestData.isDefault = 1;
            }

            requestData.userId = requestData.loginData.id;

            let modelItem = await helper.save(models[model], requestData, true);

            return helper.success(res, `${modelName} added successfully.`, modelItem);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    deleteCard: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const card = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: requestData.loginData.id
                },
                raw: true
            });

            if (!card) throw "Invalid id.";

            await helper.delete(models[model], requestData.id);

            return helper.success(res, `${modelName} deleted successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    changeDefaulCard: async (req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const card = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: requestData.loginData.id
                },
                raw: true
            });
            if (!card) throw "Invalid id.";

            await models[model].update(
                {
                    isDefault: 0
                },
                {
                    where: {
                        userId: requestData.loginData.id
                    }
                }
            );

            requestData.isDefault = 1;

            let modelItem = await helper.save(models[model], requestData, true);

            let modelItems = await models[model].findAll({
                where: {
                    userId: requestData.loginData.id
                },
                order: [['id', 'DESC']],
            });

            return helper.success(res, `${modelName} changed to default successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
}