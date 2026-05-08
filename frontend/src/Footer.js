
import './main.css';

export default function Footer(){
    return(
        <>
        <footer className="footer-section pt-5 pb-3">
  <div className="container">
    <div className="row g-4">
      <div className="col-lg-4">
        {/* <!-- Add restaurant logo image here, square 200x200 --> */}
        <img src="images/logo.png" alt="Restaurant Logo" className="footer-logo mb-3" />
        <p className="footer-text">
          A modern restaurant offering unforgettable flavors,
          stylish ambiance, and a premium dining experience.
        </p>
      </div>

      <div className="col-lg-4">
        <h5 className="footer-title">Contact</h5>
        <ul className="footer-list">
          <li>123 Food Street, City</li>
          <li>+1 234 567 890</li>
          <li>info@restaurant.com</li>
        </ul>
      </div>

      <div className="col-lg-4">
        <h5 className="footer-title">Opening Hours</h5>
        <ul className="footer-list">
          <li>Mon – Fri: 10:00 AM – 10:00 PM</li>
          <li>Saturday: 12:00 PM – 11:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom text-center mt-4 pt-3">
      <p className="mb-0">
        © 2026 Restaurant Name. All rights reserved.
      </p>
    </div>
  </div>
</footer>

        </>
    );
}