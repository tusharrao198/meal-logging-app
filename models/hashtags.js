const mongoose = require("mongoose");

//  logId, Timestamp, UserId, HashTags[] associated with the meal by the user, FoodItems[] associated with the meal

const HashTagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("hashtags", HashTagSchema);
