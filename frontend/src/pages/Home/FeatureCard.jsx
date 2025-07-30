import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import {
	FaChartLine,
	FaRobot,
	FaHeartbeat,
	FaRegLightbulb,
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";

// import { BsGraphUp } from "react-icons/bs";
// import { GiWaterDrop, GiGeothermal } from "react-icons/gi";
// import { FaRegChartBar } from "react-icons/fa";

const features = [
	{
		icon: <FaChartLine />,
		title: "Data Insights",
		description:
			"Unlock deep insights from groundwater level data to make informed decisions.",
	},
	{
		icon: <FaRobot />,
		title: "Predictive Modeling",
		description:
			"Forecast groundwater trends using machine learning models to anticipate future scenarios.",
	},
	{
		icon: <FaHeartbeat />,
		title: "Real-time Monitoring",
		description:
			"Stay updated with real-time groundwater level data from monitoring stations across the region.",
	},
	{
		icon: <MdComputer />,
		title: "User-Friendly Interface",
		description:
			"Navigate complex data easily with a user-friendly interface designed for everyone.",
	},
];

const FeatureCard = () => {
	useEffect(() => {
		Aos.init({
			duration: 1000,
		});
	}, []);

	return (
		<section className="services-section py-8 md:py-12 md:mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl font-extrabold ">Our Expertise</h2>
				<p className="mt-4 text-lg leading-6 ">
					Discover our wide range of services designed to provide actionable
					insights and innovative solutions for your groundwater management
					needs.
				</p>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							data-aos="fade-up" // or any other AOS animation type
							className="service-item p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
						>
							<div className="icon-container mb-4 flex justify-center items-center">
								<div className="icon text-indigo-600 text-4xl sm:text-5xl lg:text-6xl">
									{feature.icon}
								</div>
							</div>
							<h3 className="text-xl font-semibold">{feature.title}</h3>
							<p className="mt-2 ">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeatureCard;
