const express = require("express");
require("dotenv").config();

const mongoose = require("mongoose");
const path = require("path");

const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const PORT = process.env.PORT || 4001;
mongoose
  .connect("mongodb://localhost:27017/Phirkoj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
// mongoose.Promise = global.Promise;

app.use(express.json());

app.use(require("./api/routes/signin")); //update later
app.use(require("./api/routes/post"));
// app.use("/posts", postRoutes);
// app.use("/user", userRoutes);
app.get("/", (req, res) => res.send("Hello World!!!"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
