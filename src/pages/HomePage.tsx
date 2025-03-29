import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAutoHideToast } from "../hooks/useAutoHideToast";

interface Job {
	id: number;
	title: string;
	location: string;
	description: string;
	salary: string;
	user_id: number;
}

const HomePage = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const accessToken = localStorage.getItem("token");
	const [success, setSuccess] = useState(true);

	const [applicationData, setApplicationData] = useState({
		email: "",
		mobile_number: "",
		expected_salary: "",
		resume: "",
		user_id: 0,
	});

	const navigate = useNavigate();
	const location = useLocation();

	const userId = localStorage.getItem("user_id")
		? parseInt(localStorage.getItem("user_id")!)
		: null;

	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	useEffect(() => {
		if (location.state?.message) {
			setMessage(location.state.message);
			setSuccess(true);
			setIsToastVisible(true);
			navigate(location.pathname, { replace: true, state: { message: null } });
		}
	}, [location.state, navigate]);

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				if (!accessToken) {
					setMessage("Not authenticated");
					setSuccess(false);
					setIsToastVisible(true);
					throw new Error("Not authenticated");
				}

				const response = await axios.get(
					"http://localhost:8000/api/v1/job?page=1&size=50",
					{ headers: { Authorization: `Bearer ${accessToken}` } }
				);

				const jobList = Array.isArray(response.data.items)
					? response.data.items.slice(0, 6)
					: [];
				setJobs(jobList);
			} catch (err) {
				setMessage("Failed to load jobs");
				setSuccess(false);
				setIsToastVisible(true);
			}
		};
		fetchJobs();
	}, []);

	const openModal = (job: Job) => {
		setSelectedJob(job);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedJob(null);
	};

	const removeFile = () => {
		setResumeFile(null);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
	};

	// Function to handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			console.log("Selected file:", file);
			setResumeFile(file); // Store the selected file
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedJob) return;

		const jsonPayload = {
			email: applicationData.email,
			mobile_number: applicationData.mobile_number,
			expected_salary: Number(applicationData.expected_salary),
			user_id: localStorage.getItem("user_id") || "",
		};

		const formData = new FormData();

		// Append file (Use the correct key: "file")
		if (resumeFile) {
			formData.append("file", resumeFile); // 🔹 Ensure the key matches the FastAPI parameter
		} else {
			setMessage("No resume selected");
			setSuccess(false);
			console.error("No resume file selected");
		}

		// Append JSON as a string
		formData.append("obj_in", JSON.stringify(jsonPayload)); // 🔹 No extra JSON.stringify

		try {
			if (!accessToken) {
				setMessage("Not authenticated");
				setSuccess(false);
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			const response = await axios.post(
				`http://localhost:8000/api/v1/application/${selectedJob.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				setMessage("Application submitted successfully!");
				setSuccess(true);
				setIsToastVisible(true);
				closeModal();
			}
		} catch (error) {
			setMessage("Failed to submit application");
			setSuccess(false);
			setIsToastVisible(true);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			{isToastVisible && (
				<div
					id={success ? "toast-success" : "toast-error"}
					className={`fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 z-[9999] ${
						success
							? "bg-green-100 text-green-800 border-l-4 border-green-500"
							: "bg-red-100 text-red-800 border-l-4 border-red-500"
					} animate-fadeIn`}
					role="alert"
				>
					{/* Icon Section */}
					<div
						className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full ${
							success ? "bg-green-500 text-white" : "bg-red-500 text-white"
						}`}
					>
						{success ? (
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
							</svg>
						) : (
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 .5A9.5 9.5 0 1 0 19.5 10 9.5 9.5 0 0 0 10 .5Zm.707 4.293a1 1 0 0 1 1.414 1.414L10 8.414l-2.121-2.121a1 1 0 0 1 1.414-1.414L10 6.586l.707-.707Z" />
							</svg>
						)}
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
			{/* Hero Section */}
			<header className="relative text-white text-center py-50 bg-[#ffb380]">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-50"
					style={{ backgroundImage: "url('/src/assets/municipal-bg.jpeg')" }}
				></div>
				<div className="relative z-10">
					<h2 className="text-3xl md:text-5xl font-bold">
						Find Your Job here in Peso Calumpit
					</h2>
					<p className="mt-4 text-lg">
						Find the perfect job from a wide range of opportunities.
					</p>
				</div>
			</header>
			;
			<main className="container mx-auto my-8 px-4 flex-1">
				<h3 className="text-2xl font-semibold mb-4">Latest Jobs</h3>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{jobs.length > 0 ? (
						jobs.map((job) => (
							<div
								key={job.id}
								className="border p-4 rounded shadow hover:shadow-lg transition"
							>
								<h4 className="text-xl font-bold">{job.title}</h4>
								<p className="mt-2 text-sm">Location: {job.location}</p>
								<p className="mt-2 text-sm">Salary: {job.salary}</p>
								{userId !== job.user_id && (
									<button
										onClick={() => openModal(job)}
										className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded"
									>
										Apply Now
									</button>
								)}
							</div>
						))
					) : (
						<p className="text-gray-600">No jobs available.</p>
					)}
				</div>
			</main>
			{isModalOpen && (
				<form action="" onSubmit={handleSubmit}>
					<div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
							<h2 className="text-xl font-bold mb-4">
								Apply for {selectedJob?.title}
							</h2>
							<input
								name="email"
								onChange={handleChange}
								placeholder="Email"
								className="w-full p-2 mb-2 border rounded"
							/>
							<input
								name="mobile_number"
								onChange={handleChange}
								placeholder="Mobile Number"
								className="w-full p-2 mb-2 border rounded"
							/>
							<input
								name="expected_salary"
								onChange={handleChange}
								placeholder="Expected Salary"
								className="w-full p-2 mb-2 border rounded"
							/>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700">
									Upload Resume
								</label>
								<div className="flex items-center justify-center w-full">
									<label className="flex flex-col items-center w-full h-32 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
										{!resumeFile ? (
											<>
												<svg
													className="w-10 h-10 text-gray-400 mb-2"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M12 4v16m8-8H4"
													></path>
												</svg>
												<span className="text-gray-600">
													Click to upload or drag & drop
												</span>
												<input
													type="file"
													name="resume"
													onChange={handleFileChange}
													className="hidden"
													accept=".pdf,.doc,.docx"
												/>
											</>
										) : (
											<div className="text-center">
												<p className="text-gray-600">
													Selected: {resumeFile.name}
												</p>
												<button
													type="button"
													onClick={removeFile}
													className="mt-2 px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
												>
													Remove File
												</button>
											</div>
										)}
									</label>
								</div>
							</div>
							<div className="flex justify-end space-x-2">
								<button
									onClick={closeModal}
									className="bg-gray-500 text-white px-4 py-2 rounded"
								>
									Close
								</button>
								<button className="bg-blue-500 text-white px-4 py-2 rounded">
									Submit
								</button>
							</div>
						</div>
					</div>
				</form>
			)}
		</div>
	);
};

export default HomePage;
