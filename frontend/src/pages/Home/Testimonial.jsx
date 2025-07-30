import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useRef } from "react";
import Aos from "aos";
import { testimonials } from "../../data/testimonials";

export default function Testimonial() {
	const swiperRef = useRef(null); // Reference to Swiper instance

	useEffect(() => {
		Aos.init({
			duration: 1000,
		});
	}, []);

	return (
		<section className="py-16 px-4">
			<div className="container mx-auto text-center">
				<h2 className="text-5xl font-bold mb-4" data-aos="fade-up">
					What people are saying.
				</h2>
				<p className=" mb-10" data-aos="fade-up">
					Hear from those who’ve experienced the impact firsthand.
				</p>
				<div
					className="border-b-4 border-indigo-500 w-20 mx-auto mb-12"
					data-aos="fade-up"
				></div>

				<Swiper
					onSwiper={(swiper) => (swiperRef.current = swiper)} // Get the swiper instance
					slidesPerView={1}
					spaceBetween={30}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
					}}
					breakpoints={{
						640: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1024: {
							slidesPerView: 3,
						},
					}}
					pagination={{
						clickable: true,
					}}
					modules={[Pagination, Autoplay]}
					className="mySwiper"
				>
					{testimonials.map((testimonial, index) => (
						<SwiperSlide key={index} className="text-center">
							<div
								className=" p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
								onMouseEnter={() => swiperRef.current.autoplay.stop()} // Stop autoplay on hover
								onMouseLeave={() => swiperRef.current.autoplay.start()} // Start autoplay when hover ends
								data-aos="fade-up"
							>
								<div className="flex items-center justify-center mb-4">
									<img
										src={testimonial.image}
										alt={testimonial.name}
										className="w-16 h-16 object-cover rounded-full border-4 border-indigo-500"
									/>
								</div>
								<h3 className="text-lg font-semibold  uppercase mb-2">
									{testimonial.name}
								</h3>
								<p className="text-sm text-indigo-400 mb-4">
									{testimonial.role}
								</p>
								<p className=" italic">"{testimonial.message}"</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
