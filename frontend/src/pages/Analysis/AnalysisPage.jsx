import { useState } from "react";
import SideBar from "./SideBar";
import GeospatialAnalysis from "./SideNavs/GeospatialAnalysis";
import Hydrogeology from "./SideNavs/Hydrogeology";
import Population from "./SideNavs/population";
import Elevation from "./SideNavs/Elevation";
import { IoIosArrowForward } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/solid";
import RainfallTrendAnalysis from "./SideNavs/RainfallTrendAnalysis";
import RefreshRatePredictor from "./SideNavs/RefreshRatePredictor";
import TidalCycleAnalysis from "./SideNavs/TidalCycleAnalysis";
import TidalCycleImpactPrediction from "./SideNavs/TidalCycleImpactPrediction";

const Analysis = () => {
	// State to track the currently selected component
	const [activeComponent, setActiveComponent] = useState("GeospatialAnalysis");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeItem, setActiveItem] = useState("GeospatialAnalysis"); // State to track active item

	// Function to render the component based on the selected item
	const renderActiveComponent = () => {
		switch (activeComponent) {
			case "GeospatialAnalysis":
				return <GeospatialAnalysis />;
			case "Hydrogeology":
				return <Hydrogeology />;
			case "RefreshRatePredictor":
				return <RefreshRatePredictor />;
			case "RainfallTrendAnalysis":
				return <RainfallTrendAnalysis />;
			case "Population":
				return <Population />;
			case "Elevation":
				return <Elevation />;
			case "TidalCycleAnalysis":
				return <TidalCycleAnalysis />;
			case "TidalCycleImpactPrediction":
				return <TidalCycleImpactPrediction />;
			default:
				return <GeospatialAnalysis />;
		}
	};

	return (
		<div className="flex">
			<SideBar
				setActiveComponent={setActiveComponent}
				sidebarOpen={sidebarOpen}
				setActiveItem={setActiveItem}
				activeItem={activeItem}
			/>
			<div
				className={`transition-all duration-300 ${
					sidebarOpen ? "w-[calc(100%-20rem)]" : "w-full"
				}`}
			>
				<button
					className={`absolute ${
						sidebarOpen ? "top-24 left-60" : "top-20 left-2"
					}  z-10 p-2 bg-blue-500 text-white rounded-full focus:outline-none`}
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					{sidebarOpen ? (
						<XMarkIcon className="h-6 w-6" />
					) : (
						<IoIosArrowForward className="h-6 w-6" />
					)}
				</button>
				<div className="max-h-[calc(100vh-2rem)] overflow-auto">
					{renderActiveComponent()}
				</div>
			</div>
		</div>
	);
};

export default Analysis;
