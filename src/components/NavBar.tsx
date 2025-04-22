import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [jobsDropdown, setJobsDropdown] = useState(false);
	const [accountDropdown, setAccountDropdown] = useState(false);

	const navigate = useNavigate();

	const username = localStorage.getItem("username");

	// Refs for detecting clicks outside dropdowns
	const jobsRef = useRef<HTMLLIElement>(null);
	const accountRef = useRef<HTMLLIElement>(null);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				jobsRef.current &&
				!jobsRef.current.contains(event.target as Node) &&
				accountRef.current &&
				!accountRef.current.contains(event.target as Node)
			) {
				setJobsDropdown(false);
				setAccountDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		// Clear the token from localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("user_id");
		localStorage.removeItem("username");

		// Redirect to the login page
		navigate("/login");
	};

	// Function to close all dropdowns
	const closeDropdowns = () => {
		setJobsDropdown(false);
		setAccountDropdown(false);
	};

	return (
		<>
			{/* Navbar */}
			<nav className="bg-[#ff7409] text-white p-4 relative z-50">
				<div className="container mx-auto flex justify-between items-center">
					{/* Logo */}
					<div className="flex items-center space-x-2">
						<img
							src="/src/assets/peso-logo.png"
							alt="JobPortal Logo"
							className="h-12 w-12 md:h-16 md:w-16"
						/>
						<h1 className="text-2xl md:text-3xl font-bold">
							Peso Calumpit Job Portal
						</h1>
					</div>

					{/* Desktop Navbar */}
					<ul className="hidden md:flex space-x-6">
						<li>
							<Link
								to="/"
								className="hover:text-gray-200 transition"
								onClick={closeDropdowns}
							>
								Home
							</Link>
						</li>

						{/* Jobs Dropdown */}
						<li ref={jobsRef} className="relative">
							<button
								onClick={() => {
									setJobsDropdown(!jobsDropdown);
									setAccountDropdown(false);
								}}
								className="hover:text-gray-200 transition"
							>
								Jobs ▼
							</button>
							{jobsDropdown && (
								<ul className="absolute left-0 mt-2 w-48 bg-white text-black border rounded shadow-lg z-50">
									{username !== "admin" && (
										<>
											<li>
												<Link
													to="/jobs"
													className="block px-4 py-2 hover:bg-gray-100"
													onClick={closeDropdowns}
												>
													Browse Jobs
												</Link>
											</li>
											<li>
												<Link
													to="/jobs-applied"
													className="block px-4 py-2 hover:bg-gray-100"
													onClick={closeDropdowns}
												>
													Jobs Applied
												</Link>
											</li>
											<li>
												<Link
													to="/save-jobs"
													className="block px-4 py-2 hover:bg-gray-100"
													onClick={closeDropdowns}
												>
													Saved Jobs
												</Link>
											</li>
										</>
									)}
									{username === "admin" && (
										<>
											<li>
												<Link
													to="/jobs-created"
													className="block px-4 py-2 hover:bg-gray-100"
													onClick={closeDropdowns}
												>
													My Jobs
												</Link>
											</li>
										</>
									)}
								</ul>
							)}
						</li>

						{username === "admin" && (
							<>
								<li>
									<Link
										to="/post-job"
										className="hover:text-gray-200 transition"
										onClick={closeDropdowns}
									>
										Post a Job
									</Link>
								</li>
							</>
						)}

						{/* Account Dropdown */}
						<li ref={accountRef} className="relative">
							<button
								onClick={() => {
									setAccountDropdown(!accountDropdown);
									setJobsDropdown(false);
								}}
								className="hover:text-gray-200 transition"
							>
								Account ▼
							</button>
							{accountDropdown && (
								<ul className="absolute right-0 mt-2 w-40 bg-white text-black border rounded shadow-lg z-50">
									<li>
										<Link
											to="/profile"
											className="block px-4 py-2 hover:bg-gray-100"
											onClick={closeDropdowns}
										>
											Profile
										</Link>
									</li>
									<li>
										<Link
											to="javascript:void(0)"
											className="block px-4 py-2 hover:bg-gray-100"
											onClick={handleLogout}
										>
											Logout
										</Link>
									</li>
								</ul>
							)}
						</li>
					</ul>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden px-3 py-1 bg-white text-[#ff7409] rounded"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						Menu
					</button>
				</div>

				{/* Mobile Menu */}
				{menuOpen && (
					<ul className="md:hidden mt-2 bg-[#ff7409] p-4 space-y-2 text-center z-50">
						<li>
							<Link
								to="/"
								className="block text-white hover:underline"
								onClick={() => setMenuOpen(false)}
							>
								Home
							</Link>
						</li>
						{username !== "admin" && (
							<>
								<li>
									<Link
										to="/jobs"
										className="block text-white hover:underline"
										onClick={() => setMenuOpen(false)}
									>
										Jobs
									</Link>
								</li>
								<li>
									<Link
										to="/jobs-applied"
										className="block text-white hover:underline"
										onClick={() => setMenuOpen(false)}
									>
										Jobs Applied
									</Link>
								</li>
								<li>
									<Link
										to="/save-jobs"
										className="block text-white hover:underline"
										onClick={() => setMenuOpen(false)}
									>
										Saved Jobs
									</Link>
								</li>
							</>
						)}

						{username === "admin" && (
							<>
								<li>
									<Link
										to="/jobs-created"
										className="block text-white hover:underline"
										onClick={() => setMenuOpen(false)}
									>
										My Jobs
									</Link>
								</li>
								<li>
									<Link
										to="/post-job"
										className="block text-white hover:underline"
										onClick={() => setMenuOpen(false)}
									>
										Post a Job
									</Link>
								</li>
							</>
						)}
						<li>
							<Link
								to="/profile"
								className="block text-white hover:underline"
								onClick={() => setMenuOpen(false)}
							>
								Profile
							</Link>
						</li>
						<li>
							<Link
								to="/logout"
								className="block text-white hover:underline"
								onClick={() => setMenuOpen(false)}
							>
								Logout
							</Link>
						</li>
					</ul>
				)}
			</nav>
		</>
	);
};

export default NavBar;
