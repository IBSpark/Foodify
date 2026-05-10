
import './main.css';


export default function About(){
    return(
        <>
        <section className="about-section py-5" id="about">
  <div className="container">
    <div className="row align-items-center g-5">
      <div className="col-lg-6">
        {/* <!-- Add restaurant interior or chef image here, 800x600 --> */}
        <img src="images/about.jpg" alt="About our restaurant" className="img-fluid rounded-4 shadow" />
      </div>
      <div className="col-lg-6">
        <span className="section-subtitle">About Us</span>
        <h2 className="section-title mt-2 mb-4">
          A Modern Restaurant With a Passion for Taste
        </h2>
        <p className="about-text">
          We are a contemporary restaurant focused on fresh ingredients,
          creative recipes, and unforgettable dining experiences.
          Every dish is crafted with care, combining modern techniques
          with authentic flavors.
        </p>
        <p className="about-text">
          Our warm atmosphere, stylish interiors, and dedicated chefs
          make every visit special — whether it’s a casual meal or
          a memorable celebration.
        </p>
        <a href="/" className="btn btn-primary mt-3 px-4">
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>
        </>
    );
}