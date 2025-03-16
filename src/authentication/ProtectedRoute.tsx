import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }: { element: any }) {
	const token = localStorage.getItem("token");

	if (!token) {
		// Redirect to login if no token exists
		return <Navigate to="/login" replace />;
	}

	// Render the protected element if authenticated
	return element;
}

export default ProtectedRoute;
