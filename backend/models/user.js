const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // note dont user arrow function here
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
      productId: product._id,
      quantity: newQty,
    });
  }
  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (prod) => prod.productId.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  // console.log(updatedCartItems[0].productId.toString(), "\n", productId);
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = model("User", userSchema);

// const mongodb = require("mongodb");

// const { getDB } = require("../util/database");

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this._id = id;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDB();
//     return db.collection("users").insertOne(this);
//   }

// getCart() {
//   const db = getDB();
//   const prodIdsArr = this.cart.items.map((prod) => prod.productId);

//   return db
//     .collection("products")
//     .find({ _id: { $in: prodIdsArr } })
//     .toArray()
//     .then((products) => {
//       return products.map((p) => {
//         return {
//           ...p,
//           quantity: this.cart.items.find((itm) => {
//             // console.log(p, "\n\n\n");
//             return itm.productId.toString() === p._id.toString();
//           }).quantity,
//         };
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// addToCart(product) {
//   // check if item alreay exist

//   const cartProdIdx = this.cart.items.findIndex(
//     (cartItem) => cartItem.productId.toString() === product._id.toString()
//   );
//   // updates cart items
//   let updatedCartItems = [...this.cart.items];

//   let newQty = 1;

//   if (cartProdIdx >= 0) {
//     newQty = this.cart.items[cartProdIdx].quantity + 1;
//     updatedCartItems[cartProdIdx].quantity = newQty;
//   } else {
//     updatedCartItems.push({
//       productId: new mongodb.ObjectId(product._id),
//       quantity: newQty,
//     });
//   }

//   const db = getDB();
//   return db
//     .collection("users")
//     .updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     );
// }

// deleteItemFromCart(productId) {
//   const updatedCartItems = this.cart.items.filter(
//     (prod) => prod.productId.toString() !== productId.toString()
//   );

//   const db = getDB();
//   return db
//     .collection("users")
//     .updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     );
// }

//   addOrder() {
//     const db = getDB();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };

//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };

//         // console.log("\n\n\n\n executing \n\n\n\n");
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   fetchOrders() {
//     const db = getDB();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(prodId) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(prodId) });
//   }
// }

// module.exports = User;
