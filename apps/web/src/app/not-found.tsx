"use client";

import { useEffect, useState } from "react";

export default function NotFound() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDark(mq.matches);
		const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
		mq.addEventListener("change", listener);
		return () => mq.removeEventListener("change", listener);
	}, []);

	const color = isDark ? "#fff" : "#000";
	const borderColor = isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)";
	const background = isDark ? "#000" : "#fff";

	return (
		<div
			style={{
				fontFamily:
					'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
				height: "100vh",
				textAlign: "center",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				margin: 0,
				color,
				background,
			}}
		>
			<div>
				<h1
					style={{
						display: "inline-block",
						margin: "0px 20px 0px 0px",
						padding: "0px 23px 0px 0px",
						fontSize: "24px",
						fontWeight: 500,
						verticalAlign: "top",
						lineHeight: "49px",
						borderRight: `1px solid ${borderColor}`,
					}}
				>
					404
				</h1>
				<div style={{ display: "inline-block" }}>
					<h2
						style={{
							fontSize: "14px",
							fontWeight: 400,
							lineHeight: "49px",
							margin: 0,
						}}
					>
						This page could not be found.
					</h2>
				</div>
			</div>
		</div>
	);
}
