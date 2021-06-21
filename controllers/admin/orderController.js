const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userdetail;
// const DriverDetail = models.driverdetail;

global.model = "order";
global.modelTitle = "Order";
global.modelDataTable = "orderDataTable";

const roleTypes = {
    0: 'Admin',
    1: 'User',
    2: 'Driver',
    3: 'Vendor'
}
const userRoleModels = {
    0: 'adminetail',
    1: 'userdetail',
    2: 'driverdetail',
    3: 'vendordetail',
}
const orderTypeTexts = {
    0: 'Delivery',
    1: 'Pick Up',
}
const orderStatusTexts = {
    0: 'Order Placed',
    1: 'In Preparation',
    2: 'Order Picked up by customer',
    3: 'Order Received',
}

// const orderTypeTexts = {
//     0: 'Order Placed',
//     1: 'In Preparation',
//     2: 'Order Picked up by customer',
//     3: 'Order Received',
// }

const orderStatus = {
    0: {
        value: `Order Placed`,
        backgroundCssColor: `#607d8a`,
    },
    1: {
        value: `In Preparation`,
        backgroundCssColor: `orange`,
    },
    2: {
        value: `Ready for Pickup`,
        backgroundCssColor: `#870f58`,
    },
    3: {
        value: `Order Picked up by customer`,
        backgroundCssColor: `#ca841b`,
    },
    4: {
        value: `Order Picked up by Driver`,
        backgroundCssColor: `green`,
    },
    5: {
        value: `Order Received`,
        backgroundCssColor: `#007bff`,
    }
}

const paymentMethodText = {
    0: 'Wallet',
    1: 'Card',
}

