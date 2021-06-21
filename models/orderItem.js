/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    const orderitem = sequelize.define('orderitem', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        orderId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'orderId',
            defaultValue: 0,
        },
        categoryItemId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'categoryItemId',
            defaultValue: 0,
        },
        netAmount: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'netAmount',
            defaultValue: 0,
        },
        qty: {
            type: DataTypes.INTEGER(9),
            allowNull: false,
            field: 'qty',
            defaultValue: 0,
        },
        taxCharged: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'taxCharged',
            defaultValue: 0,
        },
        amountAfterTax: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'amountAfterTax',
            defaultValue: 0,
        },
        shippingCharges: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'shippingCharges',
            defaultValue: 0,
        },
        adminCommission: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'adminCommission',
            defaultValue: 0,
        },
        total: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: false,
            field: 'total',
            defaultValue: 0,
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
        tableName: 'orderitem',
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
                    records.forEach(function(record) {
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
                    records.forEach(function(record) {
                        record.dataValues.updated = Math.round(new Date().getTime() / 1000);
                    });
                }
            }
        }
    });

    orderitem.associate = models => {
        orderitem.belongsTo(models.order, { foreignKey: 'orderId', hooks: false });
        orderitem.belongsTo(models.product, { foreignKey: 'categoryItemId', hooks: false });
    };

    return orderitem;
};