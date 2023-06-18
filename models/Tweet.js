const mongoose = require('mongoose');
const TweetSchema = new mongoose.Schema(
	{
		tweet: { type: String, required: true },
        author: { type: String, required: true }
	},
	{ collection: 'tweets' }
)

module.exports =  mongoose.model('TweetSchema', TweetSchema)