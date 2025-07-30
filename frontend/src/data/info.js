import monitoring from "../assets/image/Ground_water_monitoring.jpg";
import importance from "../assets/image/view-realistic-hands-touching-clear-flowing-water.jpg";
import policy from "../assets/image/government_policy.jpg";
import goals from "../assets/image/goals.jpg";
import getstarted from "../assets/image/surveyor-concept-land-surveying-technology-geodesy-science-engineering-topography-equipment-people-with-compass-map-topographic-equipmen.jpg";

const sections = [
	{
		title: "What is Groundwater Level Monitoring?",
		content: [
			"Groundwater level monitoring involves tracking the amount of water present in aquifers over time. This data is crucial for understanding water availability, assessing aquifer health, and managing water resources effectively.",
			"Regular monitoring helps detect changes in groundwater levels due to natural factors or human activities, providing insights into the overall state of water resources.",
		],
		img: monitoring,
		reverse: false,
	},
	{
		title: "Why is Groundwater Monitoring Important?",
		content: [
			"Understanding groundwater levels is essential for sustainable water management and ensuring a reliable water supply.",
			"Monitoring helps in detecting potential issues like over-extraction or contamination, allowing for timely interventions.",
			"Data on groundwater levels supports decision-making for agricultural planning, urban development, and environmental conservation.",
		],
		img: importance,
		reverse: true,
	},
	{
		title: "What Government Policies Affect Groundwater Management?",
		content: [
			"Government agencies implement regulations and policies to manage groundwater resources and ensure sustainable usage.",
			"Policies may include water use restrictions, conservation programs, and funding for research and monitoring infrastructure.",
		],
		img: policy,
		reverse: false,
	},
	{
		title: "Our Goals",
		content: [
			"Providing Accurate Groundwater Level Data",
			"Supporting Sustainable Water Resource Management",
			"Facilitating Informed Decision-Making for Water Conservation",
			"Continuous Improvement of Monitoring Techniques",
		],
		img: goals,
		reverse: true,
	},
	{
		title: "Get Started with Groundwater Predictor",
		content: [
			"Take the first step towards better groundwater management with our tool. Empower yourself with accurate predictions and insights to ensure sustainable use of water resources and contribute to effective water management strategies.",
		],
		img: getstarted,
		reverse: false,
	},
];

export default sections;
