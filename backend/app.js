const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// User Model
const User = require("./models/user.js");

// const { mongoConnect } = require("./util/database.js");

const errorController = require("./controllers/error");

const app = express();
dotenv.config({ path: "./.env" });

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("63a1b84fff48de741554f16e")
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

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(
    `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@${process.env.MongoCluster}.cko8cat.mongodb.net/${process.env.MongoDataBase}?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "admin",
          email: "admin@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
