const db = require('../../models');
const database = require('../../db/db');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const helper = require('../../helpers/helper');
const constants = require('../../config/constants');
const secretKey = constants.jwtSecretKey;
var crypto = require('crypto')

const User = db.user;
const userdetail = db.userdetail;


module.exports = {

    signUp: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,

            };

            var auth_create = crypto.randomBytes(20).toString('hex');
            const nonRequired = {
                authKey: auth_create,
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken,
                countryCode: req.body.countryCode,
                phone: req.body.phone,
                address: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: req.files && req.files.image,
                checkExists: 1,
                imageFolders: {
                    image: 'user'
                }
            };

            let requestData = await helper.vaildObject(required, nonRequired);
            const findEmail = await User.findOne({
                where: {
                    email: requestData.email
                }
            })

            if (findEmail) throw "This email is already registered, Please try different email.";
            if (requestData.image) {
                requestData['image'] = helper.imageUpload(requestData.image, 'user');
            }

            requestData.countryCodePhone = `${requestData.countryCode}${requestData.phone}`;

            if (requestData.hasOwnProperty('password') && requestData.password) {
                requestData.password = helper.bcryptHash(requestData.password);
            }

            let user = await helper.save(User, requestData, true, req);

            let userData = {
                id: user.id,
                email: user.email,
            }

            let token = jwt.sign({
                data: userData
            }, secretKey);
            user.token = token;

            return helper.success(res, 'User signed up successfully.', user);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    login: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                email: req.body.email,
                password: req.body.password,
            };


            const nonRequired = {
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            let getUser = await User.findOne({
                where: {
                    email: requestData.email,
                },
                attributes: {
                    include: [
                        sequelize.literal(`IF (image='', '', CONCAT("${req.protocol}://${req.get('host')}/uploads/users/", image)) as image`),
                    ]
                },
                raw: true
            });

            if (!getUser) {
                throw "Email did not match, Please try again.";
            }
            checkPassword = await helper.comparePass(requestData.password, getUser.password);
            if (!checkPassword) {
                throw "Password did not match, Please try again.";
            }

            delete getUser['password'];
            var auth_create = crypto.randomBytes(20).toString('hex');
            const updateUserObj = {
                id: getUser.id,
                deviceToken: requestData.deviceToken,
                deviceType: requestData.deviceType,
                authKey: auth_create
            }
            await helper.save(User, updateUserObj);

            let userData = {
                id: getUser.id,
                email: getUser.email,
            }

            let token = jwt.sign({
                data: userData
            }, secretKey);

            getUser.authKey = auth_create;
            getUser.token = token;
            getUser.deviceType = requestData.deviceType || 0;
            getUser.deviceToken = requestData.deviceToken || '';

            return helper.success(res, 'User logged in successfully.', getUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    socialLogin: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                name: req.body.name,
                email: req.body.email,
                socialId: req.body.socialId,
                socialType: req.body.socialType, // 1 => facebook, 2 => google
                imageFolders: {
                    profileImage: 'users'
                }
            };
            const nonRequired = {
                image: req.files && req.files.image,
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken
            };

            let requestData = await helper.vaildObject(required, nonRequired);
            let socialId = 'facebookId';

            if (requestData.socialType == 2) {
                socialId = 'googleId';
            }

            const checkUser = await User.findOne({
                where: {
                    [socialId]: requestData.socialId,
                    email: requestData.email
                },
                raw: true
            });
            requestData[socialId] = requestData.socialId;
            if (checkUser) {
                requestData.id = checkUser.id;
            }

            if (requestData.profileImage) {
                requestData['profileImage'] = helper.fileUpload(requestData.profileImage, 'users');
            }

            const getUser = await helper.save(User, requestData, true, req);

            let userData = {
                id: getUser.id,
                email: getUser.email,
            }

            let token = jwt.sign({
                data: userData
            }, secretKey);

            getUser.token = token;

            return helper.success(res, 'User logged in successfully.', getUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    verifyOtp: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                otp: req.body.otp
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.otp != '1111') throw "Invalid OTP.";

            const updateUserObj = {
                id: req.user.id,
                otpVerified: 1
            }
            let user = await helper.save(User, updateUserObj, true);

            return helper.success(res, 'OTP verified successfully.', user);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    logout: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const updateUserObj = {
                id: req.user.id,
                deviceType: 0,
                deviceToken: ''
            }
            let user = await helper.save(User, updateUserObj, true);

            return helper.success(res, 'User logged out successfully.', {});
        } catch (err) {
            return helper.error(res, err);
        }
    }
}