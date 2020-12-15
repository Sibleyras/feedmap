module.exports = (models) => {
    var express = require('express');
    var router = express.Router();
    var Info = models['Info'];

    /* GET all infos. */
    router.get('/getinfolist/:days([0-9]+)', async function (req, res, next) {
        let infos = await Info.getLatestInfos(req.params.days);
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
        var msg = await Info.saveInfo(JSON.parse(req.body.info), req.user)
        res.send(msg)
    });

    /* DELETE info. */
    router.delete('/delinfo', async function (req, res, next) {
        if(!req.user || !req.user.editor){ res.status(403).send("You do not have rights to edit."); return}
        if(!req.body.infoid){
            res.send("Veuillez fournir l'ID")
            return
        }
        msg = await Info.delInfo(req.body.infoid)
        res.send(msg);
    });

    return router;
}