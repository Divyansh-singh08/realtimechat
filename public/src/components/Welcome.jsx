import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome({currentUser}) {
	return (
		<>
			<Container>
				<img src={Robot} alt="robot" />
				<h1>
					Welcome,<span>{currentUser.username}</span>{" "}
				</h1>
				<h3>Please Select a Chat to Start Messaging</h3>
			</Container>
		</>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	${"" /* gap:1rem; */}
	color:white;
	img {
		height: 20rem;
	}
	span {
		color: #4eff;
	}
	h1 {
		display: flex;
		justify-content: center;
		${"" /* align-items:center; */}
		align-content:center;
	}
`;
