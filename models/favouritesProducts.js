/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    const favouritesProducts = sequelize.define('favouritesProducts', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        userid: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'userid'
        },
        productid: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'productid'
        },
        isfav: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'isfav'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp'),
            field: 'updated_at'
        }
    }, {
        tableName: 'favouritesProducts'
    });

    favouritesProducts.associate = models => {
        favouritesProducts.belongsTo(models.user, { foreignKey: 'userid', hooks: false });
        favouritesProducts.belongsTo(models.product, { foreignKey: 'productid', hooks: false });

    };

    return favouritesProducts;
};