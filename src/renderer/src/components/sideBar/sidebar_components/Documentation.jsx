import { useState } from 'react'

import './sidebar_com_css/documentation.css'

function Documentation() {
  const [doc, setDoc] = useState('infraction2')
  return (
    <div className="flex dark:text-white font-poppins pt-10 pl-8">
      <div className='w-2/3'>
        {doc === 'infraction1' && (
          <div>
            <h1 className="text-3xl">Infraction de degré 1</h1>
          </div>
        )}
        {doc === 'infraction2' && (
          <div>
            <h1 className="text-3xl pb-10">Infraction de degré 2</h1>
            <ul className='list-disc'>
              <li>
                Article 76: A l'issue de la contre correction, la note obtenue est comparée avec la
                note initiale. Dans le cas où: La seconde note est inférieure à la note initiale et
                que l'écart constaté est supérieur ou égal à trois points, la note la plus basse
                sera retenue définitivement et l'étudiant sera traduit devant le conseil de
                discipline.
              </li>
              <li>
                Conformément à l'arrêté n° 371 du 11 juin 2014 à l’intérieur de l'enceinte d'un
                établissement universitaire, tout étudiant est soumis à des règles de discipline
                générale et de maintien de l'ordre, s'articulant autour du respect d'autrui et de la
                sauvegarde des biens et équipements de l'établissement. 
              </li>

              <li>
                Article 116 : Les conseils de discipline sont hiérarchisés et organisés de la
                sorte:  Le conseil de discipline de Département est compétent pour toutes les
                infractions du premier degré. 
              </li>
              <li>
                Le conseil de discipline de la Faculté est compétent pour les infractions de premier
                et deuxième degrés dont la sanction d’exclusion n’excède pas une année
                universitaire. Le conseil de discipline de l’Université est compétent pour toutes
                les infractions du deuxième degré. Le conseil de discipline de l’Université est
                compétent pour l’étude des recours.
              </li>
              <li>
                Article 117: Sont considérées comme infractions du 1er degré: Toute tentative de
                fraude, fraude établie ou fraude préméditée établie à un examen Tout refus
                d'obtempérer à des directives émanant de l'administration, du personnel enseignant
                chercheur ou de sécurité Toute demande non fondée de double correction. 
              </li>
            </ul>
          </div>
        )}
        {doc === 'autres' && <h1 className="text-3xl">AFFICHAGE des sanctions par exemple</h1>}
      </div>
      <div className='flex flex-col gap-[30px] w-1/3 items-center'>
        <button className="switchDoc" style={{backgroundColor: doc === "infraction1" ? '#2B81B8': ""}}onClick={() => setDoc('infraction1')}>Infraction de degré 1</button>
        <button className="switchDoc" style={{backgroundColor: doc === "infraction2" ? "#2B81B8": ""}}onClick={() => setDoc('infraction2')}>Infraction de degré 2</button>
        <button className="switchDoc" style={{backgroundColor: doc === "autres" ? "#2B81B8": ""}}onClick={() => setDoc('autres')}>Autres</button>
      </div>
    </div>
  )
}
export default Documentation
