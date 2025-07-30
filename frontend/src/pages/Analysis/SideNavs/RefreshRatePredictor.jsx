import { useState } from "react";

const RefreshRatePredictor = () => {
	const [loading, setLoading] = useState(true);

	const handleIframeLoad = () => {
		setLoading(false);
	};

	return (
		<div style={{ position: "relative", height: "100vh", width: "100%" }}>
			{loading && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1,
					}}
				>
					<div className="loader">Loading...</div>
				</div>
			)}
			<iframe
				src="http://127.0.0.1:5000/api/rainfall/refresh_rate/"
				title="Rainfall Refresh Rate Predictor"
				style={{ width: "100%", height: "100%", border: "none" }}
				onLoad={handleIframeLoad}
			/>
		</div>
	);
};

export default RefreshRatePredictor;
