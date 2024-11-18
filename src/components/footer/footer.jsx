
const Footer = () => {
    return (
        <footer className="w-full bg-blue-900 text-white py-4 fixed bottom-0">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                    {/* Logo y descripción */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-xl font-bold">DataUploader</h2>
                        <p className="text-sm mt-2">
                            Plataforma para subida y análisis de datos de forma eficiente y segura.
                        </p>
                    </div>

                    {/* Enlaces de navegación */}
                  {/**  <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold">Enlaces</h3>
                        <div className="flex flex-col mt-2 space-y-2">
                            <a href="#upload" className="hover:text-blue-300">Upload Files</a>
                            <a href="#analysis" className="hover:text-blue-300">Data Analysis</a>
                            <a href="#about" className="hover:text-blue-300">About</a>
                            <a href="#contact" className="hover:text-blue-300">Contact</a>
                        </div>
                    </div>  */}

                    {/* Enlaces a redes sociales */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold">Síguenos</h3>
                        <div className="flex mt-2 space-x-4">
                            <a href="https://facebook.com" className="hover:text-blue-300" aria-label="Facebook">Facebook</a>
                            <a href="https://twitter.com" className="hover:text-blue-300" aria-label="Twitter">Twitter</a>
                            <a href="https://linkedin.com" className="hover:text-blue-300" aria-label="LinkedIn">LinkedIn</a>
                        </div>
                    </div>
                </div>

                {/* Información del creador */}
                <div className="mt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} DataUploader. Creado por Eduardo Marquez.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

