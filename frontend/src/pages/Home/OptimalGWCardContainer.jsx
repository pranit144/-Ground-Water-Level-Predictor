import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import img from "../../assets/image/hero.png";
import { FaWater } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OptimalGWCardContainer = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	const navigate = useNavigate();

	const handleButtonClick = () => {
		return navigate("/groundwater/optimal_groundwater");
	};

	return (
		<div className="py-20">
			<div className="w-full flex flex-wrap mx-auto justify-center items-center bg-opacity-50 max-w-[1450px] rounded-3xl md:py-10">
				<div className="w-full md:flex-[0_0_55%] md:w-auto p-4 md:p-8">
					<h1 className="text-3xl mb-8" data-aos={"fade-up"}>
						Optimal Ground Water Coordinate Suggestor{" "}
						<FaWater className="inline-block ml-2 text-blue-500" />
					</h1>
					<p className="text-[20px]" data-aos={"fade-up"}>
						The Optimal Ground Water Coordinate Suggestor is an intelligent tool
						designed to help users find the best possible location for drilling
						or accessing groundwater. This tool leverages geospatial data and
						advanced algorithms to analyze various factors, ensuring that users
						are directed to locations with optimal groundwater levels and well
						depth conditions.
					</p>
					<button
						className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold transition duration-500 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						onClick={handleButtonClick}
						data-aos={"fade-up"}
					>
						Find Optimal Coordinates
					</button>
				</div>

				<div className="w-full md:flex-[0_0_40%] md:w-auto p-4 text-center mb-8 md:mb-0">
					<img
						src={img}
						alt="Groundwater Analysis"
						className="w-[90%] max-w-[200px] md:max-w-[350px] mx-auto md:w-[min(90%,_400px)] rounded-3xl"
						data-aos="fade-up"
					/>
				</div>
			</div>
		</div>
	);
};

export default OptimalGWCardContainer;
