import welcome from "@/assets/images/welcome01.png";
import "./index.less";

const Home = () => {
	return (
		<a className="home card" href="#/form/basicForm">
			<img src={welcome} alt="welcome" />
		</a>
	);
};

export default Home;
