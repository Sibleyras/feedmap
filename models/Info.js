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

    // Save a new info in the database.
    Info.saveInfo = async function (data, author) {
        // List of editable entry names.
        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        var info;
        var msg;
        info = await Info.create(data)
        for(let k of uptkeys){
            info.set(k, data[k]);
        }
        info.setAuthor(author)
        await info.save()
    }

    // Edit an existing instance.
    Info.prototype.edit = async function (data, author) {
        // List of editable entry names.
        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        for(let k of uptkeys){
            this.set(k, data[k]);
        }
        this.setAuthor(author)
        await this.save()
        return "success"
    }

    // Delete an existing info from the database.
    Info.delInfo = async function (infoid) {
        // List of editable entry names.
        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        let info = await Info.findByPk(infoid)
        if(!info)
            return "notfound"
        await info.destroy()
        return "success"
    }

    return Info;
};