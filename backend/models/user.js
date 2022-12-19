const mongodb = require("mongodb");

const { getDB } = require("../util/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // check if item alreay exist

    const cartProdIdx = this.cart.items.findIndex(
      (cartItem) => cartItem.productId.toString() === product._id.toString()
    );
    // updates cart items
    let updatedCartItems = [...this.cart.items];

    let newQty = 1;

    if (cartProdIdx >= 0) {
      newQty = this.cart.items[cartProdIdx].quantity + 1;
      updatedCartItems[cartProdIdx].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQty,
      });
    }

    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(prodId) });
  }
}

module.exports = User;
