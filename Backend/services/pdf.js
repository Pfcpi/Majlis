/* eslint-disable prettier/prettier */
const puppeteer = require('puppeteer')

async function generatePDFpv(data) {
  let html = null
  if (data.sectionE != null) {
    html = `
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
  }
  
  #logo {
      height: 3cm;
  }
  
  .en-tete p {
      font-size: 15px;
      text-align: center;
      font-weight: 700;
      line-height: 20px;
  }
  
  header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-top: 1cm;
      margin-bottom: 60px;
      
  }
  
  .titre {
      text-align: center;
      margin: 0;
      margin-bottom: 40px;
  }
  
  h1 {
      font-size: 24px;
      line-height: 30px;
      font-weight: 700;
      margin: 0;
      margin-bottom: 7px;
  }
  
  h2 {
      font-size: 19px;
      font-weight: 600;
      margin: 0;
  }
  
  .boxp {
      margin-left: 1.5cm;
      margin-right: 1.5cm;
      margin-bottom: 7px;
  }
  
  .boxd {
      margin: 45px 1.5cm 0 1.5cm
  }
  
  .parg {
      display: inline-block;
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
  }
  
  em {
      font-weight: 700;
      font-style: normal;
  }
  
  .boxl {
      margin-left: 1.6cm;
      margin-right: 1.6cm;
      margin-bottom: 25px;
  }
  
  .list {
      display: inline-block;
      text-align: left;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  footer {
      margin-bottom: 2cm;
      margin-top: 1cm;
  }
  
  .boxs {
      margin-right: 1.4cm;
      text-align: right;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      margin: 0;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }
  </style>
  </head>
  <body>
      <header>
          <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
          <div class="en-tete">
              <p>
                  République Algérienne Démocratique et Populaire<br>
                  Ministère de l'Enseignement Supérieur et de la Recherche Scientifique<br>
                  Université des Sciences et Technologie d'Oran -Mohamed Boudiaf-<br>
                  Faculté des Mathématiques et Informatique<br>
                  Département d'Informatique<br>
              </p>
          </div>
      </header>
      <main>
          <div class="titre">
              <h1>
                  Procès-Verbal du Conseil de Discipline<br>
                  du Département d'Informatique
              </h1>
              <h2>Date du pv: <span>${data.datePV}</span></h2>
          </div>
          <section>
              <div class="boxp">
                  <p class="parg" style="text-indent: 30px;">
                          Suite à l'infraction commise : <em>${data.motifI}</em> un conseil de discipline s'est tenu le <em>${data.dateCD}</em>, sous la demande de : <em>M./Mme. ${data.nomP} ${data.prenomP}</em> contre l'etudiant(e) concerné(e) suivant :</p>
              </div>
              <div class="boxl">
                  <ul class="list">
                      <li>Matricule : <span class="infos">${data.matriculeE}</span></li>
                      <li>Nom : <span class="infos">${data.nomE}</span> <span id="prenom_e" class="infos">${data.prenomE}</span></li>
                      <li>Niveau : <span class="infos">${data.niveauE}-</span><span class="infos">S${data.sectionE}</span><span class="infos">G${data.groupeE}</span></li>
                  </ul>
              </div>
              <div class="boxp">
                  <p class="parg">En présence des membres suivants :</p>
              </div>
              <div class="boxl">
                  <ul class="list" id="membrel">
                  </ul>
              </div>
              <div class="boxp">
                  <p class="parg" id="temoinp" style="display: none;">Et en présence des temoins suivants :</p>
              </div>
              <div class="boxl">
                  <ul class="list" id ="temoinl" style="display: none;">
                  </ul>
              </div>
          </section>
          <section>
              <div class="boxd">
                  <p class="parg" style="text-indent: 30px;">Suite a ce conseil, les membres ont tranchés sur la sanction suivante : <span class="infos">${data.libeleS}</span></p>
              </div>
          </section>
      </main>
      <footer>
          <div class="boxs">
              <p class="sign">
                  Le president du conseil :<br>
                  <span class="infos">${data.nomPR}</span> <span class="infos">${data.prenomPR}</span>
              </p>
          </div>
      </footer>
      <script>
      function maj(chaine) {
        return chaine.charAt(0).toUpperCase() + chaine.slice(1)
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
                    visTemoin();
                    const listItem = document.createElement('li');
                    const fullName = dataArray1[i].toUpperCase() + ' ' + maj(dataArray2[i]);
                    listItem.textContent = 'M./Mme. ' + fullName;
                    list.appendChild(listItem);
                }
            }
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
                listItem.textContent = 'M./Mme. ' + fullName;
                list.appendChild(listItem);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            addDynamicTemoin();
            addDynamicMembre();
        });

        function visTemoin() {
            const parg = document.getElementById('temoinp');
            const list = document.getElementById('temoinl');
            parg.style.display = "block";
            list.style.display = "block";
        }
    </script>
  </body>
  </html>
  `
  } else {
    html = `
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
  }
  
  #logo {
      height: 3cm;
  }
  
  .en-tete p {
      font-size: 15px;
      text-align: center;
      font-weight: 700;
      line-height: 20px;
  }
  
  header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-top: 1cm;
      margin-bottom: 60px;
      
  }
  
  .titre {
      text-align: center;
      margin: 0;
      margin-bottom: 40px;
  }
  
  h1 {
      font-size: 24px;
      line-height: 30px;
      font-weight: 700;
      margin: 0;
      margin-bottom: 7px;
  }
  
  h2 {
      font-size: 19px;
      font-weight: 600;
      margin: 0;
  }
  
  .boxp {
      margin-left: 1.5cm;
      margin-right: 1.5cm;
      margin-bottom: 7px;
  }
  
  .boxd {
      margin: 45px 1.5cm 0 1.5cm
  }
  
  .parg {
      display: inline-block;
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
  }
  
  em {
      font-weight: 700;
      font-style: normal;
  }
  
  .boxl {
      margin-left: 1.6cm;
      margin-right: 1.6cm;
      margin-bottom: 25px;
  }
  
  .list {
      display: inline-block;
      text-align: left;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  footer {
      margin-bottom: 2cm;
      margin-top: 1cm;
  }
  
  .boxs {
      margin-right: 1.4cm;
      text-align: right;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      margin: 0;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }
  </style>
  </head>
  <body>
      <header>
          <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
          <div class="en-tete">
              <p>
                  République Algérienne Démocratique et Populaire<br>
                  Ministère de l'Enseignement Supérieur et de la Recherche Scientifique<br>
                  Université des Sciences et Technologie d'Oran -Mohamed Boudiaf-<br>
                  Faculté des Mathématiques et Informatique<br>
                  Département d'Informatique<br>
              </p>
          </div>
      </header>
      <main>
          <div class="titre">
              <h1>
                  Procès-Verbal du Conseil de Discipline<br>
                  du Département d'Informatique
              </h1>
              <h2>Date du pv: <span>${data.datePV}</span></h2>
          </div>
          <section>
              <div class="boxp">
                  <p class="parg" style="text-indent: 30px;">
                          Suite à l'infraction commise : <em>${data.motifI}</em> un conseil de discipline s'est tenu le <em>${data.dateCD}</em>, sous la demande de : <em>M./Mme. ${data.nomP} ${data.prenomP}</em> contre l'etudiant(e) concerné(e) suivant :</p>
              </div>
              <div class="boxl">
                  <ul class="list">
                      <li>Matricule : <span class="infos">${data.matriculeE}</span></li>
                      <li>Nom : <span class="infos">${data.nomE}</span> <span id="prenom_e" class="infos">${data.prenomE}</span></li>
                      <li>Niveau : <span class="infos">${data.niveauE}-</span>G<span class="infos">G${data.groupeE}</span></li>
                  </ul>
              </div>
              <div class="boxp">
                  <p class="parg">En présence des membres suivants :</p>
              </div>
              <div class="boxl">
                  <ul class="list" id="membrel">
                  '</ul>
              </div>
              <div class="boxp">
                  <p class="parg" id="temoinp" style="display: "none;">Et en présence des temoins suivants :</p>
              </div>
              <div class="boxl">
                  <ul class="list" id="temoinl" style="display: "none;">
                  </ul>
              </div>
          </section>
          <section>
              <div class="boxd">
                  <p class="parg" style="text-indent: 30px;">Suite a ce conseil, les membres ont tranchés sur la sanction suivante : <span class="infos">${data.libeleS}</span></p>
              </div>
          </section>
      </main>
      <footer>
          <div class="boxs">
              <p class="sign">
                  Le president du conseil :<br>
                  <span class="infos">${data.nomPR}</span> <span class="infos">${data.prenomPR}</span>
              </p>
          </div>
      </footer>
      <script>
      function maj(chaine) {
        return chaine.charAt(0).toUpperCase() + chaine.slice(1)
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
                    listItem.textContent = 'M./Mme. ' + fullName;
                    list.appendChild(listItem);
                }
            }
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
                listItem.textContent = 'M./Mme. ' + fullName;
                list.appendChild(listItem);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            addDynamicTemoin();
            addDynamicMembre();
        });

        function visTemoin() {
            const parg = document.getElementById('temoinp');
            const list = document.getElementById('temoinl');
            parg.style.display = "block";
            list.style.display = "block";
        }
    </script>
  </body>
  </html>
  `
  }
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  await page.pdf({ path: './out/s.pdf', format: 'A4' })
  console.log('passed by here pdf.js generatePdfPV')

  return page.pdf({ format: 'A4' })
}

