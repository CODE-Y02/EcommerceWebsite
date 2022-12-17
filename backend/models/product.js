const { getDB, mongoConnect } = require("../util/database");

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDB();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(" THEN BLOCK INSIDE SVAAE ");
        console.log("\n FROM SAVE ====>   \n", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
