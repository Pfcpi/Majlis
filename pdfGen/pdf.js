/* eslint-disable prettier/prettier */
const puppeteer = require('puppeteer')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const svgToPdf = require('svg-to-pdfkit')
const path = require('path')

async function generatePDFpv(data, pathReq) {
  let html = `
  <!DOCTYPE html>
  <html lang="fr-FR">
  <head>
      <meta charset="UTF-8">
      <title>PV</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
        body {
    font-family: "PT Serif", serif;
      font-style: normal;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin: 0;
  }
  
  #logo {
      height: 3cm;
  }
  
  #en-tete {
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    line-height: 20px;
  }
  
  .header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-bottom: 0.8cm;
      margin-top: 0.5cm;
      
  }
  
  .title {
      text-align: center;
      margin-bottom: 0.3cm;
  }
  
  h1 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
  }
  
  h2 {
    font-size: 19px;
    font-weight: 600;
  }
  .main {
      flex: 1;
      margin: 0 1cm;
  }
  
  .boxp {
      text-align: left;
      margin-right: 0.5cm;
      margin-top: 0;
      margin-bottom: 0.05cm;
  }
  
  .parg {
      display: inline-block;
      text-align: justify;
      font-size: 18px;
      font-weight: 500;
  }
  
  .boxl {
      text-align: left;
      margin-right: 0.5cm;
      margin-bottom: 0.5cm;
  }
  
  .list {
      display: inline-block;
      text-align: justify;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  .boxs {
      text-align: right;
      margin-bottom: 0.5cm;
      margin-right: 1.2cm;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }

  #pied-page {
    height: 1.3cm;
    width: 21.4cm;
  }
  
  footer {
    flex: 0;
  }
    </style>
  </head>
  <body>
    <div class="header">
        <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
        <p id="en-tete">
            People's Democratic Republic of Algeria<br>
            Ministry of Higher Education and Scientific Research<br>
            University of Science and Technology of Oran Mohamed BOUDIAF<br>
            Faculty of Mathematics and Computer Science
        <p>
    </div>
    <div class="title">
        <h1>
            Procès-Verbal du Conseil de Discipline<br>
            du Département d'Informatique
        </h1>
        <h2>Date du PV: <span>${data.datePV}</span></h2>
    </div>
    <div class="main">
        <div class="boxp">
            <p class="parg">
            Suite à l'infraction commise: <span class="infos">${data.motifI}</span>, un conseil de discipline s'est tenu le <span class="infos">${data.dateCD}</span>, sous la demande de : M./Mme.<span class="infos"> ${data.nomP} ${data.prenomP}</span> à l'encontre l'étudiant(e) concerné(e) suivant:</p>
        </div>
        <div class="boxl">
            <ul class="list">
                <li>Matricule: <span class="infos">${data.matriculeE}</span></li>
                <li>Nom et prénom: <span class="infos">${data.nomE} ${data.prenomE}</span></li>
                <li>Niveau d'étude: <span class="infos">${data.niveauE}-S${data.sectionE}G${data.groupeE}</span></li>
            </ul>
        </div>
        <div class="boxp">
            <p class="parg">En présence des membres suivants:</p>
        </div>
        <div class="boxl">
            <ul class="list" id="membrel">
            </ul>
        </div>
        <div class="boxp">
            <p class="parg" id="temoinp" style="display: none;">Et en présence des temoins suivants:</p>
        </div>
        <div class="boxl">
            <ul class="list" id ="temoinl" style="display: none;">
            </ul>
        </div>
        <div class="boxp">
            <p class="parg">Suite à ce conseil, les membres ont tranché sur la décision suivante: <span class="infos">${data.libeleS}</span></p>
        </div>
    </div>
    <div class="footer">
    <div class="boxs">
            <p class="sign">
                Président de la commission:<br>
                M./Mme.<span class="infos"> ${data.nomPR} ${data.prenomPR}</span>
            </p>
        </div>
        <img src="https://i.goopics.net/sxwqhc.png" alt="pied-de-page USTO" id="pied-page">
    </div>

    <script>
    function maj(chaine) {
    return chaine.charAt(0).toUpperCase() + chaine.slice(1)
    }

    // Function to add dynamic data to the membre list
        function addDynamicMembre() {
            const list = document.getElementById('membrel');
            const data1 = ${JSON.stringify(data.nomM)};
            const data2 = ${JSON.stringify(data.prenomM)};
            const dataArray1 = data1.split(',');
            const dataArray2 = data2.split(',');
            for (let i = 0; i < dataArray1.length; i++) {
                const listItem = document.createElement('li');
                const fullName = dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]);
                listItem.innerHTML = 'M./Mme. ' + '<span class="infos">' + fullName + '</span>';
                list.appendChild(listItem);
            }
        }

    // Function to add dynamic data to the temoin list
        function addDynamicTemoin() {
            const list = document.getElementById('temoinl');
            const data1 = ${JSON.stringify(data.nomT)};
            const data2 = ${JSON.stringify(data.prenomT)};
            const dataArray1 = data1.split(',');
            const dataArray2 = data2.split(',');
            if (dataArray1.length > 0 && dataArray1[0] !== "") {
                visTemoin();
                for (let i = 0; i < dataArray1.length; i++) {
                    const listItem = document.createElement('li');
                    const fullName = dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]);
                    listItem.innerHTML = 'M./Mme. ' + '<span class="infos">' + fullName + '</span>';
                    list.appendChild(listItem);
                }
            }
        }

        function visTemoin() {
            const parg = document.getElementById('temoinp');
            const list = document.getElementById('temoinl');
            parg.style.display = "block";
            list.style.display = "block";
        }

        document.addEventListener('DOMContentLoaded', function() {
            addDynamicMembre();
            addDynamicTemoin();
        });
    </script>
  </body>
  </html>
  `
  // Create a temporary HTML file
  //const tempHtmlPath = path.join(pathReq, 'temp.html')
  //fs.writeFileSync(tempHtmlPath, html, 'utf-8')

  /*const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  //await page.goto(tempHtmlPath)

  // Generate PDF
  const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '0.5cm' }, timeout: 60000 })

  let pathPDF = path.join(pathReq, 'sortie.pdf')

  // Write PDF to file system
  fs.writeFile(pathPDF, pdfBuffer, (err) => {
    if (err) {
      console.error('Error writing PDF:', err)
    } else {
      console.log('PDF saved successfully!')
    }
  })*/
  var doc = new PDFDocument({ margin: 0, size: 'A4' })

  const writableStream = fs.createWriteStream('public/sortie.pdf')

  // Write some content to the PDF
  doc.text('PV you human.')

  // End the document
  doc.end()

  // Pipe the PDF content to the file stream
  doc.pipe(writableStream)

  // Handle errors
  writableStream.on('error', (err) => {
    console.error('Error occurred:', err)
    return 'Error occured'
  })

  // Handle finish event
  writableStream.on('finish', () => {
    console.log('PDF saved successfully.')
    return 'PDF saved successfully'
  })

  return
}

