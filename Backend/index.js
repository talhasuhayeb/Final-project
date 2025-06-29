const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const AuthRouter = require("./Routes/AuthRouter");
const AdminRouter = require("./Routes/AdminRouter");

require("dotenv").config();
require("./Models/db");
const PORT = process.env.PORT || 8080;

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);

// Serve fingerprint images statically
app.use("/uploads", express.static(path.join(__dirname, "Ml_server/uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
