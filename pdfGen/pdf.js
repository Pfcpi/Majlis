/* eslint-disable prettier/prettier */
const puppeteer = require('puppeteer')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const svgToPdf = require('svg-to-pdfkit')
const path = require('path')

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

const marginList = 60
const marginText = 40
const footerHeight = 50

const ustoLogoDimention = 70
const headerW = 500
const headerH = 100
const headerY = 0
const pdTop = headerY + 10

function maj(chaine) {
  return chaine.charAt(0).toUpperCase().concat(chaine.slice(1))
}

async function generatePDFpv(data, isSendingEmail) {
  return new Promise((resolve, reject) => {
    var doc = new PDFDocument({ margin: 0, size: 'A4' })

    const writableStream = fs.createWriteStream('public/sortie.pdf')

    //Entete
    const headerX = (doc.page.width - headerW) / 2

    doc.rect(headerX, headerY, headerW, headerH)

    pathImages = path.join(__dirname, 'imagesForPDF')
    const svgData = fs.readFileSync(path.join(pathImages, 'entete.svg'), 'utf8')
    svgToPdf(doc, svgData, headerX + 120, headerY + 15)
    doc.image('imagesForPDF/ustoLogo.jpg', headerX + 10, pdTop, {
      fit: [ustoLogoDimention, ustoLogoDimention]
    })

    const TitleY = 120
    doc
      .font(pt_bold)
      .fontSize(xl)
      .text('Procès-Verbal du Conseil de Discipline', 0, TitleY, { align: 'center' })
    doc.fontSize(xl).text("du Département d'Informatique", 0, TitleY + 30, { align: 'center' })
    doc.fontSize(lg).text('Date du PV: ' + data.datePV, 0, TitleY + 66, { align: 'center' })

    //Détails de l'infraction
    doc.font(pt_regular)
    const text1i = "Suite à l'infraction commise: "
    const text2i = data.motifI
    const text3i = ",  un conseil de discipline s'est tenu le "
    const text4i = data.dateCD
    const text5i = ', sous la demande de : M./Mme. '
    const text6i = data.nomP + ' ' + data.prenomP
    const text7i = ", à l'encontre l'étudiant(e) concerné(e) suivant:"

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
    const StudentDetailsY = doc.y + leadingmd

    doc.text('\u2022 ' + 'Matricule: ', marginList, StudentDetailsY, {
      continued: true,
      align: 'left',
      width: doc.page.width - marginList * 2
    })
    doc.font(pt_bold)
    doc.text(`${data.matriculeE}`)
    doc.font(pt_regular)
    doc.text('\u2022 ' + 'Nom et prénom: ', marginList, doc.y, {
      continued: true,
      align: 'left',
      width: doc.page.width - marginList * 2
    })
    doc.font(pt_bold)
    doc.text(`${data.nomE} ${data.prenomE}`)
    doc.font(pt_regular)
    doc.text('\u2022 ' + "Niveau d'étude: ", marginList, doc.y, {
      continued: true,
      align: 'left',
      width: doc.page.width - marginList * 2
    })
    doc.font(pt_bold)
    doc.text(`${data.niveauE}-S${data.sectionE}G${data.groupeE}`)

    //détails des membres présentes
    const membresdetailsy = doc.y + leadingmd * 1
    doc.font(pt_regular)
    doc.text('en présence des membres suivants: ', marginText, membresdetailsy, {
      align: 'left',
      width: doc.page.width - marginText * 2
    })

    const dataArray1 = data.nomM.split(',')
    const dataArray2 = data.prenomM.split(',')

    doc.y = doc.y + leadingmd

    if (dataArray1.length > 0 && dataArray1[0] !== '') {
      for (let i = 0; i < dataArray1.length; i++) {
        doc.font(pt_regular)
        doc.text('\u2022 ' + 'm./Mme: ', marginList, doc.y, {
          continued: true,
          align: 'left',
          width: doc.page.width - marginList * 2
        })
        doc.font(pt_bold)
        doc.text(dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]))
      }
    }

    if (data.nomT != null && data.prenomT != null) {
      //Détails des témoins présentes
      const temoinsDetailsY = doc.y + leadingmd * 1
      doc.font(pt_regular)
      doc.text('En présence des témoins suivants: ', marginText, temoinsDetailsY, {
        align: 'left',
        width: doc.page.width - marginText * 2
      })
      const dataArrayt1 = data.nomT.split(',')
      const dataArrayt2 = data.prenomT.split(',')

      doc.y = doc.y + leadingmd

      if (dataArrayt1.length > 0 && dataArrayt1[0] !== '') {
        for (let i = 0; i < dataArrayt1.length; i++) {
          doc.font(pt_regular)
          doc.text('\u2022 ' + 'M./Mme: ', marginList, doc.y, {
            continued: true,
            align: 'left',
            width: doc.page.width - marginList * 2
          })
          doc.font(pt_bold)
          doc.text(dataArrayt1[i].toUpperCase() + ' ' + maj(dataArrayt2[i]))
        }
      }
    }
    //Décision

    doc.font(pt_regular)
    doc.text(
      'Suite à ce conseil, les membres ont tranché sur la décision suivante: ',
      marginText,
      doc.y + leadingmd,
      {
        align: 'left',
        continued: true,
        width: doc.page.width - marginText * 2
      }
    )
    doc.font(pt_bold)
    doc.text(data.libeleS)

    //Signature
    const textSignature = 'M./Mme: '
    const nomPrenomPR = `${data.nomPR} ${data.prenomPR}`
    const text1Signature = 'Président de la commission:'
    const textSignatureW = doc.widthOfString(textSignature, { font: pt_regular, size: md })
    const nomPrenomPRW = doc.widthOfString(nomPrenomPR, { font: pt_bold, size: md })
    const text1SignatureW = doc.widthOfString(text1Signature, { font: pt_regular, size: md })
    const secondLineW = textSignatureW + nomPrenomPRW

    const signatureW = Math.max(text1SignatureW, secondLineW) + marginText * 2
    const signatureH = 100
    const signatureX = doc.page.width - signatureW
    const defaultSignatureY = 670
    const signatureY = doc.y > defaultSignatureY ? doc.y + 10 : defaultSignatureY

    doc.rect(signatureX, signatureY, signatureW, signatureH)

    doc.font(pt_regular)
    doc.text(text1Signature, signatureX, signatureY, {
      align: 'center'
    })
    doc.text(textSignature, signatureX + (signatureW - secondLineW) / 2, signatureY + 20, {
      continued: true
    })
    doc.font(pt_bold)
    doc.text(nomPrenomPR)

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
      reject('Error occured while generating pdf')
    })

    // Handle finish event
    writableStream.on('finish', () => {
      console.log('PDF saved successfully.')

      if (isSendingEmail) {
        const pdfPath = path.join(__dirname, 'public', 'sortie.pdf')
        fs.readFile(pdfPath, (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve(data) // Return the buffer
        })
      } else {
        resolve('PDF generated successfully')
      }
    })
  })
}

