import DataTable from "react-data-table-component";
import { useMemo, useState, useEffect } from "react";
import { useData } from "../components/context/dataContext";

const DataAnalyst = () => {
    const { data } = useData();
    const [analysis, setAnalysis] = useState(null);
    const [centralTendency, setCentralTendency] = useState(null);
    const [activeTab, setActiveTab] = useState('datatable'); // Estado para la pestaña activa
    const [rowField, setRowField] = useState(''); // Campo para filas
    const [columnField, setColumnField] = useState(''); // Campo para columnas
    const [contingencyTable, setContingencyTable] = useState({}); // Datos de la tabla de contingencia
    const [selectedColumn1, setSelectedColumn1] = useState('');
    const [selectedColumn2, setSelectedColumn2] = useState('');
    const [correlation, setCorrelation] = useState(null);


    // Función para calcular análisis inicial (como .info() de pandas)
    const analyzeData = (data) => {
        if (!data || data.length === 0) return null;

        const columns = Object.keys(data[0]);
        const columnInfo = columns.map((col) => {
            const columnData = data.map(row => row[col]);

            // Limpiar los datos: eliminar saltos de línea y convertir a números cuando sea posible
            const cleanedColumnData = columnData.map(value => {
                // Limpiar caracteres especiales (como saltos de línea) si es necesario
                const cleanedValue = value && typeof value === 'string' ? value.replace(/\n/g, '').trim() : value;

                // Intentar convertir a número
                const numericValue = !isNaN(cleanedValue) ? parseFloat(cleanedValue) : cleanedValue;
                return numericValue;
            });

            const nonNullCount = cleanedColumnData.filter(value => value !== null && value !== undefined).length;
            const nullCount = data.length - nonNullCount;

            // Detectar tipo de dato (número o string)
            let dataType = typeof cleanedColumnData.find(value => value !== null && value !== undefined);
            if (dataType === 'number' && cleanedColumnData.some(value => !isNaN(value))) {
                // Si la columna contiene números, marcarla como 'float64'
                dataType = 'float64';
            } else {
                // Si es una cadena, mantener 'string'
                dataType = 'string';
            }

            // Agregar consola para depurar el tipo de dato
            console.log(`Columna: ${col}`);
            console.log(`Datos: ${cleanedColumnData}`);
            console.log(`Tipo de dato encontrado: ${dataType}`);

            return {
                name: col,
                nonNullCount,
                nullCount,
                dataType: dataType === 'number' ? 'float64' : dataType
            };
        });

        const totalEntries = data.length;
        const totalColumns = columns.length;
        const memoryUsageKB = (JSON.stringify(data).length / 1024).toFixed(2);

        return {
            totalEntries,
            totalColumns,
            memoryUsageKB,
            columnInfo
        };
    };

    // Función para calcular medidas de tendencia central
    const calculateCentralTendency = (data) => {
        if (!data || data.length === 0) return null;

        const columns = Object.keys(data[0]);
        const results = columns.map((col) => {
            const columnData = data.map(row => row[col]);

            // Limpiar los datos: eliminar saltos de línea y convertir a números cuando sea posible
            const cleanedColumnData = columnData.map(value => {
                // Limpiar caracteres especiales (como saltos de línea) si es necesario
                const cleanedValue = value && typeof value === 'string' ? value.replace(/\n/g, '').trim() : value;

                // Intentar convertir a número
                const numericValue = !isNaN(cleanedValue) ? parseFloat(cleanedValue) : cleanedValue;
                return numericValue;
            });

            // Filtrar valores nulos o undefined
            const nonNullData = cleanedColumnData.filter(value => value !== null && value !== undefined);

            // Detectar tipo de dato
            let dataType = typeof nonNullData.find(value => value !== null && value !== undefined);
            if (dataType === 'number' && nonNullData.some(value => !isNaN(value))) {
                // Si la columna contiene números, se marca como cuantitativa
                dataType = 'Cuantitativo';
            } else {
                // Si no es un número, se marca como cualitativa (cadenas de texto)
                dataType = 'Cualitativo';
            }

            // Si es cuantitativo
            if (dataType === 'Cuantitativo') {
                const mean = nonNullData.reduce((a, b) => a + b, 0) / nonNullData.length;
                const sorted = [...nonNullData].sort((a, b) => a - b);
                const median = sorted.length % 2 === 0
                    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                    : sorted[Math.floor(sorted.length / 2)];
                const mode = nonNullData
                    .reduce((acc, val) => {
                        acc[val] = (acc[val] || 0) + 1;
                        return acc;
                    }, {});
                const modeValue = Object.keys(mode).reduce((a, b) => (mode[a] > mode[b] ? a : b));
                const stdDev = Math.sqrt(nonNullData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / nonNullData.length);

                return {
                    name: col,
                    type: "Cuantitativo",
                    mean: isNaN(mean) ? "" : mean.toFixed(2),
                    median: isNaN(median) ? "" : median.toFixed(2),
                    mode: isNaN(modeValue) ? "" : modeValue,
                    stdDev: isNaN(stdDev) ? "" : stdDev.toFixed(2)
                };
            }
            // Si es cualitativo
            else if (dataType === 'Cualitativo') {
                const mode = nonNullData
                    .reduce((acc, val) => {
                        acc[val] = (acc[val] || 0) + 1;
                        return acc;
                    }, {});
                const modeValue = Object.keys(mode).reduce((a, b) => (mode[a] > mode[b] ? a : b));
                const uniqueCount = new Set(nonNullData).size;

                return {
                    name: col,
                    type: "Cualitativo",
                    mode: isNaN(modeValue) ? "" : modeValue,
                    uniqueCount
                };
            }

            return null;
        });

        return results.filter(result => result !== null);
    };

    // Generar la tabla de contingencia
    const generateContingencyTable = () => {
        if (!rowField || !columnField) return;

        const table = {};
        data.forEach((row) => {
            const rowValue = row[rowField];
            const colValue = row[columnField];

            if (!table[rowValue]) {
                table[rowValue] = {};
            }
            table[rowValue][colValue] = (table[rowValue][colValue] || 0) + 1;
        });

        setContingencyTable(table);
    };

    // Renderizar la tabla de contingencia
    const renderContingencyTable = () => {
        const rowKeys = Object.keys(contingencyTable);
        const colKeys = [
            ...new Set(rowKeys.flatMap((rowKey) => Object.keys(contingencyTable[rowKey]))),
        ];

        return (
            <table className="border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2 bg-gray-100">{rowField}</th>
                        {colKeys.map((colKey) => (
                            <th key={colKey} className="border border-gray-400 p-2 bg-gray-100">
                                {colKey}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowKeys.map((rowKey) => (
                        <tr key={rowKey}>
                            <td className="border border-gray-400 p-2 bg-gray-50">{rowKey}</td>
                            {colKeys.map((colKey) => (
                                <td
                                    key={colKey}
                                    className="border border-gray-400 p-2 text-center bg-white"
                                >
                                    {contingencyTable[rowKey][colKey] || 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const clearTable = () => {
        setRowField('');
        setColumnField('');
        setContingencyTable({});
    };

    const getQuantitativeColumns = () => {
        // Verificar si 'data' tiene al menos un elemento
        if (!data || data.length === 0) {
            return []; // Retorna un arreglo vacío si 'data' no está definido o está vacío
        }

        const columns = Object.keys(data[0]); // Obtener las claves de las columnas
        return columns.filter((col) => {
            const columnData = data.map(row => row[col]);

            // Limpiar los datos: eliminar saltos de línea y convertir a números cuando sea posible
            const cleanedColumnData = columnData.map(value => {
                const cleanedValue = value && typeof value === 'string' ? value.replace(/\n/g, '').trim() : value;
                const numericValue = !isNaN(cleanedValue) ? parseFloat(cleanedValue) : cleanedValue;
                return numericValue;
            });

            // Filtrar valores nulos o undefined
            const nonNullData = cleanedColumnData.filter(value => value !== null && value !== undefined);

            // Detectar tipo de dato
            let dataType = typeof nonNullData.find(value => value !== null && value !== undefined);
            if (dataType === 'number' && nonNullData.some(value => !isNaN(value))) {
                dataType = 'Cuantitativo'; // Marcar como cuantitativo
            } else {
                dataType = 'Cualitativo'; // Marcar como cualitativo
            }

            // Retornar si la columna es cuantitativa
            return dataType === 'Cuantitativo';
        });
    };


    const quantitativeColumns = getQuantitativeColumns(); // Obtener las columnas cuantitativas

    // Función para calcular correlación de Pearson
    const calculateCorrelation = (data, column1, column2) => {
        if (!data || data.length === 0 || !column1 || !column2) return null;

        // Extraer las columnas seleccionadas
        const x = data.map(row => row[column1]);
        const y = data.map(row => row[column2]);

        // Filtrar los valores no numéricos
        const filteredData = x.map((value, index) => ({
            x: parseFloat(value),
            y: parseFloat(y[index])
        })).filter(item => !isNaN(item.x) && !isNaN(item.y));

        if (filteredData.length === 0) return null;

        // Cálculo de la correlación de Pearson
        const n = filteredData.length;
        const sumX = filteredData.reduce((sum, item) => sum + item.x, 0);
        const sumY = filteredData.reduce((sum, item) => sum + item.y, 0);
        const sumXY = filteredData.reduce((sum, item) => sum + item.x * item.y, 0);
        const sumX2 = filteredData.reduce((sum, item) => sum + item.x * item.x, 0);
        const sumY2 = filteredData.reduce((sum, item) => sum + item.y * item.y, 0);

        // Fórmula de correlación de Pearson
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (denominator === 0) return null; // Para evitar división por cero

        return numerator / denominator;
    };

    const handleCorrelation = () => {
        const correlationValue = calculateCorrelation(data, selectedColumn1, selectedColumn2);
        setCorrelation(correlationValue);
    };

    // Realizar análisis cuando los datos cambian
    useEffect(() => {
        setAnalysis(analyzeData(data));
        setCentralTendency(calculateCentralTendency(data));
    }, [data]);

    // Definir columnas solo si hay datos
    const columns = useMemo(() => {
        return data.length > 0
            ? Object.keys(data[0]).map((key) => ({
                name: key,
                selector: (row) => row[key],
                sortable: true
            }))
            : [];
    }, [data]);

    return (
        <div className="max-h-[360px] md:max-h-[520px] p-4 bg-white shadow-md rounded-lg w-[85%] mx-auto overflow-auto">
            {/* Tabs */}
            <div className="block md:flex justify-between mb-4 border-b">
                <button
                    className={`p-2 text-lg font-semibold ${activeTab === 'datatable' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    onClick={() => setActiveTab('datatable')}
                >
                    DataTable
                </button>
                <button
                    className={`p-2 text-lg font-semibold ${activeTab === 'analysis' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    Resultados Info
                </button>
                <button
                    className={`p-2 text-lg font-semibold ${activeTab === 'centralTendency' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    onClick={() => setActiveTab('centralTendency')}
                >
                    Medidas de Tendencia Central
                </button>
                <button
                    onClick={() => setActiveTab('TablaContingencia')}
                    className={`p-2 text-lg font-semibold ${activeTab === 'TablaContingencia' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                        }`}
                >
                    Tabla de Contingencia
                </button>
                <button
                    onClick={() => setActiveTab('Correlacion')}
                    className={`p-2 text-lg font-semibold ${activeTab === 'Correlacion' ? 'border-b-2 border-blue-500 text-blue-500' : ''
                        }`}
                >
                    Correlación
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'datatable' && (
                <>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        responsive
                        highlightOnHover
                        noDataComponent={<p>No hay datos para mostrar</p>}
                    />
                </>
            )}

            {activeTab === 'analysis' && analysis && (
                <div className="bg-gray-100 p-4 mb-4 rounded-lg border mt-5">
                    <h3 className="text-lg font-semibold mb-2">Análisis de Datos</h3>
                    <p><strong>Total de Entradas:</strong> {analysis.totalEntries}</p>
                    <p><strong>Total de Columnas:</strong> {analysis.totalColumns}</p>
                    <p><strong>Uso de Memoria:</strong> {analysis.memoryUsageKB} KB</p>

                    <h4 className="text-md font-semibold mt-3">Columnas:</h4>
                    <table className="w-full mt-2 border">
                        <thead>
                            <tr>
                                <th className="border p-2">#</th>
                                <th className="border p-2">Nombre de Columna</th>
                                <th className="border p-2">No Nulos</th>
                                <th className="border p-2">Nulos</th>
                                <th className="border p-2">Tipo de Dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.columnInfo.map((col, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{col.name}</td>
                                    <td className="border p-2">{col.nonNullCount}</td>
                                    <td className="border p-2">{col.nullCount}</td>
                                    <td className="border p-2">{col.dataType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'centralTendency' && centralTendency && (
                <div className="bg-gray-100 p-4 mb-4 rounded-lg border overflow-auto">
                    <h3 className="text-lg font-semibold mb-2">Medidas de Tendencia Central</h3>
                    <table className="w-full mt-2 border">
                        <thead>
                            <tr>
                                <th className="border p-2">Columna</th>
                                <th className="border p-2">Tipo</th>
                                <th className="border p-2">Media</th>
                                <th className="border p-2">Mediana</th>
                                <th className="border p-2">Moda</th>
                                <th className="border p-2">Desviación Estándar</th>
                                <th className="border p-2">Valores Únicos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {centralTendency.map((metric, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{metric.name}</td>
                                    <td className="border p-2">{metric.type}</td>
                                    <td className="border p-2">{metric.mean || '-'}</td>
                                    <td className="border p-2">{metric.median || '-'}</td>
                                    <td className="border p-2">{metric.mode || '-'}</td>
                                    <td className="border p-2">{metric.stdDev || '-'}</td>
                                    <td className="border p-2">{metric.uniqueCount || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'TablaContingencia' && (
                <div className="p-4 mb-4 bg-gray-100 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-3">Generar Tabla de Contingencia</h3>
                    <div className="w-full block md:flex items-center gap-2 ">
                        <div className="w-full mb-4">
                            <label className="block font-semibold mb-1">Campo para Filas:</label>
                            <select
                                className="border p-2 rounded w-full"
                                value={rowField}
                                onChange={(e) => setRowField(e.target.value)}
                            >
                                <option value="">Seleccione un campo</option>
                                {Object.keys(data[0] || {}).map((key, index) => (
                                    <option key={index} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full mb-4">
                            <label className="block font-semibold mb-1">Campo para Columnas:</label>
                            <select
                                className="border p-2 rounded w-full"
                                value={columnField}
                                onChange={(e) => setColumnField(e.target.value)}
                            >
                                <option value="">Seleccione un campo</option>
                                {Object.keys(data[0] || {}).map((key, index) => (
                                    <option key={index} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded shadow"
                        onClick={generateContingencyTable}
                    >
                        Generar Tabla
                    </button>
                    {/* Botón de limpieza */}
                    <div className="w-full flex justify-end ">
                        {Object.keys(contingencyTable).length > 0 && (
                            <button
                                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded shadow"
                                onClick={clearTable}
                            >
                                X
                            </button>
                        )}
                    </div>
                    <div className="mt-4 overflow-auto">
                        {Object.keys(contingencyTable).length > 0 ? renderContingencyTable() : (
                            <p className="text-gray-500">Seleccione campos y haga clic en "Generar Tabla".</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'Correlacion' && (
                <div>
                    {/* Select para elegir columnas */}
                    <div className="w-full space-y-2 md:space-y-0 block md:flex items-center gap-2 ">
                        <select className="border p-2 rounded w-full" onChange={e => setSelectedColumn1(e.target.value)}>
                            <option value="">Seleccione una columna</option>
                            {quantitativeColumns.map((column, index) => (
                                <option key={index} value={column}>{column}</option>
                            ))}
                        </select>

                        <select className="border p-2 rounded w-full" onChange={e => setSelectedColumn2(e.target.value)}>
                            <option value="">Seleccione una columna</option>
                            {quantitativeColumns.map((column, index) => (
                                <option key={index} value={column}>{column}</option>
                            ))}
                        </select>
                    </div>

                    <button className="mt-4" onClick={handleCorrelation}>
                        Calcular Correlación
                    </button>

                    {correlation !== null && (
                        <div>
                            <p>Correlación: {correlation.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default DataAnalyst;
