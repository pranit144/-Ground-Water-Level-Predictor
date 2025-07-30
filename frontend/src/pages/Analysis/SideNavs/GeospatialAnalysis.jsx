import { Loader, LoaderCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

const GroundwaterAnalysis = () => {
	const [plotType, setPlotType] = useState("Groundwater Heatmap");
	const [heatmapDate, setHeatmapDate] = useState("Jan-23");
	const [loading, setLoading] = useState(false);
	const [mapContent, setMapContent] = useState("");

	useEffect(() => {
		submitForm(plotType);
	}, [plotType]);

	const handlePlotChange = (type) => {
		setPlotType(type);
	};

	const submitForm = async (type = "") => {
		setLoading(true);
		let formData = new FormData();
		formData.append("plot_type", type);

		if (type === "Groundwater Heatmap") {
			formData.append("heatmap_date", heatmapDate);
		}

		try {
			const response = await fetch(
				"http://127.0.0.1:5000/api/geospatial_analysis/plot",
				{
					method: "POST",
					body: formData,
				}
			);
			const html = await response.text();
			console.log(html);

			setMapContent(html);
		} catch (error) {
			console.error("Error fetching map data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
			<nav className="bg-black text-white p-4 shadow-md">
				<div className="container mx-auto flex justify-between items-center">
					<a
						href="#"
						onClick={() => handlePlotChange("Groundwater Heatmap")}
						className="px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
					>
						Groundwater Heatmap
					</a>
					<a
						href="#"
						onClick={() => handlePlotChange("Wells Cluster Plot")}
						className="px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
					>
						Wells Cluster Plot
					</a>
					<a
						href="#"
						onClick={() => handlePlotChange("Well Type Scatter Plot")}
						className="px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
					>
						Well Type Scatter Plot
					</a>
					<a
						href="#"
						onClick={() => handlePlotChange("Aquifer Circle Plot")}
						className="px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
					>
						Aquifer Circle Plot
					</a>
					<a
						href="#"
						onClick={() => handlePlotChange("Well Depth Plot")}
						className="px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
					>
						Well Depth Plot
					</a>
				</div>
			</nav>

			{plotType === "Groundwater Heatmap" && (
				<div className="container mx-auto text-center mt-4">
					<form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
						<label
							htmlFor="heatmap_date"
							className="block text-lg font-medium mb-2 dark:text-gray-200"
						>
							Select Date for Heatmap:
						</label>
						<select
							id="heatmap_date"
							value={heatmapDate}
							onChange={(e) => setHeatmapDate(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
						>
							<option value="Jan-23">Jan-23</option>
							<option value="May-22">May-22</option>
							<option value="Aug-22">Aug-22</option>
							<option value="Nov-22">Nov-22</option>
						</select>
						<button
							type="button"
							onClick={() => submitForm(plotType)}
							className="bg-black ml-4 text-white px-6 py-2 rounded-lg transition-colors duration-300 hover:bg-red-600 dark:hover:bg-red-400"
						>
							Submit
						</button>
					</form>
				</div>
			)}

			{loading ? (
				<div className="flex justify-center items-center flex-grow">
					<Loader className="animate-spin h-20 w-20 text-blue-500 dark:text-blue-400" />
				</div>
			) : (
				<div className="flex-grow">
					<iframe
						title="mapFrame"
						srcDoc={mapContent}
						className="w-full h-full mx-auto border-none"
					/>
				</div>
			)}
		</div>
	);
};

export default GroundwaterAnalysis;
