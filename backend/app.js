const express = require("express");
const app = express();
const dotenv = require("dotenv");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
// Bạn cần phải sử dụng bodyParser() nếu bạn muốn data form có sẵn trong req.body
const path = require("path");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

//Route import
const category =  require("./routes/CategoryRoute");
const subCategory = require("./routes/SubCategoryRoute");
const product = require("./routes/ProductRoute");
const user = require("./routes/UserRoute");
const order = require("./routes/OrderRoute");
const payment = require("./routes/PaymentRoute");

app.use("/api/v2", category);
app.use("/api/v2", subCategory);
app.use("/api/v2", product);
app.use("/api/v2", user);
app.use("/api/v2", order);
app.use("/api/v2", payment);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// it's for errorHandeling
module.exports = app;
