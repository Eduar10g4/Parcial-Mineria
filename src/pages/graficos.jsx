import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Para registrar todos los componentes de Chart.js
import { useData } from "../components/context/dataContext";

const Graphics = () => {
    const { data } = useData(); // Datos del contexto
    const [columns, setColumns] = useState([]); // Nombres de columnas
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [chartType, setChartType] = useState('');
    const [chartData, setChartData] = useState(null);

    // Generador de colores dinámicos
    const generateColors = (count) => {
        return Array.from({ length: count }, () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
        );
    };

    // Extrae las columnas del contexto cuando los datos están disponibles
    useEffect(() => {
        if (data && data.length > 0) {
            setColumns(Object.keys(data[0])); // Usa las claves del primer objeto como nombres de columnas
        }
    }, [data]);

    // Actualiza los datos del gráfico basado en las columnas seleccionadas
    useEffect(() => {
        if (selectedColumns.length > 0) {
            const labels = data.map(row => row[selectedColumns[0]]); // Primera columna para etiquetas
            const datasets = selectedColumns.slice(1).map((col, index) => {
                const colors = generateColors(data.length); // Genera colores dinámicos para cada barra o segmento
                return {
                    label: col,
                    data: data.map(row => row[col]),
                    backgroundColor: colors,
                    borderColor: colors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                };
            });

            setChartData({
                labels,
                datasets,
            });
        }
    }, [selectedColumns, data]);

    // Maneja la selección de columnas
    const handleColumnSelection = (column) => {
        setSelectedColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
    };

    // Renderiza el gráfico basado en el tipo seleccionado
    const renderChart = () => {
        if (!chartData) return <p>Por favor seleccione las columnas y un tipo de gráfico.</p>;

        switch (chartType) {
            case 'Bar':
                return <Bar data={chartData} />;
            case 'Pie':
                return <Pie data={chartData} />;
            default:
                return <p>Seleccione un tipo de gráfico.</p>;
        }
    };

    return (
        <div className="max-h-[360px] md:max-h-[520px] w-[85%] p-4 bg-white rounded-lg shadow-md  overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Generador de Gráficos</h2>

            {/* Selección de columnas */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Selecciona las columnas:</h3>
                <div className="flex flex-wrap gap-2">
                    {columns.map((col) => (
                        <button
                            key={col}
                            onClick={() => handleColumnSelection(col)}
                            className={`px-4 py-2 rounded border ${selectedColumns.includes(col) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                        >
                            {col}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selección de tipo de gráfico */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Selecciona el tipo de gráfico:</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setChartType('Bar')}
                        className={`px-4 py-2 rounded border ${chartType === 'Bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        Barras
                    </button>
                    <button
                        onClick={() => setChartType('Pie')}
                        className={`px-4 py-2 rounded border ${chartType === 'Pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        Circular
                    </button>
                    {/**  <button
                        onClick={() => setChartType('HorizontalBar')}
                        className={`px-4 py-2 rounded border ${
                            chartType === 'HorizontalBar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        Columnas Horizontales
                    </button>  */}
                </div>
            </div>

            {/* Gráfico dinámico */}
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Gráfico:</h3>
                <div className=" border p-4 rounded bg-gray-50">{renderChart()}</div>
            </div>
        </div>
    );
};

export default Graphics;
