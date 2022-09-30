const mongoose = require("mongoose");

//  logId, Timestamp, UserId, HashTags[] associated with the meal by the user, FoodItems[] associated with the meal

const MealSchema = new mongoose.Schema({
	logId: {
		type: String,
		required: true,
	},
	UserId: {
		type: String,
		required: true,
	},
	HashTags: [
		{
			name: { type: String },
		},
	],
	FoodItems: [
		{
			name: { type: String },
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("meal", MealSchema);
