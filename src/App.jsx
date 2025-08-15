import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Gallery from "./pages/Gallery";
import ImageDetail from "./pages/ImageDetail";
import Create from "./pages/Create";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/create" element={<Create />} />
      <Route path="/gallery/:id" element={<ImageDetail />} />
    </Routes>
  );
}

export default App;
