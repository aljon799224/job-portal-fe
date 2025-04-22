import React, { useState } from "react";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function SendOtp() {
	const [email, setEmail] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/send-otp", { email });
			setSuccessMessage(response.data.message || "OTP sent to your email.");
			navigate("/reset-password-main", {
				state: { email: email, message: "OTP sent to your email" },
			});
			setErrorMessage("");
		} catch (error: any) {
			setSuccessMessage("");
			setErrorMessage(error.response?.data?.message || "Failed to send OTP.");
		} finally {
			setIsToastVisible(true);
		}
	};

	const closeToast = () => setIsToastVisible(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				{/* toast */}
				{isToastVisible && (errorMessage || successMessage) && (
					<div
						id="toast"
						className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow mx-auto ${
							errorMessage ? "text-red-500" : "text-green-500"
						}`}
						role="alert"
					>
						<div
							className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
								errorMessage
									? "text-red-500 bg-red-100"
									: "text-green-500 bg-green-100"
							}`}
						>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								{errorMessage ? (
									<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
								) : (
									<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
								)}
							</svg>
						</div>
						<div className="ms-3 text-sm font-normal">
							{errorMessage || successMessage}
						</div>
						<button
							type="button"
							onClick={closeToast}
							className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 h-8 w-8 inline-flex items-center justify-center"
							aria-label="Close"
						>
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

				{/* title */}
				<h2 className="text-2xl font-bold text-center text-[#ff7409]">
					Send OTP
				</h2>
				<p className="text-gray-600 text-center mb-4">
					We'll send a code to your email
				</p>

				<form onSubmit={handleSendOTP} className="space-y-6">
					<div>
						<label className="text-sm text-gray-700">Email</label>
						<input
							type="email"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-[#ff7409] text-white py-2 px-4 rounded hover:bg-[#e66508] transition text-sm font-semibold"
					>
						Send OTP
					</button>
				</form>
			</div>
		</div>
	);
}
