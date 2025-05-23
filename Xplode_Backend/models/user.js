const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      minlength: 6,
    },
    profilePic: {
      data: { type: Buffer, default: null }, // ✅ Binary data with default null
      contentType: { type: String, default: null }, // ✅ Image type with default null
    },
    phone: {
      type: Number,
      match: /^[0-9]{10}$/,
    },
    vault: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "vault",
    }],
    recent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "recent",
    }],
    username:{
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    

  },
  { timestamps: true }
);

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$"))
      .required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });

  return schema.validate(data);
};

module.exports = {
  userModel: mongoose.model("user", userSchema),
  validateUser,
};
