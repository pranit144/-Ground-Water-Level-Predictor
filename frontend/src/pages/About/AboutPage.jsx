import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

const AboutPage = () => {
	useEffect(() => {
		Aos.init({
			duration: 1000,
		});
	}, []);

	return (
		<>
			<div className="sm:flex items-center justify-center mx-auto max-w-screen-xl">
				<div className="sm:w-1/2 p-10">
					<div className="image object-center text-center">
						<img src="https://i.imgur.com/WbQnbas.png" data-aos="fade-right" />
					</div>
				</div>
				<div className="sm:w-1/2 p-5">
					<div className="text">
						<p
							data-aos="fade-right"
							className="border-b-2 border-indigo-600 uppercase text-lg font-medium"
						>
							About us
						</p>
						<h2
							className="my-4 font-bold text-3xl  sm:text-4xl "
							data-aos="fade-right"
						>
							About <span className="text-indigo-600">Our Vision</span>
						</h2>
						<p data-aos="fade-right">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid,
							commodi doloremque, fugiat illum magni minus nisi nulla numquam
							obcaecati placeat quia, repellat tempore voluptatum.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default AboutPage;
