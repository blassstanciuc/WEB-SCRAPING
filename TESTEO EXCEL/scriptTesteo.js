const xlsx = require('xlsx');
const path = require('path');
const readline = require('readline');

// Configurar readline para leer la entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//RUTA AL ARCHIVO A CHEQUEAR
const fixedPath = path.resolve(__dirname, 'C:/Users/blass/OneDrive/Desktop/PRUEBAS');
//RUTA DE ARCHIVO CHERQUEO
const documentNumbersFilePath = path.resolve(__dirname, 'C:/Users/blass/OneDrive/Desktop/PRUEBAS/EANS_PARA_CHEQUEO.xlsx');

// Nombre de la hoja de trabajo predefinido
const sheetName = 'Productos';

// Lista de números de documentos que quieres revisar
//const documentNumbers = [7622201735258, 67890, 23456, 78901, 7790580697303,9999999999];

// Preguntar al usuario la ruta del archivo
rl.question('Ingrese el nombre del archivo Excel a chequear: ', (fileName) => {
    const excelFilePath = path.join(fixedPath, fileName);
    try {
        // Leer el archivo Excel que contiene los números de EANS a chequear
        const docNumbersWorkbook = xlsx.readFile(documentNumbersFilePath);
        const docNumbersSheet = docNumbersWorkbook.Sheets[sheetName];
        
        if (!docNumbersSheet) {
            console.error(`La hoja de trabajo '${sheetName}' no se encontró en el archivo de números de documentos.`);
            process.exit(1);
        }

        // Convertir la hoja de trabajo de números de documentos a un JSON
        const docNumbersData = xlsx.utils.sheet_to_json(docNumbersSheet);

        // Nombre de la columna que contiene los números de documentos en el archivo de números de documentos
        const documentColumnEAN = 'EAN';

        // Obtener los números de documentos del archivo de números de documentos
        const documentNumbers = docNumbersData.map(row => row[documentColumnEAN]);
//------------------------------------------------------------------------------------------
        // Leer el archivo Excel
        const workbook = xlsx.readFile(excelFilePath);
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            console.error(`La hoja de trabajo '${sheetName}' no se encontró en el archivo.`);
            rl.close();
            return;
        }

        // Convertir la hoja de trabajo a un JSON
        const data = xlsx.utils.sheet_to_json(sheet);

        // Nombre de la columna que contiene los números de documentos
        const documentColumn = 'EAN';

        // Verificar si los números de documentos existen en la columna
        const foundDocuments = data.filter(row => documentNumbers.includes(row[documentColumn]));

        // Mostrar los documentos encontrados
        console.log("EANS ENCONTRADOS:");
        console.log(foundDocuments);

        // Para mostrar los documentos que no se encontraron
        const foundDocumentNumbers = foundDocuments.map(doc => doc[documentColumn]);
        const missingDocuments = documentNumbers.filter(doc => !foundDocumentNumbers.includes(doc));

        const missingRows = docNumbersData.filter(row => missingDocuments.includes(row[documentColumn]));


        console.log("EANS NO ENCONTRADOS:");
        missingDocuments.forEach(docNumber => {
            const missingDocument = docNumbersData.find(row => row[documentColumn] === docNumber);
            if (missingDocument) {
                console.log(`EAN: ${docNumber}`);
            }
        });
        console.log("-----------------------------------------------------------------------------");

        console.log("PRODUCTOS CON DESCRIPCION");

        missingDocuments.forEach(docNumber => {
            const missingDocument = docNumbersData.find(row => row[documentColumn] === docNumber);
            if (missingDocument) {
                console.log(missingDocument);
            }
        });
    } catch (error) {
        console.error("Error al leer el archivo Excel:", error.message);
    } finally {
        // Cerrar la interfaz readline
        rl.close();
    }
});

