import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
	const { token } = useParams(); // Get reset token from URL
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		// TODO: Call backend API to reset password
		console.log("Resetting password with token:", token, formData.password);

		// Redirect to login after successful reset
		navigate("/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-[#ff7409]">
					Reset Password
				</h2>
				<p className="text-gray-600 text-center mb-4">
					Enter your new password
				</p>

				{error && <p className="text-red-500 text-center">{error}</p>}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">New Password</label>
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
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
