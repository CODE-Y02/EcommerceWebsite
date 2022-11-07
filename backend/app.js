const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();
dotenv.config({ path: "../.env" });

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      // user --> is seduilize obj with sequalize methods attached to it with users info
      // we can add req but SHOULD NOT EDIT EXISTING FIELDS  EVEN THOUGH ITS POSSIBLE
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// sequelize can create table for models created using it during server start , it will create table only when its NOT Exist in DB
// it also automatically defines relationship

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

const startApp = async () => {
  try {
    await sequelize.sync();
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        name: process.env.SITE_ADMIN_USERNAME,
        email: process.env.SITE_ADMIN_EMAIL,
      });
    }

    let cart = await user.getCart();
    if (!cart) {
      cart = await user.createCart();
    }

    app.listen(3000);
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

startApp();
