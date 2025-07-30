import { useEffect } from "react";
import Carousel from "./Carousel";
import FeatureCard from "./FeatureCard";
import MapCardContainer from "./MapCardContainer";
import AOS from "aos";
import "aos/dist/aos.css";
import FAQ from "./FAQ";
import { useNavigate } from "react-router-dom";
import OptimalGWCardContainer from "./OptimalGWCardContainer";
import Testimonial from "./Testimonial";

const HomePage = () => {
	const navigate = useNavigate();

	const handleOnClick = () => {
		return navigate("/info");
	};

	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	return (
		<>
			<div className="w-full mb-12">
				<div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-start justify-between p-6 space-y-8 md:space-y-0 md:space-x-8 mt-8 md:mt-12">
					{/* Left Section - Text */}
					<div className="flex-1 space-y-4 md:space-y-6" data-aos="fade-right">
						<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center md:text-left">
							Empowering Groundwater Management
						</h1>
						<p className="text-sm md:text-lg text-center md:text-left">
							Access a wealth of groundwater data from multiple agencies and
							digital sensors. Forecast water levels with precision using
							advanced analytical tools. Stay ahead of trends and ensure optimal
							management of precious water resources.
						</p>
						<div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
							<button
								className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								onClick={handleOnClick}
							>
								Get Started
							</button>
							<button className="w-full md:w-auto bg-transparent border-2 border-gray-500 px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105  hover:border-gray-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500">
								View More
							</button>
						</div>
					</div>

					{/* Right Section - Carousel */}
					<div
						className="w-full md:w-1/2 flex justify-center md:justify-end"
						data-aos="fade-left"
					>
						<Carousel />
					</div>
				</div>

				{/* Additional content below */}
				<FeatureCard />
				<MapCardContainer />
				<OptimalGWCardContainer />
				<Testimonial />
				<FAQ />
			</div>
		</>
	);
};

export default HomePage;
