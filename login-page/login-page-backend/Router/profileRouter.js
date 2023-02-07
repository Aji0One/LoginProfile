const express = require("express");
const profileModule= require("../Modules/profileModule");

const router= express.Router();

router.get("/get", profileModule.getProfile);
router.put("/update",profileModule.editProfile);


module.exports=router;