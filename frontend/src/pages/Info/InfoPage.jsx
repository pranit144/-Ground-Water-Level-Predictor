import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import sections from "../../data/info";
import { useNavigate } from "react-router-dom";

const Info = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: true,
		});
	}, []);

	// Check the current theme
	// const theme = document.body.classList.contains("dark-mode")
	// 	? "dark"
	// 	: "light";

	const navigate = useNavigate();

	const handleOnClick = () => {
		return navigate("/groundwater/optimal_groundwater");
	};

	return (
		<div className="mx-auto flex-grow py-20 max-w-screen-xl p-6 md:px-10 lg:px-10">
			<div className="text-3xl md:text-5xl font-bold pb-10 text-center ">
				Information
			</div>
			{sections.map((section, index) => (
				<section
					key={index}
					className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-14 items-center ${
						section.reverse ? "md:grid-cols-2 md:gap-12" : ""
					}`}
					data-aos="fade-up"
					data-aos-delay={index * 100}
				>
					<div
						className={`flex justify-center ${
							section.reverse ? "order-2" : "order-1"
						}`}
					>
						<img
							src={section.img}
							alt={section.title}
							className="w-full h-auto rounded-lg shadow-lg"
						/>
					</div>
					<div className={` ${section.reverse ? "order-1" : "order-2"}`}>
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							{section.title}
						</h2>
						{section.content.map((text, i) => (
							<p key={i} className="mb-4 text-md md:text-lg">
								{text}
							</p>
						))}
					</div>
				</section>
			))}
			<section className="md:py-12 mt-12 mb-12 text-center flex flex-col items-center gap-4 justify-center">
				<h2 className="text-2xl md:text-3xl font-bold mb-4" data-aos="fade-up">
					Get Started with Groundwater Predictor
				</h2>
				<p className=" mb-4" data-aos="fade-up">
					Take the first step towards better groundwater management with our
					tool. Empower yourself with accurate predictions and insights to
					ensure sustainable use of water resources and contribute to effective
					water management strategies.
				</p>
				<a href="#" data-aos="fade-up">
					<button
						className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
						onClick={handleOnClick}
					>
						Get Started with Ground Water Coordinate Suggestor
					</button>
				</a>
			</section>
		</div>
	);
};

export default Info;
