// Entry.js
const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    required: [true, "User phone number required"],
  },
});

module.exports = mongoose.model("Entry", EntrySchema);
