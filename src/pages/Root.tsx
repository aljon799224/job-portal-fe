import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

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
