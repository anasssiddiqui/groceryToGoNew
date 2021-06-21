/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const shippingAddress = sequelize.define('shippingAddress', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userId',
			defaultValue: 0,
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'orderId',
			defaultValue: 0,
		},
		addressLine1: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'addressLine1',
			defaultValue: '',
		},
		addressLine2: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'addressLine2',
			defaultValue: '',
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'city',
			defaultValue: '',
		},
		state: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'state',
			defaultValue: '',
		},
		country: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'country',
			defaultValue: '',
		},
		pinCode: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'pinCode',
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
		tableName: 'shippingAddress',
		// freezeTableName: true,
		// hierarchy: true,
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

	shippingAddress.associate = models => {
		shippingAddress.belongsTo(models.user, { foreignKey: 'userId' });
		shippingAddress.belongsTo(models.order, { foreignKey: 'orderId' });
	};

	return shippingAddress;
};
