const router = require("express").Router();
const {
	findUserFoodLog,
	createFoodLog,
	hashtagsInfo,
	fooditemsInfo,
} = require("../utils");
var url = require("url");
const { authCheck } = require("../middleware/auth");

router.get("/foodlog", authCheck, async (req, res) => {
	const hashtags = await hashtagsInfo();
	const fooditems = await fooditemsInfo();
	const context = {
		hashtags: hashtags,
		fooditems: fooditems,
	};
	res.render("addfoodlog", {
		authenticated: true,
		...context,
	});
});

//food log add page
router.get("/showfoodlog", authCheck, async (req, res) => {
	let foodLogTable = require("../models/meal");
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ out: "Added Data!" }));
});

// create food log for user
router.post("/foodlog", authCheck, async (req, res) => {
	const userDetails = require("../models/User");
	const mealDetails = require("../models/meal");
	const userID = req.user._id;

	let user = await userDetails.findOne({ _id: userID });
	if (user) {
		// console.log("user");
		let mealdata = await mealDetails.findOne({ UserId: String(userID) });
		let HashTagsList = ["A", "B"];
		let FoodItemsList = ["C", "D"];

		console.log("new user  with meal data");
		const data = {
			username: user.username,
			HashTags: HashTagsList,
			FoodItems: FoodItemsList,
		};
		await createFoodLog(req, data);
		res.redirect(`/meallogs`);

		// await updatefoodlog(req, data);
	} else {
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ msg: "No user logged in!" }));
	}
});

//meallogs for user
router.get("/meallogs", authCheck, async (req, res) => {
	const mealdata = await findUserFoodLog(req);
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ ...mealdata }));
});

router.get("/hashtags", authCheck, async (req, res) => {
	const data = await hashtagsInfo(req);
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ ...data }));
});

router.get("/ingredients", authCheck, async (req, res) => {
	const data = await fooditemsInfo(req);
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ ...data }));
});
module.exports = router;
