const mongo = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  console.log(req.body.email);
  try {
    // Email Validation
    const existUser = await mongo.Db.collection("users").findOne({
      email: req.body.email,
    });

    if (existUser) {
      return res
        .status(400)
        .send({ msg: "your an existing user. Kindly Login" });
    }

    //Password Checking
    const isSamePassword = checkPassword(
      req.body.password,
      req.body.confirmPassword
    );

    if (!isSamePassword) {
      return res.status(400).send({ msg: "password doesn't match" });
    } else delete req.body.confirmPassword;

    //Password Hashed
    const randomString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, randomString);

    // save the data in DB
    const insertedResponse = await mongo.Db.collection("users").insertOne({
      ...req.body,
    });
    res.send(insertedResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const checkPassword = (password, confirmPassword) => {
  return password !== confirmPassword ? false : true;
};

exports.signin = async (req, res, next) => {
  //Email Validation
  const existUser = await mongo.Db.collection("users").findOne({
    email: req.body.email,
  });

  if (!existUser) {
    return res
      .status(400)
      .send({
        msg: "email doesn't match. Kindly Signup to continue further!!",
      });
  }

  // Password varification
  const isSamePassword = await bcrypt.compare(
    req.body.password,
    existUser.password
  );
  if (!isSamePassword) {
    return res.status(400).send({ msg: "Incorrect Password" });
  }

  // Generate and send Token
  const token = jwt.sign(existUser, process.env.SECRET_KEY, {
    expiresIn: "2 hr",
  });
  res.send(token);
};
