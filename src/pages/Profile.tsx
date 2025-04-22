import React, { useState, useEffect } from "react";
import api from "../axios";

const Profile: React.FC = () => {
	const [userData, setUserData] = useState({
		first_name: "",
		middle_name: "",
		last_name: "",
		email: "",
		username: "",
	});
	const [editing, setEditing] = useState(false);
	const [message, setMessage] = useState("");
	const accessToken = localStorage.getItem("token");
	const userId = localStorage.getItem("user_id")
		? parseInt(localStorage.getItem("user_id")!)
		: null;

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.get(`/user/${userId}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				setUserData(response.data);
			} catch (error) {
				setMessage("Failed to fetch profile.");
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (userData.username.trim() === "") {
			setMessage("Username cannot be empty.");
			return;
		}

		try {
			console.log(userData);
			const response = await api.put(`/user/${userId}`, userData, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			console.log(response);
			setMessage("Profile updated successfully!");
			setEditing(false);
		} catch (error) {
			setMessage("Failed to update profile.");
		}
	};

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			{message && <p className="text-center text-green-600">{message}</p>}

			<h2 className="text-3xl font-bold text-center text-[#ff7409]">Profile</h2>

			<form className="max-w-lg mx-auto mt-6 bg-white p-6 shadow-lg rounded">
				{/* First Name */}
				<div className="mb-4">
					<label className="block font-semibold">First Name</label>
					<input
						type="text"
						name="first_name"
						value={userData.first_name}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						disabled={!editing}
					/>
				</div>

				{/* Middle Name */}
				<div className="mb-4">
					<label className="block font-semibold">Middle Name</label>
					<input
						type="text"
						name="middle_name"
						value={userData.middle_name}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						disabled={!editing}
					/>
				</div>

				{/* Last Name */}
				<div className="mb-4">
					<label className="block font-semibold">Last Name</label>
					<input
						type="text"
						name="last_name"
						value={userData.last_name}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						disabled={!editing}
					/>
				</div>

				{/* Email */}
				<div className="mb-4">
					<label className="block font-semibold">Email</label>
					<input
						type="email"
						name="email"
						value={userData.email}
						className="w-full p-2 border rounded bg-gray-100"
						disabled
					/>
				</div>

				{/* Username */}
				<div className="mb-4">
					<label className="block font-semibold">Username</label>
					<input
						type="text"
						name="username"
						value={userData.username}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						disabled={!editing}
					/>
				</div>

				{/* Action Buttons */}
				<div className="mt-6 flex justify-center space-x-4">
					{editing ? (
						<>
							<button
								type="button"
								onClick={handleSave}
								className="bg-[#ff7409] text-white px-4 py-2 rounded w-full hover:bg-orange-600"
							>
								Save Changess
							</button>
							<button
								type="button"
								onClick={() => setEditing(false)}
								className="bg-gray-400 text-white px-4 py-2 rounded w-full hover:bg-gray-500"
							>
								Cancel
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => setEditing(true)}
							className="bg-gray-700 text-white px-4 py-2 rounded w-full hover:bg-gray-900"
						>
							Edit Profile
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default Profile;
