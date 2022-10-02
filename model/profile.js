const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const profileSchema = new mongoose.Schema({
  userId: { type: ObjectId, unique: true },
  imageUrl: { type: String },
  public: { type: Boolean, default: false },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: { type: String, },
  occupations: { type: [String], default: null },
  motto: { type: String },
  address: { type: { 
    street: { type: String },
    city: { type: String },
    postCode: { type: Number },
    country: { type: String },
  }, default: null },
  socialMedia: { type: [
    { 
      name: { type: String },
      url: { type: String },
    }
  ], default: null},
  bio: { type: String },
  documents: [
    {
      length: { type: Number, required: true },
      chunkSize: { type: Number, required: true },
      uploadDate: { type: Date, required: true },
      filename: { type: String, required: true },
      md5: { type: String, required: true },
      contentType: { type: String, required: true },
      metadata: { 
          type: { 
              owner: { type: ObjectId },
              url: String
          } }
    }
  ]
});

module.exports = mongoose.model("profile", profileSchema);