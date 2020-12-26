module.exports = (sequelize) => {
  let express = require("express");
  let router = express.Router();

  /* GET current DATETIME. */
  router.get("/now", async function (req, res, next) {
    let ts;
    try {
      ts = await sequelize.query("SELECT CURRENT_TIMESTAMP");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error -> " + err);
    }
    res.send(ts[0][0]["CURRENT_TIMESTAMP"]);
  });

  /* GET paths to marker icons. */
  router.get("/markers", async function (req, res, next) {
    let marker = require('../public/images/marker.json')
    res.json(marker);
  });

  return router;
};
