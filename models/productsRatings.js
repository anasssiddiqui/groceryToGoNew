/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('productsRatings', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId'
		},
		productId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'productId'
		},
		ratings: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'ratings'
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'comment'
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
		tableName: 'productsRatings'
	});
};
