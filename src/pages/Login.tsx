import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAutoHideToast } from "../hooks/useAutoHideToast";
import axios from "axios";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [isToastVisible, setIsToastVisible] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	// Automatically hide toast after 3 seconds
	useAutoHideToast(isToastVisible, setIsToastVisible);

	useEffect(() => {
		if (location.state?.message) {
			setSuccessMessage(location.state.message);
			setIsToastVisible(true);
			navigate(location.pathname, { replace: true, state: { message: null } });
		}
	}, [location.state, navigate]);

	const closeToast = () => setIsToastVisible(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Logging in:", formData);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/v1/auth/login/token",
				formData,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			);
			const { access_token, user_id } = response.data;
			localStorage.setItem("token", access_token);
			localStorage.setItem("user_id", user_id);

			navigate("/", { state: { message: "Login Successful!" } });
		} catch (error) {
			setSuccessMessage("");
			setErrorMessage("Invalid username or password.");
			setIsToastVisible(true);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				{/* toast */}

				{isToastVisible && errorMessage && (
					<div
						id="toast-danger"
						className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow mx-auto"
						role="alert"
					>
						<div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
							</svg>
							<span className="sr-only">Error icon</span>
						</div>
						<div className="ms-3 text-sm font-normal">{errorMessage}</div>
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

				{isToastVisible && successMessage && (
					<div
						id="toast-danger"
						className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow mx-auto"
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
						<div className="ms-3 text-sm font-normal">{successMessage}</div>
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

				{/* end toast */}

				<h2 className="text-2xl font-bold text-center text-[#ff7409]">Login</h2>
				<p className="text-gray-600 text-center mb-4">
					Sign in to your account
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">Username</label>
						<input
							type="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Password</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div className="flex justify-between text-sm">
						<Link
							to="/reset-password"
							className="text-[#ff7409] hover:underline"
						>
							Forgot Password?
						</Link>
						<Link to="/register" className="text-[#ff7409] hover:underline">
							Create an account
						</Link>
					</div>

					<button
						type="submit"
						className="w-full bg-[#ff7409] text-white py-2 rounded hover:bg-[#e66508] transition"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
