/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const categoryitem = sequelize.define('categoryitem', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'status',
			defaultValue: 0,
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'categoryId',
			defaultValue: 0,
		},
		subCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'subCategoryId',
			defaultValue: 0,
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'title',
			defaultValue: '',
		},
		introduction: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'introduction',
			defaultValue: '',
		},
		description: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'description',
			defaultValue: '',
		},
		price: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'price',
			defaultValue: '0',
		},
		// image: {
		// 	type: DataTypes.STRING(100),
		// 	allowNull: false,
		// 	field: 'image',
		// 	defaultValue: '',
		// },
		mediaType: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'mediaType',
			defaultValue: 0,
		},
		quantityType: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'quantityType',
			defaultValue: 0,
		},
		previewMedia: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'previewMedia',
			defaultValue: '',
		},
		media: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'media',
			defaultValue: '',
		},
		quantity: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'quantity',
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
		tableName: 'categoryitem',
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

	categoryitem.associate = models => {
		categoryitem.belongsTo(models.category, { foreignKey: 'categoryId', as: 'category', hooks: false });
		categoryitem.belongsTo(models.category, { foreignKey: 'subCategoryId', as: 'subCategory', hooks: false });
		categoryitem.hasMany(models.recipeingredient, { foreignKey: 'categoryItemId', hooks: false });
	};

	return categoryitem;
};
