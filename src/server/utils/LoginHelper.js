const { User } = require("./Schemas");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const authenticateUser = require("./auth");
require("dotenv").config();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const MONGO_DB_KEY = process.env.MONGO_DB_KEY;
const bcrypt = require("bcrypt");
const saltRounds = 5;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_photos", // The name of the folder in Cloudinary
    allowedFormats: ["jpg", "png"],
  },
});
const parser = multer({ storage: storage });
const connectDB = require("./db");
connectDB(MONGO_DB_KEY);
cloudinary.config({
  cloud_name: "dezclgtpg",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});
module.exports = {
  signUp: async (req, res, next) => {
    // This middleware handles the file upload.
    parser.single("image")(req, res, async function (err) {
      if (err) {
        return res.status(400).send("File upload error.");
      }
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
      console.log("Received FormData:", {
        username: req.body.username,
        password: req.body.password,
        file: req.file,
      });
      const { username, password } = req.body;
      const image = {
        url: req.file.path,
        cloudinary_id: req.file.filename,
      };
      try {
        const existingUser = await User.findOne({
          username: username.toLowerCase(),
        });
        if (existingUser) {
          return res.status(404).sendStatus(404);
        } else {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);
          const createNewUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            profilePic: {
              url: image.url,
              cloudinary_id: image.cloudinary_id,
            },
          });
          await createNewUser.save();
          res
            .status(200)
            .json({ message: "User created!", image, hashedPassword });
        }
      } catch (error) {
        console.error("Error registering user:", error);
        res.sendStatus(500).send("Error registering user.");
      }
    });
  },
  Login: async (req, res) => {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);

    if (result === "INVALID PASSWORD") {
      res.status(401).send("Invalid password");
    } else if (result === "USER NOT FOUND") {
      res.status(404).send("User not found");
    } else if (result === "INTERNAL SERVER ERROR") {
      res.status(500).send("Internal Server Error");
    } else {
      // Authentication was successful, proceed with your logic
      res.status(200).send(result);
    }
  },
};
