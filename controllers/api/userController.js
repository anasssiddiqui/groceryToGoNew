const db = require("../../models");
const database = require("../../db/db");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const helper = require("../../helpers/helper");
const constants = require("../../config/constants");
const secretKey = constants.jwtSecretKey;

const User = db.user;
const Group = db.groups;
const Notification = db.notifications;
const Post = db.posts;
const Community = db.communities;
const Journal = db.journals;
const PostMedia = db.post_media;
const PostComment = db.postComments;
const SearchedUser = db.searchedUsers;
const card = db.card;

// Notification.belongsTo(User, { foreignKey: "byUserId" });
// SearchedUser.belongsTo(User, {
//   foreignKey: "searchedUserId",
//   as: "searchedUser"
// });
const stripeNpm = stripe('sk_test_pciIAynild7VofmBr89ZTX6T');

module.exports = {

    addWalletMoney: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
                cardId: req.body.cardId,
                amount: req.body.amount,
                cvv: req.body.cvv
            };
            const non_required = {

            };
            let requestData = await helper.vaildObject(required, non_required, res);

            const findCard = await card.findOne({
                where: {
                    id: requestData.cardId,
                    userId: requestData.loginData.id,
                },
                raw: true,
            });
            const token = await stripeNpm.tokens.create({
                card: {
                    number: findCard.cardNumber,
                    exp_month: findCard.month,
                    exp_year: String(findCard.year).slice(2),
                    cvc: requestData.cvv,
                },
            });
            console.log(token, "---------------tokken")
            const payment = await stripeNpm.charges.create({
                amount: requestData.amount * 100,
                currency: 'INR',
                source: token.id,
                description: 'Grocery Payment'
            });

            console.log(payment, '======>payment');


            if (payment && payment.status != "succeeded") {
                throw "Something went, payment could not be processed.";
            }
            console.log(required.loginData.wallet, required.loginData.id, "==========================wallet")
            var finalAmount = Number(requestData.amount) + Number(required.loginData.wallet)

            console.log(finalAmount, "===========final amount");

            const update_details = await User.update({
                wallet: finalAmount
            }, {
                where: {
                    id: required.loginData.id
                }
            });

            return helper.success(res, 'Updated Wallet amount successfully.', {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateProfile: async function(req, res) {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,

            };
            const non_required = {
                username: req.body.username,
                email: req.body.email,
                image: req.body.image,
                phone: req.body.phone
            };
            let requestdata = await helper.vaildObject(required, non_required, res);


            let imageName = required.loginData.image
            if (req.files && req.files.image) {
                imageName = helper.image_upload(req.files.image);
            }

            const update_details = await User.update({
                username: requestdata.username,
                email: requestdata.email,
                image: imageName,
                phone: req.body.phone

            }, {
                where: {
                    id: required.loginData.id
                }
            });

            const data = await User.findOne({
                attributes: [`id`, `username`, `email`, `authKey`, `deviceType`, 'phone', 'authKey', 'isSociallogin', 'wallet', helper.makeImageUrlSql('user', 'image', 'user'), ],
                where: {
                    id: required.loginData.id
                }
            })
            return helper.success(res, 'User details updated successfully.', data);
        } catch (error) {
            return helper.error(res, err);
        }
    },
    getProfile: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            // try {
            const data = await User.findOne({
                attributes: [`id`, `username`, `email`, `authKey`, `deviceType`, 'phone', 'authKey', 'isSociallogin', 'wallet', helper.makeImageUrlSql('user', 'image', 'user'), ],
                where: {
                    id: required.loginData.id
                }
            })

            // } catch (err) {
            //     throw err;
            // }

            return helper.success(res, 'Fetched user details successfully.', data);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    GetWalletBalance: async(req, res) => {
        try {
            const required = {
                security_key: req.headers.security_key,
                auth_key: req.headers.auth_key,

            };
            const non_required = {};

            let requestdata = await helper.vaildObject(required, non_required, res);

            // try {
            const data = await User.findOne({
                attributes: [`wallet`],
                where: {
                    id: required.loginData.id
                }
            })
            return helper.success(res, "Get wallet details successfully.", data);
        } catch (error) {
            return helper.error(res, error);
        }
    },

    changePassword: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                oldPassword: req.body.oldPassword,
                newPassword: req.body.newPassword
            };

            const nonRequired = {
                imageFolders: {
                    image: "users"
                }
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            checkPassword = await helper.comparePass(
                requestData.oldPassword,
                req.user.password
            );
            if (!checkPassword) {
                throw "old password did not match.";
            }

            requestData.password = helper.bcryptHash(requestData.newPassword);
            requestData.id = req.user.id;

            let user = await helper.save(User, requestData, true, req);

            return helper.success(res, "User password changed successfully.", user);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    checkPhoneBook: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                numbers: req.body.numbers // comma seperated numbers
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            requestData.numbers = requestData.numbers.split(",");

            let users = await User.findAll({
                where: {
                    role: 1,
                    otpVerified: 1,
                    [Op.or]: [{
                            phone: {
                                [Op.in]: requestData.numbers
                            }
                        },
                        {
                            countryCodePhone: {
                                [Op.in]: requestData.numbers
                            }
                        }
                    ]
                },
                attributes: {
                    include: [
                        sequelize.literal(
                            `IF (image='', '', CONCAT("${req.protocol}://${req.get(
                "host"
              )}/uploads/users/", image)) as image`
                        )
                    ],
                    exclude: ["password"]
                },
                order: [
                    ["id", "DESC"]
                ],
                raw: true
            });

            return helper.success(res, "Uses searched successfully.", users);
        } catch (err) {
            return helper.error(res, err, []);
        }
    },
    notificationListing: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let notifications = await Notification.findAll({
                where: {
                    toUserId: req.user.id
                },
                include: [{
                    model: User,
                    required: false,
                    attributes: [
                        "id",
                        "name",
                        "email", [
                            sequelize.literal(
                                `IF (user.image='', '', CONCAT("${req.protocol}://${req.get(
                    "host"
                  )}/uploads/users/", user.image))`
                            ),
                            "image"
                        ]
                    ]
                }],
                order: [
                        ["id", "DESC"]
                    ]
                    // raw: true
            });

            return helper.success(
                res,
                "Notifications fetched successfully.",
                notifications
            );
        } catch (err) {
            return helper.error(res, err, []);
        }
    },
    forgotPassword: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                email: req.body.email
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let existingUser = await User.findOne({
                where: {
                    email: requestData.email
                },
                raw: true
            });
            if (!existingUser) throw "Email does not exist.";
            existingUser.forgotPasswordHash = helper.createSHA1();

            let html = `Click here to change your password <a href="${
        req.protocol
      }://${req.get("host")}/api/forgot_url/${
        existingUser.forgotPasswordHash
      }"> Click</a>`;

            let emailData = {
                to: requestData.email,
                subject: `${constants.appName} Forgot Password`,
                html: html
            };

            await helper.sendEmail(emailData);

            const user = await helper.save(User, existingUser, true);

            return helper.success(
                res,
                "Forgot Password email sent successfully.", {}
            );
        } catch (err) {
            return helper.error(res, err, {});
        }
    },
    forgotUrl: async(req, res) => {
        try {
            let user = await User.findOne({
                where: {
                    forgotPassword: req.params.hash
                }
            });

            if (user) {
                res.render("admin/reset_password", {
                    title: "Ghana Connect",
                    response: user,
                    message: req.flash("message"),
                    hash: req.params.hash
                });
            } else {
                res.status(403).send("Link has been expired!");
            }
        } catch (err) {
            throw err;
        }
    },
    resetPassword: async(req, res) => {
        try {
            const { password, forgotPassword } = {...req.body };

            const user = await User.findOne({
                where: {
                    forgotPassword
                },
                raw: true
            });
            if (!user) throw "Something went wrong.";

            const updateObj = {};
            updateObj.password = helper.createSHA1Hash(password);
            updateObj.forgotPassword = "";
            updateObj.id = user.id;

            const updatedUser = await helper.save(User, updateObj);

            if (updatedUser) {
                res.render("admin/success_page", {
                    title: "Ghana Connect",
                    message: "Password Change successfull"
                });
            } else {
                throw "Invalid user";
            }
        } catch (err) {
            if (typeof err === "string") {
                res.render("admin/success_page", {
                    message: err
                });
            } else {
                console.log(err);
            }
        }
    },
    changePrivacy: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                type: req.body.type // 0=>public, 1=>private, 2=>group
            };

            const nonRequired = {};

            const validTypes = [0, 1, 2];
            if (!validTypes.includes(parseInt(required.type))) throw "Invalid type.";

            if (required.hasOwnProperty("type") && required.type == 2) {
                required["groupId"] = req.body.groupId;
            } else {
                required["privacyGroupId"] = 0;
            }

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.hasOwnProperty("groupId")) {
                let group = await Group.findOne({
                    where: {
                        id: requestData.groupId,
                        userId: req.user.id
                    },
                    raw: true
                });
                if (!group) throw "Invaid groupId.";
                requestData["privacyGroupId"] = requestData["groupId"];
            }
            requestData["id"] = req.user.id;
            requestData["privacy"] = requestData.type;

            await helper.save(User, requestData);

            return helper.success(res, "Privacy changed successfully.", {});
        } catch (err) {
            return helper.error(res, err, {});
        }
    },
    notificationsOnOff: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                type: req.body.type, // 0=>off, 1=>on
                imageFolders: {
                    image: "users"
                }
            };

            const nonRequired = {};

            const validTypes = [0, 1];
            if (!validTypes.includes(parseInt(required.type))) throw "Invalid type.";


            let requestData = await helper.vaildObject(required, nonRequired);

            requestData["id"] = req.user.id;
            requestData["notifications"] = requestData.type;

            const user = await helper.save(User, requestData, true, req);

            return helper.success(res, `Notifications turned ${requestData.type == 1 ? 'on' : 'off'} successfully.`, user);
        } catch (err) {
            return helper.error(res, err, {});
        }
    },
    searchUser: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                keyWord: req.body.keyWord
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let users = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: req.user.id
                    },
                    role: 1,
                    [Op.or]: [{
                            email: {
                                [Op.like]: `%${requestData.keyWord}%`
                            }
                        },
                        {
                            name: {
                                [Op.like]: `%${requestData.keyWord}%`
                            }
                        },
                        {
                            phone: {
                                [Op.like]: `%${requestData.keyWord}%`
                            }
                        },
                        {
                            countryCodePhone: {
                                [Op.like]: `%${requestData.keyWord}%`
                            }
                        }
                    ]
                },
                attributes: {
                    include: [
                        sequelize.literal(
                            `IF (image='', '', CONCAT("${req.protocol}://${req.get(
                "host"
              )}/uploads/users/", image)) as image`
                        )
                    ],
                    exclude: ["password"]
                },
                raw: true
            });

            return helper.success(res, "User searched successfully.", users);
        } catch (err) {
            return helper.error(res, err, []);
        }
    },
    recentSearchedUsers: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let users = await SearchedUser.findAll({
                where: {
                    userId: req.user.id
                },
                include: [{
                    model: User,
                    as: "searchedUser",
                    required: true,
                    attributes: []
                }],
                attributes: [
                    sequelize.col("searchedUser.*"), [
                        sequelize.literal(
                            "IF (`searchedUser`.`image`='', '', CONCAT('" +
                            req.protocol +
                            "://" +
                            req.get("host") +
                            "/uploads/users/', `searchedUser`.`image`))"
                        ),
                        "image"
                    ],
                    "createdAt"
                ],
                order: [
                    [sequelize.col("searchedUser.id"), "DESC"]
                ],
                raw: true,
                nest: true
            });

            users = users.map(user => {
                delete user.password;
                return user;
            });

            return helper.success(
                res,
                "Recent searched users fetched successfully.",
                users
            );
        } catch (err) {
            return helper.error(res, err, []);
        }
    },
    clearRecentSearchedUsers: async(req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            await SearchedUser.destroy({
                where: {
                    userId: req.user.id
                }
            });

            return helper.success(
                res,
                "Recent searched users cleared successfully.", {}
            );
        } catch (err) {
            return helper.error(res, err, []);
        }
    },
};