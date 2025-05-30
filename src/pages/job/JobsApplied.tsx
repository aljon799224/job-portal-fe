import React, { useEffect, useState } from "react";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
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

const JobsApplied: React.FC = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [isToastVisible, setIsToastVisible] = useState(false);
	const accessToken = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id");

	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);

	const fetchAppliedJobs = async () => {
		if (!accessToken || !userId) {
			setMessage("Not authenticated");
			setIsToastVisible(true);
			throw new Error("Not authenticated");
		}

		try {
			const response = await api.get(`/jobs/applied/${userId}?page=1&size=50`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setJobs(response.data.items);
		} catch (err) {
			setMessage("Failed to load applied jobs. Please try again.");
		} finally {
			console.log("done");
		}
	};

	useEffect(() => {
		fetchAppliedJobs();
	}, [userId]);

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

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToNextPage,
		goToPreviousPage,
	} = usePagination(jobs, 10, fetchAppliedJobs);

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
				Jobs You've Applied For
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Track the status of your job applications.
			</p>
			{jobs.length === 0 ? (
				<p className="text-center text-gray-500 mt-4">No applied jobs found.</p>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
					{paginatedData.map((job: any, index: any) => (
						<div
							key={index}
							className="border p-4 rounded shadow hover:shadow-lg transition"
						>
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
								className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded"
							>
								View Details
							</button>
						</div>
					))}
				</div>
			)}
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

export default JobsApplied;
