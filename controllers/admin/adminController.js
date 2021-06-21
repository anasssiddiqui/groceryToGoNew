const models = require('../../models');
const sequelize = require('sequelize');
const helper = require('../../helpers/helper');
const { request } = require('express');

const orderControllerApi = require('../api/orderController');

const User = models.user;
const AdminDetail = models.admindetail;

module.exports = {
    dashboard: async (req, res) => {
        try {
            global.currentModule = 'Dashboard';

            let getCounts = await User.findOne({
                attributes: [
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=1)'), 'user'],
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=2)'), 'driver'],
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=3)'), 'vendor'],
                    [sequelize.literal('(SELECT COUNT(*) FROM categoryitem WHERE categoryId=1)'), 'recipe'],
                    [sequelize.literal('(SELECT COUNT(*) FROM categoryitem WHERE categoryId=2)'), 'retail'],
                    [sequelize.literal('(SELECT COUNT(*) FROM categoryitem WHERE categoryId=3)'), 'revive'],
                    [sequelize.literal('(SELECT COUNT(*) FROM categoryitem WHERE categoryId=4)'), 'read'],
                    [sequelize.literal('(SELECT COUNT(*) FROM categoryitem WHERE categoryId=5)'), 'reset'],
                    [sequelize.literal('(SELECT COUNT(*) FROM todayscategory)'), 'todaysCategory'],
                    [sequelize.literal('(SELECT COUNT(*) FROM category)'), 'category'],
                    [sequelize.literal('(SELECT COUNT(*) FROM category WHERE hierarchyLevel=1)'), 'parentcategory'],
                    // [sequelize.literal(`(SELECT COUNT(*) FROM \`order\` AS o WHERE o.vendorId=${adminData.id})`), 'order'],hierarchyLevel
                    [sequelize.literal(`(SELECT COUNT(*) FROM \`order\` AS o )`), 'order'],

                    [sequelize.literal("(SELECT COUNT(*) FROM `product` AS `product` LEFT OUTER JOIN `user` AS `vendor` ON `product`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN`vendordetail` AS `vendor->vendordetail` ON`vendor`.`id` = `vendor->vendordetail`.`userId`)"), 'product'],

                    [sequelize.literal("(SELECT COUNT(*) FROM `ordercancellationrequest` AS `ordercancellationrequest` INNER JOIN `order` AS `order` ON `ordercancellationrequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userdetail` AS `order->customer->userdetail` ON `order->customer`.`id` = `order->customer->userdetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `order->vendor->vendordetail` ON `order->vendor`.`id` = `order->vendor->vendordetail`.`userId` ORDER BY `ordercancellationrequest`.`id` DESC)"), 'ordercancellationrequest'],
                    [sequelize.literal("(SELECT COUNT(*) FROM `orderrefundrequest` AS `orderrefundrequest` INNER JOIN `order` AS `order` ON `orderrefundrequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userdetail` AS `order->customer->userdetail` ON `order->customer`.`id` = `order->customer->userdetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `order->vendor->vendordetail` ON `order->vendor`.`id` = `order->vendor->vendordetail`.`userId`  ORDER BY `orderrefundrequest`.`id` DESC)"), 'orderrefundrequest'],
                    [sequelize.literal("(SELECT COUNT(*) FROM `orderwithdrawalrequest` AS `orderwithdrawalrequest` INNER JOIN `order` AS `order` ON `orderwithdrawalrequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userdetail` AS `order->customer->userdetail` ON `order->customer`.`id` = `order->customer->userdetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `order->vendor->vendordetail` ON `order->vendor`.`id` = `order->vendor->vendordetail`.`userId` ORDER BY `orderwithdrawalrequest`.`id` DESC)"), 'orderWithdrawalRequests'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT DATE(`order`.`createdAt`) AS `grouped_date`, COUNT(*) AS `count` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userdetail` AS `customer->userdetail` ON `customer`.`id` = `customer->userdetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `vendor->vendordetail` ON `vendor`.`id` = `vendor->vendordetail`.`userId` GROUP BY `grouped_date` ORDER BY `order`.`id` DESC) as tt)"), 'salesReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userdetail` AS `customer->userdetail` ON `customer`.`id` = `customer->userdetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `vendor->vendordetail` ON `vendor`.`id` = `vendor->vendordetail`.`userId` GROUP BY `customerId` ORDER BY `order`.`id` DESC) AS tt)"), 'userReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userdetail` AS `customer->userdetail` ON `customer`.`id` = `customer->userdetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `vendor->vendordetail` ON `vendor`.`id` = `vendor->vendordetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'sellerReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userdetail` AS `customer->userdetail` ON `customer`.`id` = `customer->userdetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `vendor->vendordetail` ON `vendor`.`id` = `vendor->vendordetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'taxReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userdetail` AS `customer->userdetail` ON `customer`.`id` = `customer->userdetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendordetail` AS `vendor->vendordetail` ON `vendor`.`id` = `vendor->vendordetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'commissionReport'],
                ],
                raw: true
            });
            console.log(getCounts, '===============>getCounts');

            return res.render('admin/home/dashboard', { getCounts });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    dashboardCounts: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            // let getCounts = await User.findOne({
            //     attributes: [
            //         [sequelize.literal('(SELECT COUNT(*) FROM users WHERE users.role=1)'), 'users'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM communities)'), 'communities'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM journals)'), 'journals'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM posts)'), 'posts'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM reported_posts)'), 'reportedPosts'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM `order`)'), 'order'],
            //         [sequelize.literal('(SELECT count(*) FROM ordercancellationrequest)'), 'ordercancellationrequest'],
            //     ],
            //     raw: true
            // });

            // console.log(getCounts,  '======================>getCounts'); return;

            return helper.success(res, 'Admin Dashboard Count Fetched Successfully.', getCounts);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateStatus: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                status: req.body.status,
                model: req.body.model
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const updatedItem = await helper.save(models[requestData.model], requestData, true);

            return helper.success(res, 'Status Updated Successfully.', updatedItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    delete: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                model: req.body.model
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const deleteItem = await models[requestData.model].destroy({
                where: {
                    id: requestData.id
                }
            });

            return helper.success(res, 'Item Deleted Successfully.', deleteItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },

    changeField: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                field: req.body.field,
                fieldValue: req.body.fieldValue,
                model: req.body.model
            };
            const nonRequired = {
                modelTitle: req.body.modelTitle,
                statusText: req.body.statusText,               
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            requestData[requestData.field] = requestData.fieldValue;
            const updatedItem = await helper.save(models[requestData.model], requestData, true);

            if (requestData.model == 'order' && requestData.field == 'orderStatus') {
                const user = await models.user.findOne({
                    where: {
                        id: updatedItem.customerId,
                    },
                    raw: true,
                });
                
                const order = await orderControllerApi.findOne(req, res, {
                    id: requestData.id,
                    // customerId: requestData.loginData.id,
                });
                
                // console.log(order, '=====>order');
                const message = `${requestData.modelTitle} status changed to ${requestData.statusText} ${updatedItem.orderNo}`;

                const addNotification = await helper.save(models.notifcations, {
                    senderId: 0,
                    recieverId: user.id,
                    notificationType: 1,
                    message,
                    data: order,                    
                });



                // user.deviceType = 1;
                // user.deviceToken = "a96701e670986e7af934b17400a8fcd6f68cbe9424de074453abe5f5250dcb35";
                // user.deviceType = 2;
                // user.deviceToken = "dA4Hbo5YTbORz-OPsYy3ZQ:APA91bFLXJkAZr9iktJrEAKgRgWrsAkxFWNd_EfhfZW5dC5x2cfiSxZtxETlpc0qmA71n0okeM44bJWuXPgdNumJEgHaabULFowf3OBsqcS_RAA0oqkVDM8NTa68cXCjr-sfQPbCJ_xI";
                

                if (user && user.deviceToken) {
                    const notificationData = {
                        deviceType: user.deviceType,
                        deviceToken: user.deviceToken,
                        title: message,
                        code: 1,
                        body: updatedItem
                    };
                    // data.deviceType = user.deviceType;
                    // data.token = user.deviceToken;
                    // data.title = `${modelTitle} status changed to ${statusText}`;
                    // data.code = 1;
                    // data.body = body;
                    
                    await helper.pushNotification(notificationData);
                }
            }

            // console.log(requestData.model, '======>requestData.model');
            // console.log(requestData.field, '======>requestData.field');
            // console.log(updatedItem, '======>updatedItem');

            return helper.success(res, 'Status Updated Successfully.', updatedItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
}