const Order = require("../models/order");
const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  // try {
  //   let products = await Product.fetchAll();

  //   res.json({
  //     products,
  //     Success: true,
  //   });
  // } catch (err) {
  //   res.status(500).json({ Success: false, error: err.message });
  //   console.log(err);
  // }

  Product.find()
    .populate("userId", "name -_id")
    .then((products) => {
      // console.log("\n\n\n\n", products, "\n\n\n\n");

      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      // console.log("\n\n\n", products, "\n\n\n");
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//get cart
exports.getCart = async (req, res, next) => {
  // try {
  //   let cartProds = await req.user.getCart();
  //   let totalPrice = 0;
  //   cartProds.map((product) => {
  //     const { price, quantity } = product;
  //     totalPrice += Math.round(price * quantity * 100) / 100;
  //   });
  //   // console.log("\n \n \n");
  //   // console.log(cartItemsOnPg);
  //   // console.log("\n \n \n");
  //   // cartItems.length --> total cart items
  //   res.status(200).json({
  //     Success: true,
  //     totalPrice,
  //     totalProds: cartProds.length,
  //     // hasNextPage: limit * page < cartItems.length,
  //     // hasPrevPage: page > 1,
  //     // nextPg: page + 1,
  //     // prevPg: page - 1,
  //     // lastPage: Math.ceil(cartItems.length / limit),
  //     cartItems: cartProds,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(error.status).json({ error: error.message });
  // }

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("\n\n PRODS ===============> ", user.cart.items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
      // res.json(products);
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  //get prodID
  const prodId = req.body.productId;
  console.log(prodId);
  if (!prodId) {
    return res
      .status(400)
      .json({ Success: false, message: "INVALID PRODUCT ID" });
  }

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     // if cart already has product
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       // if cart already has product then increase quantity
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }

  //     // new product :  not in cart yet
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     // error check
  //     if (!product) {
  //       throw Error("PRODUCT NOT FOUNT");
  //     }

  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res
  //       .status(200)
  //       .json({ Success: true, message: "SUCCESSFULLY ADDED TO CART" });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       Success: false,
  //       message: "ERROR OCCURED !!",
  //       error: err.message,
  //     });
  //   });

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      return res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByPk(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });

  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
      // res
      //   .status(200)
      //   .json({ success: true, message: "Item removed from cart" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// //post order
// exports.postOrder = async (req, res, next) => {
//   try {
//     let userCart = await req.user.getCart();
//     let cartItems = await userCart.getProducts();

//     if (!cartItems.length || !cartItems) {
//       res.status(400).json({ success: false, message: "CART IS EMPTY" });
//       return;
//     }

//     let orderTotal = 0;

//     let order = await req.user.createOrder();

//     let p = cartItems.map((itemsObj) => {
//       const {
//         cartItem: { quantity, cartId, productId, createdAt, updatedAt },
//         price,
//         ...other
//       } = itemsObj;
//       orderTotal += Math.round(price * quantity * 100) / 100;
//       return order.addProduct(productId, { through: { quantity } });
//     });

//     order.update({ totalAmount: orderTotal });

//     await Promise.all(p);

//     await userCart.setProducts(null);
//     // NOTE await userCart.removeProducts() does not work

//     res.json({
//       success: true,
//       message: "ORDER PLACED",
//       orderID: order.id,
//     });
//   } catch (error) {
//     console.log("\n \n 'ERROR IN POST ORDER '\n \n");
//     console.log(error);
//     console.log("\n \n \n \n");

//     res.status(500).json({ success: false, error: error });
//   }
// };

// ADD ORDER
exports.postOrder = (req, res) => {
  // console.log("\n\n\n start post add order  \n\n\n");

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // get products
      const products = user.cart.items.map((prod) => {
        return { quantity: prod.quantity, product: { ...prod.productId._doc } };
      });

      const order = new Order({
        user: {
          name: user.name,
          userId: user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      // console.log("\n\n\n", result, "\n\n\n");
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

//
//get orders
exports.getOrders = async (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  });
};

// //get orders
// exports.getOrders = async (req, res, next) => {
//   try {
//     let orders = await req.user.getOrders();

//     let p = orders.map((order) => {
//       return order.getProducts();
//     });

//     Promise.all(p).then((prods) => res.json(prods)); // we are sending list of all products
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
