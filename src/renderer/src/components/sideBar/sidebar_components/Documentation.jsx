import { useState } from 'react'

import './sidebar_com_css/documentation.css'
//Tasks:
//Add doc
function Documentation() {
  const [doc, setDoc] = useState('Usto')
  return (
    <div className="flex dark:text-white font-poppins pt-10 pl-8">
      <div className="flex flex-col w-2/3 max-h-[86vh]">
        <h1 className="text-4xl text-center mb-8">
          Règlement intérieur et arrêtés relatifs au fonctionnement des conseils de discipline
        </h1>
        {doc === 'Usto' && (
          <div className="overflow-y-auto grow">
            <h1 className="text-3xl pb-10">Règlement intérieur USTO</h1>
            <ul className="list-disc text-xl">
              <li>
                <strong>Article 76</strong>: A l'issue de la contre correction, la note obtenue est
                comparée avec la note initiale. Dans le cas où la seconde note est inférieure à la
                note initiale et que l'écart constaté est supérieur ou égal à trois points, la note
                la plus basse sera retenue définitivement et l'étudiant sera traduit devant le
                conseil de discipline.
              </li>
              <li>
                <strong>Article 116: </strong>
                Les conseils de discipline sont hiérarchisés et organisés de la sorte:
                <ul className="pl-4 pt-4 [&>li]:pb-3">
                  <li>
                    Le conseil de discipline de Département est compétent pour toutes les
                    infractions du premier degré.
                  </li>
                  <li>
                    Le conseil de discipline de la Faculté est compétent pour les infractions de
                    premier et deuxième degrés dont la sanction d’exclusion n’excède pas une année
                    universitaire.
                  </li>
                  <li>
                    Le conseil de discipline de l’Université est compétent pour toutes les
                    infractions du deuxième degré.
                  </li>
                  <li>
                    Le conseil de discipline de l’Université est compétent pour l’étude des recours.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Article 117: </strong> Sont considérées comme infractions du 1er degré:
                <ul className="pl-4 pt-4 [&>li]:pb-3">
                  <li>
                    Toute tentative de fraude, fraude établie ou fraude préméditée établie à un
                    examen
                  </li>
                  <li>
                    Tout refus d'obtempérer à des directives émanant de l'administration, du
                    personnel enseignant chercheur ou de sécurité
                  </li>
                  <li>Toute demande non fondée de double correction.</li>
                </ul>
              </li>
              <li>
                <strong>Article 118: </strong>
                Sont considérées comme infractions du deuxième degré:
                <ul className="pl-4 pt-4 [&>li]:pb-3">
                  <li>Les récidives des infractions du 1er degré</li>
                  <li>
                    L'entrave à la bonne marche de l'établissement, le désordre organisé, la
                    violence, les menaces et voies de faits de toute nature.
                  </li>
                  <li>
                    La détention de tout moyen avec l'intention établie de porter atteinte à
                    l'intégrité physique du personnel enseignant-chercheur, du personnel
                    administratif, technique et de service, et des étudiants
                  </li>
                  <li>
                    Le faux et usage de faux, la falsification et la substitution de documents
                    pédagogiques et administratifs.
                  </li>
                  <li>L'usurpation d'identité.</li>
                  <li>
                    La diffamation à l'égard de l'ensemble du personnel universitaire et des
                    étudiants.
                  </li>
                  <li>
                    Les actions délibérées de perturbation et de désordre caractérisées portant
                    atteinte au bon déroulement des activités pédagogiques telles que les entraves
                    aux enseignements et aux examens ou leur boycott, le regroupement perturbateur…
                  </li>
                  <li>
                    Le vol, l'abus de confiance et le détournement de biens de l'établissement, des
                    enseignants et des étudiants.
                  </li>
                  <li>
                    La détérioration délibérée des biens de l'établissement : matériels, mobiliers
                    et accessoires.
                  </li>
                  <li>
                    Les insultes et propos irrévérencieux à l'égard de l'ensemble du personnel –
                    enseignants chercheurs, personnel administratif, technique et de service - et
                    des étudiants.
                  </li>
                  <li>
                    Le refus d'obtempérer à un contrôle réglementaire dans l'enceinte de
                    l'établissement.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Article 119: </strong> Les infractions mentionnées aux articles 117 et 118
                de ce présent règlement intérieur ne sont pas exhaustives. Toute faute jugée comme
                telle par un conseil de discipline et qui ne figure pas aux articles 117 et 118, est
                qualifiée d’infraction du premier ou du deuxième degré selon sa gravité et ses
                conséquences sur la communauté universitaire. Le conseil de discipline étant juge.
              </li>
              <li>
                <strong>Article 120:</strong> Toute infraction dûment constatée est portée par écrit
                à la connaissance du responsable de la structure pédagogique compétente dans les
                quarante-huit (48) heures qui suivent les faits.
              </li>
              <li>
                <strong>Article 121 :</strong>Les sanctions applicables aux infractions du premier
                degré sont fixées comme suit : -Avertissement verbal, -Avertissement écrit versé au
                dossier pédagogique de l’étudiant, - Blâme versé au dossier pédagogique de
                l’étudiant.
              </li>
              <li>
                <strong>Article 122 :</strong>Les sanctions applicables aux infractions du deuxième
                degré sont fixées comme suit : -Exclusion pour un semestre ou une année, -Exclusion
                pour deux ans, -Exclusion définitive.
              </li>
              <li>
                <strong>Article 123 :</strong>Les sanctions disciplinaires prononcées par les
                conseils de discipline ne préjugent pas, par ailleurs, des poursuites prévues par la
                législation et la réglementation en vigueur.
              </li>
              <li>
                <strong>Article 124:</strong> En attendant la décision du Conseil de discipline,
                pour les cas de fraude et d’infractions du deuxième degré, des mesures
                conservatoires motivées sont imposées et peuvent être prises par le responsable de
                l’instance pédagogique compétente.
              </li>
              <li>
                <strong>Article 125 :</strong>Les travaux des Conseils de discipline sont régis par
                l’arrêté n° 96 du 09 juin 1989.
              </li>
              <li>
                <strong>Article 126 :</strong>La décision de sanction est : Notifiée à l’intéressé.
                Inscrite à son dossier. Affichée dans l'établissement. Communiquée aux autres
                Etablissement d’Enseignement Supérieur et à l’Office National des Œuvres
                Universitaires dont relève l’étudiant si la sanction est l’exclusion d’au moins une
                année. Communiquée au Vice-Rectorat chargé de la Formation Supérieure des, premier
                et deuxième cycles, la Formation Continue et les Diplômes et la Formation Supérieure
                de Graduation.
              </li>
              <li>
                <strong>Article 127 :</strong>L’étudiant sanctionné peut adresser un recours ou une
                demande de grâce auprès du Chef de l'établissement. Elle doit être formulée par
                écrit, datée et signée par l’intéressé dans un délai de quinze jours suivant la date
                de notification de la décision.
              </li>
              <li>
                <strong>Article 128 :</strong>Lorsque des éléments nouveaux et constitués
                apparaissent dans une affaire après son jugement, l’étudiant peut adresser un
                recours légal à l’instance qui a prononcé la sanction. Le responsable (Recteur,
                Doyen ou Chef de Département) de l’instance pédagogique compétente saisit de nouveau
                le conseil de discipline qui a statué sur l’affaire.
              </li>
              <li>
                <strong>Article 19 :</strong>L’étudiant ayant fait l'objet d'une exclusion,
                prononcée par le conseil de discipline de l'établissement, ne pourra retirer son
                attestation provisoire qu'à la fin de la sanction.
              </li>
              <li>
                <strong>Article 90 :</strong>Les étudiants doivent respecter les règles élémentaires
                de tenue vestimentaire et de comportement sous peine de sanctions prévues par le
                conseil de discipline et/ou la loi.
              </li>
              <li>
                <strong>Article 143 :</strong>En plus des sanctions fixées à l’article 122 du
                chapitre IV-7 pour les infractions du deuxième degré, sont considérées comme telles
                : La suspension des activités des associations ou organisations estudiantines
                agréées à l’Université (sa durée est déterminée par le Conseil de discipline selon
                la gravité de l’infraction) La fermeture définitive du bureau de l’association ou de
                l’organisation agréée en cas de faute grave ou de récidive des infractions du
                premier degré.
              </li>
            </ul>
          </div>
        )}
        {doc === 'Arrete89' && (
          <div className="overflow-y-auto grow">
            <h1 className="text-3xl pb-10">Infraction de degré 2</h1>
            <ul className="list-disc">
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
      <div className="flex flex-col gap-[30px] w-1/3 items-center">
        <button
          className="switchDoc"
          style={{
            backgroundColor: doc === 'Usto' ? '#2B81B8' : '',
            color: doc === 'Usto' ? 'white' : ''
          }}
          onClick={() => setDoc('Usto')}
        >
          Règlement intérieur USTO
        </button>
        <button
          className="switchDoc"
          style={{
            backgroundColor: doc === 'Arrete89' ? '#2B81B8' : '',
            color: doc === 'Arrete89' ? 'white' : ''
          }}
          onClick={() => setDoc('Arrete89')}
        >
          Arrêté n°96 du 09 juin 1989
        </button>
        <button
          className="switchDoc"
          style={{
            backgroundColor: doc === 'autres' ? '#2B81B8' : '',
            color: doc === 'autres' ? 'white' : ''
          }}
          onClick={() => setDoc('autres')}
        >
          Autres
        </button>
      </div>
    </div>
  )
}
export default Documentation
