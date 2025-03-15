import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar";
import Footer from "../components/Footer";

const Root: React.FC = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<NavBar />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Root;
