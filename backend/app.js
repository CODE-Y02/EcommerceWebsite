const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// User Model
const User = require("./models/user.js");

const { mongoConnect } = require("./util/database.js");

const errorController = require("./controllers/error");

const app = express();
dotenv.config({ path: "../.env" });

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("639f4e85353e5008ffd7e955")
    .then((user) => {
      req.user = user;
      // user --> is seduilize obj with sequalize methods attached to it with users info
      // we can add req but SHOULD NOT EDIT EXISTING FIELDS  EVEN THOUGH ITS POSSIBLE
      next();
    })
    .catch((err) => console.log(err));
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