async function generatePDFrapport(data, pathReq) {
  //A4 size: 595.28 x 841.89
  var doc = new PDFDocument({ margin: 0, size: 'A4' })

  const writableStream = fs.createWriteStream('public/sortie.pdf')

  //Entete
  const headerX = (doc.page.width - headerW) / 2

  doc.rect(headerX, headerY, headerW, headerH)

  pathImages = path.join(__dirname, 'imagesForPDF')
  const svgData = fs.readFileSync(path.join(pathImages, 'entete.svg'), 'utf8')
  svgToPdf(doc, svgData, headerX + 120, headerY + 15)
  doc.image('imagesForPDF/ustoLogo.jpg', headerX + 10, pdTop, {
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
  const StudentDetailsY = doc.y + leadingmd
  const StringHmd = doc.heightOfString('A')

  doc.text('\u2022 ' + 'Matricule: ', marginList, StudentDetailsY, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.matriculeE}`)
  doc.font(pt_regular)
  doc.text('\u2022 ' + 'Nom et prénom: ', marginList, doc.y, {
    continued: true,
    align: 'left',
    width: doc.page.width - marginList * 2
  })
  doc.font(pt_bold)
  doc.text(`${data.nomE} ${data.prenomE}`)
  doc.font(pt_regular)
  doc.text('\u2022 ' + "Niveau d'étude: ", marginList, doc.y, {
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

  const signatureW = Math.max(text1SignatureW, secondLineW) + marginText * 2
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
  var doc = new PDFDocument({ margin: 0, size: 'A4' })

  const writableStream = fs.createWriteStream('public/sortie.pdf')

  //Entete
  const headerX = (doc.page.width - headerW) / 2

  doc.rect(headerX, headerY, headerW, headerH)

  pathImages = path.join(__dirname, 'imagesForPDF')
  const svgData = fs.readFileSync(path.join(pathImages, 'entete.svg'), 'utf8')
  svgToPdf(doc, svgData, headerX + 120, headerY + 15)
  doc.image('imagesForPDF/ustoLogo.jpg', headerX + 10, pdTop, {
    fit: [ustoLogoDimention, ustoLogoDimention]
  })

  const TitleY = 120
  doc.font(pt_bold).fontSize(xl)
  console.log("doc.heightOfString('A'): ", doc.heightOfString('A'))
  doc.text('Procès-Verbal du Conseil de Discipline', 0, TitleY, { align: 'center' })
  doc.text("du département d'informatique", 0, TitleY + doc.heightOfString('A'), {
    align: 'center'
  })
  doc.fontSize(lg).text('Date du PV: ' + data.datePV, 0, TitleY + 3 * doc.heightOfString('A'), {
    align: 'center'
  })

  //Détails de l'infraction
  doc.font(pt_regular)
  const text1i = 'En ce jour, le '
  const text2i = data.dateCD
  const text3i =
    ", s'est tenue une réunion du conseil de discipline du département d'informatique en présence des membres suivants: "

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
  doc.text(text3i)

  const dataArray1 = data.nomM.split(',')
  const dataArray2 = data.prenomM.split(',')

  doc.y = doc.y + leadingmd

  if (dataArray1.length > 0 && dataArray1[0] !== '') {
    for (let i = 0; i < dataArray1.length; i++) {
      doc.font(pt_regular)
      doc.text('\u2022 ' + 'M./Mme: ', marginList, doc.y, {
        continued: true,
        align: 'left',
        width: doc.page.width - marginList * 2
      })
      doc.font(pt_bold)
      doc.text(dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]))
    }
  }

  doc.font(pt_regular)
  doc.text(
    "Le tableau ci-dessous résume les cas et les décisions prises pour chacun des étudiants concernés conformément à l'arrêté ministériel n°371.",
    marginText,
    doc.y + leadingmd,
    {
      align: 'left',
      width: doc.page.width - marginText * 2
    }
  )

  //détails des membres présentes
  const PVdetailsY = doc.y + leadingmd * 1

  const dataArray1P = data.nomE.split(',')
  const dataArray2P = data.prenomE.split(',')
  const dataArray3P = data.niveauE.split(',')
  const dataArray4P = data.sectionE.split(',')
  const dataArray5P = data.groupeE.split(',')
  const dataArray6P = data.motifI.split(',')
  const dataArray7P = data.nomP.split(',')
  const dataArray8P = data.prenomP.split(',')
  const dataArray9P = data.libeleS.split(',')

  doc.y = doc.y + leadingmd

  doc.font(pt_bold)
  // Define table cell content
  const headers = [
    'Étudiants concernés',
    'Faits rapportés',
    'Plaignants',
    'Décisions du conseil de discipline'
  ]
  let dataPV = []

  for (let i = 0; i < dataArray1P.length; i++) {
    const cell1 =
      dataArray1P[i].toUpperCase() +
      ' ' +
      maj(dataArray2P[i]) +
      '\n' +
      dataArray3P[i] +
      '-S' +
      dataArray4P[i] +
      'G' +
      dataArray5P[i]

    const cell2 = dataArray6P[i]

    const plaignant = 'M./Mme. ' + dataArray7P[i].toUpperCase() + ' ' + maj(dataArray8P[i])
    const cell3 = plaignant

    const cell4 = dataArray9P[i]
    dataPV = [...dataPV, [cell1, cell2, cell3, cell4]]
  }

  const padding = 20

  doc.fontSize(md)
  doc.font(pt_bold)
  const StringHmd = doc.heightOfString('A')

  // Define table properties
  const numRows = dataPV.length
  const numCols = headers.length
  const colWidth = 105
  const tableTop = doc.y + leadingmd
  const tableLeft = (doc.page.width - (numCols * colWidth + colWidth)) / 2
  const pageTop = doc.page.margins.top
  const pageBottom = doc.page.height - doc.page.margins.bottom - 20

  const maxWordPerHeader = 3
  const TableHeaderHeight = maxWordPerHeader * StringHmd + padding

  // Function to draw table headers
  function drawHeaders(headers, y) {
    doc.font(pt_bold)
    headers.forEach((header, i) => {
      if (i > 1) i += 1
      const x = tableLeft + i * colWidth

      const nbLinesPerPhrase =
        doc.heightOfString(header, {
          width: i !== 1 ? colWidth : 2 * colWidth
        }) / StringHmd
      let centerV = y + (TableHeaderHeight - nbLinesPerPhrase * StringHmd) / 2

      doc.text(header, x, centerV, {
        width: i !== 1 ? colWidth : 2 * colWidth,
        align: 'center'
      })
    })
    return y + TableHeaderHeight
  }

  // Function to draw table row
  function drawRow(row, y, height) {
    doc.font(pt_regular)
    row.forEach((cell, colIndex) => {
      if (colIndex > 1) colIndex += 1
      const x = tableLeft + colIndex * colWidth + 5 // Add padding

      const nbLinesPerPhrase =
        doc.heightOfString(cell, {
          width: colIndex !== 1 ? colWidth - 5 : 2 * colWidth - 5
        }) / StringHmd
      let centerV = y + (height - nbLinesPerPhrase * StringHmd) / 2

      doc.text(cell, x, centerV, {
        width: colIndex !== 1 ? colWidth - 5 : 2 * colWidth - 5,
        align: 'left'
      })
    })
    return y + height
  }

  function DrowHorizontalLine(y) {
    doc
      .moveTo(tableLeft, y)
      .lineTo(tableLeft + numCols * colWidth + colWidth, y)
      .stroke()
  }
  function DrowVerticalLines(y, height) {
    for (let j = 0; j <= numCols; j++) {
      let s = j > 1 ? j + 1 : j
      const x = tableLeft + s * colWidth
      doc
        .moveTo(x, y)
        .lineTo(x, y + height)
        .stroke()
    }
  }

  function DrowFourHorizontalRect(y, height) {
    DrowHorizontalLine(y)
    DrowVerticalLines(y, height)
    DrowHorizontalLine(y + height)
  }

  let y = tableTop
  DrowFourHorizontalRect(y, TableHeaderHeight)
  y = drawHeaders(headers, y)

  // Draw the table grid
  let UpdateY = y
  let j = 0
  for (let i = 0; i < numRows; i++) {
    //definition of height
    let rowHeight = 0

    dataPV[i].forEach((cell, i) => {
      const nbLinesPerPhrase =
        doc.heightOfString(cell, {
          width: i !== 1 ? colWidth : 2 * colWidth
        }) / StringHmd
      const heightCalculated = nbLinesPerPhrase * StringHmd + padding
      if (heightCalculated > rowHeight) rowHeight = heightCalculated
    })

    j += 1
    DrowFourHorizontalRect(y, rowHeight)

    y = drawRow(dataPV[i], y, rowHeight)
    if (y + rowHeight > pageBottom && i != numRows - 1) {
      doc.addPage()
      j = 0
      y = footerHeight
      DrowFourHorizontalRect(y, TableHeaderHeight)
      y = drawHeaders(headers, y)
      UpdateY = y
    }
  }

  //Signature
  const textSignature = 'M./Mme: '
  const nomPrenomPR = `${data.nomPR} ${data.prenomPR}`
  const text1Signature = 'Président de la commission:'
  const textSignatureW = doc.widthOfString(textSignature, { font: pt_regular, size: md })
  const nomPrenomPRW = doc.widthOfString(nomPrenomPR, { font: pt_bold, size: md })
  const text1SignatureW = doc.widthOfString(text1Signature, { font: pt_regular, size: md })
  const secondLineW = textSignatureW + nomPrenomPRW

  const signatureW = Math.max(text1SignatureW, secondLineW) + marginText * 2
  const signatureH = 100
  const signatureX = doc.page.width - signatureW
  const signatureY = 670
  if (doc.y > signatureY) {
    doc.addPage()
  }

  doc.rect(signatureX, signatureY, signatureW, signatureH)

  doc.font(pt_regular)
  doc.text(text1Signature, signatureX, signatureY, {
    align: 'center'
  })
  doc.text(textSignature, signatureX + (signatureW - secondLineW) / 2, signatureY + 20, {
    continued: true
  })
  doc.font(pt_bold)
  doc.text(nomPrenomPR)

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
  })

  // Handle finish event
  writableStream.on('finish', () => {
    console.log('PDF saved successfully.')
  })

  return
}

module.exports = { generatePDFpv, generatePDFrapport, generatePDFcd }
