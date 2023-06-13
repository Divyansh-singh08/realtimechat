import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

function SetAvatar() {
	//api route for images
	const api = "https://api.multiavatar.com/654661";
	const navigate = useNavigate();
	const [avatar, setAvatar] = useState([]);
	//to show the loader
	const [isLoading, setIsLoading] = useState(true);
	const [selectedAvatar, setSelectedAvatar] = useState(undefined);

	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};

	//here we need useEffect
	useEffect(() => {
		const fetch = async () => {
			//if there is not user in the localStorage
			//then we need to login first
			if (!localStorage.getItem("chat-app-user")) {
				navigate("/login");
			}
		};
		fetch();
	}, []);

	const setProfilePicture = async () => {
		if (selectedAvatar === undefined) {
			toast.error("Please select an avatar for your profile", toastOptions);
		} else {
			//if avatar is selected
			//get the user from localStorage of the user device
			const user = await JSON.parse(localStorage.getItem("chat-app-user"));
			//we have user information
			//http://localhost:5000/api/auth/setAvatar/user._id
			//we fetch the data from the client side storage make update the data on client side
			const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
				image: avatar[selectedAvatar],
			});
			// console.log(data);
			if (data.isSet) {
				console.log(data.isSet);
				user.isAvatarImageSet = true;
				user.avatarImage = data.image;
				localStorage.setItem("chat-app-user", JSON.stringify(user));
				navigate("/");
			} else {
				toast.error("Error setting avatar.Please try again", toastOptions);
			}
		}
	};
	// useEffect(async () => {
	// 	const data = [];
	// 	//this will generate random numbers and we get different img every time
	// 	for (let i = 0; i < 4; i++) {
	// 		const image = await axios.get(
	// 			`${api}/${Math.round(Math.random() * 1000)}`
	// 		);
	// 		const buffer = new Buffer(image.data);
	// 		data.push(buffer.toString("base64"));
	// 	}
	// 	setAvatar(data);
	// 	setIsLoading(false);
	// }, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = [];
				// Generate random numbers to get different images each time
				for (let i = 0; i < 4; i++) {
					const response = await axios.get(
						`${api}/${Math.round(Math.random() * 1000)}`,
						{
							responseType: "arraybuffer",
						}
					);
					const image = Buffer.from(response.data, "binary").toString("base64");
					data.push(image);
				}
				setAvatar(data);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return (
		// loader gif

		<>
			{isLoading ? (
				<Container>
					<img src={loader} alt="loader" className="loader-gif" />
				</Container>
			) : (
				<Container>
					<div className="title-container">
						<h1>Pick an Avatar for your Profile Picture</h1>
					</div>
					<div className="avatars">
						{avatar.map((avatar, index) => {
							return (
								<div
									key={index}
									className={`avatar ${
										selectedAvatar === index ? "selected" : ""
									}`}
								>
									<img
										src={`data:image/svg+xml;base64,${avatar}`}
										alt="avatar"
										onClick={() => setSelectedAvatar(index)}
									/>
								</div>
							);
						})}
					</div>
					<button className="submit-btn" onClick={setProfilePicture}>
						Set as Profile Avatar
					</button>
				</Container>
			)}
			<ToastContainer />
		</>
	);
}

export default SetAvatar;

//create a component for markup
const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 3rem;
	background-color: #131324;
	height: 100vh;
	width: 100vw;
	.loader {
		max-inline-size: 100%;
	}
	.title-container {
		h1 {
			color: white;
		}
	}
	.avatars {
		display: flex;
		gap: 2rem;
		${"" /* border: 2px solid transparent; */}
		.avatar {
			border: 0.4rem solid transparent;
			padding: 0.4rem;
			border-radius: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: 0.5s ease-in-out;
			img {
				height: 6rem;
				transition: 0.5s ease-in-out;
			}
		}
		.selected {
			border: 0.4rem solid #4e0eff;
		}
	}
	.submit-btn {
		background-color: #4e0eff;
		color: white;
		padding: 1rem 2rem;
		border: none;
		font-weight: bold;
		cursor: pointer;
		border-radius: 0.4rem;
		font-size: 1rem;
		text-transform: uppercase;
		transition: 0.5s ease-in-out;
		&:hover {
			background-color: #50c878;
		}
	}
`;
