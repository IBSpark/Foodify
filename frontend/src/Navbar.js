
import { Link } from 'react-router-dom';
import './main.css';

export default function Navbar(){
    return(
        <>
        <header className="main-header">
  <nav className="navbar navbar-expand-lg navbar-dark">
    <div className="container">
      <a className="navbar-brand fw-bold" href="index.html">Foodify Restu</a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#restaurantNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="restaurantNav">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li className="nav-item">
            <Link className="nav-link" to="/Main">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/menu">Menu</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
          
          <li className="nav-item ms-lg-3">
            <Link to="/reservation" className="btn btn-primary px-4">Book a Table</Link>
          </li>
          <li className="nav-item ms-lg-2">
  <Link to="/signModal" className="btn btn-outline-light px-1">
    Sign
  </Link>
</li>
        </ul>
      </div>
    </div>
  </nav>
</header>
        </>
    );
}