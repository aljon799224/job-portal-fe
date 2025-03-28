import React, { useEffect, useState } from "react";
import axios from "axios";

interface Job {
	id: number;
	title: string;
	location: string;
	description: string;
	salary: string;
	user_id: number;
}

const Jobs: React.FC = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [message, setMessage] = useState("");

	const accessToken = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id")
		? parseInt(localStorage.getItem("user_id")!)
		: null;

	const closeToast = () => setIsToastVisible(false);

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				if (!accessToken) {
					setMessage("Not authenticated");
					setIsToastVisible(true);
					throw new Error("Not authenticated");
				}

				const response = await axios.get(
					"http://localhost:8000/api/v1/job?page=1&size=50",
					{ headers: { Authorization: `Bearer ${accessToken}` } }
				);
				console.log("API Response:", response.data);
				setJobs(response.data.items);
			} catch (err) {
				setMessage("Failed to load jobs");
			}
		};
		fetchJobs();
	}, []);

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			{isToastVisible && (
				<div
					id="toast-success"
					className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow z-[9999]"
					role="alert"
				>
					<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
						<svg
							className="w-5 h-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
						</svg>
						<span className="sr-only">Check icon</span>
					</div>
					<div className="ms-3 text-sm font-normal">{message}</div>
					<button
						type="button"
						className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 text-gray-500"
						aria-label="Close"
						onClick={closeToast}
					>
						<span className="sr-only">Close</span>
						<svg
							className="w-3 h-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
							/>
						</svg>
					</button>
				</div>
			)}
			<h2 className="text-3xl font-bold text-center text-[#ff7409]">
				Job Listings
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Explore exciting career opportunities.
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{jobs.map((job) => (
					<div
						key={job.id}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="mt-2 text-sm">Location: {job.location}</p>
						<p className="mt-2 text-sm">Description: {job.description}</p>
						<p className="mt-2 text-sm">Salary: {job.salary}</p>

						{/* Hide the apply button if the job belongs to the logged-in user */}
						{userId !== job.user_id && (
							<button className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded">
								Apply Now
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Jobs;
