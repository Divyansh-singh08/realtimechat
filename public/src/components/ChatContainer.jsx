import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
// import Messages from "./Messages";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { addMsgToDBRoute, getAllMsgFromDBRoute } from "../utils/APIRoutes";
function ChatContainer({ currentChatProfile, currentUser, socket }) {
	// console.log(currentChatProfile);

	const [messageBox, setMessageBox] = useState([]);
	//this state is for socketIO
	const [arrivalMsg, setArrivalMsg] = useState(null);

	const scrollRef = useRef();
	//we want to run whenever the currentChat is change
	//we want to fetch the chat of the current User using currentUser
	useEffect(() => {
		const msgFetch = async () => {
			try {
				if (currentChatProfile) {
					//when we hit on this api we fetch the data from the DB
					//from -sender who write
					//to - receive the data
					const responseMsg = await axios.post(getAllMsgFromDBRoute, {
						from: currentUser._id,
						to: currentChatProfile._id,
					});
					setMessageBox(responseMsg.data);
				}
			} catch (er) {
				console.log(er);
			}
		};
		msgFetch();
	}, []);

	//sending props to it's child and asking for it's value or result and display it
	const handleSendMsg = async (msg) => {
		// console.log(msg);
		// alert(msg);
		try {
			// hitting to this client-side ,
			// server-side will active and passing payload to the DB
			await axios.post(addMsgToDBRoute, {
				from: currentUser._id,
				to: currentChatProfile._id,
				message: msg,
			});
			//when we send the msg will also emit the event
			socket.current.emit("send-msg", {
				to: currentChatProfile._id,
				from: currentUser._id,
				message: msg,
			});

			const msgs = [...messageBox];
			msgs.push({ fromSelf: true, message: msg });
			setMessageBox(msgs);
		} catch (err) {
			console.log(err);
		}
	};

	//another use effect for socket connection
	//this will run for the first time when
	//component is loaded
	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-receive", (msg) => {
				setArrivalMsg({ fromSelf: false, message: msg });
			});
		}
	}, []);

	//another user Effect
	//this will every time when there is a new arrival msg
	useEffect(() => {
		arrivalMsg && setMessageBox((prev) => [...prev, arrivalMsg]);
	}, [arrivalMsg]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messageBox]);

	return (
		<>
			{currentChatProfile && (
				<Container>
					<div className="chat-header">
						<div className="user-details">
							<div className="avatar">
								<img
									src={`data:image/svg+xml;base64,${currentChatProfile.avatarImage}`}
									alt="avatar"
								/>
							</div>
							<div className="username">
								<h3>{currentChatProfile.username}</h3>
							</div>
						</div>
						<Logout />
					</div>
					<div className="chat-messages">
						{messageBox.map((messageBox) => {
							return (
								<div ref={scrollRef} key={uuidv4()}>
									<div
										className={`messageBox ${
											messageBox.fromSelf ? "sended" : "received"
										}`}
									>
										<div className="message-content">
											<p>{messageBox.message}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
					{/* <Messages  /> */}
					{/* <div className="chat-input-box"></div> */}
					{/* taking back props value from it child  */}
					<ChatInput handleSendMsg={handleSendMsg} />
				</Container>
			)}
		</>
	);
}

export default ChatContainer;

const Container = styled.div`
	padding-top: 1rem;
	display: grid;
	grid-template-rows: 10% 78% 12%;
	gap: 0.1rem;
	overflow: hidden;
	@media screen and (min-width: 720px) and (max-width: 1080px) {
		${"" /* /if u are under this range then it will be tab screen */}
		grid-template-rows:15% 70% 15%;
	}
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 2rem;
		${"" /* border:2px solid green; */}
		.user-details {
			display: flex;
			align-items: center;
			${"" /* border:2px solid red; */}
			gap:1rem;
			.avatar {
				img {
					height: 3rem;
				}
			}
			.username {
				h3 {
					color: white;
				}
			}
		}
	}
	.chat-messages {
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: auto;
		&::-webkit-scrollbar {
			width:0.2rem;
			&-thumb{
				background-color: #ffffff39;
				width:0.1rem;
				border-radius:1rem;
			}
		}
		.messageBox {
			display: flex;
			align-items: center;
			.message-content {
				max-width: 40%;
				overflow-wrap: break-word;
				padding: 1rem;
				font-size: 1.1rem;
				border-radius: 1rem;
				color: #d1d1d1;
			}
		}
		.sended {
			justify-content: flex-end;
			.message-content {
				background-color: #4f04ff21;
			}
		}
		.received {
			justify-content: flex-start;
			.message-content {
				background-color: #9900ff20;
			}
		}
	}
`;
