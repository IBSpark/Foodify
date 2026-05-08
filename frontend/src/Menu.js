
import './main.css';

export default function Menu(){
    return(
        <>
        <section className="menu-section py-5" id="menu">
  <div className="container">
    <div className="text-center mb-5">
      <span className="section-subtitle">Popular Dishes</span>
      <h2 className="section-title mt-2">Featured Menu</h2>
    </div>

    <div className="row g-4">
      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish1.jpg" alt="Dish name" className="img-fluid rounded-4" />
          <h5 className="mt-3">Crispy Chicken Bites</h5>
          <p>Starter</p>
          <p className="price">$10.99</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>

      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish2.jpg" alt="Dish name" className="img-fluid rounded-4" />
          <h5 className="mt-3">Grilled Chicken Steak</h5>
          <p>Main Course</p>
          <p className="price">$16.50</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>

      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish3.jpg" alt="Dish name" className="img-fluid rounded-4"/>
          <h5 className="mt-3">classic Beef Burger</h5>
          <p>Fast Food</p>
          <p className="price">$22.00</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>
    </div>
  </div>
  <div className="container mt-4">
    <div className="row g-4">
      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish4.jpg" alt="Dish name" className="img-fluid rounded-4" />
          <h5 className="mt-3">Pepperoni Pizza</h5>
          <p>Pizza</p>
          <p className="price">$8.99</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>

      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish5.jpg" alt="Dish name" className="img-fluid rounded-4" />
          <h5 className="mt-3">Chocolate Lava Cake</h5>
          <p>Desserts</p>
          <p className="price">$4.50</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>

      <div className="col-md-4">
        <div className="menu-card text-center">
          {/* <!-- Add dish image here, 600x400 --> */}
          <img src="images/dish6.jpg" alt="Dish name" className="img-fluid rounded-4"/>
          <h5 className="mt-3">Fresh Mint Lemonade</h5>
          <p>Drinks</p>
          <p className="price">$2.00</p>
          <button className="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#fullMenuModal">
            View Full Menu
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
        </>
    );
}