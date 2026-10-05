import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import HowItWorks from "./Pages/HowItWorks";
import EvidenceHistory from "./Pages/EvidenceHistory";
import Investigate from "./Pages/Investigate";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer theme="dark" transition="slide" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/evidence-history" element={<EvidenceHistory />} />
          <Route path="/investigate" element={<Investigate />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
