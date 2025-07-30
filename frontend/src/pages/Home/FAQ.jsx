import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import data from "../../data/faq";

const FAQ = () => {
	const [selected, setSelected] = useState(null);

	const toggle = (i) => {
		setSelected(selected === i ? null : i);
	};

	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	return (
		<div className=" py-12">
			<div className="max-w-screen-lg mx-auto px-4">
				<h1
					className="text-center text-3xl md:text-4xl font-semibold mb-8"
					data-aos="fade-up"
				>
					Frequently Asked Questions
				</h1>
				<div className="space-y-4">
					{data.map((item, i) => (
						<div key={i} className=" shadow-md rounded-lg overflow-hidden">
							<div
								className="cursor-pointer px-6 py-4 flex justify-between items-center border-b border-gray-200"
								onClick={() => toggle(i)}
								role="button"
								aria-expanded={selected === i}
								aria-controls={`content-${i}`}
								data-aos="fade-up"
								data-aos-delay="100"
							>
								<h2 className="text-lg font-medium">{item.question}</h2>
								<span className="text-xl font-bold">
									{selected === i ? "-" : "+"}
								</span>
							</div>
							<div
								id={`content-${i}`}
								className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
									selected === i ? "max-h-screen" : "max-h-0"
								}`}
							>
								<div className="px-6 py-4">
									<p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FAQ;
