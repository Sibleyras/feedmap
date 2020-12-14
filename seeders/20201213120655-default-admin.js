'use strict';
const forge = require('node-forge')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      password: forge.md.sha256.create().update(queryInterface.sequelize.options.sel + 'admin' + 'admin').digest().toHex(),
      createdAt: new Date(),
      updatedAt: new Date(),
      editor: 1,
      superadmin: 1,
      last_login: null
    }], {});
    console.log('admin/admin SuperAdmin account created. Please change your password in your_site.com/login/chgpwd.')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: 'admin'
    }, {});
  }
};