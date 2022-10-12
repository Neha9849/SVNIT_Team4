const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); //logs
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
//load config
require("dotenv").config();

//passport config
require("./passport")(passport);

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
// app.use(morgan('dev')) //logs middlewares
app.use(express.json());
app.use(express.urlencoded({ extented:false }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret:'mimi',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:process.env.MONGO_URI
  })
}
));
app.use(passport.initialize());
app.use(passport.session())

//connect db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"))
app.use('/categories',require('./routes/category'))
app.use("/product",require("./routes/product"))
app.use("/user",require("./routes/user"))

//run server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
