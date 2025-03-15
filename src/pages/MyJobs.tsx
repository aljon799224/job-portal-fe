import React from "react";

const PostedJobs: React.FC = () => {
	const myJobs = [
		{
			title: "React Developer",
			company: "My Company",
			applicants: 12,
			status: "Open",
		},
		{
			title: "Backend Engineer",
			company: "My Startup",
			applicants: 8,
			status: "Closed",
		},
		{
			title: "Data Scientist",
			company: "Innovate AI",
			applicants: 5,
			status: "Open",
		},
	];

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			<h2 className="text-3xl font-bold text-center text-[#ff7409]">
				Jobs You Created
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Manage and track the jobs you've posted.
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{myJobs.map((job, index) => (
					<div
						key={index}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="text-gray-600">{job.company}</p>
						<p className="mt-2 text-sm">Applicants: {job.applicants}</p>
						<p className="mt-1 text-sm font-semibold">Status: {job.status}</p>
						<div className="flex justify-between items-center mt-4">
							<button className="bg-[#ff7409] text-white px-4 py-2 rounded">
								Edit
							</button>
							<button className="text-gray-500 hover:text-red-500 transition">
								🗑 Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default PostedJobs;
