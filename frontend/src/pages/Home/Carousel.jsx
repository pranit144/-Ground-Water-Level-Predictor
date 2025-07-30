import { useState, useEffect } from "react";
import img1 from "../../assets/image/drops-of-water-water-nature-liquid-40784.jpg";
import img2 from "../../assets/image/GroundLagoon.jpg";
import img3 from "../../assets/image/Groundwater.jpg";
import img4 from "../../assets/image/Ground_water.jpg";
import img5 from "../../assets/image/Cave_water.jpg";

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const slides = [img1, img2, img3, img4, img5];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
	};

	const handlePrev = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + slides.length) % slides.length
		);
	};

	return (
		<div className="relative w-full">
			<div className="relative h-56 md:h-72 lg:h-96 overflow-hidden">
				{slides.map((slide, index) => (
					<div
						key={index}
						className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
							index === currentIndex ? "opacity-100" : "opacity-0"
						}`}
					>
						<img
							src={slide}
							className="w-full h-full object-cover"
							alt={`Slide ${index + 1}`}
						/>
					</div>
				))}
			</div>

			<div className="absolute z-30 bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 rtl:space-x-reverse">
				{slides.map((_, index) => (
					<button
						key={index}
						type="button"
						className={`w-3 h-3 rounded-full ${
							index === currentIndex ? "bg-blue-500" : "bg-gray-500"
						}`}
						aria-current={index === currentIndex ? "true" : "false"}
						aria-label={`Slide ${index + 1}`}
						onClick={() => setCurrentIndex(index)}
					></button>
				))}
			</div>

			<button
				type="button"
				className="absolute top-1/2 start-0 z-30 flex items-center justify-center h-10 w-10 -translate-y-1/2 px-4 cursor-pointer group focus:outline-none"
				onClick={handlePrev}
			>
				<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 1 1 5l4 4"
						/>
					</svg>
					<span className="sr-only">Previous</span>
				</span>
			</button>

			<button
				type="button"
				className="absolute top-1/2 end-0 z-30 flex items-center justify-center h-10 w-10 -translate-y-1/2 px-4 cursor-pointer group focus:outline-none"
				onClick={handleNext}
			>
				<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg
						className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m1 9 4-4-4-4"
						/>
					</svg>
					<span className="sr-only">Next</span>
				</span>
			</button>
		</div>
	);
};

export default Carousel;
