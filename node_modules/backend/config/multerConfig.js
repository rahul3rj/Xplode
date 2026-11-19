const multer = require("multer");

// Memory storage (MongoDB me binary format store karne ke liye)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Sirf images allow karna (jpg, jpeg, png)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
