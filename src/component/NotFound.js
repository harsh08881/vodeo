
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import "./NotFound.css";
import notFoundImage from "../assets/404.png";

export default function NotFound() {
  return (
    <>
    <Header/>
    <div className="not-found-container">
      <img src={notFoundImage} alt="404 Not Found" className="not-found-image" />
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text"> <span>Oops! </span>The page you are looking for does not exist.</p>
      <a href="/" className="not-found-button">Go Back Home</a>
    </div>
    <Footer/>
    </>
  );
}