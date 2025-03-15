import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
			<h1 className="text-6xl font-bold text-[#ff7409]">404</h1>
			<h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
			<p className="text-gray-600 mt-2">
				Sorry, the page you are looking for does not exist.
			</p>
			<Link
				to="/"
				className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded hover:bg-[#e66508] transition"
			>
				Go to Home
			</Link>
		</div>
	);
};

export default NotFound;
