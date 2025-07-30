import {
	Card,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
} from "@material-tailwind/react";
import { PresentationChartBarIcon } from "@heroicons/react/24/solid";

import { FaWater, FaWind } from "react-icons/fa";
import { MdPerson2 } from "react-icons/md";
import { HiChartBar } from "react-icons/hi";
import { FiCloud } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";

export default function SideBar({
	setActiveComponent,
	sidebarOpen,
	activeItem,
	setActiveItem,
	setSidebarOpen,
}) {
	const [isRainfallOpen, setIsRainfallOpen] = useState(false);
	const [isTidalCyclesOpen, setIsTidalCyclesOpen] = useState(false);

	return (
		<Card
			className={`h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-gray-800 dark:shadow-none transition-all duration-300 ${
				sidebarOpen ? "w-[20rem]" : "w-0 hidden transition-all overflow-hidden"
			}`}
		>
			<div className="mb-2 p-4">
				<Typography
					variant="h5"
					className="text-blue-gray-900 dark:text-gray-300"
				>
					Sidebar
				</Typography>
			</div>
			<List>
				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "GeospatialAnalysis"
							? "bg-blue-100 dark:bg-gray-700"
							: ""
					}`}
					onClick={() => {
						setActiveComponent("GeospatialAnalysis");
						setActiveItem("GeospatialAnalysis");
					}}
				>
					<ListItemPrefix>
						<PresentationChartBarIcon className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Geospatial Analysis
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Hydrogeology" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("Hydrogeology");
						setActiveItem("Hydrogeology");
					}}
				>
					<ListItemPrefix>
						<FiCloud className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Hydrogeology
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Rainfall" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => setIsRainfallOpen(!isRainfallOpen)}
				>
					<ListItemPrefix>
						<FaWater className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Rainfall
					</span>
					<IoIosArrowForward
						className={`h-4 w-4 ml-auto transition-transform dark:text-gray-300 ${
							isRainfallOpen ? "rotate-90" : "rotate-0"
						}`}
					/>
				</ListItem>

				{isRainfallOpen && (
					<div className="pl-6">
						<ListItem
							className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
								activeItem === "RainfallTrendAnalysis"
									? "bg-blue-100 dark:bg-gray-700"
									: ""
							}`}
							onClick={() => {
								setActiveComponent("RainfallTrendAnalysis");
								setActiveItem("RainfallTrendAnalysis");
							}}
						>
							<span className="text-blue-gray-900 dark:text-gray-300">
								Rainfall Trend Analysis
							</span>
						</ListItem>

						<ListItem
							className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
								activeItem === "RefreshRatePredictor"
									? "bg-blue-100 dark:bg-gray-700"
									: ""
							}`}
							onClick={() => {
								setActiveComponent("RefreshRatePredictor");
								setActiveItem("RefreshRatePredictor");
							}}
						>
							<span className="text-blue-gray-900 dark:text-gray-300">
								Refresh Rate Predictor
							</span>
						</ListItem>
					</div>
				)}

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Population" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("Population");
						setActiveItem("Population");
					}}
				>
					<ListItemPrefix>
						<MdPerson2 className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Population
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "Elevation" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => {
						setActiveComponent("Elevation");
						setActiveItem("Elevation");
					}}
				>
					<ListItemPrefix>
						<HiChartBar className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Elevation
					</span>
				</ListItem>

				<ListItem
					className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
						activeItem === "TidalCycles" ? "bg-blue-100 dark:bg-gray-700" : ""
					}`}
					onClick={() => setIsTidalCyclesOpen(!isTidalCyclesOpen)}
				>
					<ListItemPrefix>
						<FaWind className="h-5 w-5 text-blue-gray-900 dark:text-gray-300" />
					</ListItemPrefix>
					<span className="text-blue-gray-900 dark:text-gray-300">
						Tidal Cycles
					</span>
					<IoIosArrowForward
						className={`h-4 w-4 ml-auto dark:text-gray-300 transition-transform ${
							isTidalCyclesOpen ? "rotate-90" : "rotate-0"
						}`}
					/>
				</ListItem>

				{isTidalCyclesOpen && (
					<div className="pl-6">
						<ListItem
							className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
								activeItem === "TidalCycleAnalysis"
									? "bg-blue-100 dark:bg-gray-700"
									: ""
							}`}
							onClick={() => {
								setActiveComponent("TidalCycleAnalysis");
								setActiveItem("TidalCycleAnalysis");
							}}
						>
							<span className="text-blue-gray-900 dark:text-gray-300">
								Tidal Cycle Analysis
							</span>
						</ListItem>

						<ListItem
							className={`hover:bg-blue-gray-100 dark:hover:bg-gray-700 ${
								activeItem === "TidalCycleImpactPrediction"
									? "bg-blue-100 dark:bg-gray-700"
									: ""
							}`}
							onClick={() => {
								setActiveComponent("TidalCycleImpactPrediction");
								setActiveItem("TidalCycleImpactPrediction");
							}}
						>
							<span className="text-blue-gray-900 dark:text-gray-300">
								Tidal Cycle Impact Prediction
							</span>
						</ListItem>
					</div>
				)}
			</List>
		</Card>
	);
}
