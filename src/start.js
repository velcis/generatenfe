import fs from 'fs';
import path from 'path'
import PDFParser from "pdf2json";
const analyzePdf = new PDFParser(this, 1);
const folderPath = './src/files/'; 

function run(filePath) {
  analyzePdf.on("pdfParser_dataError", 
  errData => console.error(errData.parserError) );
  
  analyzePdf.on("pdfParser_dataReady", pdfData => {
    const nfe = analyzePdf.getRawTextContent();
    
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
    
  });
  
  
  // fs.writeFile("./Arquivos.txt", string, ()=>{console.log("Pdf convertido!");});

  
  analyzePdf.loadPDF(filePath);
}

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


// fs.readdir(folderPath, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }

//   files.forEach((file) => {
//     const filePath = path.join(folderPath, file);
//     // console.log(filePath)
//     run(folderPath + file)
//   })
// })

run("src/files/nfse_1724.pdf");
// run("src/files/nfse_1727.pdf");
// run("src/files/nfse_1728.pdf")
