const Sequelize = require("sequelize");

// with Sequelize we dont neewd to write sql queries manually

const sequelize = new Sequelize("node-complete", "root", "King@Ninja@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
