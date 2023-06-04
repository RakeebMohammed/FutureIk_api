const express = require("express");
const app = express();
const user = require("./routes/userRoutes");
const cors=require('cors')
const db = require("./model/connection");
require('dotenv').config()
app.use(cors())
app.use(express.json());
app.use("/", user);
//connecting to database
db.connect();
//listening to port
app.listen(process.env.PORT || 3002, () => {
  console.log("connected to port "+process.env.PORT);
});