const db = require('../models');
const user = db.user;
const config = require('./config');
const contant = require('../config/constants');
const crypto = require('crypto');
const path = require('path');
var uuid = require('uuid');
const posts = db.posts;
const postsImages = db.postsImages;
const notifcations = db.notifcations;
const sequelize = require('sequelize');
const Op = sequelize.Op;
const FCM = require('fcm-node');
var apn = require('apn');

module.exports = {
    isJson(item) {
        item = typeof item !== "string" ? JSON.stringify(item) : item;

        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if (typeof item === "object" && item !== null) {
            return true;
        }

        return false;
    },
    vaildObject: async function(required, non_required, res) {
        let message = '';
        let empty = [];
        let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] == '') {
                    empty.push(key);
                }
            }
        }

        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " fields are required"
            } else {
                message += " field is required"
            }
            res.status(400).json({
                'success': false,
                'message': message,
                'code': 400,
                'body': {}
            });
            return;
        } else {
            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != "Grocery@123") {
                    message = "Invalid security key";
                    res.status(403).json({
                        'success': false,
                        'message': message,
                        'code': 403,
                        'body': []
                    });
                    res.end();
                    return false;
                }
            }
            if (required.hasOwnProperty('password')) {
                // const saltRounds = 10;
                // var myPromise = await new Promise(function (resolve, reject) {
                //     bcrypt.hash(required.password, saltRounds, function (err, hash) {
                //         if (!err) {

                //             resolve(hash);
                //         } else {
                //             reject('0');
                //         }
                //     });
                // });
                // // required.password= crypto.createHash('sha1').update(required.password).digest('hex');
                // required.password = myPromise;
                // required.password = await this.getBcryptHash(required.password);
            }

            /* if (required.hasOwnProperty('checkexit')) {
                if (required.checkexit === 1) {
                    if (required.hasOwnProperty('email')) {
                        required.email = required.email.toLowerCase();

                        if (await this.checking_availability(required.email, 'email', table_name)) {
                            message = "this email is already register kindly use another";
                            res.status(403).json({
                                'success': false,
                                'message': message,
                                'code': 403,
                                'body': []
                            });
                            res.end();
                            return false;
                        }
                    }
                    if (required.hasOwnProperty('name') && required.name != undefined) {
                        required.name = required.name.toLowerCase();

                        if (await this.checking_availability(required.name, 'name', table_name)) {
                            message = "name is already in use";
                            res.status(403).json({
                                'success': false,
                                'message': message,
                                'code': 403,
                                'body': []
                            });
                            return false;
                        }
                    }

                }
            }


            if (non_required.hasOwnProperty('name') && non_required.name != undefined) {
                non_required.name = non_required.name.toLowerCase();

                if (await this.checking_availability(non_required.name, 'name', table_name)) {
                    message = "name is already in use";
                    res.status(403).json({
                        'success': false,
                        'message': message,
                        'code': 403,
                        'body': []
                    });
                    return false;
                }
            } */

            const marge_object = Object.assign(required, non_required);
            delete marge_object.checkexit;

            for (let data in marge_object) {
                if (marge_object[data] == undefined) {
                    delete marge_object[data];
                } else {
                    if (typeof marge_object[data] == 'string') {
                        marge_object[data] = marge_object[data].trim();
                    }
                }
            }

            return marge_object;
        }
    },

    error: function(res, err) {
        console.log(err);
        console.log('error');
        // console.log(JSON.stringify(ReferenceError));
        // console.log(ReferenceError);
        // return false;
        let code = (typeof err === 'object') ? ((err.statusCode) ? err.statusCode : ((err.code) ? err.code : 403)) : 403;
        let message = (typeof err === 'object') ? (err.message) : err;
        // console.log(code);
        // console.log(message);
        // return false;
        res.status(code).json({
            'success': false,
            'error_message': message,
            'code': code,
            'body': []
        });
    },

    getBcryptHash: async(keyword) => {
        const saltRounds = 10;
        var myPromise = await new Promise(function(resolve, reject) {
            bcrypt.hash(keyword, saltRounds, function(err, hash) {
                if (!err) {

                    resolve(hash);
                } else {
                    reject('0');
                }
            });
        });
        // required.password= crypto.createHash('sha1').update(required.password).digest('hex');
        keyword = myPromise;
        return keyword;
    },

    comparePass: async(requestPass, dbPass) => {
        const match = await bcrypt.compare(requestPass, dbPass);
        return match;
    },

    sendMail: function(object) {
        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport('gmail', contant.mail_auth);

        var mailOptions = object;
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                //console.log(info); 
                console.log('Email sent: ' + info.messageId);
            }
        });
    },
    Notification: function(object) {
        var FCM = require('fcm-node');
        var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
        var fcm = new FCM(serverKey);


        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: '',
            /* collapse_key: 'your_collapse_key', */

            notification: {
                title: 'Title of your push notification',
                body: 'Body of your push notification'
            },

            data: { //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };

        fcm.send(message, function(err, response) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });


    },
    userdetail: async function(userid) {

        // try {
        const data = await user.findOne({
                attributes: [`id`, `username`, `image`, `email`, `isterms`, `lat`, `lng`, `loginType`, `authKey`, `deviceType`, `deviceToken`, `socialId`, 'authKey', 'isSociallogin', ],
                where: {
                    id: userid,
                }
            })
            .then(obj => obj ? obj.toJSON() : obj);
        return data;
        // } catch (err) {
        //     throw err;
        // }
    },
    postdetail: async function(userid, postid, req) {
        // try {

        const postdata = await posts.findOne({
            attributes: [`id`, `userId`, `catId`, `description`, `status`, [sequelize.literal('UNIX_TIMESTAMP(posts.createdAt)'), 'createdAt'],
                [sequelize.literal('(SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `postId`=posts.id)'), 'totalvote'],
                [sequelize.literal('(SELECT case when `profile_image`="" then "" else  CONCAT("http://' + req.get('host') + '/images/users/", profile_image) end as userimage FROM users where id = posts.userId)'), 'userimage'],
                [sequelize.literal('(SELECT username FROM users where id = posts.userId)'), 'username'],
                [sequelize.literal('(SELECT case when ifnull(count(*),0) = 0 then 0 else 1 end as count FROM `votecasting` WHERE `postId`=posts.id and userId=' + userid + ')'), 'is_vote'],
            ],
            where: {
                status: 1,
                id: postid,
            },
            include: [{
                model: postsImages,
                attributes: ['id', [sequelize.literal('case when postsImages.`images`="" then "" else  CONCAT("http://' + req.get('host') + '/images/post/", postsImages.images) end'), 'images'],
                    [sequelize.literal('(SELECT case when ifnull(count(*),0) = 0 then 0 else 1 end as count FROM `votecasting` WHERE `imageId`=postsImages.id and userId=' + userid + ')'), 'is_imagevote'],
                    [sequelize.literal('(SELECT  ifnull(count(*),0) as count FROM `votecasting` WHERE `imageId`=postsImages.id)'), 'imagevote'],
                    [sequelize.literal('(SELECT ifnull(round((((SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `imageId`=postsImages.id) / (SELECT ifnull(count(*),0)as count FROM `votecasting` WHERE `postId`=posts.id)) * 100),2),0) )'), 'percentage'],
                ],
                on: {
                    col1: sequelize.where(sequelize.col('postsImages.postId'), '=', sequelize.col('posts.id')),
                },
            }],
        });
        return postdata;
        // } catch (err) {
        //     throw err;
        // }
    },
    send_email: function(otp, data, resu) {

        try {
            const nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'noreply.tamamapp@gmail.com',
                    pass: '@@Tamam123'
                }
            });
            var mailOptions = {
                from: 'RE:NOURISH <vendrevieux@gmail.com>',
                to: data.dataValues.email,
                subject: 'Grocery: Forgot password',
                html: `Click here for change password <a href="${baseUrl}/api/url_id/` + otp + '"> Click</a>'
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(info);
                    res.send('Email send');
                }
            });
            return resu;
        } catch (err) {
            throw err;
        }
    },

    createSHA1: function() {
        let key = 'abc' + new Date().getTime();
        return crypto.createHash('sha1').update(key).digest('hex');
    },
    image_upload: function(image) {
        if (image) {
            var extension = path.extname(image.name);
            var filename = uuid() + extension;
            var sampleFile = image;
            sampleFile.mv(process.cwd() + '/public/uploads/user/' + filename, (err) => {
                if (err) throw err;
            });

            return filename;
        }

    },
    image_upload_post: function(image) {
        if (image) {
            var extension = path.extname(image.name);
            var filename = uuid() + extension;
            var sampleFile = image;
            sampleFile.mv(process.cwd() + '/public/images/post/' + filename, (err) => {
                if (err) throw err;
            });

            return filename;
        }

    },
    send_push_notification: function(get_message, device_token, device_type, notitype, title, data_to_send) {
        if (device_token != '' && device_token != null) {
            bundel_id = 'com.live.votecast';
            var message = {
                to: device_token,
                // collapse_key: 'your_collapse_key',

                /* notification: {
                      title: title,
                      body: get_message
                    },
             */
                data: {
                    body: get_message,
                    receiver_data: data_to_send,
                    notitype: notitype
                }
            };

            if (device_type == 1) {
                var serverKey = 'AAAAOpyOko4:APA91bGO_yrFMzfNmicFwYXqfwVOFDlC18ejAL2RZGU_sjexuuo3G3tq_uySowManHGZE2TYaFd0rKGmixjNBV7WcycFFrH8pCcrGsafWZg8m71OXvbbVNXZw7CL4rVlySZ4TByFib2u'; //put your server key here
                var fcm = new FCM(serverKey);



                fcm.send(message, function(err, response) {
                    if (err) {
                        console.log("Something has gone wrong!", message);
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

                return fcm;
            } else {

                console.log("else aple")
                var note = new apn.Notification();
                note.sound = "ping.aiff";
                note.title = title
                note.body = get_message
                note.payload = message;
                note.topic = bundel_id;
                console.log(note, "-------------note---------");
                apnProvider.send(note, device_token).then((result) => {
                    console.log(result, "new_message-----------")
                });
                return apnProvider;
            }
        } else {
            return;
        }

    },
    savenotifications: async function(senderId, recieverId, notiType, message, data) {
        try {
            var jsonData = JSON.stringify(data);
            const savenotification = await notifcations.create({
                senderId: senderId,
                recieverId: recieverId,
                notiType: notiType,
                message: message,
                data: jsonData,
            });
            return savenotification;
        } catch (error) {}
    },
    gettoken: async function(userId) {
        try {
            const userdata = await user.findOne({
                attributes: ['username', 'profileImage', 'deviceToken', 'deviceType', 'notificationStatus'],
                where: {
                    id: userId
                }
            });
            if (userdata) {
                return userdata.dataValues;
            }
        } catch (error) {
            console.log(error, "----------gettoken---------");
        }
    },
}