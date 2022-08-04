const mongoose = require('mongoose');
const { getSetFromName } = require('../utils/get-set-from-name');

const artifactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	slot: {
		type: String,
		required: true,
		enum: ["flower", "feather", "sands", "goblet", "circlet"]
	},
	level: {
		type: Number,
		required: true
	},
	mainStat: {
		type: String,
		required: true
	},
	mainStatAmount: {
		type: Number,
		required: true
	},
	substats: [{
		stat: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			required: true
		}
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		// required: true
	}
}, {
	timestamps: true,
});

// find the artifact's set from its proper name and its slot
artifactSchema.virtual("set").get(function() {
	return getSetFromName(this.name, this.slot);
});

module.exports = mongoose.model("Artifact", artifactSchema);
