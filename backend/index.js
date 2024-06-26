//iampramodkumar8888
//GwO7DCAeNwBXn9xO old backend
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json());

//mongodb config
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-cluster.qvh4i5x.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodi-cluster`
  )
  .then(console.log("Connceted to mongodb"))
  .catch((error) => console.log("error connceting to mongodb"));

//jwt config
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//   import routes here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const verifyToken = require("./api/middleware/verifyToken");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.get("/", verifyToken, (req, res) => {
  res.send("Hw World!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
