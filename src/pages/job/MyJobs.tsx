import React, { useEffect, useState } from "react";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import usePagination from "../../hooks/usePagination";

interface Job {
	id: number;
	title: string;
	location: string;
	description: string;
	salary: string;
	logo: string;
	company: string;
}

const PostedJobs: React.FC = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [message, setMessage] = useState("");

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [applications, setApplications] = useState([]);

	const accessToken = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id");

	const navigate = useNavigate();

	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);
	const fetchJobs = async () => {
		try {
			const userId = localStorage.getItem("user_id");

			if (!accessToken || !userId) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}

			const response = await api.get(`/jobs/user/${userId}?page=1&size=50`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			console.log(response.data.items);
			setJobs(response.data.items);
		} catch (error) {
			setMessage("Failed to fetch jobs.");
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const openEditModal = (job: Job) => {
		setSelectedJob(job);
		setIsEditModalOpen(true);
	};

	const openDeleteModal = (job: Job) => {
		setSelectedJob(job);
		setIsDeleteModalOpen(true);
	};

	const closeModals = () => {
		setIsEditModalOpen(false);
		setIsDeleteModalOpen(false);
		setSelectedJob(null);
	};

	const handleUpdate = async () => {
		if (!accessToken) {
			setMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}

		if (!selectedJob) return;
		try {
			await api.put(
				// Change from PATCH to PUT
				`/job/${selectedJob.id}`,
				{
					title: selectedJob.title,
					location: selectedJob.location,
					description: selectedJob.description,
					salary: selectedJob.salary,
					user_id: userId,
				},
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			setMessage("Job updated successfully!");
			setIsToastVisible(true);
			closeModals();
			setJobs((prev) =>
				prev.map((job) => (job.id === selectedJob.id ? selectedJob : job))
			);
		} catch (error) {
			setMessage("Failed to update job.");
		}
	};

	const handleDelete = async () => {
		if (!accessToken) {
			setMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}

		if (!selectedJob) return;
		try {
			await api.delete(`/job/${selectedJob.id}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setMessage("Job deleted successfully!");
			setIsToastVisible(true);
			closeModals();
			setJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
		} catch (error) {
			setMessage("Failed to delete job.");
		}
	};

	const handleDownloadCSV = async () => {
		if (!startDate || !endDate) {
			setMessage("Please select both start and end dates.");
			setIsToastVisible(true);
			return;
		}

		try {
			const res = await api.get("/application?page=1&size=100", {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			const filtered = res.data.items.filter((app: any) => {
				const appliedAt = new Date(app.applied_at);
				return (
					appliedAt >= new Date(startDate) &&
					appliedAt <= new Date(endDate + "T23:59:59")
				);
			});

			const userCache: Record<number, string> = {};
			const jobCache: Record<number, string> = {};

			const csvData = await Promise.all(
				filtered.map(async (app: any) => {
					let fullName = "Unknown";
					let jobTitle = "Unknown";

					if (userCache[app.user_id]) {
						fullName = userCache[app.user_id];
					} else {
						try {
							const userRes = await api.get(`/user/${app.user_id}`, {
								headers: { Authorization: `Bearer ${accessToken}` },
							});
							const u = userRes.data;
							fullName =
								`${u.first_name} ${u.middle_name} ${u.last_name}`.trim();
							userCache[app.user_id] = fullName;
						} catch {
							fullName = "Unavailable";
						}
					}

					if (jobCache[app.job_id]) {
						jobTitle = jobCache[app.job_id];
					} else {
						try {
							const jobRes = await api.get(`/job/${app.job_id}`, {
								headers: { Authorization: `Bearer ${accessToken}` },
							});
							jobTitle = jobRes.data.title;
							jobCache[app.job_id] = jobTitle;
						} catch {
							jobTitle = "Unavailable";
						}
					}

					return [
						fullName,
						app.email,
						app.mobile_number,
						jobTitle,
						app.applied_at,
					];
				})
			);

			const csvHeader =
				"Applicant Name,Email,Mobile Number,Job Title,Applied At\n";
			const csvRows = csvData.map((row) => row.join(","));
			const csvContent = csvHeader + csvRows.join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `applications_${startDate}_to_${endDate}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error("CSV download error:", err);
			setMessage("Failed to download applications.");
			setIsToastVisible(true);
		}
	};

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	} = usePagination(jobs, 10, fetchJobs);

	return (
		<div className="container mx-auto my-8 px-4 flex-1 h-screen">
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
				Jobs You Created
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Manage and track the jobs you've posted.
			</p>
			<div className="flex flex-col items-center justify-center mt-6">
				<p className="text-sm text-gray-700 mb-2">
					Select a date range to download job applications submitted within that
					period.
				</p>
				<div className="flex flex-col md:flex-row gap-4 items-center">
					<div>
						<label className="text-sm mr-2">Start Date:</label>
						<input
							type="date"
							className="border rounded px-2 py-1"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</div>
					<div>
						<label className="text-sm mr-2">End Date:</label>
						<input
							type="date"
							className="border rounded px-2 py-1"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</div>
					<button
						className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
						onClick={handleDownloadCSV}
					>
						Download CSV
					</button>
				</div>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{paginatedData.map((job) => (
					<div
						key={job.id}
						className="border p-4 rounded-xl shadow-md hover:shadow-lg transition bg-white flex flex-col gap-4 w-full max-w-full overflow-hidden"
					>
						{/* Logo and Job Info */}
						<div className="flex gap-4 items-start w-full max-w-full overflow-hidden">
							{job.logo && (
								<div className="h-16 w-16 rounded-full overflow-hidden border shrink-0 bg-gray-100 flex items-center justify-center">
									<img
										src={`${
											import.meta.env.VITE_API_BASE_URL_IMG
										}/public/logos/${job.logo}`}
										alt={`${job.title} logo`}
										className="h-full w-full object-cover"
									/>
								</div>
							)}

							<div className="flex flex-col overflow-hidden w-full">
								<h3 className="text-xl font-bold text-gray-800 break-words">
									{job.title}
								</h3>

								<p className="text-gray-600 break-words">
									<span className="font-semibold">Company:</span> {job.company}
								</p>

								<p className="text-gray-600 break-words">
									<span className="font-semibold">Location:</span>{" "}
									{job.location}
								</p>

								<p className="text-gray-600 break-words">
									<span className="font-semibold">Description:</span>{" "}
									{job.description.length > 100
										? `${job.description.slice(0, 100)}...`
										: job.description}
								</p>

								<p className="text-gray-600 break-words">
									<span className="font-semibold">Salary:</span> {job.salary}
								</p>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-2 mt-2">
							<button
								onClick={() => openEditModal(job)}
								className="bg-[#ff7409] text-white px-4 py-2 rounded-lg hover:bg-[#e06700] transition w-full sm:w-auto"
							>
								Edit
							</button>
							<button
								onClick={() =>
									navigate(`/jobs/applications/${job.id}`, {
										state: { jobTitle: job.title },
									})
								}
								className="bg-[#ff7409] text-white px-4 py-2 rounded-lg hover:bg-[#e06700] transition w-full sm:w-auto"
							>
								View Applications
							</button>
							<button
								onClick={() => openDeleteModal(job)}
								className="text-gray-500 hover:text-red-500 text-xl transition w-full sm:w-auto"
								title="Delete Job"
							>
								🗑
							</button>
						</div>
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
			{/* Edit Modal */}
			{isEditModalOpen && selectedJob && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
					<div className="bg-white p-6 rounded-lg w-96 shadow-lg">
						<h3 className="text-lg font-bold text-center text-[#ff7409]">
							Edit Job
						</h3>

						<div className="mt-4">
							<label className="block text-gray-700 font-semibold">
								Job Title
							</label>
							<input
								type="text"
								className="w-full border p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7409]"
								value={selectedJob.title}
								onChange={(e) =>
									setSelectedJob({ ...selectedJob, title: e.target.value })
								}
							/>
						</div>

						<div className="mt-4">
							<label className="block text-gray-700 font-semibold">
								Location
							</label>
							<input
								type="text"
								className="w-full border p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7409]"
								value={selectedJob.location}
								onChange={(e) =>
									setSelectedJob({ ...selectedJob, location: e.target.value })
								}
							/>
						</div>

						<div className="mt-4">
							<label className="block text-gray-700 font-semibold">
								Description
							</label>
							<textarea
								className="w-full border p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7409] resize-none"
								rows={3}
								value={selectedJob.description}
								onChange={(e) =>
									setSelectedJob({
										...selectedJob,
										description: e.target.value,
									})
								}
							></textarea>
						</div>

						<div className="mt-4">
							<label className="block text-gray-700 font-semibold">
								Salary
							</label>
							<input
								type="text"
								className="w-full border p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7409]"
								value={selectedJob.salary}
								onChange={(e) =>
									setSelectedJob({ ...selectedJob, salary: e.target.value })
								}
							/>
						</div>

						<div className="flex justify-end mt-6">
							<button
								onClick={handleUpdate}
								className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
							>
								Update
							</button>
							<button
								onClick={closeModals}
								className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Delete Modal */}
			{isDeleteModalOpen && selectedJob && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
					<div className="bg-white p-6 rounded-lg w-96 shadow-lg">
						<h3 className="text-lg font-bold text-red-600">Confirm Delete</h3>
						<p className="text-gray-700">
							Are you sure you want to delete "{selectedJob.title}"?
						</p>
						<button
							onClick={handleDelete}
							className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
						>
							Delete
						</button>
						<button
							onClick={closeModals}
							className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostedJobs;
