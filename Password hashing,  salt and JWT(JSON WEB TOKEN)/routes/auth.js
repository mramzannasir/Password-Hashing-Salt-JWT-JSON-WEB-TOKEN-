const { json } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create a User using Post " ". Doesn't require any auth




// this is for Json web token you  need to give some thing 
const JWT_SECRET = "nasir";
router.post(
  "/",
  [
    body("name", "invalid name").isLength({ min: 4 }),
    // email must be an email
    body("email", "enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "Password must be 8 charcter").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // fined one use for finding  duplicate emails in data base
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Invalid email this email already exist" });
    }

    // Creating an Hash form of password
    const salt = bcrypt.genSaltSync(10);
    secpass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass,
    });


// creating an jsonwebtoken
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    // Show your jsonwebtoken in your response json
    res.json(authToken);
  }
);

module.exports = router;
