require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./models");
const app = express();
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 3000;

//Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Connect to Mongo DB

var MONGODB_URI = "mongodb://localhost/newsScraper";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
//Express
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
    })
);
app.set("view engine", "handlebars");

//Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!`)
});