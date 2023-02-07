const jwt = require("jsonwebtoken");

//Authentication
exports.authenticUser = (req, res, next) => {
  // check whether token exist in header
  if (!req.headers.accesstoken) {
    return res.status(400).send({ msg: "Token not found" });
  }

  try {
    const user = jwt.verify(req.headers.accesstoken, process.env.SECRET_KEY);
    req.body.user = user;
    next();
  } catch (err) {
    res.status(400).send({ msg: "unauthorised" });
  }
};
