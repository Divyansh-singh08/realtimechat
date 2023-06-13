const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//register controller

module.exports.register = async (req, res, next) => {
	// console.log(req.body);
	try {
		//backend
		const { username, email, password } = req.body; //this is coming from client side
		const usernameCheck = await User.findOne({ username }); //check is database
		if (usernameCheck) {
			return res.json({ msg: "Username is already used", status: false });
		}
		const emailCheck = await User.findOne({ email });
		if (emailCheck) {
			return res.json({ msg: "Email is already used", status: false });
		}
		//if no user found and every this good then
		// encrypt the password into hash and then store the data into user DB
		//10 is salt
		const hashedPassword = await bcrypt.hash(password, 10);
		//no user is present of that email then create a new userID
		const user = await User.create({
			email,
			username,
			password: hashedPassword,
		});
		// and also we don't need the password
		delete user.password;
		return res.json({ status: true, user });
	} catch (error) {
		console.log(error);
		// res.status(500).json({success:false,message:`Internal server Error ${error}`});
		next(error);
	}
};

//loginController
module.exports.loginSever = async (req, res, next) => {
	// console.log(req.body);
	try {
		//backend
		const { username, password } = req.body; //this is coming from client side
		const user = await User.findOne({ username });
		//if not present
		if (!user) {
			return res.json({ msg: "Incorrect username or password", status: false });
		}
		//password is send from client side need to compar with DB password store
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.json({ msg: "Incorrect username or password", status: false });
		}
		delete user.password;

		return res.json({ status: true, user });
	} catch (error) {
		console.log(error);
		// res.status(500).json({success:false,message:`Internal server Error ${error}`});
		next(error);
	}
};

//setAvatarController
module.exports.setAvatarController = async (req, res, next) => {
	try {
		//need the userId(getting from the URL) and from the client side localStorage
		//avatarImage getting from the payload of the client side localStorage
		const userId = req.params.id;
		const avatarImage = req.body.image;
		const userData = await User.findByIdAndUpdate(userId, {
			isAvatarImageSet: true,
			avatarImage,
		});
		return res.json({
			isSet: userData.isAvatarImageSet,
			image: userData.avatarImage,
		});
	} catch (error) {
		next(error);
	}
};

//allUser Information data send
module.exports.getAllUsers = async (req, res, next) => {
	try {
		//we take all the id of user but not the current idUser and also mention what i need
		//this will res(send back) to the client-chatApp page from there components can user
		const users = await User.find({ _id: { $ne: req.params.id } }).select([
			"email",
			"username",
			"avatarImage",
			"_id",
		]);
		return res.json(users);
	} catch (err) {
		next(err);
	}
};
