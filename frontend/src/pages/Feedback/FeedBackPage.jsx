import { useState } from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	CircularProgress,
	Snackbar,
	Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTokenStore from "../../store/userTokenStore";
import { toast } from "react-toastify";

const FeedbackPage = () => {
	const [feedback, setFeedback] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { token, userId } = useTokenStore((state) => state);
	const userID = userId;

	const handleFeedbackChange = (e) => setFeedback(e.target.value);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		try {
			const response = await fetch(
				`http://localhost:3600/api/feedback/${userID}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ feedback }),
				}
			);

			if (!response.ok) {
				throw new Error("Something went wrong. Please try again.");
			}

			setSuccess(true);
			toast.success("Feedback submitted successfully!", {
				autoClose: 3000,
			});
			setFeedback("");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 18 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Feedback
			</Typography>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
			>
				<TextField
					label="Your Feedback"
					multiline
					rows={6}
					variant="outlined"
					fullWidth
					value={feedback}
					onChange={handleFeedbackChange}
					required
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={loading}
					sx={{ alignSelf: "flex-start" }}
				>
					{loading ? <CircularProgress size={24} /> : "Submit Feedback"}
				</Button>
			</Box>

			<Snackbar
				open={success}
				autoHideDuration={6000}
				onClose={() => setSuccess(false)}
			>
				<Alert onClose={() => setSuccess(false)} severity="success">
					Feedback submitted successfully!
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError("")}
			>
				<Alert onClose={() => setError("")} severity="error">
					{error}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default FeedbackPage;
