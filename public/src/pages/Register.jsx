import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
//this is just for the pop-up msg indicter
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
//component base function
function Register() {
	const navigate = useNavigate();
	//create a state
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	//pop-up msg
	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};
	//if user is already logged in then no need to register
	useEffect(() => {
		if (localStorage.getItem("chat-app-user")) {
			navigate("/");
		}
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			// console.log("invalidation", registerRoute);
			//if it true it will call an api to fetch data
			const { password, username, email } = values;
			// hit with the client-side payload data and compar with the server-side DB
			// go to the server-side hit compar from DB it and return it some information
			// http://localhost:5000/api/auth/register
			// payload
			const { data } = await axios.post(registerRoute, {
				username: username,
				email: email,
				password: password,
			});
			//check is data is valid or not
			if (data.status === false) {
				toast.error(data.msg, toastOptions);
			}
			// if data is valid and New user is Create
			// then we pass the user information to the localstorage in json format
			if (data.status === true) {
				//store data in the web browser's local storage.
				//store data locally on the user's device.
				localStorage.setItem("chat-app-user", JSON.stringify(data.user));
				//navigate method
				//if everything is correct then we set user to localstorage
				//then we navigate to the chat container
				navigate("/");
			}
		}
	};

	const handleValidation = () => {
		const { password, confirmPassword, username, email } = values;
		//every user name length and it type valid then return true
		if (password !== confirmPassword) {
			toast.error("password and confirm password should be same", toastOptions);
			return false;
		} else if (username.length < 3) {
			toast.error(
				"Username should be greater then 3 characters ! ",
				toastOptions
			);
			return false;
		} else if (password.length < 8) {
			toast.error(
				"Password should be equal or greater then 8 characters ! ",
				toastOptions
			);
			return false;
		} else if (email === "") {
			toast.error("Email should can't be Blank! ", toastOptions);
			return false;
		}
		return true;
	};

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	return (
		<>
			<FormContainer>
				<form onSubmit={(event) => handleSubmit(event)}>
					<div className="brand">
						<img src={Logo} alt="LogoImg" />
						<h1>Baatuni</h1>
					</div>
					<input
						type="text"
						name="username"
						onChange={(e) => handleChange(e)}
						placeholder="Username"
						required
					/>
					<input
						type="email"
						name="email"
						onChange={(e) => handleChange(e)}
						placeholder="Email"
						required
					/>
					<input
						type="password"
						name="password"
						onChange={(e) => handleChange(e)}
						placeholder="Password"
						required
					/>
					<input
						type="password"
						name="confirmPassword"
						onChange={(e) => handleChange(e)}
						placeholder="Confirm Password"
						required
					/>
					<button type="submit">Create User</button>
					<span>
						Already have an account ? <Link to="/login">Login</Link>{" "}
					</span>
				</form>
			</FormContainer>
			<ToastContainer />
		</>
	);
}

const FormContainer = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	align-items: center;
	background-color: #131324;
	.brand {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		img {
			height: 5rem;
		}
		h1 {
			color: yellow;
			text-transform: uppercase;
		}
	}
	form {
		${"" /* width:500px; */}
		${"" /* height:600px; */}
		display: flex;
		flex-direction: column;
		gap: 2rem;
		background-color: #00000076;
		border-radius: 2rem;
		padding: 3rem 5rem;

		input {
			background-color: transparent;
			padding: 1rem;
			border: 0.1rem solid #4e0eff;
			border-radius: 0.4rem;
			color: white;
			width: 100%;
			font-size: 1rem;
			&:focus {
				border: 0.1rem solid #ffff00;
				outline: none;
			}
		}
		button {
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
		span {
			color: white;
			text-transform: uppercase;
			a {
				color: #50c878;
				text-decoration: none;
				font-weight: bold;
			}
		}
	}
`;

export default Register;
