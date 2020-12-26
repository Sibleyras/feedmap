module.exports = (models, passport) => {
  var express = require("express");
  //const app = require('../app');
  var router = express.Router();
  const User = models["User"];

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
        return res.send("Mauvais username/password.");
      }
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.send("success");
      });
    })(req, res, next);
  });

  // Logout.
  router.get("/logout", function (req, res) {
    req.logout();
    console.log("logged out");
    return res.send("success");
  });

  // Change password
  router.get("/login/chgpwd", function (req, res, next) {
    res.render("changepassword", {
      err: req.error,
    });
  });

  // Treat the change password form.
  router.put("/login/chgpwd", async function (req, res, next) {
    if (
      !(
        req.body.username &&
        req.body.password &&
        req.body.newpass &&
        req.body.newpass2
      )
    ) {
      return res.send("Remplissez tous les champs")
    }
    passport.authenticate("local", async function (err, user, info) {
      if (!user) {
        return res.send("Mauvais username/password.")
      }
      if (req.body.newpass != req.body.newpass2) {
        return res.send("mots de passe différents.")
      }
      user.setPassword(req.body.newpass);
      await user.save();
      return res.send("success")
    })(req, res, next);
  });

  /* GET current logged user. */
  router.get("/user", async function (req, res, next) {
    if (!req.user) {
      return res.status(403).send("ACCESS DENIED");
    }
    return res.json(req.user);
  });

  /* GET users listing. */
  router.get("/users", async function (req, res, next) {
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
    res.json({
      userlist: userlist,
    });
  });

  // Add a new user.
  router.post("/user", async function (req, res, next) {
    if (!req.user || !req.user.superadmin) {
      return res.status(403).send("ACCESS DENIED");
    }
    let u = await User.findByUsername(req.body.username, (err, user) => {
      return user;
    });
    if (u) return res.send("Username already in use");
    u = User.build({
      username: req.body.username,
      editor: false,
    });
    u.setPassword(req.body.password);
    try {
      await u.save();
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.send("success");
  });

  // switch the editor right.
  router.put("/user/editor/:userId([0-9]+)", async function (req, res, next) {
    if (!req.user || !req.user.superadmin) {
      return res.status(403).send("ACCESS DENIED");
    }
    let user = await User.findByPk(req.params.userId);
    if (user) {
      user.editor = !user.editor;
      await user.save();
    }
    res.send("success");
  });

  /* DELETE user. */
  router.delete("/user/:userId([0-9]+)", async function (req, res, next) {
    if (!req.user || !req.user.superadmin) {
      return res.status(403).send("You do not have rights to edit.");
    }
    if (!req.params.userId) {
      return res.send("Veuillez fournir l'ID");
    }
    let msg;
    try {
      msg = await User.delUser(req.params.userId);
    } catch (err) {
      return res.status(500).send("Error -> " + err);
    }
    res.send(msg);
  });

  return router;
};
