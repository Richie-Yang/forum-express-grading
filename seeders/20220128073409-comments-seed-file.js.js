'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const [users, restaurants] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id, email FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        'SELECT id FROM Restaurants;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 100 }, () => ({
        text: faker.lorem.text(),
        user_id: users[
          Math.floor(Math.random() * users.length)
        ].id,
        restaurant_id: restaurants[
          Math.floor(Math.random() * restaurants.length)
        ].id,
        created_at: new Date(),
        updated_at: new Date()
      })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
