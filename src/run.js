import pdfParser from 'pdf2json';
import fs from 'fs'
import path from 'path'
import readline from 'readline'

function processPDF(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new pdfParser(this, 1);


    parser.on('pdfParser_dataReady', (pdfData) => {
      // Here, you can extract the necessary data from 'pdfData' object
      // and resolve with the extracted data.
      const nfe = parser.getRawTextContent();
      
      const name = nfe.substring(
          nfe.indexOf('Razão SocialCPF/CNPJInscrição Estadual') + 'Razão SocialCPF/CNPJInscrição Estadual'.length, 
          nfe.lastIndexOf("Inscrição")
      );

      
      const [firstName, cpf] = dividirStringPorNumeros(name);


      const number = nfe.substring(
          nfe.indexOf('Número da Nota') + 'Número da Nota'.length, 
          nfe.lastIndexOf("Folha")
      );

      const price = nfe.substring(
          nfe.indexOf('VALOR TOTAL DE SERVIÇOS = ') + 'VALOR TOTAL DE SERVIÇOS = '.length, 
          nfe.lastIndexOf("PIS")
      );

      const string = `${firstName.trim()} ${cpf.trim()} ${price.trim()} ${number.trim()}`;


      console.log(string)
      resolve(string);
    });

    parser.on('pdfParser_dataError', (error) => {
      reject(error);
    });

    // Read the PDF file
    // const pdfBuffer = fs.readFileSync(filePath);
    parser.loadPDF(filePath);
  });
}


async function processPDFFilesInDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  var fileData = "";

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    try {
      const pdfData = await processPDF(filePath);
      // Process the extracted data as needed
      // console.log(`Data from file ${file}:`, pdfData);
      if(fileData.length) {
        fileData = fileData + '\n' + pdfData
      } else {
        fileData = pdfData
      }

    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }

    fs.writeFile("./Arquivos.txt", fileData, ()=>{console.log("Pdf convertido!");});
  }
}

const directoryPath = './src/files/'; // Replace with the actual directory path
processPDFFilesInDirectory(directoryPath);




///


function dividirStringPorNumeros(str) {
  // Use uma expressão regular para encontrar o índice onde começa o número
  const match = str.match(/\d/);

  if (match) {
    const index = match.index;
    const parteAntesDoNumero = str.slice(0, index);
    return [parteAntesDoNumero, str.slice(index)];
  } else {
    // Se não houver números, retorne a string original e uma string vazia
    return [str, ""];
  }
}
