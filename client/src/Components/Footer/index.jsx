
import { LuShirt } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
	return (
		<footer>

			<div id="rowfoot">
				<div id="footer-col">
					<h4>company</h4>
					<ul>
						<li><a href="#">about us</a></li>
						<li><a href="#">our services</a></li>
						<li><a href="#">privacy policy</a></li>
						<li><a href="#">affiliate program</a></li>
					</ul>
				</div>
				<div id="footer-col">
					<h4>get help</h4>
					<ul>
						<li><a href="#">FAQ</a></li>
						<li><a href="#">shipping</a></li>
						<li><a href="#">returns</a></li>
						<li><a href="#">order status</a></li>
						<li><a href="#">payment options</a></li>
					</ul>
				</div>
				<div id="footer-col">
					<h4>online shop</h4>
					<ul>
						<li><a href="#">english</a></li>
						<li><a href="#">thai</a></li>
						<li><a href="#">comics</a></li>
						<li><a href="#">toy</a></li>
					</ul>
				</div>
				<div id="footer-col">
					<h4>follow us</h4>
					<div id="social-links">
						<a href="#"><FaFacebook /></a>
						<a href="#"><FaFacebook /></a>
						<a href="#"><FaFacebook /></a>

					</div>
				</div>
			</div>

		</footer>
	)
}

export default Footer;