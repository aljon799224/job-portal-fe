import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import Jobs from "./pages/job/Job";
import JobsApplied from "./pages/job/JobsApplied";
import SavedJobs from "./pages/SavedJobs";
import PostedJobs from "./pages/job/MyJobs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import Profile from "./pages/Profile";
import ProtectedRoute from "./authentication/ProtectedRoute";
import JobCreate from "./pages/job/JobCreate";
import ApplicationsList from "./pages/job/ApplicationList";

function App() {
	const router = createBrowserRouter([
		{
			path: "*",
			element: <NotFound />, // Create a NotFoundPage component
		},
		{
			path: "/not-authorize",
			element: <NotAuthorized />, // Create a NotFoundPage component
		},
		{
			path: "/register",
			element: <Register />,
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/reset-password",
			element: <ResetPassword />,
		},
		{
			path: "/",
			element: <ProtectedRoute element={<Root />} />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: "jobs",
					element: <Jobs />,
				},
				{
					path: "jobs/applications/:jobId",
					element: <ApplicationsList />,
				},
				{
					path: "post-job",
					element: <JobCreate />,
				},
				{
					path: "jobs-applied",
					element: <JobsApplied />,
				},
				{
					path: "save-jobs",
					element: <SavedJobs />,
				},
				{
					path: "jobs-created",
					element: <PostedJobs />,
				},
				{
					path: "profile",
					element: <Profile />,
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
