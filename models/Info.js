'use strict';
module.exports = (sequelize, DataTypes) => {
    const {gt, lte, ne} = sequelize.Sequelize.Op;

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

    // Get all the infos of the past <int:days> days. Negative or 0 for all infos.
    Info.getLatestInfos = async function (days) {
        if(days <= 0){
            return await Info.findAll({
                order: [
                    ['createdAt', 'DESC']
                ]
            })
        }
        return await Info.findAll({
            where: {
                createdAt: {
                    [gt]: Info.sequelize.literal('date_sub(curdate(), interval ' + days + ' day)')
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
    }

    // Save a new info or edit an existing one in the database.
    Info.saveInfo = async function (data, author) {
        // List of editable entry names.
        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        var info;
        var msg;
        if(!data['id'] || data['id'] === 0){
            info = await Info.create(data)
            msg = "Info ajoutée";
        } else {
            info = await Info.findByPk(data['id'])
            msg = "Info éditée";
        }
        for(let k of uptkeys){
            info.set(k, data[k]);
        }
        info.setAuthor(author)
        await info.save()
        return msg;
    }

    // Delete an existing info from the database.
    Info.delInfo = async function (infoid) {
        // List of editable entry names.
        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        var info = await Info.findByPk(infoid)
        if(!info)
            return "Entrée inexistante."
        await info.destroy();
        return "Entrée Supprimée."
    }

    return Info;
};