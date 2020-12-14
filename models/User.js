'use strict';
const forge = require('node-forge')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    editor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    superadmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login: {
      type: DataTypes.DATE
    }
  }, {
    // Options
  });

  User.findByUsername = async function (username, done) {
    var user = await User.findOne({
      where: {
        username: username
      }
    })
    if (!user)
      return done(null, null)

    return done(null, user)
  }

  User.checkPassword = async function (username, password, done) {
    await User.findByUsername(username, function (err, user) {
      if(err){
        return done(err)
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      user.update( { last_login : sequelize.literal('CURRENT_TIMESTAMP') })
      return done(null, user);
    })
  }

  User.prototype.validPassword = function (password) {
    return this.computeHash(password) == this.password;
  }

  User.prototype.setPassword = function (password) {
    this.password = this.computeHash(password);
  }

  User.prototype.computeHash = function (password) {
    var h = forge.md.sha256.create()
    h.update(sequelize.options.sel + this.username + password)
    return h.digest().toHex()
  }

  return User;
};