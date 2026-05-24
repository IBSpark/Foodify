import About from './About';
import './main.css';
import Menu from './Menu';
import Reservation from './Reservation';

export default function Home() {
 return(
    <>
     {/* <!-- Header Navbar Start --> */}


{/* <!-- Header Navbar End --> */}

{/* <!-- Hero Section Start --> */}
<section className="hero-section">
  {/* <!-- Add hero background image here, 1920x900 --> */}
  <img src="images/hero.jpg" alt="Restaurant ambience" className="hero-bg" />

  <div className="container h-100">
    <div className="row h-100 align-items-center">
      <div className="col-lg-7 text-white">
        <h1 className="display-4 fw-bold">Foodify Resturant</h1>
        <p className="lead mt-3 mb-4">
          Savor the Perfect Harmony of Taste, Presentation, and Elegance in an Atmosphere That Redefines Luxury Dining.
        </p>
        <a href="/menu" className="btn btn-primary btn-lg px-5">
          Explore Menu
        </a>
      </div>
    </div>
  </div>
</section>

{/* <!-- Hero Section End.. --> */}
 
  {/* <!-- About.. Start --> */}

    <About />

{/* <!-- About End.. --> */}

{/* <!-- Menu feature St art --> */}
  <Menu />
{/* <!-- Menu Feature End.. --> */}

<div className="modal fade" id="fullMenuModal" tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-body p-0">
        {/* <!-- Add full menu image here, vertical poster 900x1200 --> */}
        <img src="images/fullmenu.jpg" alt="Full Menu" className="img-fluid w-100 rounded" />
      </div>
    </div>
  </div>
</div>




    <Reservation />




    </>
 );
}