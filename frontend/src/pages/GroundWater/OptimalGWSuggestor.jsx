import { useState } from "react";
import optimum_gw from "../../assets/image/optimum_gw.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import mapGuidelines from "../../data/mapGuidlines";

const OptimalGWSuggestor = () => {
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [optimalResult, setOptimalResult] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/api/optimum_gw",
				{
					latitude,
					longitude,
				}
			);
			const data = response.data;

			if (response.status === 200) {
				setOptimalResult(data);
			} else {
				toast.error("Invalid Latitude or Longitude. Please try again.");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred. Please try again.");
		}
	};

	return (
		<div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
			<h1 className="text-4xl font-bold text-black dark:text-gray-50 text-center mb-8 mt-4">
				Optimal Ground Water Coordinate Suggestor
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Input Form */}
				<div>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-lg font-semibold mb-2 dark:text-gray-300">
								Enter Latitude:
							</label>
							<input
								type="number"
								step="0.00001"
								className="w-full p-3 border border-gray-300 rounded shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
								value={latitude}
								onChange={(e) => setLatitude(e.target.value)}
								placeholder="E.g. 18.51672"
								required
							/>
						</div>
						<div>
							<label className="block text-lg font-semibold mb-2 dark:text-gray-300">
								Enter Longitude:
							</label>
							<input
								type="number"
								step="0.00001"
								className="w-full p-3 border border-gray-300 rounded shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
								value={longitude}
								onChange={(e) => setLongitude(e.target.value)}
								placeholder="E.g. 73.85625"
								required
							/>
						</div>
						<button
							type="submit"
							className="bg-green-600 text-white font-semibold py-3 px-6 rounded hover:bg-green-700 shadow-md dark:bg-green-500 dark:hover:bg-green-600"
						>
							Find Optimal Coordinates
						</button>
					</form>
				</div>

				{/* Example Image */}
				<div className="hidden md:block">
					<img
						src={optimum_gw}
						alt="Optimal Groundwater Suggestor"
						className="max-w-full h-auto rounded shadow-md"
					/>
				</div>
			</div>

			{/* Results Section */}
			{optimalResult && (
				<div className="mt-12 p-6 bg-gray-50 rounded shadow-lg dark:bg-gray-800 dark:text-gray-300">
					<h2 className="text-2xl font-semibold mb-6 text-center dark:text-gray-100">
						Results
					</h2>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Gauge Chart */}
						{optimalResult.gauge_img && (
							<div className="bg-white p-6 rounded shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
								<h3 className="text-lg font-bold mb-4 text-center dark:text-gray-200">
									Gauge Chart
								</h3>
								<div className="flex justify-center">
									<img
										src={`data:image/png;base64,${optimalResult.gauge_img}`}
										alt="Gauge Chart"
										className="w-72 h-72"
									/>
								</div>
							</div>
						)}

						{/* Optimal Location */}
						<div className="bg-white p-6 rounded shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
							<h3 className="text-lg font-bold mb-4 dark:text-gray-200">
								Optimal Location
							</h3>
							<p className="text-gray-700 dark:text-gray-300">
								<strong>Address:</strong> {optimalResult.optimal_address}
							</p>
							<p className="text-gray-700 dark:text-gray-300">
								<strong>Latitude:</strong> {optimalResult.optimal_lat}
							</p>
							<p className="text-gray-700 dark:text-gray-300">
								<strong>Longitude:</strong> {optimalResult.optimal_lon}
							</p>
						</div>

						{/* User Address */}
						<div className="bg-white p-6 rounded shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
							<h3 className="text-lg font-bold mb-4 dark:text-gray-200">
								User Address
							</h3>
							<p className="text-gray-700 dark:text-gray-300">
								<strong>Address:</strong> {optimalResult.user_address}
							</p>
						</div>
					</div>

					{/* Full-width Map */}
					{optimalResult.map_html && (
						<div className="mt-8 mb-12">
							<h3 className="text-lg font-bold mb-4 text-center dark:text-gray-200">
								Map
							</h3>
							<div
								className="rounded shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600"
								dangerouslySetInnerHTML={{ __html: optimalResult.map_html }}
								style={{ width: "100%" }}
							/>
						</div>
					)}

					{/* Map Guidelines */}
					{optimalResult.map_html && (
						<div className="bg-white p-6 rounded shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
							<h2 className="text-xl font-bold mb-4 dark:text-gray-100">
								Map Guidelines
							</h2>
							<ul className="list-disc list-inside dark:text-gray-300">
								{mapGuidelines.map((guideline, index) => (
									<li key={index} className="mb-2">
										{guideline}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default OptimalGWSuggestor;
