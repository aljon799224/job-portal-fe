import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import api from "../axios";

interface ResetFormData {
	email: string;
	otp: string;
	newPassword: string;
}

export default function ResetPasswordWithOTP() {
	const [formData, setFormData] = useState<ResetFormData>({
		email: "",
		otp: "",
		newPassword: "",
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	useAutoHideToast(isToastVisible, setIsToastVisible);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			const response = await api.post("/reset-password-otp", {
				email: formData.email,
				otp: formData.otp,
				new_password: formData.newPassword,
			});

			setSuccessMessage(response.data.message || "Password reset successful!");
			setIsToastVisible(true);
			navigate("/login", {
				state: { message: "Password updated successfully!" },
			});
		} catch (error: any) {
			setErrorMessage(
				error?.response?.data?.message || "Something went wrong."
			);
			setIsToastVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center font-[sans-serif] min-h-screen p-4 bg-gray-50">
			{isToastVisible && (errorMessage || successMessage) && (
				<div
					className={`flex items-center w-full max-w-xs p-4 mb-6 rounded-lg shadow-md mx-auto transition-all duration-300 ${
						errorMessage ? "bg-white text-red-600" : "bg-white text-green-600"
					}`}
					role="alert"
				>
					<span className="text-sm font-medium">
						{errorMessage || successMessage}
					</span>
				</div>
			)}

			<div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white shadow-sm">
				<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Reset Password
				</h1>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							name="email"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="otp"
							className="block text-sm font-medium text-gray-700"
						>
							OTP
						</label>
						<input
							id="otp"
							type="text"
							name="otp"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
							placeholder="Enter OTP"
							value={formData.otp}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="newPassword"
							className="block text-sm font-medium text-gray-700"
						>
							New Password
						</label>
						<input
							id="newPassword"
							type="password"
							name="newPassword"
							className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
							placeholder="Enter new password"
							value={formData.newPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 disabled:opacity-50"
						disabled={loading}
					>
						{loading ? "Resetting..." : "Reset Password"}
					</button>
				</form>
			</div>
		</div>
	);
}
