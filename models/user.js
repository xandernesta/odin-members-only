const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 50, unique: true, },
    email: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["non-member", "member", "secret-member", "admin"],
        default: "non-member",
      },
    isAdmin: { type: Boolean },
    image: { type: String },
})

// Virtual for User's URL
UserSchema.virtual("url").get(function (){
    // Arrow function not used since we'll need the this object
    return `/user/${this._id}`;
})
// Allows for checking if username is taken
UserSchema.statics.isUsernameTaken = async function isUsernameTaken(username) {
  return this.exists({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();
}

// Export the model
module.exports = mongoose.model("User", UserSchema);