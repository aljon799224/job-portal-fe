import React, { useEffect, useState } from "react";
import api from "../../axios";
import usePagination from "../../hooks/usePagination";

interface Job {
	id: number;
	title: string;
	location: string;
	description: string;
	salary: string;
	user_id: number;
	logo: string;
}

const Jobs: React.FC = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [success, setSuccess] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
	const [appliedJobs, setAppliedJobs] = useState(new Set());
	const [savedJobs, setSavedJobs] = useState(new Set<number>());

	console.log(success);

	const [applicationData, setApplicationData] = useState({
		email: "",
		mobile_number: "",
		expected_salary: "",
		resume: "",
		user_id: 0,
	});

	const accessToken = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id")
		? parseInt(localStorage.getItem("user_id")!)
		: null;
	const [salaryFilter, setSalaryFilter] = useState("");

	const closeToast = () => setIsToastVisible(false);

	const removeFile = () => {
		setResumeFile(null);
	};

	const openApplyModal = (job: Job) => {
		setSelectedJob(job);
		setIsApplyModalOpen(true);
	};

	const closeApplyModal = () => {
		setIsApplyModalOpen(false);
		setSelectedJob(null);
	};

	const fetchJobs = async () => {
		try {
			if (!accessToken) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			const response = await api.get("/job?page=1&size=50", {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			console.log("API Response:", response.data);
			setJobs(response.data.items);
		} catch (err) {
			setMessage("Failed to load jobs");
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	useEffect(() => {
		const checkApplications = async () => {
			if (!accessToken) {
				setMessage("Not authenticated");
				setSuccess(false);
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}
			if (!userId) return;
			const appliedSet = new Set();
			for (const job of jobs) {
				try {
					const response = await api.get(
						`/applications/user-job?user_id=${userId}&job_id=${job.id}`,
						{ headers: { Authorization: `Bearer ${accessToken}` } }
					);
					if (response.status === 200) {
						appliedSet.add(job.id); // Mark job as applied
					}
				} catch (error: any) {
					if (error.response?.status !== 404) {
						console.error("Error checking application status", error);
					}
				}
			}
			setAppliedJobs(appliedSet);
		};

		if (jobs.length) {
			checkApplications();
		}
	}, [jobs, userId]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
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

			const response = await api.post(
				`/application/${selectedJob.id}`,
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
				closeApplyModal();
				window.location.reload();
			}
		} catch (error) {
			setMessage("Failed to submit application");
			setSuccess(false);
			setIsToastVisible(true);
		}
	};

	const fetchJobDetails = async (jobId: number) => {
		try {
			if (!accessToken || !userId) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}
			const response = await api.get(`/job/${jobId}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setSelectedJob(response.data);
			setIsModalOpen(true);
		} catch (error) {
			setMessage("Failed to fetch job details.");
			setIsToastVisible(true);
		}
	};

	const saveJob = async (jobId: number) => {
		try {
			if (!accessToken || !userId) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			const response = await api.post(
				"/save-job",
				{ user_id: userId, job_id: jobId },
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			if (response.status === 200) {
				setMessage("Job saved successfully!");
				setSuccess(true);
				setIsToastVisible(true);

				// 🔹 Update the saved jobs state immediately
				setSavedJobs((prevSavedJobs) => new Set(prevSavedJobs).add(jobId));
			}
		} catch (error) {
			setMessage("Failed to save job");
			setSuccess(false);
			setIsToastVisible(true);
		}
	};

	useEffect(() => {
		// Function to check if each job is saved
		const checkSavedJobs = async () => {
			const savedJobIds = new Set<number>();

			await Promise.all(
				jobs.map(async (job) => {
					try {
						await api.get(
							`/save-job/user-job?user_id=${userId}&job_id=${job.id}`
						);
						// If request succeeds, add job ID to savedJobs
						savedJobIds.add(job.id);
					} catch (error: any) {
						if (error.response?.status === 404) {
							// Job is NOT saved, do nothing
						} else {
							console.error("Error checking saved job:", error);
						}
					}
				})
			);

			setSavedJobs(savedJobIds);
		};

		if (jobs.length > 0) {
			checkSavedJobs();
		}
	}, [jobs, userId]);

	const filteredJobs = jobs.filter((job) => {
		if (salaryFilter === "lt30000") return parseInt(job.salary) < 30000;
		if (salaryFilter === "30000to50000") {
			const salary = parseInt(job.salary);
			return salary >= 30000 && salary <= 50000;
		}
		if (salaryFilter === "gt50000") return parseInt(job.salary) > 50000;
		return true; // If no filter selected, include all
	});

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	} = usePagination(filteredJobs, 10, fetchJobs);

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
			<select
				name="salaryFilter"
				value={salaryFilter}
				onChange={(e) => setSalaryFilter(e.target.value)}
				className="border p-2 rounded"
			>
				<option value="">All</option>
				<option value="lt30000">Less than 30,000</option>
				<option value="30000to50000">30,000 to 50,000</option>
				<option value="gt50000">More than 50,000</option>
			</select>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{paginatedData.map((job) => (
					<div
						key={job.id}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						{job.logo && (
							<div className="h-16 w-16 rounded-full overflow-hidden border shrink-0 bg-gray-100 flex items-center justify-center">
								<img
									src={`${import.meta.env.VITE_API_BASE_URL_IMG}/public/logos/${
										job.logo
									}`}
									alt={`${job.title} logo`}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="mt-2 text-sm">Location: {job.location}</p>
						<p className="mt-2 text-sm">
							Description:{" "}
							{job.description.length > 15
								? `${job.description.slice(0, 15)}...`
								: job.description}
						</p>

						<p className="mt-2 text-sm">Salary: {job.salary}</p>
						<button
							onClick={() => fetchJobDetails(job.id)}
							className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded mr-2"
						>
							View Details
						</button>

						{/* Hide the apply button if the job belongs to the logged-in user */}
						{userId !== job.user_id && (
							<button
								onClick={() => openApplyModal(job)}
								className={`mt-4 px-4 py-2 rounded mr-2 ${
									appliedJobs.has(job.id)
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-500 text-white"
								}`}
								disabled={appliedJobs.has(job.id)}
							>
								{appliedJobs.has(job.id) ? "Applied" : "Apply Now"}
							</button>
						)}
						<button
							onClick={() => saveJob(job.id)}
							className={`mt-4 px-3 py-2 rounded ${
								savedJobs.has(job.id)
									? "bg-gray-400 cursor-not-allowed"
									: "bg-yellow-500 text-white hover:bg-yellow-600"
							} transition`}
							disabled={savedJobs.has(job.id)}
						>
							{savedJobs.has(job.id) ? "✅ Saved" : "⭐ Save Job"}
						</button>
					</div>
				))}
			</div>
			<div className="flex items-center justify-center space-x-2 mt-4">
				<button
					className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					onClick={goToPreviousPage}
					disabled={currentPage === 1}
				>
					Prev
				</button>

				<span className="px-4 py-1 border rounded-lg bg-blue-100">
					Page {currentPage} of {totalPages}
				</span>

				<button
					className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
					onClick={goToNextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
			{isApplyModalOpen && (
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
							<select
								name="expected_salary"
								onChange={handleChange}
								value={applicationData.expected_salary}
								className="w-full p-2 mb-2 border rounded"
							>
								<option value="">Select Expected Salary</option>
								<option value="5000">5000</option>
								<option value="10000">10000</option>
								<option value="15000">15000</option>
								<option value="20000">20000</option>
								<option value="30000">30000</option>
							</select>

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
									onClick={closeApplyModal}
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
			{/* Modal */}
			{isModalOpen && selectedJob && (
				<div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
						{selectedJob.logo && (
							<div className="h-16 w-16 rounded-full overflow-hidden border shrink-0 bg-gray-100 flex items-center justify-center">
								<img
									src={`${import.meta.env.VITE_API_BASE_URL_IMG}/public/logos/${
										selectedJob.logo
									}`}
									alt={`${selectedJob.title} logo`}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<h3 className="text-xl font-bold">{selectedJob.title}</h3>
						<p className="mt-2">Location: {selectedJob.location}</p>
						<p className="mt-2">Description: {selectedJob.description}</p>
						<p className="mt-2">Salary: {selectedJob.salary}</p>
						<button
							onClick={() => setIsModalOpen(false)}
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Jobs;
