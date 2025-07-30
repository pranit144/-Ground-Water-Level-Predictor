import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HomePage from "./pages/Home/HomePage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import Auth from "./components/layouts/Auth.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import MainLayout from "./components/layouts/MainLayout.jsx";
import Analysis from "./pages/Analysis/AnalysisPage.jsx";
import Info from "./pages/Info/InfoPage.jsx";
import About from "./pages/About/AboutPage.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import OptimalGWSuggestor from "./pages/GroundWater/OptimalGWSuggestor.jsx";
import FeedBackPage from "./pages/Feedback/FeedBackPage.jsx";

// Import ThemeContext
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import GroundwaterPredictor from "./pages/GroundWater/GroundwaterPredictor.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ path: "home", element: <HomePage /> },
			{ path: "groundwater/level_predict", element: <GroundwaterPredictor /> },
			{
				path: "groundwater/optimal_groundwater",
				element: <OptimalGWSuggestor />,
			},
			{ path: "analysis", element: <Analysis /> },
			{ path: "info", element: <Info /> },
			{ path: "about", element: <About /> },
			{ path: "contact", element: <Contact /> },
			{ path: "users/:userId/feedback", element: <FeedBackPage /> },
			{ path: "/", element: <HomePage />, index: true },
		],
	},
	{
		path: "/auth",
		element: <Auth />,
		children: [
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
		],
	},
]);

// App component using ThemeContext and MuiThemeProvider
const AppContent = () => {
	const { theme } = useContext(ThemeContext);

	// Define MUI theme based on the context theme
	const muiTheme = createTheme({
		palette: {
			mode: theme === "light" ? "light" : "dark",
		},
	});

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			<div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
				{/* Tailwind CSS and MUI components will share the theme */}
				<RouterProvider router={router} />
			</div>
		</MuiThemeProvider>
	);
};

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AppContent />
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default App;
