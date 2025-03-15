import React from "react";

const JobsApplied: React.FC = () => {
	const appliedJobs = [
		{
			title: "Software Engineer",
			company: "Tech Corp",
			status: "Under Review",
		},
		{
			title: "Frontend Developer",
			company: "Web Solutions",
			status: "Pending",
		},
		{
			title: "Backend Developer",
			company: "Code Masters",
			status: "Interview Scheduled",
		},
	];

	return (
		<div className="container mx-auto my-8 px-4 flex-1">
			<h2 className="text-3xl font-bold text-center text-[#ff7409]">
				Jobs You've Applied For
			</h2>
			<p className="text-center text-gray-600 mt-2">
				Track the status of your job applications.
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{appliedJobs.map((job, index) => (
					<div
						key={index}
						className="border p-4 rounded shadow hover:shadow-lg transition"
					>
						<h3 className="text-xl font-bold">{job.title}</h3>
						<p className="text-gray-600">{job.company}</p>
						<p className="mt-2 text-sm font-semibold">Status: {job.status}</p>
						<button className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded">
							View Details
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default JobsApplied;