async function generatePDFrapport(data, pathReq) {
  let html = `
  <!DOCTYPE html>
  <html lang="fr-FR">
  <head>
  <meta charset="UTF-8">
  <title>Rapport</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <style>
  
  body {
    font-family: "PT Serif", serif;
      font-style: normal;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin: 0;
  }
  
  #logo {
      height: 3cm;
  }
  
  #en-tete {
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    line-height: 20px;
  }
  
  .header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-bottom: 2.5cm;
  }
  
  .title {
      text-align: center;
      margin-bottom: 1cm;
  }
  
  h1 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
  }
  
  h2 {
    font-size: 19px;
    font-weight: 600;
  }
  .main {
      flex: 1;
      margin: 0 1.5cm;
  }
  
  .boxp {
      text-align: left;
      margin-right: 0.5cm;
      margin-bottom: 0.05cm;
  }
  
  .parg {
      display: inline-block;
      text-align: justify;
      font-size: 18px;
      font-weight: 500;
  }
  
  .boxl {
      text-align: left;
      margin-right: 0.5cm;
      margin-bottom: 1cm;
  }
  
  .list {
      display: inline-block;
      text-align: justify;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  .boxs {
      text-align: right;
      margin-bottom: 0.5cm;
      margin-right: 1.2cm;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }

  #pied-page {
    height: 1.3cm;
    width: 21.4cm;
  }
  
  footer {
    flex: 0;
  }
  
  </style>
  </head>
  <body>
      <div class="header">
          <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
          <p id="en-tete">
              People's Democratic Republic of Algeria<br>
              Ministry of Higher Education and Scientific Research<br>
              University of Science and Technology of Oran Mohamed BOUDIAF<br>
              Faculty of Mathematics and Computer Science
          <p>
      </div>
      <div class="title">
          <h1>
                Rapport pour un conseil de discipline<br>
            du département d'informatique
          </h1>
          <h2>Date du rapport: <span>${data.dateR}</span></h2>
      </div>
      <div class="main">
          <div class="boxp">
              <p class="parg">
                  En raison de l'infraction suivante : <span class="infos">${data.motifI}</span>, le  <span class="infos">${data.dateI}</span> à <span class="infos">${data.lieuI}</span>, commise par l'étudiant(e) suivant(e):
              </p>
          </div>
          <div class="boxl">
              <ul class="list">
                  <li>Matricule: <span class="infos">${data.matriculeE}</span></li>
                  <li>Nom et prénom: <span class="infos">${data.nomE} ${data.prenomE}</span></li>
                  <li>Niveau d'étude: <span class="infos">${data.niveauE}-S${data.sectionE}G${data.groupeE}</span></li>
              </ul>
          </div>
          <div class="boxp">
              <p class="parg">Un conseil de discipline est demandé par le plaignant suivant:</p>
          </div>
          <div class="boxl">
              <ul class="list">
                  <li>M./Mme. <span class="infos">${data.nomP} ${data.prenomP}</span></li>
              </ul>
          </div>
      </div>
      <div class="boxs">
              <p class="sign">
                  Chef du département:<br>
                  M./Mme.<span class="infos"> ${data.nomC} ${data.prenomC}</span>
              </p>
        </div>
      <div class="footer">
          <img src="https://i.goopics.net/sxwqhc.png" alt="pied-de-page USTO" id="pied-page">
      </div>
  </body>
  </html>
  `

  // Create a temporary HTML file
  /*const tempHtmlPath = path.join(pathReq, 'temp.html')
  fs.writeFileSync(tempHtmlPath, html, 'utf-8')*/

  /*const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  //console.log('tempHtmlPath: ', tempHtmlPath)
  //await page.goto(tempHtmlPath)

  // Generate PDF
  console.log('1')
  const pdfBuffer = await page.pdf()
  console.log('2')

  //let pathPDF = path.join(pathReq, 'sortie.pdf')
  //let file_name = data.numr.toString().concat('.pdf')
  let pathPDF = path.join(pathReq, 'sortie.pdf')

  // Write PDF to file system
  fs.writeFile(pathPDF, pdfBuffer, (err) => {
    if (err) {
      console.error('Error writing PDF:', err)
    } else {
      console.log('PDF saved successfully!')
    }
  })*/

  //A4 size: 595.28 x 841.89
  var doc = new PDFDocument({ margin: 0, size: 'A4' })

  const writableStream = fs.createWriteStream('public/sortie.pdf')

  //fonts
  const pt_serif_folder = path.join(__dirname, 'fonts', 'PT_Serif')
  const pt_bold = path.join(pt_serif_folder, 'PTSerif-Bold.ttf')
  const pt_boldItalic = path.join(pt_serif_folder, 'PTerif-BoldItalic.ttf')
  const pt_Italic = path.join(pt_serif_folder, 'PTSerif-Italic.ttf')
  const pt_regular = path.join(pt_serif_folder, 'PTSerif-Regular.ttf')

  const leadingFactor = 1.2
  const md = 13
  const leadingmd = md * leadingFactor
  const lg = 16
  const leadinglg = lg * leadingFactor
  const xl = 20
  const leadingxl = xl * leadingFactor

  //Entete
  const headerW = 500
  const headerH = 100
  const headerX = (doc.page.width - headerW) / 2
  const headerY = 0

  const ustoLogoDimention = 90
  doc.rect(headerX, headerY, headerW, headerH)

  pathImages = path.join(__dirname, 'imagesForPDF')
  const svgData = fs.readFileSync(path.join(pathImages, 'entete.svg'), 'utf8')
  svgToPdf(doc, svgData, headerX + 120, headerY + 15)
  doc.image('imagesForPDF/ustoLogo.jpg', headerX + 10, headerY, {
    fit: [ustoLogoDimention, ustoLogoDimention]
  })

  const TitleY = 170
  doc
    .font(pt_bold)
    .fontSize(xl)
    .text('Rapport pour un conseil de discipline', 0, TitleY, { align: 'center' })
  doc.fontSize(xl).text("du département d'informatique", 0, TitleY + 30, { align: 'center' })
  doc.fontSize(lg).text('Date du rapport: ' + data.dateR, 0, TitleY + 66, { align: 'center' })

  //Détails de l'infraction
  const marginText = 40

  doc.font(pt_regular)
  const text1i = "En raison de l'infraction suivante : "
  const text2i = data.motifI
  const text3i = ', le '
  const text4i = data.dateI
  const text5i = ' à '
  const text6i = data.lieuI
  const text7i = ", commise par l'étudiant(e) suivant(e): "

  const InfractionY = TitleY + 130
  doc
    .font(pt_regular)
    .fontSize(md)
    .text(text1i, marginText, InfractionY, {
      continued: true,
      align: 'left',
      width: doc.page.width - marginText * 2
    })

  doc.font(pt_bold)
  doc.text(text2i, { continued: true })
  doc.font(pt_regular)
  doc.text(text3i, { continued: true })
  doc.font(pt_bold)
  doc.text(text4i, { continued: true })
  doc.font(pt_regular)
  doc.text(text5i, { continued: true })
  doc.font(pt_bold)
  doc.text(text6i, { continued: true })
  doc.font(pt_regular)
  doc.text(text7i, { continued: false })

  //Détails de l'étudiant
  const marginList = 60
  const StudentDetailsY = doc.y + leadingmd

  doc.text('\u2022 ' + 'Matricule: ', marginList, StudentDetailsY, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.matriculeE}`)
  doc.font(pt_regular)
  doc.text('\u2022 ' + 'Nom et prénom: ', marginList, StudentDetailsY + leadingmd, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.nomE} ${data.prenomE}`)
  doc.font(pt_regular)
  doc.text('\u2022 ' + "Niveau d'étude: ", marginList, StudentDetailsY + leadingmd * 2, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.niveauE}-S${data.sectionE}G${data.groupeE}`)

  //Détails de plaignant
  const plaignantDetailsY = doc.y + leadingmd * 3
  doc.font(pt_regular)
  doc.text(
    'Un conseil de discipline est demandé par le plaignant suivant:',
    marginText,
    plaignantDetailsY,
    {
      align: 'left',
      width: doc.page.width - marginText * 2
    }
  )
  doc.text('\u2022 ' + 'M./Mme: ', marginList, plaignantDetailsY + leadingmd + 15, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.nomP} ${data.prenomP}`)

  //Signature

  const textSignature = 'M./Mme: '
  const nomPrenomChef = `${data.nomC} ${data.prenomC}`
  const text1Signature = 'Chef du département:'
  const textSignatureW = doc.widthOfString(textSignature, { font: pt_regular, size: md })
  const nomPrenomChefW = doc.widthOfString(nomPrenomChef, { font: pt_bold, size: md })
  const text1SignatureW = doc.widthOfString(text1Signature, { font: pt_regular, size: md })
  const secondLineW = textSignatureW + nomPrenomChefW

  const signatureW = Math.max(text1SignatureW, secondLineW) + 20
  const signatureH = 100
  const signatureX = doc.page.width - signatureW
  const signatureY = 670

  doc.rect(signatureX, signatureY, signatureW, signatureH)

  doc.font(pt_regular)
  doc.text(text1Signature, signatureX, signatureY, {
    align: 'center'
  })
  doc.text(textSignature, signatureX + (signatureW - secondLineW) / 2, signatureY + 20, {
    continued: true
  })
  doc.font(pt_bold)
  doc.text(nomPrenomChef)

  const footerHeight = 50
  doc.image('imagesForPDF/footer.png', 0, doc.page.height - footerHeight, {
    fit: [doc.page.width, footerHeight],
    width: doc.page.width
  })

  // End the document
  doc.end()

  // Pipe the PDF content to the file stream
  doc.pipe(writableStream)

  // Handle errors
  writableStream.on('error', (err) => {
    console.error('Error occurred:', err)
    return 'err while generating the pdf'
  })

  // Handle finish event
  writableStream.on('finish', () => {
    console.log('PDF saved successfully.')
    return 'PDF saved successfully'
  })
}

