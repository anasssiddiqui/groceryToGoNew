const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');

const stripeNpm = stripe('sk_test_pciIAynild7VofmBr89ZTX6T');

const model = 'order';
const modelName = 'Order';

module.exports = {
    orderListing: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                type: req.body.type, // 1 => ongoing orders, 2 => past orders
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (![1, 2].includes(parseInt(requestData.type))) throw "Invalid type.";
            var status = (requestData.type == 1 ? 0 : 5)


            // ...(
            //     requestData.type == 1 ? {
            //         [Op.eq]: 5,
            //     } : {
            //         [Op.ne]: 0
            //     }
            // )
            const orders = await module.exports.findAll(req, res, {
                customerId: requestData.loginData.id,
                orderStatus: status
            }).then(orders => orders.map(order => {
                delete order.json;
                // delete order.shippingAddress;

                if (order.hasOwnProperty('orderitems') && Array.isArray(order.orderitems) && order.orderitems.length > 0) {
                    // console.log(order, '====>order');
                    order.orderitems = order.orderitems.map(orderItem => {
                        orderItem.product.qty = orderItem.qty;
                        return orderItem;
                    });
                }

                return order;
            }));


            return helper.success(res, `${requestData.type == 1 ? 'Past' : 'Ongoing'} ${modelName} listng fetched successfully.`, orders);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    orderDetail: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                id: req.body.id,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const order = await module.exports.findOne(req, res, {
                id: requestData.id,
                // customerId: requestData.loginData.id,
            });

            if (!order) throw "Invalid id.";

            return helper.success(res, `${modelName} detail fetched successfully.`, order);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addOrder: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                categoryItemIds: req.body.categoryItemIds,
                qtys: req.body.qtys,
                categoryItemTaxes: req.body.categoryItemTaxes,
                categoryItemAmounts: req.body.categoryItemAmounts,
                cardId: req.body.cardId,
                amount: req.body.amount,
                totalTaxCharged: req.body.totalTaxCharged,
                // addressLine1: req.body.addressLine1,
                // city: req.body.city,
                // state: req.body.state,
                // country: req.body.country,
                // pinCode: req.body.pinCode,
                // cardNumber: req.body.cardNumber,
                // expMonth: req.body.expMonth,
                // expYear: req.body.expYear,
                cvv: req.body.cvv,
                paymentMethod: req.body.paymentMethod
            };

            const nonRequired = {
                addressLine2: req.body.addressLine2,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const card = await models.card.findOne({
                where: {
                    id: requestData.cardId,
                    userId: requestData.loginData.id,
                },
                raw: true,
            });
            if (!card) throw "Invalid cardId.";
            console.log(card, '==========>card');
            // return;

            requestData.card = card;

            requestData.categoryItemIds = requestData.categoryItemIds.split(',');
            requestData.qtys = requestData.qtys.split(',');
            requestData.categoryItemAmounts = requestData.categoryItemAmounts.split(',');
            requestData.categoryItemTaxes = requestData.categoryItemTaxes.split(',');

            if (requestData.paymentMethod == 1) {
                const token = await module.exports.stripeToken(requestData);

                const payment = await stripeNpm.charges.create({
                    amount: requestData.amount * 100,
                    currency: 'INR',
                    source: token,
                    description: 'Grocery Payment'
                });

                console.log(payment, '======>payment');


                if (payment && payment.status != "succeeded") {
                    throw "Something went, payment could not be processed.";
                }
            }

            if (requestData.paymentMethod == 0) {
                var finalAmount = Number(required.loginData.wallet) - Number(requestData.amount)

                const update_details = await models.user.update({
                    wallet: finalAmount
                }, {
                    where: {
                        id: required.loginData.id
                    }
                });
            }



            const orderId = await helper.save(models.order, {
                customerId: requestData.loginData.id,
                netAmount: requestData.amount,
                total: requestData.amount,
                taxCharged: requestData.totalTaxCharged,
                paymentMethod: requestData.paymentMethod,
                json: '',
                orderNo: helper.orderNumber(),
            });

            const orderItems = requestData.categoryItemIds.map((categoryItemId, index) => ({
                orderId,
                categoryItemId,
                qty: requestData.qtys[index],
                netAmount: Number(requestData.qtys[index]) * Number(requestData.categoryItemAmounts[index]),
                total: Number(requestData.qtys[index]) * Number(requestData.categoryItemAmounts[index]),
                taxCharged: Number(requestData.qtys[index]) * Number(requestData.categoryItemTaxes[index]),
                amountAfterTax: Number(requestData.qtys[index]) * Number(requestData.categoryItemAmounts[index]) + Number(requestData.qtys[index]) * Number(requestData.categoryItemTaxes[index]),
            }));

            await models.orderitem.bulkCreate(orderItems);
            // console.log(orderItems, '=====>orderItems');
            // return;

            // const addShippingAddress = await helper.save(models.shippingAddress, {
            //     ...requestData,
            //     orderId,
            //     userId: requestData.loginData.id,
            // });

            const order = await module.exports.findOne(req, res, {
                id: orderId,
            });

            // var insert_invoice = await models.order.create({
            //     userId: data.order.userId,
            //     orderId: data.order.id,
            //     amount: data.amount,
            //     providerId: data.order.providerId,
            //     cardId: data.card.id,
            //     type: 1,
            //     isOrderType: data.isOrderType,
            //     adminFees: admin_fees,
            //     transectionId: payment.id,
            //     data: JSON.stringify(payment)
            // });
            // return payment.status;

            return helper.success(res, `${modelName} created successfully.`, order);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    stripeToken: async function(data) {
        // console.log(data, '=====>data');
        // return;
        // console.log(data.card.year, '=====>data.card.year');
        // data.card.year = String(data.card.year).slice(2);
        // console.log(data.card.year, '=====>data.card.year');
        const token = await stripeNpm.tokens.create({
            card: {
                number: data.card.cardNumber,
                exp_month: data.card.month,
                exp_year: String(data.card.year).slice(2),
                cvc: data.cvv,
            },
        });
        if (token) {
            return token.id;
        }
    },
    findOne: async(req, res, where = {}, conditions = {}) => {
        let modelItem = await models[model].findOne({

            where,
            include: [{
                    model: models.user,
                    as: 'customer',
                    required: true,
                    attributes: [
                        'id',
                        'username',
                        'email', [sequelize.literal('(SELECT address FROM usersAddresses WHERE userId = order.customerId and isdefault=0)'), 'shippingAddress'],
                    ],

                },
                {
                    model: models.orderitem,
                    required: false,
                    include: [{
                        model: models.product,
                        required: true,
                        attributes: {
                            include: [
                                [
                                    sequelize.literal(
                                        "IF (`orderitems->product`.`image`='', '', CONCAT('" +
                                        req.protocol +
                                        "://" +
                                        req.get("host") +
                                        "/uploads/product/', `orderitems->product`.`image`))"
                                    ),
                                    "image",
                                ],
                            ]
                        }
                    }]
                },
            ],
            ...conditions,
        });

        if (modelItem) modelItem = modelItem.toJSON();

        if (modelItem.hasOwnProperty('orderitems') && Array.isArray(modelItem.orderitems) && modelItem.orderitems.length > 0) {
            // console.log(order, '====>order');
            modelItem.orderitems = modelItem.orderitems.map(orderItem => {
                orderItem.product.qty = orderItem.qty;
                return orderItem;
            });
        }

        return modelItem;
    },
    findAll: async(req, res, where = {}, conditions = {}) => {
        return await models[model].findAll({
            where,
            include: [{
                    model: models.user,
                    as: 'customer',
                    required: true,
                    attributes: [
                        'id',
                        'username',
                        'email',
                    ]
                },
                // {
                //     model: models.shippingAddress,
                //     required: true,
                // },
                {
                    model: models.orderitem,
                    required: false,
                    include: [{
                        model: models.product,
                        required: true,
                        attributes: {
                            include: [
                                [
                                    sequelize.literal(
                                        "IF (`orderitems->product`.`image`='', '', CONCAT('" +
                                        req.protocol +
                                        "://" +
                                        req.get("host") +
                                        "/uploads/product/', `orderitems->product`.`image`))"
                                    ),
                                    "image",
                                ],
                            ]
                        }
                    }]
                },
            ],
            order: [
                ['id', 'DESC']
            ],
            ...conditions,
        }).map(modelItem => modelItem.toJSON());
    },
}