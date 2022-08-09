const mongoose = require('mongoose');
const { getSetFromName } = require('../utils/get-set-from-name');

const characterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	level: {
		type: Number,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
}, {
	timestamps: true,
});

module.exports = mongoose.model("Character", characterSchema);
