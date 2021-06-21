const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');


const model = 'notifcations';
const modelName = 'Notification';

module.exports = {
    notificationListing: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await models[model].findAll({
                attributes: ['notificationType', 'message', 'isRead'],
                where: {
                    recieverId: requestData.loginData.id
                },
                order: [
                    ['id', 'DESC']
                ],
            });

            return helper.success(res, `${modelName}s fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
}