import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ImageDetail from "./pages/ImageDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/gallery/:id" element={<ImageDetail />} />
    </Routes>
  );
}

export default App;
