/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    var UsersAddresses = sequelize.define('usersAddresses', {
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
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'address'
        },
        lat: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'lat'
        },
        lng: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'lng'
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'country'
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'phone'
        },
        isdefault: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'isdefault'
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
        tableName: 'usersAddresses'
    });

    UsersAddresses.associate = models => {
        UsersAddresses.belongsTo(models.user, { foreignKey: 'userId', hooks: false });
    };

    return UsersAddresses;
};