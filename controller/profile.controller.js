const mongoose = require('mongoose');
const Profile = mongoose.model('profile');
const FSFile = mongoose.model("file");
const FSChunk = mongoose.model("chunk");
const Readable = require("stream").Readable;

const { API_URI } = process.env;

var bucket;
mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

class ProfileController {
  
  // Done
  static getIsPublic = async (req, res) => {
    
    const { username } = req.params;
    
    const result = await Profile.findOne({ username }, 'public');
    
    return res.status(200).send(result.public);
  }

  // Done
  static getByUsername = async (req, res) => {

    const { username } = req.params;
    
    var profile = await Profile.findOne({ username });
    
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    return res.status(200).send(profile);
  }

  // Done
  static getAll = async (req, res) => {

    const profiles = await Profile.find({ public: true });
    
    return res.status(200).send(profiles);
  }

  // static getAll = asnyc (req, res) => {
  //   return await Profile.find({ public: true });
  // }

  // Done
  static update = async (req, res) => {
    
    const user = req.user;
    const profile = req.body;

    console.log(user);
    console.log(profile);

    const currentProfile = await Profile.findOne({ userId: user._id });
    if (!currentProfile) {
      return res.status(404).send("Profile not found");
    }

    const usernameProfileExist = await Profile.findOne({ username: profile.username });
    // If requested username already exist and it's not mine
    if (usernameProfileExist && usernameProfileExist.username !== profile.username) {
      return res.status(409).send("Username is already taken.");
    }

    const emailProfileExist = await Profile.findOne({ email: profile.email });
    // If requested email already exist and it's not mine
    if (emailProfileExist && emailProfileExist.email !== profile.email) {
      return res.status(409).send("Email is already taken.");
    }

    var result = await Profile.replaceOne({ userId: user._id }, profile)

    return res.status(200).send(result);
  }

   // Not Done
  //
  // Files Seciton
  //
  //

  static upload = async (req, res) => {
    
    const user = req.user;
    const file = req.files.file;
    
    if(!file) 
      return res.status(400).send("Bad request - File not sent");

    const readableStream = new Readable();
    readableStream.push(file.data);
    readableStream.push(null);

    let uploadStream = bucket.openUploadStream(
      file.name, 
      { 
        contentType: file.mimetype, 
        metadata: { owner: user._id }
      });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", async () => 
      res.status(500).send("Internal server error"));

    uploadStream.on("finish", async (file) => {
      var fileUrl = API_URI + '/api/profile/files/' + file._id + '?' + Date.now();
      await FSFile.updateOne({ _id: file._id }, { $set: { 'metadata.url': fileUrl }});
      file.metadata.url = fileUrl;

      return res.status(200).json(file);
    });
  }

  // Done
  static getFile = async (req, res) => {
    
    const fileId = req.params.id;
    
    try {
    
      const fileInfo = await FSFile.findOne({ _id: fileId });
    
      if(!fileInfo) 
        return res.status(404).send("File not found");
    
      bucket.openDownloadStreamByName(fileInfo.filename).pipe(res);

    } catch (error) {

      return res.status(500).send("internal");

    }
  }

  
  // Done
  static deleteFile = async (req, res) =>  {
    
    const fileId = req.params.id;
    
    const file = await FSFile.findOne({ _id: fileId });
    
    if (!file) {
      return res.status(404).send("File not found");
    }

    await FSChunk.deleteMany({ filesId: fileId });
    await FSFile.deleteOne({ _id: fileId });

    return res.status(204).send();
  }
}

module.exports = ProfileController;