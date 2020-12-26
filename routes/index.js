module.exports = (models, passport) => {
  var express = require("express");
  var router = express.Router();
  const User = models["User"];

  /* GET home page. */
  router.get("/", function (req, res, next) {
    res.render("index", { edit: req.user ? req.user.editor : 0 });
  });

  /* GET IP address. */
  router.get("/ip", function (req, res, next) {
    res.send("Votre IP est " + req.ip);
  });

  // Simple login form.
  router.get("/login", function (req, res, next) {
    res.render("login", {
      user: req.user,
    });
  });

  // Treat the login form with passport authenticate.
  router.post("/login", async function (req, res, next) {
    passport.authenticate("local", async function (err, user, info) {
      if (!user) {
        return res.render("login", {
          user: req.user,
          err: "Mauvais username/password.",
        });
      }
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        if (user.superadmin) {
          return res.redirect("/admin");
        }
        return res.redirect("/");
      });
    })(req, res, next);
  });

  // Change password
  router.get("/login/chgpwd", function (req, res, next) {
    res.render("changepassword", {
      err: req.error,
    });
  });

  // Treat the change password form.
  router.post("/login/chgpwd", async function (req, res, next) {
    if (
      !(
        req.body.username &&
        req.body.password &&
        req.body.newpass &&
        req.body.newpass2
      )
    ) {
      return res.render("changepassword", {
        err: "Remplissez tous les champs",
      });
    }
    passport.authenticate("local", async function (err, user, info) {
      if (!user) {
        return res.render("changepassword", {
          err: "Mauvais username/password.",
        });
      }
      if (req.body.newpass != req.body.newpass2) {
        return res.render("changepassword", {
          err: "mots de passe différents.",
        });
      }
      user.setPassword(req.body.newpass);
      await user.save();
      return res.render("changepassword", {
        err: "Mot de Passe modifé !",
      });
    })(req, res, next);
  });

  /* GET users listing and add new. */
  router.get("/admin", async function (req, res, next) {
    if (!req.user || !req.user.superadmin) {
      res.status(403).send("ACCESS DENIED");
      return;
    }
    let userlist;
    try {
      userlist = await User.findAll();
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.render("admin", {
      user: req.user,
      userlist: userlist,
    });
  });

  return router;
};
