const printer = require('printer');
const fs = require('fs');

const fileName = process.argv[2];

if (!fileName) {
    console.error('Especifica la ruta del archivo PDF.');
    process.exit(1);
}

fs.readFile(fileName, (err, buffer) => {
    if (err) {
        console.error('Error leyendo el archivo:', err);
        return;
    }

    printer.printDirect({
        data: buffer,
        type: 'PDF',
        success: function (jobID) {
            console.log(`Documento enviado a imprimir con jobID: ${jobID}`);
        },
        error: function (err) {
            console.error('Error imprimiendo:', err);
        }
    });
});
