import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import LogoApp from "../../assets/LogoDataAnalyst.webp"
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-900 text-white px-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xl font-bold py-1.5">
                <img src={LogoApp} alt="Logo App" className="w-16 h-auto rounded"/>
                <h1>DataAnalyst</h1>
            </div>
            <div className="hidden md:flex space-x-8 py-3 ">
                <Link to="/Parcial-Mineria/upload_files" className="hover:text-blue-300">Upload Files</Link>
                <Link to="/Parcial-Mineria/data_analysis" className="hover:text-blue-300">Data Analysis</Link>
                <Link to="/Parcial-Mineria/graphics" className="hover:text-blue-300">Graphics</Link> 
            </div>
            <div className="md:hidden flex items-center">
                <button onClick={toggleMenu} className="text-2xl focus:outline-none">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Menu desplegable en pantallas pequeñas */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center bg-blue-800 w-full mt-4 space-y-4 py-4">
                    <Link to="/Parcial-Mineria/upload_files" className="hover:text-blue-300" onClick={toggleMenu}>Upload Files</Link>
                    <Link to="/Parcial-Mineria/data_analysis" className="hover:text-blue-300" onClick={toggleMenu}>Data Analysis</Link>
                    <Link to="/Parcial-Mineria/graphics" className="hover:text-blue-300" onClick={toggleMenu}>Graphics</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
