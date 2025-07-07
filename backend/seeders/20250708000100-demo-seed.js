// Seeder for demo roles, groups, and an admin user
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed roles
    const roles = await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', description: 'Administrator', createdAt: new Date(), updatedAt: new Date() },
      { name: 'User', description: 'Regular user', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Seed groups
    const groups = await queryInterface.bulkInsert('Groups', [
      { name: 'Default Group', description: 'Default group for users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Marketing', description: 'Marketing team', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Get inserted role and group IDs
    const [adminRole] = await queryInterface.sequelize.query('SELECT id FROM "Roles" WHERE name = \'Admin\' LIMIT 1;');
    const [defaultGroup] = await queryInterface.sequelize.query('SELECT id FROM "Groups" WHERE name = \'Default Group\' LIMIT 1;');

    // Seed admin user
    const password_hash = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password_hash,
        role_id: adminRole[0]?.id || 1,
        group_id: defaultGroup[0]?.id || 1,
        must_change_password: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { username: 'admin' });
    await queryInterface.bulkDelete('Roles', { name: ['Admin', 'User'] });
    await queryInterface.bulkDelete('Groups', { name: ['Default Group', 'Marketing'] });
  },
}; 