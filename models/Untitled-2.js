/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        role: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            field: 'role'
        },
        verified: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            field: 'verified'
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            field: 'status'
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'username'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'email'
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'password'
        },
        created: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'created'
        },
        updated: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'updated'
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'image'
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'address'
        },
        lat: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'lat'
        },
        lng: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'lng'
        },
        deviceType: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'device_type'
        },
        deviceToken: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'device_tokken'
        },
        loginType: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'login_type'
        },
        socialId: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'social_id'
        },
        isterms: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'isterms'
        },
        forgotPassword: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'forgot_password'
        },
        notificationStatus: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '1',
            field: 'notification_status'
        },
        authKey: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'auth_key'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'updatedAt'
        }
    }, {
        tableName: 'user'
    });
};