const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');
const db = require("../../models");

const usersAddresses = db.usersAddresses

module.exports = {
    addressDefaultSet: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                addressId: req.body.addressId
            };
            const non_required = {};

            let requestdata = await helper.vaildObject(required, non_required, res);
            var findAddress = await usersAddresses.findOne({
                    where: {
                        userId: required.loginData.id,
                        isdefault: 1
                    },
                    raw: true
                })
                // console.log(findAddress, "==========address");
                // return
            if (findAddress) {
                var updateaddress = await usersAddresses.update({
                    isdefault: 0
                }, {
                    where: {
                        id: findAddress.id
                    }
                })

                var updateaddress = await usersAddresses.update({
                    isdefault: 1
                }, {
                    where: {
                        id: requestdata.addressId
                    }
                })
            }



            return helper.success(res, "Change default address successfully.", {});
        } catch (error) {
            return helper.error(res, error);
        }
    },
    deleteAddress: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                addressId: req.body.addressId,

            };
            const non_required = {

            };

            let requestdata = await helper.vaildObject(required, non_required, res);

            var findAddress = await usersAddresses.findOne({
                where: {
                    id: requestdata.addressId
                }
            })
            if (findAddress.dataValues.isdefault == 1) {

                var getappointments = await usersAddresses.destroy({

                    where: {
                        id: requestdata.addressId
                    }
                })
                var findcard = await usersAddresses.findOne({

                    where: {
                        userId: required.loginData.id,
                    }
                })

                if (findcard) {

                    var getappointments = await usersAddresses.update({
                        isdefault: 1,

                    }, {
                        where: {
                            id: findcard.dataValues.id
                        }
                    })

                }

            } else {
                var getappointments = await usersAddresses.destroy({

                    where: {
                        id: requestdata.addressId
                    }
                })
            }

            return helper.success(res, "Delete address successfully.", {});
        } catch (error) {
            return helper.error(res, error);
        }
    },
    editAddress: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                authKey: req.headers.auth_key,
                addressId: req.body.addressId,

            };
            const non_required = {
                address: req.body.address,
                lat: req.body.lng,
                lng: req.body.lng,
                country: req.body.country,
                phone: req.body.phone
            };

            let requestdata = await helper.vaildObject(required, non_required, res);


            var updateaddress = await usersAddresses.update({
                type: requestdata.type,
                address: requestdata.address,
                address: requestdata.address,
                lat: requestdata.lng,
                lng: requestdata.lng,
                country: requestdata.country,
                phone: requestdata.phone
            }, {
                where: {
                    id: requestdata.addressId
                }
            })
            let msg = 'Address updated sucessfully';
            var response = {}
            return helper.success(res, "User address updated successfully.", {});
        } catch (error) {
            return helper.error(res, error);
        }
    },
    addAddress: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                address: req.body.address,
                isdefault: req.body.isdefault,
                lat: req.body.lng,
                lng: req.body.lng,
                country: req.body.country,
                phone: req.body.phone
            };

            const nonRequired = {};

            let requestdata = await helper.vaildObject(required, nonRequired);


            var datacreate = {
                userId: required.loginData.id,
                address: requestdata.address,
                isdefault: requestdata.isdefault,
                lat: requestdata.lng,
                lng: requestdata.lng,
                country: requestdata.country,
                phone: requestdata.phone
            }
            if (requestdata.isdefault == 1) {
                const finddefault = await usersAddresses.findOne({
                    where: {
                        userId: required.loginData.id,
                        isdefault: 1
                    }
                });

                // console.log(finddefault, "===================");
                // return
                if (finddefault) {
                    const add_order = await usersAddresses.update({
                        isdefault: 0
                    }, {
                        where: {
                            id: finddefault.dataValues.id
                        }
                    });
                    await usersAddresses.create(datacreate);
                } else {
                    await usersAddresses.create(datacreate);
                }
            } else {
                await usersAddresses.create(datacreate);
            }

            return helper.success(res, "User add address successfully.", {});


        } catch (error) {
            return helper.error(res, error);
        }
    },
    UserAddressList: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const non_required = {};
            // console.log(required, "==================");
            // return
            let requestdata = await helper.vaildObject(required, non_required, res);



            var addresslists = await usersAddresses.findAll({
                where: {
                    userId: required.loginData.id,
                },

                order: [
                    ['id', 'DESC'],
                ],

            })


            return helper.success(res, "Get user addresses list successfully.", addresslists);

        } catch (error) {
            return helper.error(res, error);
        }
    },
}