/*
|----------------------------------------------------------------------------------------------------------------------------
|   Helpers File
|----------------------------------------------------------------------------------------------------------------------------
|
|   All helper methods in this file.
|
*/
const helper = require('../helpers/helper');
const sequelize = require('sequelize');
const models = require("../models");
const { Op } = sequelize;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var path = require('path');
var uuid = require('uuid');
const fs = require('fs');
const apn = require("apn");
const FCM = require("fcm-node");
const nodemailer = require('nodemailer');
const constants = require('../config/constants')
const user = models.user;

// console.log(models, '============>models');

/*
|----------------------------------------------------------------------------------------------------------------------------
|   Exporting all methods
|----------------------------------------------------------------------------------------------------------------------------
*/
module.exports = {
    userdetail: async function(userid) {

        // try {
        const data = await user.findOne({
                attributes: [`id`, `username`, `email`, `authKey`, `deviceType`, 'phone', 'authKey', 'isSociallogin', helper.makeImageUrlSql('user', 'image', 'user'), ],
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
    vaildObject: async function(required, nonRequired) {
        let message = '';
        let empty = [];

        let model = required.hasOwnProperty('model') && models.hasOwnProperty(required.model) ?
            models[required.model] :
            models.user;


        // console.log(model, '====>model');
        // console.log(models, '====>models');
        // return;

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] === '' && (required[key] !== '0' || required[key] !== 0)) {
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
            throw {
                'code': 400,
                'message': message
            }
        } else {
            if (required.hasOwnProperty('auth_key')) {
                const checkExists = await model.findOne({
                    where: {
                        authKey: required.auth_key,
                    },
                    raw: true,
                });

                if (!checkExists) throw {
                    code: 400,
                    message: 'Invalid authorization Key',
                }

                console.log(checkExists, '============================>loginData');

                required.loginData = checkExists;
            }

            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != securityKey) {
                    message = "Invalid security key";
                    throw {
                        'code': 403,
                        'message': message
                    }
                }
            }

            const mergeObject = Object.assign(required, nonRequired);
            delete mergeObject.checkexit;
            delete mergeObject.securitykey;

            if (mergeObject.hasOwnProperty('password') && mergeObject.password == '') {
                delete mergeObject.password;
            }

            for (let data in mergeObject) {
                if (mergeObject[data] == undefined) {
                    delete mergeObject[data];
                } else {
                    if (typeof mergeObject[data] == 'string') {
                        mergeObject[data] = mergeObject[data].trim();
                    }
                }
            }

            return mergeObject;
        }
    },
    save: async(model, data, returnData = false, req = {}) => {
        try {
            if (!(typeof data == 'object' && !Array.isArray(data))) {
                throw 'Please send valid object in second argument of save function.';
            }
            console.log(model, '===================>model');
            const tableColumns = model.rawAttributes
                // console.log(tableColumns, '==============>tableColumns');
            const defaultValues = {
                'INTEGER': 0,
                'STRING': '',
                'TEXT': '',
                'FLOAT': 0,
                'DECIMAL': 0,
            }

            data = {...data };
            let rawData = {...data };

            for (let key in data) {
                if (!tableColumns.hasOwnProperty(key)) {
                    delete data[key];
                } else {
                    const tableColumn = tableColumns[key];
                    const tableDataType = tableColumn.type.key;
                    if (!data[key] && !tableColumn.hasOwnProperty('defaultValue')) {
                        data[key] = defaultValues[tableDataType]
                    }
                }
            }

            for (let column in tableColumns) {
                if (column != 'createdAt' && column != 'updatedAt' && column != 'id' && !data.hasOwnProperty('id')) {
                    const tableColumn = tableColumns[column];
                    const tableDataType = tableColumn.type.key;

                    // console.log(tableColumn, '=================>tableColumn');

                    if (!data.hasOwnProperty(column)) {
                        if (!tableColumn.hasOwnProperty('defaultValue')) {
                            data[column] = defaultValues[tableDataType];
                        } else {
                            // console.log(tableDataType, '===========>tableDataType');
                            // console.log(tableColumn.defaultValue, '===========>tableColumn.defaultValue');
                            data[column] = tableColumn.defaultValue;
                        }
                    }
                }
            }

            let id;
            // console.log(data, '===========================>data');
            // return;

            if (data.hasOwnProperty('id')) {
                const updatedEntry = await model.update(
                    data, {
                        where: {
                            id: data.id,
                        },
                        individualHooks: true
                    }
                );
                id = data.id;
            } else {
                const createdEntry = await model.create(data);
                id = createdEntry.dataValues.id;
            }

            if (returnData) {
                let getData = await model.findOne({
                    where: {
                        id
                    }
                });
                getData = getData.toJSON();
                if (getData.hasOwnProperty('password')) {
                    delete getData['password'];
                }

                if (rawData.hasOwnProperty('imageFolders') && typeof rawData.imageFolders == 'object' && !Array.isArray(rawData.imageFolders) && Object.keys(rawData.imageFolders).length > 0 && Object.keys(req).length > 0) {
                    for (let column in rawData.imageFolders) {
                        const folder = rawData.imageFolders[column];
                        if (getData.hasOwnProperty(column) && getData[column] != '') {
                            getData[column] = `${req.protocol}://${req.get('host')}/uploads/${folder}/${getData[column]}`
                        }
                    }
                }

                return getData;
            }

            return id;
        } catch (err) {
            throw err;
        }
    },
    delete: async(model, where) => {
        await model.destroy({
            where: {
                ...(
                    typeof where == 'object' && !Array.isArray(where) ?
                    where : {
                        id: {
                            [sequelize.Op.in]: Array.isArray(where) ? where : [where]
                        }
                    }
                )
            }
        });
    },

    clone: function(value) {
        return JSON.parse(JSON.stringify(value));
    },


    time: function() {
        var time = Date.now();
        var n = time / 1000;
        return time = Math.floor(n);
    },

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

    generateTransactionNumber: function(length = 10) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        text += this.time();

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    success: function(res, message = '', body = {}) {
        return res.status(200).json({
            'success': true,
            'code': 200,
            'message': message,
            'body': body
        });
    },

    error: function(res, err, req) {
        console.log(err, '===========================>error');
        // console.log(JSON.stringify(ReferenceError));
        // console.log(ReferenceError);
        // return false;
        // let code=(typeof err==='object') ? ((err.statusCode) ? err.statusCode : ((err.code) ? err.code : 403)) : 403;
        let code = (typeof err === 'object') ? (err.code) ? err.code : 403 : 403;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        if (!Number(code)) code = 403;
        // console.log(code);
        // console.log(message);
        // return false;

        if (req) {
            req.flash('flashMessage', { color: 'error', message });

            const originalUrl = req.originalUrl.split('/')[1];
            return res.redirect(`/${originalUrl}`);
        }


        console.log(code, '===================>code');
        console.log(message, '===================>message');

        console.log('here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================here============================');

        return res.status(code).json({
            'success': false,
            'message': message,
            'code': code,
            'body': {}
        });

    },
    bcryptHash: (myPlaintextPassword, saltRounds = 10) => {
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(myPlaintextPassword, salt);
        hash = hash.replace('$2b$', '$2y$');
        return hash;
    },

    comparePass: async(requestPass, dbPass) => {
        dbPass = dbPass.replace('$2y$', '$2b$');
        const match = await bcrypt.compare(requestPass, dbPass);
        // console.log(match, "==");

        return match;
    },
    sendEmail(object) {
        try {
            var transporter = nodemailer.createTransport(constants.mailAuth);
            var mailOptions = object;

            console.log(constants.mail_auth);
            console.log(mailOptions);
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('error', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (err) {
            throw err;
        }
    },

    sendMail: function(object) {
        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport(config.mail_auth);
        var mailOptions = object;
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    createSHA1: function() {
        let key = 'abc' + new Date().getTime();
        return crypto.createHash('sha1').update(key).digest('hex');
    },

    imageUpload: (file, folder = 'user') => {
        if (file.name == '') return;

        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
        var result = "";
        // while (result.length<28)
        // {
        //     var rand_int = Math.floor((Math.random() * 19) + 1);
        //     var rand_chr= letters[rand_int];
        //     if (result.substr(-1, 1)!=rand_chr) result+=rand_chr;
        // }
        result = uuid();
        let name = result + '.' + file_extension;
        // console.log(name);return false;
        file.mv('public/uploads/' + folder + '/' + name, function(err) {
            if (err) throw err;
        });
        return name;
    },
    base64ImageUpload: async function(base64String, folder, extension_data = 'png') {
        // const fileType = require('file-type');
        // const mimeInfo = module.exports.base64MimeType(get_message);
        // console.log(mimeInfo, '========>mimeInfo');

        var base64Str = base64String.replace(/^data:image\/\w+;base64,/, '');
        var extension = extension_data;
        // var extension = mimeInfo.split('/')[1];
        // var filename = Math.floor(Date.now() / 1000) + '.' + extension;
        let name = uuid() + '.' + extension;
        // var base64Str = data;
        // upload_path = path.join(__dirname, 'public/uploads/' + folder + '/' + name);
        upload_path = path.join('public/uploads/' + folder + '/' + name);

        if (!extension) return false;
        console.log(base64Str, '====================>base64Str');

        return await new Promise((resolve, reject) => {
            fs.writeFile(upload_path, base64Str, {
                encoding: 'base64'
            }, function(err) {
                if (err) {
                    console.log(err)
                    reject(err);
                }
                // console.log(filename, '==========>filename');

                resolve(name);
            })
        });

        // return filename;
    },


    uploadImage: function(fileName, file, folderPath) {
        const rootPath = path.join(path.resolve(__dirname), '../');
        const imageBuffer = decodeBase64Image(file);
        const newPath = `${rootPath}${folderPath}${fileName}`;
        writeDataStream(newPath, imageBuffer.data);
        return newPath;
    },

    fileUpload(file, folder = 'users') {
        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
        var result = "";
        while (result.length < 28) {
            var rand_int = Math.floor((Math.random() * 19) + 1);
            var rand_chr = letters[rand_int];
            if (result.substr(-1, 1) != rand_chr) result += rand_chr;
        }
        let name = result + '.' + file_extension;
        // console.log(name);return false;
        file.mv('public/images/' + folder + '/' + name, function(err) {
            if (err) {
                throw err;
            }
        });
        return name;
    },

    sendPushNotificationTifiFunction: function(notification_data) {
        try {
            var serverKey = 'AAAA87hG_mQ:APA91bFubhzMoDS434ncH2B0H4686QFnD4xRws_KQME9uy-JT5-aQf1UG7zu_Q3IUP70xXIFqqhhvpXSiTifyiYTYU8QFaFYNqP3btQbmHCPEO98URWhDxW72IsIidCZ8HnuFNxFvZQh';
            const FCM = require('fcm-node');
            var fcm = new FCM(serverKey);
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: notification_data.device_token,
                // registration_ids: regTokens  // for multiple device_tokens use "registration_ids" instead of "to"

                notification: {
                    title: 'Bahama Eats Notification',
                    body: notification_data.msg,
                },


                data: { //you can send only notification or only data(or include both)
                    ...notification_data.body
                }
            };
            // console.log(message);
            // return false;

            fcm.send(message, function(err, response) {
                if (err) {
                    console.log("sendPushNotificationTifiFunction")
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        } catch (err) {
            throw err;
        }
    },

    sendPushNotification: async function(dataForSend) {
        // console.log(dataForSend);

        const apn = require('apn');

        const options = {
            token: {
                key: __dirname + "/AuthKey_2PNTKZ4V8T.p8",
                keyId: "2PNTKZ4V8T",
                teamId: "7KU34ZBRT8"
                    //   keyId: "N62K9PCCD2",
                    //   teamId: "4XVQBWH9QF"
            },
            production: true
        };
        const apnProvider = new apn.Provider(options);

        if (dataForSend && dataForSend.deviceToken && dataForSend.deviceToken != '') {
            var myDevice = dataForSend.deviceToken;
            var note = new apn.Notification();

            console.log(myDevice);

            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 1;
            note.sound = "ping.aiff";

            note.alert = dataForSend.message;
            note.payload = { 'data': dataForSend };
            // note.topic = "cqlsys.BahamaEats";
            note.topic = "com.live.BahamaEats";

            console.log("send note", note);

            apnProvider.send(note, myDevice).then((result) => {
                // see documentation for an explanation of result
                console.log("send failed result", result.failed);
                //console.log("send err",err);
            }).catch((err) => {
                console.error("error while sending user notification", err);
            });
            // Close the server
            //apnProvider.shutdown();
        }
    },

    sendPushNotificationDriver: async function(dataForSend) {
        // console.log(dataForSend);

        const apn = require('apn');

        const options = {
            token: {
                key: __dirname + "/AuthKey_2PNTKZ4V8T.p8",
                keyId: "2PNTKZ4V8T",
                teamId: "7KU34ZBRT8"
                    //   keyId: "2D764P6QG8",
                    //   teamId: "UL6P4CWL4N"
            },
            production: true
        };
        const apnProvider = new apn.Provider(options);
        // console.log(apnProvider);

        if (dataForSend && dataForSend.deviceToken && dataForSend.deviceToken != '') {
            var myDevice = dataForSend.deviceToken;
            var note = new apn.Notification();

            console.log(myDevice);

            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            note.badge = 1;
            note.sound = "ping.aiff";

            note.alert = dataForSend.message;
            note.payload = { 'data': dataForSend };
            // note.topic = "cqlsys.BahamaEats";
            note.topic = "com.live.BahamaEatsDriver";

            console.log("send note", note);

            apnProvider.send(note, myDevice).then((result) => {
                // see documentation for an explanation of result
                console.log("send failed result", result.failed);
                //console.log("send err",err);
            }).catch((err) => {
                console.error("error while sending user notification", err);
            });
            // Close the server
            //apnProvider.shutdown();
        }
    },

    distance: function(lat1, lon1, lat2, lon2, unit) {
        //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
        //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
        //:::    unit = the unit you desire for results                               :::
        //:::           where: 'M' is statute miles (default)                         :::
        //:::                  'K' is kilometers                                      :::
        //:::                  'N' is nautical miles                                  :::

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    },
    orderNumber() {
        let now = Date.now().toString() // '1492341545873'
            // pad with extra random digit
        now += now + Math.floor(Math.random() * 10)
            // format
        return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join('-')
    },
    pushNotification: async function(notificationData) {
        // console.log(JSON.stringify(notificationData, null, 2), '=======>notificationData');

        if (notificationData.hasOwnProperty('deviceType') && notificationData.deviceType == 1) {
            return module.exports.pushNotificationIos(notificationData);
        } else {
            return module.exports.pushNotificationAndroid(notificationData);
        }
    },
    pushNotificationIos: async function(dataForSend) {
        try {

            console.log(dataForSend, '=======>dataForSend');

            // const topicTypes = {
            // 	0: 'user',
            // 	1: 'driver',
            // }

            // const topics = {
            // 	user: 'com.debug.Grocery',
            // 	driver: 'com.debug.Grocery',
            // }

            // const type = topicTypes[parseInt(dataForSend.type)];
            // const topic = "com.debug.Grocery";
            const topic = "com.Grocery.app";

            const options = {
                token: {
                    // key: __dirname + "/AuthKey_4LD5GV7SK7.p8",
                    // keyId: "4LD5GV7SK7",
                    // teamId: "6R5227TJ7K",
                    key: __dirname + "/AuthKey_23B8Q3AX67.p8",
                    keyId: "23B8Q3AX67",
                    teamId: "VMG8345F58",
                },
                production: false
            };
            const apnProvider = new apn.Provider(options);
            // console.log(apnProvider);

            if (
                dataForSend &&
                dataForSend.deviceToken &&
                dataForSend.deviceToken != ""
            ) {
                var myDevice = dataForSend.deviceToken;
                var note = new apn.Notification();

                console.log(myDevice, '=============>myDevice');

                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.contentAvailable = 1;
                note.badge = 1;
                note.sound = "ping.aiff";

                note.title = "Grocery";
                note.body = dataForSend.title;
                // note.payload = { data: dataForSend.body };
                note.payload = { //This is only optional, you can send any data
                    soundname: "default",
                    deviceToken: dataForSend.deviceToken,
                    code: dataForSend.code,
                    body: dataForSend.body,
                    // body: {
                    // data: dataForSend.body,
                    // title: 'Grocery',
                    // message: dataForSend.title
                    // }
                };
                note.topic = topic;

                console.log(JSON.stringify(note, null, 2), "----------------->push notification Data");

                // console.log(type, '=====>type')

                apnProvider
                    .send(note, myDevice)
                    .then(result => {

                        // see documentation for an explanation of result
                        console.log("send result response", result);
                        //console.log("send err",err);
                    })
                    .catch(err => {
                        console.error("error while sending user notification", err);
                    });
                // Close the server
                //apnProvider.shutdown();
            }
        } catch (err) {
            console.log(err, '====>errrrrrr in ios push notification function');
        }
    },
    pushNotificationAndroid: async function(notificationData) {
        try {
            var serverKey =
                "AAAAVrVlm6s:APA91bGSUxgyw_IJAotOb_P1EgF_slWcCCc0LwDvu5RmfPvvEydl_FNsPOSPUDqnvPE5buND63j_yWAgtZLo6loBXOM1CFbKKIZUhzZ7tqfVeFTHETXXuVScfb5TJbr7zbvfshOJzBPN";

            var fcm = new FCM(serverKey);

            var message = {
                content_available: true,
                message: notificationData.title,
                data: {
                    message: notificationData.title,
                    deviceToken: notificationData.deviceToken,
                    code: notificationData.code,
                    body: {
                        message: notificationData.title,
                        ...notificationData.body
                    }
                },
                priority: "high"
            };
            console.log(JSON.stringify(message, null, 2), "=========================>message");

            if (Array.isArray(notificationData.deviceToken)) {
                message["registration_ids"] = notificationData.deviceToken;
            } else {
                message["to"] = notificationData.deviceToken;
            }

            fcm.send(message, function(err, response) {
                if (err) {
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        } catch (err) {
            console.log(err, '====>errrrrrr in andoid push notification function');
        }
    },
    capitalizeFirstLetter: (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    },
    // makeImageUrlSql: (model, field, modelFolder, returnField = field) => ([
    //     sequelize.literal(`(IF (\`${model}\`.\`${field}\`='', '', CONCAT('${baseUrl}/uploads/${modelFolder}/', \`${model}\`.\`${field}\`)) )`),
    //     returnField
    // ]),
    makeImageUrlSql: (model, field, modelFolder = 'user', returnField = field, ifEmpty = '') => ([
        sequelize.literal(`(IF (LOCATE('http', \`${model}\`.\`${field}\`) > 0, \`${model}\`.\`${field}\`, IF (\`${model}\`.\`${field}\`='', "${ifEmpty}", CONCAT('${baseUrl}/uploads/${modelFolder}/', \`${model}\`.\`${field}\`)) ))`),
        returnField
    ]),
    uppercaseFirstLetter: function(s) {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    },


}