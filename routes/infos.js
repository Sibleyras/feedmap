module.exports = (models) => {
  let express = require("express");
  let router = express.Router();
  let Info = models["Info"];

  /* GET all infos. */
  router.get("/infos", async function (req, res, next) {
    let infos;
    try {
      infos = await Info.findAll();
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.json(infos);
  });

  /* GET latest infos. */
  router.get("/infos/days/:days([0-9]+)", async function (req, res, next) {
    let infos;
    try {
      infos = await Info.getLatestInfos(req.params.days);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.json(infos);
  });

  /* GET info by Id. */
  router.get("/info/:infoId([0-9]+)", async function (req, res, next) {
    let info;
    try {
      info = await Info.findByPk(req.params.infoId);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.json(info);
  });

  /* Create a new Info. */
  router.post("/info", async function (req, res, next) {
    if (!req.user || !req.user.editor) {
      return res.status(403).send("You do not have rights to edit.");
    }
    let msg;
    try {
      msg = await Info.saveInfo(JSON.parse(req.body.info), req.user);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.send(msg);
  });

  /* Edit an existing Info. */
  router.put("/info/:infoId([0-9]+)", async function (req, res, next) {
    if (!req.user || !req.user.editor) {
      return res.status(403).send("You do not have rights to edit.");
    }
    let msg;
    try {
      let info = await Info.findByPk(req.params.infoId);
      msg = await info.edit(JSON.parse(req.body.info), req.user);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.send(msg);
  });

  /* DELETE info. */
  router.delete("/info/:infoId([0-9]+)", async function (req, res, next) {
    if (!req.user || !req.user.editor) {
      return res.status(403).send("You do not have rights to edit.");
    }
    if (!req.params.infoId) {
      return res.send("Veuillez fournir l'ID");
    }
    let msg;
    try {
      msg = await Info.delInfo(req.params.infoId);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.send(msg);
  });

  return router;
};
