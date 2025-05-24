import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import api from "../../axios";

const JobCreate: React.FC = () => {
	const [jobData, setJobData] = useState({
		title: "",
		company: "",
		location: "",
		description: "",
		salary: "",
		logo: "",
		user_id: 0, // Added user_id
	});

	const [isToastVisible, setIsToastVisible] = useState(false);
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	const userId = Number(localStorage.getItem("user_id")) || 0;
	const accessToken = localStorage.getItem("token");

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	// Fetch user_id from localStorage when component mounts
	useEffect(() => {
		if (userId) {
			setJobData((prevState) => ({ ...prevState, user_id: userId }));
		}
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setJobData({ ...jobData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (!accessToken) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			await api.post("/job", jobData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setMessage("Job posted successfully!");
			setJobData({
				title: "",
				company: "",
				location: "",
				description: "",
				salary: "",
				logo: "",
				user_id: userId, // Retain user_id
			});
			navigate("/jobs-created", {
				state: { message: "Job created successfully!" },
			});
		} catch (error) {
			setMessage("Failed to post the job. Please try again.");
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await api.post("/upload-logo/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setSelectedFile(file);

			// Save the filename returned by the backend
			const uploadedFilename = response.data.filename;
			setJobData((prevData) => ({ ...prevData, logo: uploadedFilename }));
		} catch (error) {
			console.error("Logo upload failed", error);
			setMessage("Failed to upload logo.");
			setIsToastVisible(true);
		}
	};

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
						data-dismiss-target="#toast-danger"
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
				Post a Job
			</h2>
			<form
				onSubmit={handleSubmit}
				className="max-w-lg mx-auto mt-6 bg-white p-6 shadow-lg rounded"
			>
				{message && <p className="text-center text-green-600">{message}</p>}

				<div className="mb-4">
					<label className="block font-semibold">Job Title</label>
					<input
						type="text"
						name="title"
						value={jobData.title}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block font-semibold">Company</label>
					<input
						type="text"
						name="company"
						value={jobData.company}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block font-semibold">Location</label>
					<input
						type="text"
						name="location"
						value={jobData.location}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block font-semibold">Job Description</label>
					<textarea
						name="description"
						value={jobData.description}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<select
					name="salary"
					value={jobData.salary}
					onChange={handleChange}
					className="border p-2 rounded w-full mb-2"
				>
					<option value="">Select salary</option>
					{[
						"10000",
						"15000",
						"20000",
						"25000",
						"30000",
						"35000",
						"40000",
						"45000",
						"50000",
						"55000",
						"60000",
						"65000",
						"70000",
					].map((salary) => (
						<option key={salary} value={salary}>
							{salary}
						</option>
					))}
				</select>

				<div className="mb-6 mt-2">
					<label className="block font-semibold mb-2">Company Logo</label>
					<div className="flex items-center gap-4">
						<label
							htmlFor="file-upload"
							className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Upload Image
						</label>
						<span className="text-sm text-gray-600">
							{selectedFile?.name || "No file selected"}
						</span>
					</div>
					<input
						id="file-upload"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				{/* Hidden input for user_id */}
				<input type="hidden" name="user_id" value={jobData.user_id} />

				<button
					type="submit"
					className="bg-[#ff7409] text-white px-4 py-2 rounded w-full"
				>
					Post Job
				</button>
			</form>
		</div>
	);
};

export default JobCreate;
