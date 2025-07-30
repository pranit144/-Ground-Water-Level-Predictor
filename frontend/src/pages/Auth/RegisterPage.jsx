import { useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid"; // Still using Grid
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GoogleButton from "react-google-button";
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../http/api";
import useTokenStore from "../../store/userTokenStore";
import { useNavigate } from "react-router-dom";

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function SignUp() {
	const firstNameRef = useRef(null);
	const lastNameRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const { setToken, setUserId } = useTokenStore((state) => state);
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: register,
		onSuccess: (response) => {
			const token = response.data.access_token;
			const userId = response.data.user_id;
			setToken(token);
			setUserId(userId);
			navigate("/");
		},
		onError: () => {
			toast.error("Something went wrong!", {
				autoClose: 4000,
			});
		},
	});
	const handleSubmit = (event) => {
		event.preventDefault();

		const firstName = firstNameRef.current.value;
		const lastName = lastNameRef.current.value;
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (!email || !password || !firstName || !lastName) {
			toast.error("Please fill all fields!", {
				autoClose: 4000,
			});
			return;
		}
		mutation.mutate({ email, password, firstName, lastName });
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign up
						</Typography>
					</Box>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									inputRef={firstNameRef}
									autoComplete="fname"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									inputRef={lastNameRef}
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lname"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									inputRef={emailRef}
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									inputRef={passwordRef}
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
									Sign Up
								</Button>
							</Grid>
							<Grid item xs={12}>
								<Typography sx={{ textAlign: "center" }}>OR</Typography>
							</Grid>
							<Grid item xs={12}>
								<GoogleButton
									style={{ width: "100%" }} // This ensures the button takes up the full width of the container
									onClick={() => {
										console.log("Google button clicked");
									}}
								/>
							</Grid>
						</Grid>
						<Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
							<Grid item>
								<Link href="/auth/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Box mt={5}>
					<Copyright />
				</Box>
				<ToastContainer />
			</Container>
		</ThemeProvider>
	);
}
