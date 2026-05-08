
import './main.css';

export default function Reservation(){
    return(
        <>
        
<section
  className="reservation-section py-5 mt-5"
  id="book"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/reservation-bg.jpg')`,
  }}
>
  <div className="container">
    <div className="row align-items-center g-5">

      {/* LEFT CONTENT */}
      <div className="col-lg-6 text-white">
        <span className="section-subtitle text-light">RESERVATION</span>

        <h2 className="section-title text-white mt-2 mb-4">
          Book a Table or Order Online
        </h2>

        <p className="reservation-text mb-4">
          Reserve your table in advance or place an online order to enjoy
          our delicious dishes without waiting. Fresh taste, quick service,
          and a premium dining experience.
        </p>

        <form className="reservation-form">
          <div className="row g-3">

            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Your Name" />
            </div>

            <div className="col-md-6">
              <input type="tel" className="form-control" placeholder="Phone Number" />
            </div>

            <div className="col-md-6">
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-6">
              <input type="time" className="form-control" />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100 mt-2">
                Confirm Reservation
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* RIGHT IMAGE (UPDATED) */}
      <div className="col-lg-6">
        <img
          src="/images/reservation.jpg"   // 👈 replace with your new image name
          alt="Menu"
          className="img-fluid reservation-img"
        />
      </div>

    </div>
  </div>
</section>
        </>
    );
}