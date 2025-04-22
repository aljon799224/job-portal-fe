import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

const Register: React.FC = () => {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const [formData, setFormData] = useState({
		userName: "",
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const closeToast = () => setIsToastVisible(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setErrorMessage("Password do not match.");
			setIsToastVisible(true);
			return;
		}

		try {
			const backendPayload = {
				username: formData.userName,
				email: formData.email,
				first_name: formData.firstName,
				middle_name: formData.middleName,
				last_name: formData.lastName,
				password: formData.password,
			};

			const response = await api.post("/user", backendPayload);

			console.log(response);
			navigate("/login", { state: { message: "Registration Successful!" } });
		} catch (error: any) {
			setErrorMessage(
				"The username and password must be unique. Please ensure they are not already in use or verify your internet connection and try again."
			);
			setIsToastVisible(true);
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				{/* toast */}

				{isToastVisible && (
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

				{/* end toast */}
				<h2 className="text-2xl font-bold text-center text-[#ff7409]">
					Register
				</h2>
				<p className="text-gray-600 text-center mb-4">
					Create an account to get started
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">Username</label>
						<input
							type="text"
							name="userName"
							value={formData.userName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">First Name</label>
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Middle Name</label>
						<input
							type="text"
							name="middleName"
							value={formData.middleName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Last Name</label>
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium">Email Address</label>
						<input
							type="email"
							name="email"
							value={formData.email}
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

					<div>
						<label className="block text-sm font-medium">
							Confirm Password
						</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-[#ff7409] text-white py-2 rounded hover:bg-[#e66508] transition"
					>
						Register
					</button>
				</form>

				<p className="text-sm text-center mt-4">
					Already have an account?{" "}
					<a href="/login" className="text-[#ff7409] hover:underline">
						Login here
					</a>
				</p>
			</div>
		</div>
	);
};

export default Register;
