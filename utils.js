const { create } = require("connect-mongo");
var url = require("url");
const meal = require("./models/meal");

module.exports = {
	hashtagsInfo: async function () {
		const Info = require("./models/hashtags");
		let info = await Info.find().lean();
		return info;
	},
	fooditemsInfo: async function () {
		const Info = require("./models/fooditems");
		let info = await Info.find().lean();
		return info;
	},
	findUserFoodLog: async function (req) {
		const userID = req.user._id;
		const mealDetails = require("./models/meal");
		let data = [];
		let mealdata = await mealDetails.find({ UserId: String(userID) });
		return mealdata;
	},

	createFoodLog: async function (req, data) {
		// const formDetails = req.body;
		const userID = req.user._id;
		const mealDetails = require("./models/meal");
		let mealdata = await mealDetails.find({ UserId: String(userID) });
		const mealTable = require("./models/meal");
		let user_id = String(req.user._id);

		let newmeal = new mealTable({
			logId: mealdata != null ? mealdata.length + 1 : 0,
			UserId: user_id,
			username: data.username,
			HashTags: [],
			FoodItems: [],
		});

		newmeal.save(function (err) {
			if (err) {
				console.log(err.errors);
				return err;
			}
		});
	},

	// updatefoodlog: async function (req, data) {
	// 	let user_id = String(req.user._id);
	// 	const mealTable = require("./models/meal");
	// 	if (user_id) {
	// 		console.log("user found : ", user_id);
	// 		await mealTable.updateOne(
	// 			{ UserId: user_id },
	// 			{
	// 				$push: {
	// 					FoodItems: {
	// 						name: "AVC",
	// 					},
	// 				},
	// 			}
	// 		);
	// 	} else {
	// 		console.log("user not  found : ", user_id);
	// 	}
	// },
};
