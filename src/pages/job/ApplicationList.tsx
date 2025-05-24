import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAutoHideToast } from "../../hooks/useAutoHideToast";
import api from "../../axios";

interface Application {
	email: number;
	resume: string;
	mobile_number: string;
	expected_salary: string;
}

const ApplicationsList: React.FC = () => {
	const { jobId } = useParams<{ jobId: string }>();

	const [applications, setApplications] = useState<Application[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [isToastVisible, setIsToastVisible] = useState(false);

	const accessToken = localStorage.getItem("token");
	const location = useLocation();

	const jobTitle = location.state?.jobTitle || "Applications";

	useAutoHideToast(isToastVisible, setIsToastVisible);

	const closeToast = () => setIsToastVisible(false);
	useEffect(() => {
		const fetchApplications = async () => {
			if (!accessToken) {
				setMessage("Not authenticated");
				setIsToastVisible(true);
				throw new Error("Not authenticated");
			}
			try {
				const response = await api.get(
					`/application/job/${jobId}?page=1&size=50`,
					{ headers: { Authorization: `Bearer ${accessToken}` } }
				);
				setApplications(response.data.items || []);
			} catch (err) {
				setError("Failed to fetch applications");
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, [jobId]);

	const handleDownloadResume = async (filePath: string) => {
		if (!filePath) {
			setMessage("Resume not available");
			setIsToastVisible(true);
			return;
		}

		if (!accessToken) {
			setMessage("Not authenticated");
			setIsToastVisible(true);
			return;
		}

		// Extract only the filename from the path
		const filename = filePath.split("/").pop(); // ✅ This ensures only the filename is sent

		try {
			const encodedFilename = encodeURIComponent(filename!);
			const response = await api.get(
				`/application/download/${encodedFilename}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", filename!);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			setMessage("Failed to download resume");
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
				Applications for Job {jobTitle}
			</h2>
			{loading ? (
				<p className="text-center">Loading applications...</p>
			) : error ? (
				<p className="text-center text-red-600">{error}</p>
			) : applications.length === 0 ? (
				<p className="text-center">No applications found.</p>
			) : (
				<ul className="mt-6 space-y-4">
					{applications.map((app, index) => (
						<li key={index} className="p-4 bg-white shadow rounded">
							<p>Email: {app.email}</p>
							<p>Mobile Number: {app.mobile_number}</p>
							<p>
								Resume:{" "}
								{app.resume ? (
									// 🔽 Button for downloading the resume
									<button
										onClick={() => handleDownloadResume(app.resume)}
										className="text-blue-500 underline hover:text-blue-700"
									>
										Download Resume
									</button>
								) : (
									<span className="text-gray-400">No resume uploaded</span>
								)}
							</p>
						</li>
					))}
				</ul>
			)}
			<button
				onClick={() => navigate("/jobs-created")}
				className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
			>
				Back to Posted Jobs
			</button>
		</div>
	);
};

export default ApplicationsList;
