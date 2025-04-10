import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Outfits from "./pages/Outfits/Outfits";
import Inventory from "./pages/Inventory/Inventory";
import CreateOutfit from "./pages/CreateOutfit/CreateOutfit";
import AddToInventory from "./pages/AddToInventory/AddToInventory";
import Login from "./pages/Login/Login";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Outfits" element={<Outfits />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Create Outfit" element={<CreateOutfit />} />
        <Route path="/Add To Inventory" element={<AddToInventory />} />
      </Routes>
    </Router>
  );
}

export default App;
