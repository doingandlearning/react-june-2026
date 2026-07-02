import { useEffect, useState } from "react";

export function StartOfDay3() {
	const [on, setOn] = useState(false);

	useEffect(() => {
		console.log("I was called") // Fetching loads, 
		document.body.style.backgroundColor = on ? "lightblue" : "white";
	}, [on])


	return (
		<div>
			<h1>Start of Day 3</h1>
			<p>Welcome to Day 3! Today we will be building a small React application.</p>
			<button onClick={() => setOn(!on)}>Toggle</button>
		</div>
	);
}