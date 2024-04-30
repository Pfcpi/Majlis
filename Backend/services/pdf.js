const puppeteer = require('puppeteer')

async function generatePDFpv(data) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 15px;
      }
    </style>
  </head>
  <body>
    <table>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Country</th>
      </tr>
      <tr>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.country}</td>
      </tr>
    </table>
  </body>
  </html>
  `

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdfBuffer = await page.pdf({ format: 'A4' })
  await browser.close()

  return pdfBuffer
}

async function generatePDFrapport(data) {
  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disciplinary Council Report</title>
    
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">

    <div class="header" style="text-align: center; padding: 20px 0; background-color: #343a40; color: white;">
        <img src="logo.png" alt="Logo" style="max-width: 100%; height: auto;">
        <h1 style="line-height: 1.2;">Disciplinary Council Report</h1>
    </div>

    <div class="container" style="margin: 0 auto; width: 80%; padding: 20px;">
        <h2 style="line-height: 1.2;">Participants</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;" width="100%">
            <tr>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f2f2f2; font-weight: bold;" align="left" bgcolor="#f2f2f2">Name</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f2f2f2; font-weight: bold;" align="left" bgcolor="#f2f2f2">Role</th>
            </tr>
            <tr style="background-color: #f2f2f2;" bgcolor="#f2f2f2">
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">John Doe</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Concerned Person</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Jane Smith</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Complainant</td>
            </tr>
            <tr style="background-color: #f2f2f2;" bgcolor="#f2f2f2">
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Member 1</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Commission Member</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Member 2</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Commission Member</td>
            </tr>
            <tr style="background-color: #f2f2f2;" bgcolor="#f2f2f2">
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Member 3</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Commission Member</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Member 4</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Commission Member</td>
            </tr>
            <tr style="background-color: #f2f2f2;" bgcolor="#f2f2f2">
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Member 5</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: left;" align="left">Commission Member</td>
            </tr>
        </table>

        <h2 style="line-height: 1.2;">Sanction</h2>
        <p>The sanction applied to the concerned person is a written warning.</p>

        <h2 style="line-height: 1.2;">Date</h2>
        <p>March 22, 2023</p>

        <h2 style="line-height: 1.2;">Witnesses</h2>
        <p>Witness 1, Witness 2</p>
    </div>

    <footer style="text-align: center; padding: 10px 0; background-color: #343a40; color: white; margin-top: 20px;">
        <p>&copy; 2023 Disciplinary Council. All rights reserved.</p>
    </footer>

</body>
</html>

    `

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdfBuffer = await page.pdf({ format: 'A4' })
  await browser.close()

  return pdfBuffer
}

module.exports = { generatePDFpv, generatePDFrapport }
