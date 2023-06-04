const bcrypt = require("bcrypt");
const db = require("../model/connection");
const jwt = require("jsonwebtoken");

const objectid = require("mongodb").ObjectId;
const Signup = async (req, res) => {
  try {
    //destructoring request
    let { Name, Password, Cpassword, Email, Phone } = req.body;
    console.log(req.body);
    //check for empty requests
    if (!Name || !Password || !Cpassword || !Email || !Phone)
      return res.status(404).json("Please provide all credintials");
    //check for valid Name
    if (!/^[A-Za-z]+$/.test(Name))
      return res.status(404).json("Not a valid Name");
      //check for valid mobile number

    let PhoneRegex = /^[0-9]{10}$/;
    if (!PhoneRegex.test(Phone))
      return res.status(400).json("Phone number not valid");
    let EmailRegex =
      /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    //validating Email
    if (!EmailRegex.test(Email))
      return res.status(400).json("Email validation failed");
    let PasswordRegex = /^[A-Za-z\d]{8,}$/;
    //check for valid password
    if (!PasswordRegex.test(Password))
      return res
        .status(400)
        .json("Password should contain atleast 8 characters");
    
    //check whether both password is same
    if (Password !== Cpassword)
      return res.status(404).json("Password mismatch");
    else {
      let EmailExists = await db
        .get()
        .collection("users")
        .findOne({ Email: Email });
      console.log(EmailExists);
      //check for if the Email exists in the database
      if (EmailExists)
        return res.status(404).json("Already have same Email id ");
      //hashing the password to store in the database
      Password = await bcrypt.hash(Password, 10);
      console.log(Password);
      //store details to the database
      await db
        .get()
        .collection("users")
        .insertOne({ Name, Email, Password, Phone });
      res.status(200).json({ id: "sucess" });
    }
  } catch (err) {
    // internal error response
    res.status(500).json({ error: err.message });
  }
};

const Login = async (req, res) => {
  try {
    //destructoring request
    const { Email, Password } = req.body;
    console.log(req.body);
    //check for empty requests
    if (!Email || !Password)
      return res.status(404).json("Please enter valid credintials");
    //finding an Email exitsts in the database
    let EmailExists = await db
      .get()
      .collection("users")
      .findOne({ Email: Email });

    console.log(EmailExists);
    //comparing the hashed password with the password
    if (EmailExists && (await bcrypt.compare(Password, EmailExists.Password))) {
      //creating token with the secret key
      const token = jwt.sign({ EmailExists }, process.env.SECRET, {
        expiresIn: "2h",
      });
      console.log(token);
      res.status(200).json({ id: token });
    } else
      res.status(404).json("Incorrect Email or password");
  } catch (err) {
    // internal error response
    return res.status(500).json({ error: err.message });
  }
};
const Check = async (req, res) => {
  try {
    const { Email, Phone } = req.body;
    let result = await db
      .get()
      .collection("users")
      .findOne({ $and: [{ Email: Email, Phone: Phone }] });

    console.log(result + "hii");
    if (result) return res.status(200).json({ result: result._id });
    else return res.status(404).json('No user found');
  } catch (e) {
    // internal error response
    return res.status(500).json({ error: err.message });
  }
};

const Update = async (req, res) => {
  try {
    console.log(req.body);
    let { Password, Cpassword, Id } = req.body;
    if (Password !== Cpassword) {
      return res.status(404).json("Password mismatch");
    }
    let PasswordRegex = /^[A-Za-z\d]{8,}$/;
    //check for valid password
    if (!PasswordRegex.test(Password))
      return res
        .status(400)
        .json("Password Should contain atleast 8 characters");
    //hashing the password to store in the database
    Password = await bcrypt.hash(Password, 10);
    console.log(Password);
    //storing password to database
    Id = new objectid(Id);
    await db
      .get()
      .collection("users")
      .updateOne({ _id: Id }, { $set: { Password: Password } })
      .then(() => res.status(200).json({ result: true }))
      .catch(() => res.status(400).json("Password not updated"));
  } catch (e) {
    // internal error response
    return res.status(500).json({ error: err.message });
  }
};
module.exports = { Signup, Check, Login, Update };
