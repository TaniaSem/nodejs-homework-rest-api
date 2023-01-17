const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = {
  Contact,
};
