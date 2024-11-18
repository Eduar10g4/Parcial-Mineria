import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { DataProvider } from "../context/dataContext";

const LayoutDashobard = ({ children }) => {

    return (
        <>
            <DataProvider>
                <Navbar />
                <div className="flex items-center justify-center h-[56vh] md:h-[74vh]">
                    {children}
                </div>
                <Footer />
            </DataProvider>
        </>
    );
};

export default LayoutDashobard;
