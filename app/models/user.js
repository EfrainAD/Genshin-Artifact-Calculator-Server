const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		substatWeighting: {
			type: mongoose.SchemaTypes.Mixed,
			required: true,
			default: {
				"Atk": 0,
				"Atk%": 0,
				"HP": 0,
				"HP%": 0,
				"Def": 0,
				"Def%": 0,
				"critRate": 1,
				"critDmg": 1,
				"EM": 0,
				"ER": 0
			}
		},
		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
