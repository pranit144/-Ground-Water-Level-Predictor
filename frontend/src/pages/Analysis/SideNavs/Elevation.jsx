import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { Loader } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup } from "react-leaflet";

// Helper function to create a dangerouslySetInnerHTML object for rendering HTML maps
const createMarkup = (html) => {
	return { __html: html };
};

const Elevation = () => {
	const [districts, setDistricts] = useState([]);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [metrics, setMetrics] = useState({});
	const [elevationMap, setElevationMap] = useState("");
	const [figWellTypeVsElevation, setFigWellTypeVsElevation] = useState(null);
	const [figWellDepthVsElevation, setFigWellDepthVsElevation] = useState(null);
	const [aquiferMap, setAquiferMap] = useState("");
	const [wellDepthMap, setWellDepthMap] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Initial GET request to fetch available districts
		axios
			.get("http://127.0.0.1:5000/api/elevation/")
			.then((response) => {
				setDistricts(response.data.districts);
				setElevationMap(response.data.elevation_map);
				setFigWellTypeVsElevation(response.data.fig_well_type_vs_elevation);
				setFigWellDepthVsElevation(response.data.fig_well_depth_vs_elevation);
				setAquiferMap(response.data.aquifer_map);
				setWellDepthMap(response.data.well_depth_map);
				setLoading(false); // Data has been fetched, set loading to false
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
				setLoading(false); // In case of error, also stop loading
			});
	}, []);

	const handleDistrictChange = (event) => {
		const district = event.target.value;
		setSelectedDistrict(district);

		// POST request to filter data by selected district
		setLoading(true); // Start loading
		axios
			.post("http://127.0.0.1:5000/api/elevation/", { district })
			.then((response) => {
				setMetrics(response.data.metrics);
				setElevationMap(response.data.elevation_map);
				setFigWellTypeVsElevation(response.data.fig_well_type_vs_elevation);
				setFigWellDepthVsElevation(response.data.fig_well_depth_vs_elevation);
				setAquiferMap(response.data.aquifer_map);
				setWellDepthMap(response.data.well_depth_map);
				setLoading(false); // Data has been fetched, set loading to false
			})
			.catch((error) => {
				console.error("Error posting data: ", error);
				setLoading(false); // In case of error, also stop loading
			});
	};

	return (
		<div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
				Elevation Analysis
			</h1>

			{/* District Selector */}
			<div className="mb-6">
				<label
					htmlFor="district"
					className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Select District:
				</label>
				<select
					id="district"
					value={selectedDistrict || ""}
					onChange={handleDistrictChange}
					className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
				>
					<option value="">Select a district</option>
					{districts.map((district) => (
						<option key={district} value={district}>
							{district}
						</option>
					))}
				</select>
			</div>

			{/* Display Loader or Content */}
			{loading ? (
				<div className="flex items-center justify-center h-96">
					<Loader className="animate-spin h-20 w-20 text-blue-500 dark:text-blue-400" />
				</div>
			) : (
				<div>
					{/* Display Metrics */}
					{metrics && (
						<div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
								Metrics for Selected District
							</h2>
							{/* Updated Grid for Metrics */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Aquifer Type */}
								<div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg shadow-lg">
									<p className="text-sm font-medium text-white">Aquifer Type</p>
									<p className="text-lg font-bold text-white">
										{metrics["AQUIFER"]}
									</p>
								</div>

								{/* Well Depth */}
								<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg">
									<p className="text-sm font-medium text-white">
										Well Depth (m)
									</p>
									<p className="text-lg font-bold text-white">
										{metrics["WELL DEPTH"]}
									</p>
								</div>

								{/* Well Type */}
								<div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg shadow-lg">
									<p className="text-sm font-medium text-white">Well Type</p>
									<p className="text-lg font-bold text-white">
										{metrics["WELL TYPE"]}
									</p>
								</div>

								{/* Ground Water Level */}
								<div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-lg shadow-lg">
									<p className="text-sm font-medium text-white">
										Ground Water Level (mbgl)
									</p>
									<p className="text-lg font-bold text-white">
										{metrics["Ground water level (mbgl)"]}
									</p>
								</div>

								{/* Elevation */}
								<div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg shadow-lg">
									<p className="text-sm font-medium text-white">
										Elevation (m)
									</p>
									<p className="text-lg font-bold text-white">
										{metrics["elevation"]}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Display Maps */}
					<div className="mb-6">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
							Elevation HeatMap & Ground Water Level
						</h2>
						<div
							className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
							dangerouslySetInnerHTML={createMarkup(elevationMap)}
						/>
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
							Aquifer Type vs Elevation
						</h2>
						<div
							className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
							dangerouslySetInnerHTML={createMarkup(aquiferMap)}
						/>
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">
							Well Depth vs Elevation Heatmap
						</h2>
						<div
							className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
							dangerouslySetInnerHTML={createMarkup(wellDepthMap)}
						/>
					</div>

					{/* Display Plotly Figures */}
					<div className="md:grid md:grid-cols-2 md:gap-6">
						<div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
								Well Type vs Elevation
							</h2>
							{figWellTypeVsElevation && (
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
									<Plot
										data={JSON.parse(figWellTypeVsElevation).data}
										layout={JSON.parse(figWellTypeVsElevation).layout}
										config={{ responsive: true }}
									/>
								</div>
							)}
						</div>

						<div className="mt-6 md:mt-0">
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
								Well Depth vs Elevation
							</h2>
							{figWellDepthVsElevation && (
								<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
									<Plot
										data={JSON.parse(figWellDepthVsElevation).data}
										layout={JSON.parse(figWellDepthVsElevation).layout}
										config={{ responsive: true }}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Elevation;