module.exports = {
    view: async (req, res) => {
        try {
            // global.currentModule = 'Order';
            global.currentSubModule = 'Detail';
            global.currentSubModuleSidebar = 'View';

            const order = await module.exports.findOneOrder(req.params.id);
            // console.log(JSON.stringify(order, null, 2), '=========================>order');
            // return;
            // let orderTypeTextaa = ``;
            order.orderTypeTextaa = orderTypeTexts[order.orderType];
            order.orderStatusText = orderStatusTexts[order.orderStatus];
            order.paymentMethodText = paymentMethodText[order.paymentMethod];

            const headerColumns = Object.values({
                sno: '#',
                Image: 'Image',
                // orderParticulars: 'Order Particulars',
                qty: 'Quantity',
                shippingCharges: 'Shipping Charges',
                price: 'Price',
                taxCharged: 'Tax Charged',
                total: 'Total',
            });

            const data = order.orderitems.map((orderitem, index) => {

                return Object.values({
                    sno: parseInt(index) + 1,
                    image: `<img alt="image" src="${orderitem.categoryitem.image}" class="datatable_list_image" data-toggle="tooltip" title="${orderitem.categoryitem.image}">`,
                    // orderParticulars: `Name: ${orderitem.categoryitem.name}<br/>
                    //                Brand: ${orderitem.categoryitem.brandName}`,
                    qty: orderitem.qty,
                    shippingCharges: orderitem.shippingCharges,
                    price: orderitem.netAmount,
                    taxCharged: orderitem.taxCharged,
                    total: orderitem.total,
                });
            });

            return res.render('admin/order/view', { order, headerColumns, data, orderStatus });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    orders: async (req, res) => {
        try {
            global.currentModule = 'Orders';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = 'orders';

            const model = "order";
            const modelTitle = "Order";
            // order.orderTypeText = orderTypeTexts[order.orderType];

            const listing = await models[model].findAndCountAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userdetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                    // vendorId: adminData.id
                },
                include: [{

                    model: models['user'],
                    as: 'customer',
                    required: true,
                    // include: [{
                    //     model: models['userdetail'],
                    //     attributes: {
                    //         include: [
                    //             [sequelize.literal(`(IF (\`customer->userdetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userdetail\`.\`image\`)) )`), 'image']
                    //         ]
                    //     }
                    // },]
                },
                    // {

                    //     model: models['user'],
                    //     as: 'vendor',
                    //     required: true,
                    //     include: [
                    //         {
                    //             model: models['vendordetail'],
                    //             attributes: {
                    //                 include: [
                    //                     [sequelize.literal(`(IF (\`vendor->vendordetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendordetail\`.\`image\`)) )`), 'image']
                    //                 ]
                    //             }
                    //         },
                    //     ]
                    // },
                ],
                order: [
                    ['id', 'DESC']
                ],
                raw: true,
                nest: true
            });


            const headerColumns = Object.values({
                sno: '#',
                orderId: 'Order ID',
                customerName: 'Customer',
                orderType: 'Order Type',
                orderDate: 'Order Date',
                total: 'Total',
                orderStatus: 'Order Status',
                action: 'Action',
            });

            const data = listing.rows.map((order, index) => {
                // order = order.toJSON();

                // const orderStatus = {
                //     0: {
                //         value: `Pending`,
                //         backgroundCssColor: `red`,
                //     },
                //     1: {
                //         value: `In Progress`,
                //         backgroundCssColor: `#ffc107`,
                //     },
                //     2: {
                //         value: `Complete`,
                //         backgroundCssColor: `green`,
                //     },
                // }
                
                let orderTypeTextaa = ``;
                orderTypeTextaa = orderTypeTexts[order.orderType];
                
                

                let orderStatusSelect = ``;
                orderStatusSelect += `<select class="changeOrderRequestStatus" model="${model}" model_title="${modelTitle}" model_id="${order.id}" field="orderStatus" style="background: ${orderStatus[order.orderStatus].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderStatus) {
                    orderStatusSelect += `<option value="${status}" ${status == order.orderStatus ? 'selected' : ''} style="background: ${orderStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderStatus[status].value}</option>`;
                }
                orderStatusSelect += `</select>`;

                return Object.values({
                    sno: parseInt(index) + 1,
                    orderId: order.orderNo,
                    customerName: `Name: ${order.customer.username}<br/>
                                   Email: ${order.customer.email}`,
                    orderType: orderTypeTextaa,         
                    orderDate: moment(order.createdAt).format('dddd, MMMM Do YYYY, h:mm a'),
                    total: order.total,
                    orderStatus: orderStatusSelect,
                    action: `
                    <a href="/admin/order/view/${order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                });
            });

            return res.render('admin/order/orders', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    cancellationRequests: async (req, res) => {
        try {
            global.currentModule = 'Cancellation Requests';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = '';

            const model = "ordercancellationrequest";
            const modelTitle = 'Order Cancel Request';

            const listing = await models[model].findAll({
                where: {
                    vendorId: adminData.id
                },
                include: [{
                    model: models['order'],
                    required: true,
                    include: [{

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [{
                            model: models['userdetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (\`order->customer->userdetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->customer->userdetail\`.\`image\`)) )`), 'image']
                                ]
                            }
                        },]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [{
                            model: models['vendordetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (\`order->vendor->vendordetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->vendor->vendordetail\`.\`image\`)) )`), 'image']
                                ]
                            }
                        },]
                    },
                    ],
                }],
                order: [
                    ['id', 'DESC']
                ],
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                seller: 'Seller',
                customer: 'Customer',
                requestDetails: 'Request Details',
                orderDate: 'Date',
                amount: 'Amount',
                status: 'Status',
                action: 'Action',
            });

            const data = listing.map((ordercancellationrequest, index) => {
                // const orderStatus = {
                //     0: `Pending`,
                //     1: `In Progress`,
                //     2: `Complete`,
                // }
                const orderStatus = orderStatusTexts;

                const orderRequestStatus = {
                    0: {
                        value: `Pending`,
                        backgroundCssColor: `#ffc107`,
                    },
                    1: {
                        value: `Approved`,
                        backgroundCssColor: `green`,
                    },
                    2: {
                        value: `Disapproved`,
                        backgroundCssColor: `red`,
                    },
                }

                let orderRequestSelect = ``;
                orderRequestSelect += `<select class="changeOrderRequestStatus" field="status" model="${model}" model_title="${modelTitle}" model_id="${ordercancellationrequest.id}" style="background: ${orderRequestStatus[ordercancellationrequest.status].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderRequestStatus) {
                    orderRequestSelect += `<option value="${status}" ${status == ordercancellationrequest.status ? 'selected' : ''} style="background: ${orderRequestStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderRequestStatus[status].value}</option>`;
                }
                orderRequestSelect += `</select>`;



                return Object.values({
                    sno: parseInt(index) + 1,
                    seller: `Name: ${ordercancellationrequest.order.vendor.vendordetail.name}<br/>
                            Email: ${ordercancellationrequest.order.vendor.email}`,
                    customer: `Name: ${ordercancellationrequest.order.customer.userdetail.name}<br/>
                               Email: ${ordercancellationrequest.order.customer.email}`,
                    requestDetails: `Order/Invoice: ${ordercancellationrequest.order.orderNo}<br/>
                                     Order Status: ${orderStatus[ordercancellationrequest.order.orderStatus]}<br/>
                                     Reason: ${ordercancellationrequest.reason}<br/>
                                     Comments: ${ordercancellationrequest.comments}
                                     `,
                    date: moment(ordercancellationrequest.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    amount: ordercancellationrequest.order.total,
                    status: orderRequestSelect,
                    action: `
                    <a href="/admin/order/view/${ordercancellationrequest.order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                });
            });

            return res.render('admin/order/cancellationRequests', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    orderReturnRequests: async (req, res) => {
        try {
            global.currentModule = 'Order Return Requests';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = 'orderReturnRequests';

            const model = "orderrefundrequest";
            const modelTitle = 'Order Return Request';

            const listing = await models['orderrefundrequest'].findAndCountAll({
                where: {
                    vendorId: adminData.id
                },
                include: [{
                    model: models['order'],
                    required: true,
                    include: [{

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [{
                            model: models['userdetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (\`order->customer->userdetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->customer->userdetail\`.\`image\`)) )`), 'image']
                                ]
                            }
                        },]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [{
                            model: models['vendordetail'],
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (\`order->vendor->vendordetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->vendor->vendordetail\`.\`image\`)) )`), 'image']
                                ]
                            }
                        },]
                    },
                    ],
                }],
                order: [
                    ['id', 'DESC']
                ],
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                seller: 'Seller',
                customer: 'Customer',
                requestDetails: 'Request Details',
                orderDate: 'Date',
                amount: 'Amount',
                status: 'Status',
                action: 'Action'
            });

            const data = listing.rows.map((ordercancellationrequest, index) => {
                const orderStatus = orderStatusTexts;
                // const orderStatus = {
                //     0: `Pending`,
                //     1: `In Progress`,
                //     2: `Complete`,
                // }

                const orderRequestStatus = {
                    0: {
                        value: `Pending`,
                        backgroundCssColor: `#ffc107`,
                    },
                    1: {
                        value: `Approved`,
                        backgroundCssColor: `green`,
                    },
                    2: {
                        value: `Disapproved`,
                        backgroundCssColor: `red`,
                    },
                }

                let orderRequestSelect = ``;
                orderRequestSelect += `<select class="changeOrderRequestStatus" field="status" model="${model}" model_title="${modelTitle}" model_id="${ordercancellationrequest.id}" style="background: ${orderRequestStatus[ordercancellationrequest.status].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderRequestStatus) {
                    orderRequestSelect += `<option value="${status}" ${status == ordercancellationrequest.status ? 'selected' : ''} style="background: ${orderRequestStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderRequestStatus[status].value}</option>`;
                }
                orderRequestSelect += `</select>`;

                return Object.values({
                    sno: parseInt(index) + 1,
                    seller: `Name: ${ordercancellationrequest.order.vendor.vendordetail.name}<br/>
                            Email: ${ordercancellationrequest.order.vendor.email}`,
                    customer: `Name: ${ordercancellationrequest.order.customer.userdetail.name}<br/>
                               Email: ${ordercancellationrequest.order.customer.email}`,
                    requestDetails: `Order/Invoice: ${ordercancellationrequest.order.orderNo}<br/>
                                     Order Status: ${orderStatus[ordercancellationrequest.order.orderStatus]}<br/>
                                     Reason: ${ordercancellationrequest.reason}<br/>
                                     Comments: ${ordercancellationrequest.comments}
                                     `,
                    date: moment(ordercancellationrequest.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    amount: ordercancellationrequest.order.total,
                    status: orderRequestSelect,
                    action: `
                    <a href="/admin/order/view/${ordercancellationrequest.order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                    // action
                });
            });

            return res.render('admin/order/orderReturnRequests', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    findOneOrder: async (id) => {
        let order = await models['order'].findOne({
            where: {
                id
            },
            include: [
                {

                model: models['user'],
                as: 'customer',
                required: true,
                include: [{
                    model: models['userdetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (\`customer->userdetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userdetail\`.\`image\`)) )`), 'image']
                        ]
                    }
                },]
            },
            // {

            //     model: models['user'],
            //     as: 'vendor',
            //     required: true,
            //     include: [{
            //         model: models['vendordetail'],
            //         attributes: {
            //             include: [
            //                 [sequelize.literal(`(IF (\`vendor->vendordetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendordetail\`.\`image\`)) )`), 'image']
            //             ]
            //         }
            //     },]
            // },
            {

                model: models['orderitem'],
                required: false,
                include: [
                    {
                    model: models['categoryitem'],
                    required: true,
                    attributes: {
                        include: [
                            // [sequelize.literal(`(IF (\`orderitems.categoryitem.image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/categoryitem/', \`orderitems.categoryitem.image\`)) )`), 'image']
                            [sequelize.literal(`(IF (\`orderitems->categoryitem\`.\`previewMedia\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/categoryitem/', \`orderitems->categoryitem\`.\`previewMedia\`)) )`), 'image']
                        ]
                    }
                }
                ]
            },
            ],
        });

        if (!order) throw "Invalid orderId.";
        return order.toJSON();


    },
}