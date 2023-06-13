import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
function Login() {
  const navigate = useNavigate();
	//create a state
	const [values, setValues] = useState({
		username: "",
		password: "",
	});

	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};
	//if any user is logged In and user information store in localstorage
	//then user automatically when back to the page is logged in
	//no need to logged IN again
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
			const { password, username } = values;
			// go to the client side page take username and password
      // then go to server-side and hit login page and compare with payload data password
      // if match return true else false
			// http://localhost:5000/api/auth/login -->this is server-side call
			const { data } = await axios.post(loginRoute, {
				username: username,
				password: password,
			});
			//check is data is valid or not
			if (data.status === false) {
				toast.error(data.msg, toastOptions);
			}
			//if data is valid
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
		const { password, username } = values;
		if (password === "") {
			toast.error("Email and Password is required", toastOptions);
			return false;
		} else if (username.length === "") {
			toast.error("Email and Password is required ", toastOptions);
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
						min="3"
					/>

					<input
						type="password"
						name="password"
						onChange={(e) => handleChange(e)}
						placeholder="Password"
						// required
					/>

					<button type="submit">Login In</button>
					<span>
						Don't have an account ? <Link to="/register">Register</Link>{" "}
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

export default Login;
