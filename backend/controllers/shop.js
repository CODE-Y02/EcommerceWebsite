const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let limit = 2; //ITEM PER PAGE
    let totalProds = 0;
    let skip = (page - 1) * limit;

    if (!page) {
      return res.status(400).json({ Success: false, message: "BAD REQUEST" });
    }

    totalProds = await Product.count();
    const lastPage = Math.ceil(totalProds / limit);

    if (page > lastPage) {
      return res.status(404).json({ Success: false, error: "PAGE NOT FOUND " });
    }

    let products = await Product.findAll({
      offset: skip,
      limit: 2,
    });
    res.json({
      products,
      Success: true,
      total: totalProds,
      hasNextPage: limit * page < totalProds,
      hasPrevPage: page > 1,
      nextPg: page + 1,
      prevPg: page - 1,
      lastPage: lastPage,
    });
  } catch (err) {
    res.status(500).json({ Success: false, error: err.message });
    console.log(err);
  }
  /*
  Product.count()
    .then((productsCount) => {
      totalProds = productsCount;

      return Product.findAll({
        offset: skip,
        limit: 2,
      });
    })
    .then((products) => {
      // res.render("shop/product-list", {
      //   prods: products,
      //   pageTitle: "All Products",
      //   path: "/products",
      // });

      res.json({
        products,
        Success: true,
        total: totalProds,
        hasNextPage: limit * page < totalProds,
        hasPrevPage: page > 1,
        nextPg: page + 1,
        prevPg: page - 1,
        lastPage: Math.ceil(totalProds / limit),
      });
    })
    .catch((err) => {
      res.status(500).json({ Success: false, error: err.message });
      console.log(err);
    });

  */
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  /*  
  
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
 */

  Product.findByPk(prodId)
    .then((product) => {
      // product = product[0];   // if use syntax of findAll

      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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

exports.getCart = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = 2;

    let startLim = (page - 1) * limit; // limit of data chunck to be send to front end
    let endLim = page * limit; //   limit of data chunck to be send to front end
    let userCart = await req.user.getCart();

    let cartItems = (await userCart.getProducts()) || [];

    let cartItemsOnPg = [...cartItems].slice(startLim, endLim);

    let totalPrice = 0;

    cartItems.map((product) => {
      const {
        price,
        cartItem: { quantity },
      } = product;
      totalPrice += Math.round(price * quantity * 100) / 100;
    });

    // console.log("\n \n \n");
    // console.log(cartItemsOnPg);
    // console.log("\n \n \n");
    // cartItems.length --> total cart items

    res.json({
      Success: true,
      totalPrice,
      totalProds: cartItems.length,
      hasNextPage: limit * page < cartItems.length,
      hasPrevPage: page > 1,
      nextPg: page + 1,
      prevPg: page - 1,
      lastPage: Math.ceil(cartItems.length / limit),
      cartItems: cartItemsOnPg,
    });
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ error: error.message });
  }
  /*
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart
  //       .getProducts()
  //       .then((products) => {
  //         // res.render("shop/cart", {
  //         //   path: "/cart",
  //         //   pageTitle: "Your Cart",
  //         //   products: products,
  //         // })

  //         res.json(products);
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
  */
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

  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      // if cart already has product
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        // if cart already has product then increase quantity
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      // new product :  not in cart yet
      return Product.findByPk(prodId);
    })
    .then((product) => {
      // error check
      if (!product) {
        throw Error("PRODUCT NOT FOUNT");
      }

      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res
        .status(200)
        .json({ Success: true, message: "SUCCESSFULLY ADDED TO CART" });
    })
    .catch((err) => {
      res.status(500).json({
        Success: false,
        message: "ERROR OCCURED !!",
        error: err.message,
      });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByPk(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product = products[0];

      return product.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

//post order
exports.postOrder = async (req, res, next) => {
  try {
    let userCart = await req.user.getCart();

    let cartItems = await userCart.getProducts();

    if (!cartItems || []) {
      res.status(400).json({ success: false, message: "CART IS EMPTY" });
      return;
    }

    let orderTotal = 0;

    cartItems.map((itemsObj) => {
      const { cartItem, price } = itemsObj;
      orderTotal += Math.round(price * cartItem.quantity * 100) / 100;

      console.log("\n \n \n \n");
      // console.log(price, "  ", cartItem.quantity);
      // console.log(cartItems);
      console.log("\n ");
      return;
    });

    let order = await req.user.createOrder({ totalAmount: orderTotal });
    await order.addProducts(cartItems);

    await userCart.setProducts(null);
    // NOTE await userCart.removeProducts() does not work

    // let p = await order.getProducts();

    console.log("\n \n \n \n");
    // console.log(orderItem);
    // console.log(cartItems);

    console.log("\n \n \n \n");

    res.json({
      success: true,
      message: "ORDER PLACED",
      // p,
      // orderTotal,
    });
  } catch (error) {
    console.log("\n \n \n \n");
    console.log(error);
    res.status(500).json({ success: false, error: error });
    console.log("\n \n \n \n");
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
