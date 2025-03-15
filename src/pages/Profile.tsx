import { useState } from "react";

const Profile: React.FC = () => {
	const [name, setName] = useState("John Doe");
	const [email, setEmail] = useState("johndoe@example.com");
	const [bio, setBio] = useState("Software Developer at Peso Calumpit.");
	const [profilePic, setProfilePic] = useState(
		"/src/assets/default-avatar.png"
	);
	const [editing, setEditing] = useState(false);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const imageUrl = URL.createObjectURL(file);
			setProfilePic(imageUrl);
		}
	};

	const handleSave = () => {
		// Simulate saving data (In real case, send to API)
		setEditing(false);
		alert("Profile updated successfully!");
	};

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			<h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

			{/* Profile Picture */}
			<div className="flex flex-col items-center mb-6">
				<img
					src={profilePic}
					alt="Profile"
					className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
				/>
				{editing && (
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="mt-2 text-sm"
					/>
				)}
			</div>

			{/* Profile Form */}
			<div className="space-y-4">
				{/* Name */}
				<div>
					<label className="block font-medium">Full Name</label>
					{editing ? (
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					) : (
						<p className="p-2 bg-gray-100 rounded-md">{name}</p>
					)}
				</div>

				{/* Email */}
				<div>
					<label className="block font-medium">Email</label>
					<p className="p-2 bg-gray-100 rounded-md">{email}</p>
				</div>

				{/* Bio */}
				<div>
					<label className="block font-medium">Bio</label>
					{editing ? (
						<textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="w-full p-2 border rounded-md"
						/>
					) : (
						<p className="p-2 bg-gray-100 rounded-md">{bio}</p>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-6 flex justify-between">
				{editing ? (
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-[#ff7409] text-white rounded-md hover:bg-orange-600 transition"
					>
						Save Changes
					</button>
				) : (
					<button
						onClick={() => setEditing(true)}
						className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition"
					>
						Edit Profile
					</button>
				)}
			</div>
		</div>
	);
};

export default Profile;
