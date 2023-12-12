const mongoose = require("mongoose");
const { DateTime } = require("luxon")

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 50, },
    message: { type: String, required: true, maxLength: 9999 },
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
    timestamps: true,
})

// Virtual for Message's URL
MessageSchema.virtual("url").get(function (){
    // Arrow function not used since we'll need the this object
    return `/message/${this._id}`;
})
// Virtual for formatting DateTime using luxon
MessageSchema.virtual("timestamp_formatted").get(function (){
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
});

// Export the model
module.exports = mongoose.model("Message", MessageSchema);