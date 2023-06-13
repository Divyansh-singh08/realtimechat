// here useState,useEffect is use for fetching the userInfo from server-side
// for data need in ChatApp components
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
//for every user who logIn stablish socket.io
import { io } from "socket.io-client";
function Chat() {
	const socket = useRef();

	const navigate = useNavigate();
	const [contacts, setContacts] = useState([]);
	const [currentUser, setCurrentUser] = useState(undefined);
	//this is created for selecting user and showing there chat
	const [currentChatProfile, setCurrentChatProfile] = useState(undefined);

	//loaded the username immediately
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetch1 = async () => {
			try {
				//check weather you are login or not if not login then go and loggedIN
				if (!localStorage.getItem("chat-app-user")) {
					navigate("/login");
				} else {
					//if available then set ot the currentUser
					setCurrentUser(
						await JSON.parse(localStorage.getItem("chat-app-user"))
					);
					setIsLoaded(true);
				}
			} catch (err) {
				console.log(err);
			}
		};
		fetch1();
	}, []);

	//as soon as currentUser change we want this to be run
	// then pass the socket Ref to the chatContainer
	useEffect(() => {
		if (currentUser) {
			socket.current = io(host);
			socket.current.emit("add-user", currentUser._id);
		}
	}, [currentUser]);

	// we want that this hook will trigger or run function
	// when the currentUser have some value set on it
	useEffect(() => {
		const fetch = async () => {
			try {
				// if there is currentUser then
				// again check is currentUser userSet the AvatarImage if not then navigate to setAvatar
				// then call the api and fetch the contact information from DB
				// and the set to contacts
				// and render to the components
				if (currentUser) {
					if (currentUser.isAvatarImageSet) {
						const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
						setContacts(data.data);
					} else {
						navigate("/setAvatar");
					}
				}
			} catch (err) {}
		};
		fetch();
	}, [currentUser]);

	//function handle chat-change and show the chatUser display
	const handleChatChange = (chat) => {
		setCurrentChatProfile(chat);
	};

	return (
		<>
			<Container>
				<div className="chat-container">
					{/* components  and passing the props to it child */}
					<Contact
						contacts={contacts}
						currentUser={currentUser}
						changeChat={handleChatChange}
					/>
					{/* conditional render */}
					{isLoaded && currentChatProfile === undefined ? (
						<Welcome currentUser={currentUser} />
					) : (
						<ChatContainer
							currentChatProfile={currentChatProfile}
							currentUser={currentUser}
							socket={socket}
						/>
					)}
				</div>
			</Container>
		</>
	);
}

export default Chat;

//css style...
const Container = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	background-color: #131324;
	.chat-container {
		height: 85vh;
		width: 85vw;
		background-color: #00000076;
		display: grid;
		grid-template-columns: 25% 75%;
		border: 2px solid transparent;
		@media screen and (min-width: 720px) and (max-width: 1080px) {
			${"" /* /if u are under this range then it will be tab screen */}
			grid-template-columns:35% 65%;
		}
	}
`;
