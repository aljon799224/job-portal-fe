import React, { useState } from "react";

const Register: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Registering user:", formData);
		// TODO: Connect to backend API
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-[#ff7409]">
					Register
				</h2>
				<p className="text-gray-600 text-center mb-4">
					Create an account to get started
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">Full Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
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
