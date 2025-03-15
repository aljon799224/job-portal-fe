import React from "react";

const SavedJobs: React.FC = () => {
	const savedJobs = [
		{
			title: "UI/UX Designer",
			company: "Creative Solutions",
			location: "Remote",
		},
		{
			title: "Full Stack Developer",
			company: "Innovate Tech",
			location: "San Francisco",
		},
		{ title: "Marketing Manager", company: "BrandCo", location: "New York" },
	];

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			<h2 className="text-3xl font-bold text-center text-[#ff7409]">
				Saved Jobs
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Your favorite job listings, saved for later.
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{savedJobs.map((job, index) => (
					<div
						key={index}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="text-gray-600">{job.company}</p>
						<p className="mt-2 text-sm">Location: {job.location}</p>
						<div className="flex justify-between items-center mt-4">
							<button className="bg-[#ff7409] text-white px-4 py-2 rounded">
								Apply Now
							</button>
							<button className="text-gray-500 hover:text-red-500 transition">
								🗑 Remove
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SavedJobs;
