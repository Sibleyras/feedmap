module.exports = (models) => {
    var express = require('express');
    var router = express.Router();
    var Info = models['Info'];
    const {gt, lte, ne} = models.Sequelize.Op;

    /* GET all infos. */
    router.get('/getinfolist', async function (req, res, next) {
        let infos = await Info.findAll({
            where: {
                createdAt: {
                    [gt]: Info.sequelize.literal('date_sub(curdate(), interval 14 day)')
                }
            },
            order: [['createdAt', 'DESC']]
        })
        res.json(infos);
    });

    /* GET current DATETIME. */
    router.get('/getcurrtime', async function (req, res, next) {
        let ts = await Info.sequelize.query("SELECT CURRENT_TIMESTAMP");
        res.send(ts[0][0]['CURRENT_TIMESTAMP']);
    });

    /* POST new info. */
    router.post('/saveinfo', async function (req, res, next) {
        if(!req.user || !req.user.editor){ res.status(403).send("You do not have rights to edit."); return}

        const uptkeys = ['description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        const data = JSON.parse(req.body.info);
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
            if(data[k])
                info.set(k, data[k]);
        }
        info.setAuthor(req.user)
        await info.save()
        res.send(msg);
    });

    /* DELETE info. */
    router.post('/delinfo', async function (req, res, next) {
        if(!req.user || !req.user.editor){ res.status(403).send("You do not have rights to edit."); return}

        if(!req.body.infoid)
            res.send("Veuillez fournir l'ID")
        info = await Info.findByPk(req.body.infoid)
        await info.destroy();
        res.send("Info Supprimée.");
    });

    return router;
}