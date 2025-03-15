const HomePage = () => {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero Section */}
			<header className="relative text-white text-center py-50 bg-[#ffb380]">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-50"
					style={{ backgroundImage: "url('/src/assets/municipal-bg.jpeg')" }}
				></div>
				<div className="relative z-10">
					<h2 className="text-3xl md:text-5xl font-bold">
						Find Your Job here in Peso Calumpit
					</h2>
					<p className="mt-4 text-lg">
						Find the perfect job from a wide range of opportunities.
					</p>
				</div>
			</header>

			{/* Job Listings */}
			<main className="container mx-auto my-8 px-4 flex-1">
				<h3 className="text-2xl font-semibold mb-4">Latest Jobs</h3>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((job) => (
						<div
							key={job}
							className="border p-4 rounded shadow hover:shadow-lg transition"
						>
							<h4 className="text-xl font-bold">Software Engineer</h4>
							<p className="text-gray-600">Company Name</p>
							<p className="mt-2 text-sm">Location: Remote</p>
							<button className="mt-4 bg-[#ff7409] text-white px-4 py-2 rounded">
								Apply Now
							</button>
						</div>
					))}
				</div>
			</main>
		</div>
	);
};

export default HomePage;
