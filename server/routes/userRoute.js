const {
	register,
	loginSever,
	setAvatarController,
	getAllUsers,
} = require("../controllers/userController");

const router = require("express").Router();

// localhost:5000/api/auth/register
//this is the request coming from the client side
router.post("/register", register);
router.post("/login", loginSever);
router.post("/setAvatar/:id", setAvatarController);
//sending the id of the current user in the URL itself
//and fetching the userId information from the DB
router.get("/allUsers/:id", getAllUsers);

module.exports = router;
