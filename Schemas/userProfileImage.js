const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
	filterEmail: String,
	fileName: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('userProfileImage', imageSchema);
