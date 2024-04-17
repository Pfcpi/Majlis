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
                Inscrite à son dossier. Affichée dans l'établissement. Communiquée aux Arrete14
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
            <h1 className="text-3xl pb-10">Arrêté n°96 du 09 juin 1989</h1>
            <ul className="list-disc text-xl">
              <li>
                <strong>Article 4: </strong>Composition du conseil de discipline: Le conseil de
                discipline est composé de 5 membres permanents et 5 membres suppléants. Ces derniers
                ne siègent qu'en cas d'absence des membres permanents. Il est composé du directeur
                ou son représentant, trois enseignants titulaires et trois suppléants désignés par
                le directeur après avis du conseil de direction, et un membre titulaire et un membre
                suppléant représentant des étudiants.
              </li>
              <li>
                <strong>Article 5: </strong>Présidence du conseil de discipline: Le conseil de
                discipline est présidé par le directeur ou son représentant.
              </li>
              <li>
                <strong>Article 6: </strong>Compétence du conseil de discipline: Le conseil de
                discipline de l'institut de l'établissement d'enseignement supérieur est compétent
                pour connaître des infractions du 1er degré telles que définies dans le titre 2.
              </li>
              <li>
                <strong>Article 7: </strong>Conflit de compétences: En cas de conflit de compétences
                entre conseils de discipline d'une même université, la désignation du conseil de
                discipline est faite par le conseil de discipline de l'université.
              </li>
              <li>
                <strong>Article 10: </strong>Mandat du conseil de discipline: Le conseil de
                discipline a un mandat valable pour une année universitaire.
              </li>
              <li>
                <strong>Article 11: </strong>Présidence du conseil de discipline: Le conseil de
                discipline est présidé par le recteur, le directeur de l'institut national
                d'enseignement supérieur, le directeur de l'établissement d'enseignement supérieur
                ou leurs représentants.
              </li>
              <li>
                <strong>Article 19: </strong>Mesures conservatoires: En attendant la décision du
                conseil de discipline, pour les cas de fraude et d'infractions du 2ème degré, les
                mesures conservatoires motivées peuvent être prises par le directeur de
                l'établissement, les détails de ces mesures sont comptés dans les périodes des
                actions.
              </li>
              <li>
                <strong>Article 21: </strong>Saisine du conseil de discipline: Le recteur ou le
                directeur de l'institut national d'enseignement supérieur procède s'il y a lieu à la
                saisine du conseil de discipline dans un délai de 10 jours en fixant le jour de la
                réunion de ce dernier qui doit être au maximum de 7 jours fermes après la saisine.
              </li>
              <li>
                <strong>Article 22: </strong>Convocation des membres du conseil de discipline: Le
                recteur ou le directeur de l'INES ou le directeur de l'établissement supérieur ou le
                directeur d'institut adresse une convocation aux membres du conseil de discipline
                cinq (5) jours avant la tenue de la réunion. Les membres permanents doivent signaler
                leur absence 48 heures à l'avance, lorsque des membres du conseil de discipline sont
                absents le jour de la réunion, elle est ajournée.
              </li>
              <li>
                <strong>Article 23: </strong>Deuxième convocation: Le recteur ou le directeur de
                l'INES ou le directeur de l'établissement d'enseignement supérieur ou le directeur
                de l'institut adresse une 2ème convocation aux membres du conseil de discipline dans
                un délai de 8 jours. La 2ème réunion se tient quel que soit le nombre de membres
                présents.
              </li>
              <li>
                <strong>Article 24: </strong>Enquête et instruction du dossier: Le directeur de
                l'institut procède à une enquête et instruit le dossier de l'affaire.
              </li>
              <li>
                <strong>Article 25: </strong>Convocation des parties concernées: Le recteur ou le
                directeur de l'INES ou le directeur de l'établissement d'enseignement supérieur ou
                le directeur de l'institut convoque, par lettre recommandée avec accusé de
                réception, les parties concernées.
              </li>
              <li>
                <strong>Article 26: </strong>Débats contradictoires: Les débats sont
                contradictoires. L'étudiant peut présenter tout élément qu'il juge utile pour sa
                défense, il peut avoir accès au dossier de l'affaire 48 heures avant la réunion du
                conseil de discipline, il est exclu pour la défense d'un étudiant, de faire appel à
                un élément étranger à l'établissement.
              </li>
              <li>
                <strong>Article 27: </strong>Absence de l'étudiant: Lorsque l'étudiant ne se
                présente pas le jour de la réunion du conseil de discipline peut siéger sauf si
                lsanction peut être prononcée par défaut lorsque l'étudiant ne se présente pas à la
                2ème réunion du conseil de discipline. L'étudiant dispose d'un droit de recours
                contre ldécision de sanction dans un délai d'un mois suivant la date de notification
                de la décision.
              </li>
              <li>
                <strong>Article 28: </strong>Délibération et proposition de sanction: À l'issue des
                débats, le conseil de discipline délibère, par bulletin secret hors de lprésence des
                parties concernées, il arrête une proposition de sanction.
              </li>
              <li>
                <strong>Article 29: </strong>Transmission de la proposition de sanction: La
                proposition de sanction est transmise immédiatement par les soins du président
                dconseil de discipline au recteur ou au recteur ou le directeur de l'INES ou le
                directeur de l'établissement d'enseignement supérieur. L'effet de la décision
                commence dès snotification.
              </li>
              <li>
                <strong>Article 30: </strong>Notification et communication de la décision de
                sanction: La décision de sanction est notifiée à l'intéressé, inscrite à son
                dossiesi l'infraction est du 2ème degré, et communiquée aux Arrete14 établissements
                d'enseignement supérieur et au COSU dont relève l'étudiant si la sanction est
                l'exclusion d'amoins une année.
              </li>
              <li>
                <strong>Article 31: </strong>Recours gracieux: L'étudiant sanctionné peut adresser
                un recours gracieux auprès du recteur ou du directeur de l'institut
                nationad'enseignement supérieur ou de l'établissement d'enseignement supérieur. Un
                recours gracieux doit se faire dans un délai de 15 jours, suivant la date de la
                notification de la décision, il doit être formulé par écrit, daté et signé par
                l'intéressé.
              </li>
              <li>
                <strong>Article 32: </strong>Recours légal: Lorsque les éléments nouveaux et
                constitués apparaissent dans une affaire, après son jugement, l'étudiant peut
                adresser un recours légal à l'instance qui a prononcé la sanction. Le recteur ou le
                directeur de l'INES ou le directeur de l'établissement d'enseignement supérieur ou
                le directeur de l'institut saisit de nouveau le conseil de discipline.
              </li>
              <li>
                <strong>Article 33: </strong>Réintégration de l'étudiant: Après accomplissement de
                la sanction, l'étudiant est réintégré dans tous ses droits universitaires.
              </li>
              <li>
                <strong>Article 34: </strong>Suppression de l'inscription de la sanction: Après un
                an au minimum qui suit la sanction pour l'avertissement écrit et le blâme et quatre
                ans pour les exclusions temporaires, l'étudiant peut demander la suppression de
                l'inscription de la sanction à son dossier. Une demande écrite est adressée au
                recteur ou au directeur qui tiendra compte du comportement général de l'intéressé
                depuis la sanction.
              </li>
            </ul>
          </div>
        )}
        {doc === 'Arrete14' && (
          <div>
            <h1 className="text-3xl">Arrêté n°371 du 11 Juin 2014</h1>
            <ul className="list-disc text-xl pt-10">
              <li>
                <strong>Article 6 :</strong> Composition du conseil de discipline Le conseil de
                discipline est composé :
                <ul className="pl-4 pt-4 [&>li]:pb-3">
                  <li>
                    De cinq membres titulaires et cinq membres suppléants élus par et parmi les
                    enseignants de la structure concernée,
                  </li>
                  <li>
                    D'un représentant d'étudiants titulaire et un suppléant, élus par et parmi les
                    étudiants de la structure concernée.
                  </li>
                </ul>
                Il est présidé par le premier responsable de la structure concernée ou son
                représentant.
              </li>
            </ul>
          </div>
        )}
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
            backgroundColor: doc === 'Arrete14' ? '#2B81B8' : '',
            color: doc === 'Arrete14' ? 'white' : ''
          }}
          onClick={() => setDoc('Arrete14')}
        >
          Arrêté n°371 du 11 Juin 2014
        </button>
      </div>
    </div>
  )
}
export default Documentation
