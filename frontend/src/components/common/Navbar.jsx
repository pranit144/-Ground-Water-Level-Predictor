import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useTokenStore from "../../store/userTokenStore";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MOEImage from "../../assets/image/ministry-of-education.png";
import CGWBImage from "../../assets/image/cgwb-updated-logo.png";
import SIHLogo from "../../assets/image/SIH-Logo.png";
import sun from "../../assets/image/sun.png";
import moon from "../../assets/image/moon.png";
import { useMediaQuery } from "@mui/material";

import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";

const pages = [
	{ name: "Home", path: "/home" },
	{ name: "Predict", path: "/groundwater/level_predict" },
	{ name: "Analysis", path: "/analysis" },
	{ name: "Info", path: "/info" },
	{ name: "About", path: "/about" },
	{ name: "Contact", path: "/contact" },
	{ name: "Feedback", path: "/users/:id/feedback" },
];

const settings = ["Profile", "Feedback", "Dashboard", "Logout"];

const Navbar = () => {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const isSmallScreen = useMediaQuery("(max-width:600px)");

	const { token, setToken, userId, setUserId } = useTokenStore(
		(state) => state
	);

	const { theme, toggleTheme } = React.useContext(ThemeContext);

	React.useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	});
	const navigate = useNavigate();

	const handleLogout = () => {
		console.log("Logging out!..");
		setToken("");
		setUserId("");
	};

	const handleProfile = () => {
		console.log("Profile clicked");
	};

	const handleFeedback = () => {
		if (userId) {
			navigate(`/users/${userId}/feedback`);
		} else {
			console.error("User ID is not available");
			toast.error("User ID is not available", {
				autoClose: 3000,
			});
		}
	};

	const handleDashboard = () => {
		console.log("Dashboard clicked");
	};

	const settingsHandlers = {
		Profile: handleProfile,
		Feedback: handleFeedback,
		Dashboard: handleDashboard,
		Logout: handleLogout,
	};

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar
			position="sticky"
			sx={{
				backgroundColor: theme === "light" ? "white" : "#1a202c",
				boxShadow: "none",
				borderBottom: `1px solid ${theme === "light" ? "#E0E0E0" : "#4a5568"}`,
				zIndex: 1100,
			}}
			className={theme === "dark" ? "dark" : ""}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
					{/* Logo Section for Desktop */}
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							alignItems: "center",
							gap: "1rem",
							padding: "0.5rem",
							marginRight: "3rem",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "1rem",
							}}
						>
							<img
								src={MOEImage}
								alt="MOE Logo"
								className="h-10 md:h-12 w-auto mt-2"
							/>
							<img
								src={CGWBImage}
								alt="CGWB Logo"
								className="h-8 md:h-10 w-auto"
							/>
							<img
								src={SIHLogo}
								alt="SIH Logo"
								className="h-8 md:h-12 w-auto"
							/>
						</Box>
					</Box>

					{/* Mobile Menu Icon */}
					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="open menu"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							sx={{}}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: "block", md: "none" }, minWidth: "240px" }}
						>
							<Box
								sx={{
									p: 2,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								{/* Navigation Links in Mobile Menu */}
								{pages.map((page) => (
									<MenuItem
										key={page.name}
										onClick={handleCloseNavMenu}
										component={Link}
										to={page.path}
									>
										<Typography sx={{ textAlign: "center" }}>
											{page.name}
										</Typography>
									</MenuItem>
								))}
							</Box>
						</Menu>
					</Box>

					{/* Logo Section for Mobile */}
					<Box
						sx={{
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							width: "100%",
							justifyContent: "center",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "1rem",
							}}
						>
							<img
								src={MOEImage}
								alt="MOE Logo"
								className="h-10 md:h-12 w-auto mt-2"
							/>
							<img
								src={CGWBImage}
								alt="CGWB Logo"
								className="h-8 md:h-10 w-auto"
							/>
							<img
								src={SIHLogo}
								alt="SIH Logo"
								className="h-8 md:h-12 w-auto"
							/>
						</Box>
					</Box>

					{/* Navbar Links and Theme Toggle Button */}
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex" },
							justifyContent: "center",
						}}
					>
						{pages.map((page) => (
							<Button
								key={page.name}
								onClick={() => handleCloseNavMenu()}
								component={Link}
								to={page.path}
								sx={{
									color: theme === "light" ? "black" : "white",
									mx: 1,
									position: "relative",
									transition: "all 0.3s ease-in-out",
									"&:hover": {
										color: theme === "light" ? "black" : "white",
										"&:after": {
											content: '""',
											position: "absolute",
											left: 0,
											bottom: -4,
											width: "100%",
											height: "2px",
											backgroundColor: theme === "light" ? "black" : "white",
											transform: "scaleX(1)",
											transformOrigin: "bottom left",
										},
									},
									"&:after": {
										content: '""',
										position: "absolute",
										left: 0,
										bottom: -4,
										width: "100%",
										height: "2px",
										backgroundColor: theme === "light" ? "black" : "white",
										transform: "scaleX(0)",
										transformOrigin: "bottom right",
										transition: "transform 0.3s ease-in-out",
									},
								}}
							>
								{page.name}
							</Button>
						))}
					</Box>

					{/* Theme Toggle Button */}
					<IconButton
						onClick={toggleTheme}
						sx={{
							color: theme === "light" ? "black" : "white",
							marginRight: "1rem",
						}}
						className="mr-4"
					>
						<img
							src={theme === "light" ? moon : sun}
							alt={
								theme === "light"
									? "Switch to dark mode"
									: "Switch to light mode"
							}
							className="w-6 h-6"
						/>
					</IconButton>

					{/* User Menu */}
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar
									alt="User"
									src="/static/images/avatar/4.jpg"
									sx={{
										width: isSmallScreen ? 32 : 40,
										height: isSmallScreen ? 32 : 40,
									}}
								/>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem
									key={setting}
									onClick={() => settingsHandlers[setting]()}
								>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;
