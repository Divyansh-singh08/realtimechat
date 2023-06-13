const messageModel = require("../models/messageModel");
module.exports.addMsgToDB = async (req, res, next) => {
	try {
		//taking the data from the client-side and creating the table and storing in it....
		const { from, to, message } = req.body;
		const data = await messageModel.create({
			message: { text: message },
			users: [from, to],
			sender: from,
		});
		//if message is created and store...
		if (data) {
			return res.json({ msg: "Message added successfully." });
		} else {
			return res.json({ msg: "Fail to add message into the DataBase" });
		}
	} catch (ex) {
		console.log(ex);
		next(ex);
	}
};

module.exports.getAllMessage = async (req, res, next) => {
	try {
		//here we fetching the msg from the database
		//using which user send msg to whom
		const { from, to } = req.body;
		const messages = await messageModel
			.find({
				users: {
					$all: [from, to],
				},
			})
			.sort({ updatedAt: 1 });
		const projectMessage = messages.map((msg) => {
			return {
				fromSelf: msg.sender.toString() === from,
				message: msg.message.text,
			};
		});
		res.json(projectMessage);
	} catch (ex) {
		next(ex);
	}
};
