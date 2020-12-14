'use strict';
module.exports = (sequelize, DataTypes) => {
    const Info = sequelize.define('Info', {
        // Model attributes are defined here
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        marker: {
            type: DataTypes.STRING,
            allowNull: false
        },
        source: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        optJSON: {
            type: DataTypes.JSON
        }
    }, {
        indexes: [{
                fields: ['createdAt'],
            },
            {
                fields: ['marker'],
            }
        ]
    });

    Info.associate = function (db) {
        Info.belongsTo(db['User'], {
            as: 'author',
            constraints: false
        })
    }

    return Info;
};