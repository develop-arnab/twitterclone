const mongoose = require('mongoose');
const FollowingSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
        following: { type: Array, required: true }
	},
	{ collection: 'following' }
)

module.exports =  mongoose.model('FollowingSchema', FollowingSchema)