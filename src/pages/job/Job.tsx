import React from "react";

const Jobs: React.FC = () => {
	const jobs = [
		{ title: "Software Engineer", company: "Tech Corp", location: "Remote" },
		{
			title: "Frontend Developer",
			company: "Web Solutions",
			location: "New York",
		},
		{
			title: "Backend Developer",
			company: "Code Masters",
			location: "San Francisco",
		},
		{ title: "Project Manager", company: "BizTech", location: "Chicago" },
		{ title: "Data Analyst", company: "Analytics Co.", location: "Remote" },
	];

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			<h2 className="text-3xl font-bold text-center text-[#ff7409]">
				Job Listings
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Explore exciting career opportunities.
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{jobs.map((job, index) => (
					<div
						key={index}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="text-gray-600">{job.company}</p>
						<p className="mt-2 text-sm">Location: {job.location}</p>
						<button className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded">
							Apply Now
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Jobs;
