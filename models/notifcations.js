/* jshint indent: 1 */

const isJson = (item) => {
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
}

module.exports = function(sequelize, DataTypes) {
	const notifcations = sequelize.define('notifcations', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		senderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'senderId'
		},
		recieverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'recieverId'
		},
		notificationType: {
			type: DataTypes.INTEGER(6),
			allowNull: false,
			field: 'notificationType'
		},
		message: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: '',
			field: 'message'
		},
		// data: {
		// 	type: DataTypes.TEXT,
		// 	allowNull: false,
		// 	field: 'data'
		// },
		data: {
			type: DataTypes.TEXT(),
			allowNull: true,
			field: 'data',
			defaultValue: '',
			get: function () {
				const json = this.getDataValue('data');
				console.log(json, '==================>json');
				return isJson(json) ? JSON.parse(json) : json;
			},
			set: function (json) {
				console.log(json, '=======>json');
				if (!json) json = {};
				this.setDataValue('data', JSON.stringify(json));
			},
		},
		isRead: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'isRead'
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
		tableName: 'notifcations',
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

	// notifications.associate = models => {
	// 	notifications.belongsTo(models.user, { foreignKey: 'vendorId', as: 'vendor', hooks: false });
	// 	notifications.belongsTo(models.taxcategory, { foreignKey: 'taxCategoryId', hooks: false });
	// };

	return notifcations;
};