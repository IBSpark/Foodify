import { Route, Routes } from "react-router-dom";

import DashboardLeftSide from "./components/DashboardLeftSide";
import Home from "./components/Home";

import Navbar from "./components/Navbar";
import LiveOrders from "./components/LiveOrders";
import OrderHistory from "./components/OrderHistory";
import FoodMenu   from "./components/FoodMenu";

import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import OffersPromos from "./components/OffersPromos";

import Analytics from "./components/Analytics";
import TeamStaff from "./components/TeamStaff";
import Setting from "./components/Setting";
import Footer from "./components/Footer";


function App() {

  return (
    <div className="flex flex-col min-h-screen justify-between">

      <div className="ml-60">
        <Navbar />
      </div>
      <DashboardLeftSide />

      <Routes>

        <Route index element={<Home />} />
        <Route path="/liveorders" element={<LiveOrders />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/foodmenu" element={<FoodMenu />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/offers&promos" element={<OffersPromos />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/team&staff" element={<TeamStaff />} />
        <Route path="/setting" element={<Setting />} />

      </Routes>
      
      <Footer />

    </div>
  );
  
}

export default App