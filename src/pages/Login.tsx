import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Logging in:", formData);
		// TODO: Connect to backend API
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-[#ff7409]">Login</h2>
				<p className="text-gray-600 text-center mb-4">
					Sign in to your account
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
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
