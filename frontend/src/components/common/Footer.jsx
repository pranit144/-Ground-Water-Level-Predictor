import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFacebookF,
	faTwitter,
	faInstagram,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer2 = () => {
	return (
		<footer className="bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-300 py-6">
			<div className="w-full max-w-screen-xl mx-auto px-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between">
					<div className="flex items-center mb-4 md:mb-0">
						<h1 className="text-3xl font-bold text-white dark:text-gray-100">
							UnderWater Predictor
						</h1>
					</div>
					<ul className="flex flex-wrap items-center mb-6 text-sm font-medium space-x-4 md:space-x-6">
						<li>
							<Link
								to="/groundwater/level_predict"
								className="hover:text-gray-300 dark:hover:text-gray-400"
							>
								Predict
							</Link>
						</li>
						<li>
							<Link
								to="/analysis"
								className="hover:text-gray-300 dark:hover:text-gray-400"
							>
								Analyse
							</Link>
						</li>
						<li>
							<Link
								to="/info"
								className="hover:text-gray-300 dark:hover:text-gray-400"
							>
								Information
							</Link>
						</li>
						<li>
							<Link
								to="/about"
								className="hover:text-gray-300 dark:hover:text-gray-400"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								to="/contact"
								className="hover:text-gray-300 dark:hover:text-gray-400"
							>
								Contact
							</Link>
						</li>
					</ul>
					<div className="flex space-x-4 mb-4 md:mb-0">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300"
						>
							<FontAwesomeIcon icon={faFacebookF} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300"
						>
							<FontAwesomeIcon icon={faTwitter} />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300"
						>
							<FontAwesomeIcon icon={faInstagram} />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300"
						>
							<FontAwesomeIcon icon={faLinkedin} />
						</a>
						<a
							href="mailto:contact@underwaterpredictor.com"
							className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300"
						>
							<FontAwesomeIcon icon={faEnvelope} />
						</a>
					</div>
				</div>
				<hr className="my-6 border-gray-700 dark:border-gray-600" />
				<span className="block text-sm text-gray-400 dark:text-gray-500 text-center">
					© 2024{" "}
					<a href="#" className="hover:underline dark:hover:text-gray-400">
						UnderWaterPredictor™
					</a>
					. All Rights Reserved.
				</span>
			</div>
		</footer>
	);
};

export default Footer2;
