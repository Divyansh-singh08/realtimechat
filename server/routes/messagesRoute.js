const {
	addMsgToDB,
	getAllMessage,
} = require("../controllers/messagesController");

const router = require("express").Router();

// localhost:5000/api/msg/addMsg/
//this is the request coming from the client side
//this will asking to add msg to DB when client-side hit it
router.post("/addMsg/", addMsgToDB);
router.post("/getMsg/", getAllMessage);

module.exports = router;
