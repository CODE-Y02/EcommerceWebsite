const mongoDB = require("mongodb");
const dotenv = require("dotenv");
const MongoClient = mongoDB.MongoClient;

dotenv.config({ path: ".env" });

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@${process.env.MongoCluster}.cko8cat.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("connected to mongoDB database");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
