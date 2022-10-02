const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const fileSchema = new mongoose.Schema({
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
}, { strict: false });

const chunkSchema = new mongoose.Schema({
    filesId: { type: ObjectId, required: true },
    n: { type: Number, required: true },
    data: { type: Buffer }
}, { strict: false });

module.exports = mongoose.model("file", fileSchema, "fs.files");
module.exports = mongoose.model("chunk", chunkSchema, "fs.chunks");
