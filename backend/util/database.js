const mongoDB = require("mongodb");
const dotenv = require("dotenv");
const MongoClient = mongoDB.MongoClient;

dotenv.config({ path: ".env" });

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@${process.env.MongoCluster}.cko8cat.mongodb.net/${process.env.MongoDataBase}?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("connected to mongoDB database");
      _db = client.db(); // we can also pass database name inside db ;
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDB = () => {
  if (_db) return _db;
  throw "No database Found!!!";
};

// module.exports = mongoConnect;

module.exports = {
  getDB,
  mongoConnect,
};