async function generatePDFrapport(data) {
    let html = null
    if(data.sectionE != null){
   html = `
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
  }
  
  #logo {
      height: 3cm;
  }
  
  .en-tete p {
      font-size: 15px;
      text-align: center;
      font-weight: 700;
      line-height: 20px;
  }
  
  header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-top: 1cm;
      margin-bottom: 70px;
      
  }
  
  .titre {
      text-align: center;
      margin: 0;
      margin-bottom: 55px;
  }
  
  h1 {
      font-size: 24px;
      line-height: 30px;
      font-weight: 700;
      margin: 0;
      margin-bottom: 10px;
  }
  
  h2 {
      font-size: 19px;
      font-weight: 600;
      margin: 0;
  }
  
  .boxp {
      margin-left: 1.5cm;
      margin-right: 1.5cm;
      margin-bottom: 10px;
  }
  
  .parg {
      display: inline-block;
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
  }
  
  em {
      font-weight: 700;
      font-style: normal;
  }
  
  .boxl {
      margin-left: 1.6cm;
      margin-right: 1.6cm;
      margin-bottom: 80px;
  }
  
  .list {
      display: inline-block;
      text-align: left;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  footer {
      margin-bottom: 2cm;
      margin-top: 1.5cm;
  }
  
  .boxs {
      margin-right: 1.4cm;
      text-align: right;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      margin: 0;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }
  </style>
</head>
<body>
<header>
    <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
    <div class="en-tete">
        <p>
            République Algérienne Démocratique et Populaire<br>
            Ministère de l'Enseignement Supérieur et de la Recherche Scientifique<br>
            Université des Sciences et Technologie d'Oran -Mohamed Boudiaf-<br>
            Faculté des Mathématiques et Informatique<br>
            Département d'Informatique<br>
        </p>
    </div>
</header>
<main>
    <div class="titre">
        <h1>
            Rapport pour un conseil de discipline<br>
            du département d'informatique
        </h1>
        <h2>Date du Rapport: <span>${data.dateR}</span></h2>
    </div>
    <section>
        <div class="boxp">
            <p class="parg" style="text-indent: 30px;">
                En raison de l'infraction suivante commise: <em>${data.motifI}</em>, le  <em>${data.dateI}</em> à <em>${data.lieuI}</em>, par l'étudiant ci-dessous :
            </p>
        </div>
        <div class="boxl">
            <ul class="list">
                <li>Matricule : <span class="infos">${data.matriculeE}</span></li>
                <li>Nom et prénom : <span class="infos">${data.nomE}</span> <span class="infos">${data.prenomE}</span></li>
                <li>Niveau : <span class="infos">${data.niveauE}-</span><span class="infos">S${data.sectionE}</span><span class="infos">G${data.groupeE}</span></li>
            </ul>
        </div>
    </section>
    <section>
        <div class="boxp">
            <p class="parg">Une demande de conseil de discipline est demandé par le plaigant suivant :</p>
        </div>
        <div class="boxl">
            <ul class="list">
                <li>M./Mme. <span class="infos">${data.nomP}</span> <span class="infos">${data.prenomP}</span></li>
            </ul>
        </div>
    </section>
</main>
<footer>
    <div class="boxs">
        <p class="sign">
            Chef de département :<br>
            <span class="infos">${data.nomC}</span> <span class="infos">${data.prenomC}</span>
        </p>
    </div>
</footer>
</body>
</html>
    `
} else {
    html = `
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
  }
  
  #logo {
      height: 3cm;
  }
  
  .en-tete p {
      font-size: 15px;
      text-align: center;
      font-weight: 700;
      line-height: 20px;
  }
  
  header {
      display: flex;
      flex-direction: row;
      gap: 20px;
      justify-content: center;
      margin-top: 1cm;
      margin-bottom: 70px;
      
  }
  
  .titre {
      text-align: center;
      margin: 0;
      margin-bottom: 55px;
  }
  
  h1 {
      font-size: 24px;
      line-height: 30px;
      font-weight: 700;
      margin: 0;
      margin-bottom: 10px;
  }
  
  h2 {
      font-size: 19px;
      font-weight: 600;
      margin: 0;
  }
  
  .boxp {
      margin-left: 1.5cm;
      margin-right: 1.5cm;
      margin-bottom: 10px;
  }
  
  .parg {
      display: inline-block;
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
  }
  
  em {
      font-weight: 700;
      font-style: normal;
  }
  
  .boxl {
      margin-left: 1.6cm;
      margin-right: 1.6cm;
      margin-bottom: 80px;
  }
  
  .list {
      display: inline-block;
      text-align: left;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
  }
  
  .infos {
      font-weight: 600;
  }
  
  footer {
      margin-bottom: 2cm;
      margin-top: 1.5cm;
  }
  
  .boxs {
      margin-right: 1.4cm;
      text-align: right;
  }
  
  .sign {
      display: inline-block;
      text-align: center;
      margin: 0;
      line-height: 20px;
      font-size: 16px;
      font-weight: 400;
  }
  </style>
</head>
<body>
<header>
    <img src="https://i.goopics.net/ocjo5q.jpg" alt="Logo USTO" id="logo">
    <div class="en-tete">
        <p>
            République Algérienne Démocratique et Populaire<br>
            Ministère de l'Enseignement Supérieur et de la Recherche Scientifique<br>
            Université des Sciences et Technologie d'Oran -Mohamed Boudiaf-<br>
            Faculté des Mathématiques et Informatique<br>
            Département d'Informatique<br>
        </p>
    </div>
</header>
<main>
    <div class="titre">
        <h1>
            Rapport pour un conseil de discipline<br>
            du département d'informatique
        </h1>
        <h2>Date du Rapport: <span>${data.dateR}</span></h2>
    </div>
    <section>
        <div class="boxp">
            <p class="parg" style="text-indent: 30px;">
                En raison de l'infraction suivante commise : <em>${data.motifI}</em>, le  <em>${data.dateI}</em> à <em>${data.lieuI}</em>, par l'étudiant ci-dessous :
            </p>
        </div>
        <div class="boxl">
            <ul class="list">
                <li>Matricule : <span class="infos">${data.matriculeE}</span></li>
                <li>Nom et prénom : <span class="infos">${data.nomE}</span> <span class="infos">${data.prenomE}</span></li>
                <li>Niveau : <span class="infos">${data.niveauE}-</span><span class="infos">G${data.groupeE}</span></li>
            </ul>
        </div>
    </section>
    <section>
        <div class="boxp">
            <p class="parg">Une demande de conseil de discipline est demandé par le plaigant suivant :</p>
        </div>
        <div class="boxl">
            <ul class="list">
                <li>M./Mme. <span class="infos">${data.nomP}</span> <span class="infos">${data.prenomP}</span></li>
            </ul>
        </div>
    </section>
</main>
<footer>
    <div class="boxs">
        <p class="sign">
            Chef de département :<br>
            <span class="infos">${data.nomC}</span> <span class="infos">${data.prenomC}</span>
        </p>
    </div>
</footer>
</body>
</html>
    `
  }

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  await page.pdf({ path: './out/s.pdf', format: 'A4' })
  console.log('passed by here pdf.js generatePdfRapport')

  return page.pdf({ format: 'A4' })
}

module.exports = { generatePDFpv, generatePDFrapport }