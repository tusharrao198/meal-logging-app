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
		const userID = req.user._id;
		const mealDetails = require("./models/meal");
		let mealdata = await mealDetails.find({ UserId: String(userID) });
		const mealTable = require("./models/meal");
		let user_id = String(req.user._id);

		let hasht = [];
		let foodt = [];
		let checkh = Array.isArray(data.HashTags);
		let checkf = Array.isArray(data.FoodItems);
		if (checkh) {
			for (let i = 0; i < data.HashTags.length; i++) {
				let obj = {};
				obj["name"] = data.HashTags[i];
				hasht.push(obj);
			}
		} else {
			let obj = {};
			obj["name"] = data.HashTags;
			hasht.push(obj);
		}
		if (checkf) {
			for (let i = 0; i < data.FoodItems.length; i++) {
				let obj = {};
				obj["name"] = data.FoodItems[i];
				foodt.push(obj);
			}
		} else {
			let obj = {};
			obj["name"] = data.FoodItems;
			foodt.push(obj);
		}

		let newmeal = new mealTable({
			logId: mealdata != null ? mealdata.length + 1 : 0,
			UserId: user_id,
			username: data.username,
			HashTags: hasht,
			FoodItems: foodt,
		});

		newmeal.save(function (err) {
			if (err) {
				console.log(err.errors);
				return err;
			}
		});
	},
};
