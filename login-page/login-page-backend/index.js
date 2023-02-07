const express = require("express");
const mongo = require("./connect");
const dotenv = require("dotenv");
const auth = require("./Modules/authModule");
const registerRouter = require("./Router/registerRouter");
const profileRouter= require("./Router/profileRouter");
const cors = require("cors");
const app = express();
dotenv.config();

mongo.connect();
app.use(cors());
app.use(express.json());

app.use("/register", registerRouter);

app.use("/", auth.authenticUser);

app.use("/profile",profileRouter);

app.listen(process.env.PORT);