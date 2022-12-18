const mongodb = require("mongodb");

const { getDB } = require("../util/database");

class User {
  constructor(name, email, password, id) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(prodId) });
  }
}

module.exports = User;