async function generatePDFcd(data, pathReq) {
  let html = `
    <!DOCTYPE html>
  <html lang="fr-FR">
  <head>
  <meta charset="UTF-8">
  <title>Rapport</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <style>
  
  body {
    font-family: "PT Serif", serif;
      font-style: normal;
      display: flex;
      flex-direction: column;
      margin: 0;
      font-weight: 500;
  }
  
  #logo {
      height: 3cm;
  }
  
  #en-tete {
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    line-height: 20px;
  }
  
  .header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-bottom: 1cm;
      
  }
  
  .title {
      text-align: center;
      margin-bottom: 0.5cm;
  }
  
  h1 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
  }
  
  h2 {
    font-size: 19px;
    font-weight: 600;
  }
  .main {
      flex: 1;
      margin: 0 1.5cm;
  }
  
  .boxp {
      text-align: left;
      margin-right: 0.5cm;
      margin-bottom: 0.05cm;
  }
  
  .parg {
      display: inline-block;
      text-align: justify;
      font-size: 18px;
      font-weight: 500;
  }
  
  .boxl {
      text-align: left;
      margin-right: 0.5cm;
      margin-bottom: 0.3cm;
  }
  
  .list {
      display: inline-block;
      text-align: justify;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }

  table {
    margin: 0.5cm auto 1cm;
    border-collapse: collapse;
  }
  th, td {
    border: 2px solid black;
    padding: 10px;
    
  }

  th {
    font-weight: 600;
  }
  
  .boxs {
      text-align: right;
      margin-bottom: 0.5cm;
      margin-right: 1.2cm;
    }
  
  .sign {
      display: inline-block;
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }

  #pied-page {
    height: 1.3cm;
    width: 21.4cm;
  }
  
  footer {
    flex: 0;
  }
  
  </style>
  </head>
  <body>
        <div class="header">
            <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
            <p id="en-tete">
                People's Democratic Republic of Algeria<br>
                Ministry of Higher Education and Scientific Research<br>
                University of Science and Technology of Oran Mohamed BOUDIAF<br>
                Faculty of Mathematics and Computer Science
            <p>
        </div>
        <div class="title">
            <h1>
                Procès-Verbal du Conseil de Discipline<br>
                du Département d'Informatique
            </h1>
            <h2>Date du PV: <span>${data.datePV}</span></h2>
        </div>
        <div class="main">
        <div class="boxp">
            <p class="parg">
                En ce jour, le ${data.dateCD}, s'est tenue une réunion du conseil de discipline du département d'informatique en présence des membres suivants:
            </p>
        </div>
        <div class="boxl">
            <ul class="list" id="membres">
            </ul>
        </div>
        <div class="boxp">
            <p class="parg">
                Le tableau ci-dessous résume les cas et les décisions prises pour chacun des étudiants concernés conformément à l'arrêté ministériel n°371.
            </p>
        </div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>Étudiants concernés</th>
                        <th>Faits rapportés</th>
                        <th>Plaignants</th>
                        <th>Décisions du conseil de discipline</th>
                    </tr>
                </thead>
                <tbody id="tab"></tbody>
            </table>
        </div>
        </div>
        <div class="footer">
        <div class="boxs">
            <p class="sign">
                Président de la commission:<br>
                M./Mme.<span class="infos"> ${data.nomPR}</span> <span class="infos">${data.prenomPR}</span>
            </p>
        </div>
          <img src="https://i.goopics.net/sxwqhc.png" alt="pied-de-page USTO" id="pied-page">
        </div>
        <script>
            function maj(chaine) {
                return chaine.charAt(0).toUpperCase() + chaine.slice(1)
            }
            
            // Function to add dynamic data to the membre list
            function addDynamicMembre() {
                const list = document.getElementById('membres');
                const data1 = ${JSON.stringify(data.nomM)};
                const data2 = ${JSON.stringify(data.prenomM)};
                const dataArray1 = data1.split(',');
                const dataArray2 = data2.split(',');
                for (let i = 0; i < dataArray1.length; i++) {
                    const listItem = document.createElement('li');
                    const fullName = dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]);
                    listItem.innerHTML = 'M./Mme. ' + '<span class="infos">' + fullName + '</span>';
                    list.appendChild(listItem);
                }
            }
            
            // Function to add dynamic data to the table
            function addDynamicPV() {
                const table = document.getElementById('tab');
                const data1 = ${JSON.stringify(data.nomE)};
                const data2 = ${JSON.stringify(data.prenomE)};
                const data3 = ${JSON.stringify(data.niveauE)};
                const data4 = ${JSON.stringify(data.sectionE)};
                const data5 = ${JSON.stringify(data.groupeE)};
                const data6 = ${JSON.stringify(data.motifI)};
                const data7 = ${JSON.stringify(data.nomP)};
                const data8 = ${JSON.stringify(data.prenomP)};
                const data9 = ${JSON.stringify(data.libeleS)};
                
                const dataArray1 = data1.split(',');
                const dataArray2 = data2.split(',');
                const dataArray3 = data3.split(',');
                const dataArray4 = data4.split(',');
                const dataArray5 = data5.split(',');
                const dataArray6 = data6.split(',');
                const dataArray7 = data7.split(',');
                const dataArray8 = data8.split(',');
                const dataArray9 = data9.split(',');

                for (let i = 0; i < dataArray1.length; i++) {
                    const row = document.createElement('tr');
                    const cell1 = document.createElement('td');
                    cell1.innerHTML = dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]) + '<br>' + dataArray3[i] + '-S' + dataArray4[i] + 'G' + dataArray5[i];
                    row.appendChild(cell1);
                    
                    const cell2 = document.createElement('td');
                    cell2.textContent = dataArray6[i];
                    row.appendChild(cell2);
                    
                    const cell3 = document.createElement('td');
                    const plaignant = 'M./Mme. ' + dataArray7[i].toUpperCase() + ' ' + maj(dataArray8[i]);
                    cell3.textContent = plaignant;
                    row.appendChild(cell3);
                    
                    const cell4 = document.createElement('td');
                    cell4.textContent = dataArray9[i];
                    row.appendChild(cell4);
                    
                    table.appendChild(row);
                }
            }

            document.addEventListener('DOMContentLoaded', function() {
                addDynamicPV();
                addDynamicMembre();
            });
        </script>
  </body>
  </html>
 `

  // Create a temporary HTML file
  //const tempHtmlPath = path.join(pathReq, 'temp.html')
  //fs.writeFileSync(tempHtmlPath, html, 'utf-8')

  /*const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  //await page.goto(tempHtmlPath)

  // Calculer la hauteur totale du contenu
  const contentHeight = await page.evaluate(() => {
    return document.body.scrollHeight
  })

  // Calculer le nombre de pages
  const pageHeight = 1122
  const numPages = Math.ceil(contentHeight / pageHeight)

  // Arrondir le nombre de pages à la centaine supérieure
  const minHeight = Math.ceil(numPages * 100)

  // Mettre à jour le min-height du body en fonction du nombre de pages arrondi
  await page.evaluate((minHeight) => {
    document.body.style.minHeight = `${minHeight}vh`
  }, minHeight)

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '0.5cm', bottom: '0.5cm' },
    timeout: 60000
  })

  let pathPDF = path.join(pathReq, 'sortie.pdf')

  // Write PDF to file system
  fs.writeFile(pathPDF, pdfBuffer, (err) => {
    if (err) {
      console.error('Error writing PDF:', err)
    } else {
      console.log('PDF saved successfully!')
    }
  })*/

  var doc = new PDFDocument({ margin: 0, size: 'A4' })

  const writableStream = fs.createWriteStream('public/sortie.pdf')

  // Write some content to the PDF
  doc.text('cd while doint it')

  // End the document
  doc.end()

  // Pipe the PDF content to the file stream
  doc.pipe(writableStream)

  // Handle errors
  writableStream.on('error', (err) => {
    console.error('Error occurred:', err)
  })

  // Handle finish event
  writableStream.on('finish', () => {
    console.log('PDF saved successfully.')
  })

  return
}

module.exports = { generatePDFpv, generatePDFrapport, generatePDFcd }
