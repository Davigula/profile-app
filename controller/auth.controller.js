const User = require("../model/user");
const Profile = require("../model/profile");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { DEFAULT_IMAGE_URL } = process.env;
class AuthController {
  static register  =  async (req, res) => {
    try {
      // Get user input
      const { firstName, lastName, email, password, rememberMe } = req.body;
  
      console.log("register", req.body);
      // Validate user input
      if (!(email && password && firstName && lastName)) {
        return res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      var encryptedPassword = await bcrypt.hash(String(password), 10);
      var username = email.split('@')[0];
      // Create user in our database
      const user = await User.create({
        firstName,
        lastName,
        username: username,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role: "user"
      });

      await Profile.create({
        userId: user._id,
        imageUrl: DEFAULT_IMAGE_URL,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        socialMedia: [
          {
            "name": "facebook",
            "url": ""
          },
          {
              "name": "instagram",
              "url": ""
          },
          {
              "name": "linkedin",
              "url": ""
          },
          {
              "name": "github",
              "url": ""
          }
        ]
      });
  
      // Create token
      const token = jwt.sign(
        { _id: user._id, email, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: rememberMe ? "30d" : "2h",
        }
      );
      
      const newUser = await User.findOne({ email }).select('-password');
      newUser.token = token;
  
      // return new user
      return res.status(201).json(newUser);
    } catch (err) {
      console.log(err);
    }


  }

  static login = async (req, res) => {
    // Our login logic starts here
  try {
    // Get user input
    const { email, password, rememberMe} = req.body;
    console.log("login", req.body);
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(String(password), user.password))) {
      // Create token
      const token = jwt.sign(
        { _id: user._id, email, username: user.username },
        process.env.TOKEN_KEY,
        {
          expiresIn: rememberMe ? "30d" : "2h",
        }
      );

      const userResponse = await User.findOne({ email }).select('-password');
      userResponse.token = token;
      
      // user
      return res.status(200).json(userResponse);
    }

    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
  }
}

module.exports = AuthController;