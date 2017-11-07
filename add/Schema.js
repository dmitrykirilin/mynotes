var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
	title: String,
	text: String,
	created: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Note', noteSchema);

