/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        role: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            field: 'role'
        },
        verified: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            field: 'verified'
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            field: 'status'
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'username'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'email'
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'password'
        },
        created: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'created'
        },
        updated: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'updated'
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'image'
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'address'
        },
        lat: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'lat'
        },
        lng: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'lng'
        },
        deviceType: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'device_type'
        },
        deviceToken: {
            type: DataTypes.STRING(200),
            allowNull: true,
            field: 'device_tokken'
        },
        loginType: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'login_type'
        },
        socialId: {
            type: DataTypes.STRING(200),
            allowNull: true,
            field: 'social_id'
        },
        isterms: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            field: 'isterms'
        },
        forgotPassword: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'forgot_password'
        },
        notificationStatus: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1',
            field: 'notification_status'
        },
        authKey: {
            type: DataTypes.STRING(200),
            allowNull: true,
            field: 'auth_key'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'updatedAt'
        }
    }, {
        tableName: 'user',
        hooks: {
            beforeCreate: (record, options) => {
                record.dataValues.created = Math.round(new Date().getTime() / 1000);
                record.dataValues.updated = Math.round(new Date().getTime() / 1000);
            },
            beforeUpdate: (record, options) => {
                // console.log(record, '==================================>beforeUpdate')
                record.dataValues.updated = Math.round(new Date().getTime() / 1000);
            },
            beforeBulkCreate: (records, options) => {
                if (Array.isArray(records)) {
                    records.forEach(function (record) {
                        record.dataValues.created = Math.round(new Date().getTime() / 1000);
                        record.dataValues.updated = Math.round(new Date().getTime() / 1000);
                    });
                }
            },
            beforeBulkUpdate: (records, options) => {
                // console.log(records, '==========================>records'); 
                // console.log(options, '==========================>options'); 
                // return;
                if (Array.isArray(records)) {
                    records.forEach(function (record) {
                        record.dataValues.updated = Math.round(new Date().getTime() / 1000);
                    });
                }
            }
        }
    });

    User.associate = models => {
        User.hasOne(models.admindetail, { onDelete: 'cascade', hooks: true });
        User.hasOne(models.userdetail, { onDelete: 'cascade', hooks: true });
        User.hasOne(models.driverdetail, { onDelete: 'cascade', hooks: true });
        User.hasOne(models.vendordetail, { onDelete: 'cascade', hooks: true });
    };

    return User;
};