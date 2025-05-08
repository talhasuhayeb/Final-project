import About from "./Components/About/About";
import Footer from "./Components/Footer/Footer";
import Hero from "./Components/Hero/Hero";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <>
      <div className="w-screen min-h-screen bg-[#8A0302]">
        <Navbar />
        <Hero />
        <About />
        <Footer />
      </div>
    </>
  );
}

export default App;
