/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
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
            field: 'role',
            defaultValue: 1,
        },
        verified: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            field: 'verified',
            defaultValue: 0,
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            field: 'status',
            defaultValue: 1,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'email',
            defaultValue: '',
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'password',
            defaultValue: '',
        },
        created: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'created'
        },
        updated: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'updated'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
        User.hasOne(models.admindetail, { onDelete: 'cascade', hooks: false });
        User.hasOne(models.userdetail, { onDelete: 'cascade', hooks: false });
        User.hasOne(models.driverdetail, { onDelete: 'cascade', hooks: false });
        User.hasOne(models.vendordetail, { onDelete: 'cascade', hooks: false });
    };

    return User;
};