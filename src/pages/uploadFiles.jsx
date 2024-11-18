import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "../components/context/dataContext";
import Swal from "sweetalert2";

const UploadFiles = () => {
    //const [data, setData] = useState([]);
    const { setData } = useData(); // Usecontext
    const [fileLoaded, setFileLoaded] = useState(false); // Estado para verificar si el archivo ha sido cargado

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
    
        // Verifica si el archivo es CSV o Excel
        if (fileType === "text/csv" || fileType === "application/vnd.ms-excel" || fileName.endsWith(".csv")) {
            // Procesar archivo CSV
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    setData(result.data || []);
                    console.log("Datos cargados (CSV):", result.data);
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Datos cargados correctamente',
                        text: 'El archivo CSV se ha cargado y procesado exitosamente.',
                        confirmButtonColor: '#4CAF50'
                    });
                },
                error: (error) => {
                    console.error("Error al leer el archivo CSV:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cargar el archivo CSV',
                        text: 'Hubo un problema al procesar el archivo CSV. Por favor, intenta nuevamente.',
                        confirmButtonColor: '#E57373'
                    });
                }
            });
        } else if (
            fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            fileType === "application/vnd.ms-excel" ||
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls")
        ) {
            // Procesar archivo Excel
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
    
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                setData(excelData);
                console.log("Datos cargados (Excel):", excelData);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Datos cargados correctamente',
                    text: 'El archivo Excel se ha cargado y procesado exitosamente.',
                    confirmButtonColor: '#4CAF50'
                });
            };
            reader.onerror = (error) => {
                console.error("Error al leer el archivo Excel:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar el archivo Excel',
                    text: 'Hubo un problema al procesar el archivo Excel. Por favor, intenta nuevamente.',
                    confirmButtonColor: '#E57373'
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="w-[350px] h-64 border-2 border-dashed border-blue-500 flex flex-col items-center justify-center text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-gray-500">Subir archivo</span>
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv, .xls, .xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
            {/** {data.length > 0 && <DataAnalyst data={data} className="hidden" />}  */}
        </div>
    );
};

export default UploadFiles;
