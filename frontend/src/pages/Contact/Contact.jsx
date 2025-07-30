import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

const Contact = () => {
	useEffect(() => {
		Aos.init({
			duration: 1000,
		});
	}, []);

	return (
		<>
			<section data-aos="fade-right">
				<div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center">
						Contact Us
					</h2>
					<p className="mb-8 lg:mb-16 font-light text-center sm:text-xl">
						Got a technical issue? Want to send feedback about a beta feature?
						Need details about our Business plan? Let us know.
					</p>
					<htmlForm action="#" className="space-y-8">
						<div>
							<label htmlFor="email" className="block mb-2 text-sm font-medium">
								Your email
							</label>
							<input
								type="email"
								id="email"
								className="shadow-sm text-gray-900 bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
								placeholder="name@flowbite.com"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="subject"
								className="block mb-2 text-sm font-medium "
							>
								Subject
							</label>
							<input
								type="text"
								id="subject"
								className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
								placeholder="Let us know how we can help you"
								required
							/>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="message"
								className="block mb-2 text-sm font-medium "
							>
								Your message
							</label>
							<textarea
								id="message"
								rows="6"
								className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Leave a comment..."
							></textarea>
						</div>
						<button className="w-full md:w-auto bg-transparent border-2 border-gray-500 px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105  hover:border-gray-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500">
							Send message
						</button>
					</htmlForm>
				</div>
			</section>
		</>
	);
};

export default Contact;
