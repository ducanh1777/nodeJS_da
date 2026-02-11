const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
var mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoID: { type: String, required: true },
    level: { type: String },
    slug: { type: String, slug: "name", unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

Course.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Course", Course);
