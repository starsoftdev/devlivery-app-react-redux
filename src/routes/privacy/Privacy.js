import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Privacy.css'
import {Button, Col, Input, Row, Form} from 'antd'
import messages from './messages'
import {FloatingLabel} from '../../components';
import pose8Image from '../../static/POSE_8.png'
import {registerMailChimp} from '../../reducers/register';
import formMessages from '../../formMessages'
import cn from 'classnames';

class About extends React.Component {
  render() {
    const {intl} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <React.Fragment>
        <section className={s.aboutUsSectionWrapper}>
          <div className={s.aboutUsSection}>
            <h3 className={s.aboutUsHeader}>I.	Wer wir sind | Verantwortliche Stelle</h3>
            <p className={s.aboutCommonDescription}>
            Für Ihre Personendaten ist beim Angebot von "byZumi" die Gesellschaft Get a Concierge AG, Sonnhaldenstrasse 10, 8903 Birmensdorf, Schweiz, verantwortlich. Verweise in dieser Datenschutzerklärung (die «Erklärung») auf «wir» oder «uns» sind Verweise auf Get a Concierge AG. <br/>
            Kontakt:<br/>
            Get a Concierge AG<br/>
            Sonnhaldenstrasse 10<br/>
            CH-89034 Birmensdorf<br/>
            E-Mail: [<a>datenschutz@byzumi.com</a>]<br/>
            Sollten Sie Fragen zum Thema Datenschutz haben, wenden Sie sich bitte jederzeit an uns.<br/>
            </p>


            <h3 className={s.aboutUsHeader}>II.	Welche Daten verarbeiten wir zu welchem Zweck und auf welcher Grundlage</h3>
            <p className={s.aboutDescription}>
            <b>1.	Betroffene Daten</b><br/>
              Gegenstand dieser Datenschutzerklärung sind personenbezogene Daten, das heisst, Einzelangaben über persönliche oder sachliche Verhältnisse einer bestimmten oder bestimmbaren natürlichen Person. Hierzu gehören vor allem sämtliche Angaben, die Rückschlüsse auf Ihre Identität oder die Identität des Empfängers ermöglichen (z.B. Name, Geburtsdatum, Post-Adresse, E-Mail-Adresse, IP-Adresse oder Telefonnummer). 
            </p>
            <p className={s.aboutDescription}>
            <b>2.	Von Ihnen übermittelte Daten</b><br/>
            Daten, die Sie uns selbst übermitteln, verarbeiten wir grundsätzlich nur zu den der Übermittlung zugrundeliegenden Zwecken. Eine unbefugte Übermittlung Ihrer Daten an Dritte findet nicht statt, ebenso wenig eine Verwendung für Werbezwecke ohne Ihre Zustimmung.
            </p>




            <h3 className={s.aboutUsHeader}>II.1	Bestellungen</h3>
            <p className={s.aboutDescription}>
            Während des Bestellvorganges werden folgende Daten erhoben:
            </p>
            <p className={s.aboutDescription}>
            <b>II.1.1	Kontaktdaten, Registrierung</b><br/>
            Um eine Bestellung auf unserer Seite vorzunehmen, müssen Sie sich zuvor auf unserer Seite zu registrieren und ein Benutzerkonto einrichten. Dazu werden folgende personenbezogenen Daten benötigt:<br/>
            -	Name;<br/>
            -	Adresse;<br/>
            -	Firma;<br/>
            -	E-Mail-Adresse;<br/>
            -	Telefonnummer.<br/>
            <br/>
            Über Ihr Benutzerkonto haben Sie folgende Möglichkeiten:<br/>
            -	einen Erinnerungsservice für wichtige Termine zu aktivieren;<br/>
            -	ein Adressbuch für Empfänger anzulegen;<br/>
            -	frühere Bestellungen anzusehen; oder<br/>
            -	gleich eine neue Bestellung erneut auszulösen.<br/>
            <br/>
            Werden die Karten und/oder Geschenke an einen Dritten versandt, erheben wir ausserdem folgende Daten des Empfängers:<br/>
            -	Name;<br/>
            -	Adresse;<br/>
            -	Telefonnummer;<br/>
            -	Ggf. in der Grusskarte angegebene Daten (etwa Geburtsdaten oder Verwandschaftsverhältnisse).<br/>
            <br/>
            Wir verwenden diese Daten ausschliesslich zur Abwicklung des Bestellvorgangs und des Vertragsverhältnisses. Ihre Daten werden bei uns gespeichert und bei Versendung einer Karte und/oder eines Geschenkes über einen Logistikpartner an diesen weitergegeben, soweit dies zur Ausführung Ihres Auftrags erforderlich ist. Übermittelt werden der Name und die Adresse des Empfängers, das Produkt bzw. die Dienstleistung, evtl. wichtige Zusatzinformationen, die für die Auslieferung notwendig sind («beim Nachbarn abgeben») und ggf. auch der Inhalt einer beizufügenden Karte.
            Rechtsgrundlage für die Verarbeitung der Daten ist im Anwendungsbereich der DSGVO Art. 6 I lit. b) DSGVO, da die Verarbeitung der Anbahnung oder Durchführung eines Vertragsverhältnisses dient.
            </p>
            <p className={s.aboutDescription}>
            <b>II.1.2	Zahlungsdaten</b><br/>
            Im Rahmen des Bestellvorgangs werden Zahlungsdaten erhoben. Für Bestellungen auf unserer Seite haben Sie die Möglichkeit, zwischen verschiedenen Zahlungsarten zu wählen.<br/>
            <br/>
            <b>Kreditkarte</b><br/>
            Sofern Sie mittels Kreditkarte zahlen, erhebt die die [SIX Payment Services AG, Hardturmstrasse 201, CH-8005 Zürich,] folgende Daten:<br/>
            -	Name des Kreditkarteninhabers<br/>
            -	Kreditkartennummer<br/>
            -	Gültigkeitsdauer der Kreditkarte<br/>
            -	Sicherheitscode.<br/>
            <br/>
            Wir erheben und speichern die Zahlungsdaten nicht selbst, sondern diese werden unmittelbar vom Zahlungsdienstleister erhoben. Der Dienstleister hat über die angegebenen Zahlungsdaten hinaus lediglich Kenntnis über die Auftragsnummer und den Rechnungsbetrag, ohne diese Informationen anderen Informationen (wie etwa Ihrer Adresse oder E-Mail-Adresse) zuordnen zu können. Wir halten bei der Zusammenarbeit mit der SIX Payment Services höchste Sicherheits- und Datenschutzvorgaben ein. Der Zahlungsdienstleister beachtet die Vorgaben der «Payment Card Industry (PCI) Data Security Standards». Bitte beachten Sie die jeweiligen Datenschutzerklärungen von SIX Payment Services (www.six-payment-services.com).
            <br/>
            Rechtsgrundlage für die Datenverarbeitung ist im Anwendungsbereich der DSGVO Art. 6 Abs. 1 b) DSGVO, da die Verarbeitung der Daten für die Bezahlung per Kreditkarte oder Lastschrift und damit für die Durchführung des Vertrages erforderlich ist.<br/>
            <br/>
            <b>PayPal</b><br/>
            Weiter besteht die Möglichkeit, den Zahlungsvorgang mit dem Online-Zahlungsservice PayPal abzuwickeln. PayPal ermöglicht es, Online-Zahlungen an Dritte vorzunehmen. Die Europäische Betreibergesellschaft von PayPal ist die PayPal (Europe) S.à.r.l. & Cie. S.C.A., 22-24 Boulevard Royal, 2449 Luxembourg. Wenn Sie PayPal als Zahlungsmethode wählen, werden Ihre, für den Bezahlvorgang erforderlichen Daten automatisch an PayPal übermittelt. Hierbei handelte es regelmässig um folgende Daten:<br/>
            -	Name<br/>
            -	Adresse<br/>
            -	Firma<br/>
            -	E-Mail-Adresse<br/>
            -	Telefonnummer<br/>
            -	IP-Adresse<br/>
            Die an PayPal übermittelten Daten werden von PayPal unter Umständen an Wirtschaftsauskunfteien übermittelt. Diese Übermittlung bezweckt die Identitäts- und Bonitätsprüfung. PayPal gibt Ihre Daten möglicherweise auch an Dritte weiter, soweit dies zur Erfüllung der vertraglichen Verpflichtungen erforderlich ist oder die Daten im Auftrag verarbeitet werden sollen. Die Datenschutzbestimmungen von PayPal können Sie unter https://www.paypal.com/de/webapps/mpp/ua/privacy-full/ einsehen.<br/>
            <br/>
            Rechtsgrundlage für die Datenverarbeitung ist im Anwendungsbereich der DSGVO Art. 6 Abs. 1 b) DSGVO, da die Verarbeitung der Daten für die Bezahlung mit PayPal und damit für die Durchführung des Vertrages erforderlich ist.<br/>
            <br/>
            <b>Rechnung</b><br/>
            Wenn Sie unsere Dienste mittels Rechnung begleichen möchten, erfassen wir regelmässig folgende Daten:<br/>
            -	Name<br/>
            -	Adresse<br/>
            -	Firma<br/>
            -	E-Mail Adresse<br/>
            -	Kontonummer der Rechnung<br/>
            Rechtsgrundlage für die Datenverarbeitung ist im Anwendungsbereich der DSGVO Art. 6 Abs. 1 b) DSGVO, da die Verarbeitung der Daten für die Bezahlung mit Rechnung und damit für die Durchführung des Vertrages erforderlich ist.
            </p>



            <h3 className={s.aboutUsHeader}>II.2	Newsletter und Newsletter-Tracking</h3>
            <p className={s.aboutCommonDescription}>
            Sie haben auf unserer Seite die Möglichkeit, sich für den Empfang des Newsletters anzumelden.
            Über den Newsletter informieren wir unsere Kunden über aktuelle Angebote und Aktionen. Um den Newsletter empfangen zu können, müssen Sie in das entsprechende Eingabefeld Ihre E-Mail-Adresse eintragen. An diese E-Mail-Adresse versenden wir sodann im sog. Double-Opt-In-Verfahren eine Bestätigungsmail, die zur Überprüfung Ihrer Berechtigung an der E-Mail-Adresse dient. Um den Newsletterversand zu aktivieren, müssen Sie den in der Bestätigungsmail enthaltenen Bestätigungs-Link anklicken.
            Bei der Registrierung für den Newsletter speichern wir neben der angegebenen E-Mail-Adresse Ihren Namen und Ihr Geburtsdatum, Ihre IP-Adresse, sowie das Datum und die Uhrzeit der Anmeldung, um die Anmeldung zu einem späteren Zeitpunkt nachvollziehen und belegen zu können. Die erhobenen Daten nutzen wir ausschliesslich für den Versand des Newsletters, eine Weitergabe an Dritte findet nicht statt. Sie können unseren Newsletter jederzeit abbestellen, indem Sie Ihre Einwilligung widerrufen. Dazu können Sie entweder den in unserem Newsletter vorgehaltenen Link anklicken oder sich unmittelbar mit dem Widerruf an uns wenden. Im Übrigen gelten auch insoweit die unter III. dargestellten Rechte.
            Unsere Newsletter enthalten kleine Grafiken, die beim Öffnen Ihrer E-Mail automatisch von einem Server im Internet geladen werden und bei uns mit der von Ihnen verwendeten IP-Adresse bzw. einem Cookie verbunden werden. Wir erfahren hierdurch, ob und wann Sie den Newsletter geöffnet haben und welche Inhalte des Newsletters für Sie besonders interessant sind. Wir speichern und werten diese Daten aus, um den Newsletterversand zu optimieren und den Inhalt zukünftiger Newsletter auf Ihre Interessen auszurichten. Eine Weitergabe der Daten an Dritte erfolgt nicht.
            Rechtsgrundlage für die Verarbeitung der Daten zum Newsletterversand ist im Anwendungsbereich der DSGVO Ihre Einwilligung Art. 6 Abs. 1 a) DSGVO. Rechtsgrundlage für das Newsletter-Tracking ist im Anwendungsbereich der DSGVO Art. 6 Abs. 1 f) DSGVO, da es in unserem berechtigten Interesse liegt, unsere Newsletter bestmöglich auf unsere Kundenwünsche auszurichten.

            </p>




            <h3 className={s.aboutUsHeader}>II.3	Sonstige Kontaktaufnahmen über die Internetseite</h3>
            <p className={s.aboutCommonDescription}>
            Auf unserer Website finden Sie verschiedene Informationen für die Kontaktaufnahme (E-Mail, Formular, Telefon). Wenn Sie Kontakt mit uns aufnehmen, werden die von Ihnen übermittelten personenbezogenen Daten automatisch gespeichert. Die Daten werden ausschliesslich für die Verarbeitung der Konversation verwendet.
            Rechtsgrundlage für die Verarbeitung der Daten ist im Anwendungsbereich der DSGVO Art. 6 I lit. b) DSGVO, sofern die Verarbeitung der Anbahnung eines Vertragsverhältnisses dient. Im Übrigen dienen Ihre Einwilligung (Art. 6 I lit. a) DSGVO) und unser berechtigtes Interesse (Art. 6 I lit. f) DSGVO) an der Verarbeitung als Rechtsgrundlagen im Anwendungsbereich der DSGVO. Das berechtigte Interesse besteht darin, dass wir eine von Ihnen initiierte Konversation fortführen möchten
            </p>



            <h3 className={s.aboutUsHeader}>3.	Datenerfassung über die Seitennutzung</h3>
            <p className={s.aboutDescription}>
            <b>3.1 	Allgemeine Daten</b><br/>
            Mit jedem Aufruf unserer Seite erfassen verschiedene allgemeine Daten und Informationen, die in sog. Logfiles des Servers gespeichert werden. Zu diesen Daten zählen etwa Ihre IP-Adresse, Ihr Browsertyp und -versionen, Ihr Betriebssystem, die Internetseite, von der Sie auf unsere Website gelangt sind, das Datum und die Uhrzeit eines Zugriffs auf unsere Website und Ihr Internet-Service-Provider.
            Wir benötigen die vorgenannten Daten, um die Inhalte unserer Internetseite korrekt auszuliefern und die dauerhafte Funktionsfähigkeit unserer informationstechnologischen Systeme und der Technik unserer Internetseite zu gewährleisten. Rückschlüsse auf Ihre Person werden aus den Daten nicht gezogen, insbesondere werden die Server-Logfiles getrennt von Ihren sonstigen personenbezogenen Daten gespeichert. Personenbezogene Nutzerprofile können nicht gebildet werden.
            Die Verarbeitung der Daten erfolgt im Anwendungsbereich der DSGVO auf Grundlage von Art. 6 I lit. b) DSGVO. Nach dieser Vorschrift ist die Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrages zur Nutzung dieser Internetseite, dessen Vertragspartei Sie sind, oder zur Durchführung vorvertraglicher Massnahmen erforderlich. Darüber hinaus ist die Verarbeitung im Anwendungsbereich der DSGVO über unser berechtigtes Interesse (Art. 6 I lit. f) DSGVO) gerechtfertigt, dass darin besteht, unser Angebot ordnungsgemäss ausliefern zu können und zu optimieren.
            </p>
            <p className={s.aboutDescription}>
            <b>3.2 	Cookies</b><br/>
            Wir sind stets bemüht, die Qualität unseres Angebots zu verbessern und unsere Website zielgerichtet zu gestalten. Hierzu verwenden wir so genannte Cookies. Ein Cookie ist ein von einem Server erzeugter Datensatz, der an Ihren Browser gesendet und von Ihrem Computer lokal abgelegt wird. Unsere Systeme können so Ihren Browser erkennen. Es wird hierbei zwischen so genannten Session-Cookies, die auf den Zeitraum des Besuchs unserer Website begrenzt sind, und so genannten sessionübergreifenden (persistenten) Cookies unterschieden. 
            Was machen Cookies?
            Beim Besuch von [www.byzumi.com] wird ein Cookie auf Ihrem Computer abgelegt, der uns beispielsweise mitteilt, welche Waren und/oder Dienstleistungen Sie in Ihren Warenkorb legen werden, wie oft Sie auf unserer Website sind und welche Produkte Sie schliesslich erwerben. Das Cookie bietet uns somit einen Überblick über das Verhalten unserer Kunden auf unserer Website. Die Informationen ermöglichen es, uns einen Überblick darüber zu verschaffen, welche Waren und Dienstleistungen unsere Kunden besonders interessieren. Darüber hinaus helfen Cookies, um bestimmte Einstellungen und Funktionalitäten auf unserer Webseite über Ihren Browser sicherzustellen.
            Das hat folgende Vorteile für Sie: Cookies unterstützen ein sicheres und nutzerfreundliches Einkaufserlebnis. Wir bieten unseren Kunden ein auf Ihre Interessen und Wünsche zugeschnittenes, effektives Produktangebot und machen das Surfen so komfortabel wie möglich. So können Sie auf erfasste, aber noch nicht abgeschlossene Aufträge auch dann zugreifen, wenn Sie zwischendurch weiter im Internet gesurft haben.
            Cookies werden darüber hinaus auch bei unseren Newslettern und von anderen Internetseiten eingesetzt, sodass wir anhand der vorhandenen Cookies auf Ihrem Computer nachvollziehen können, auf welcher Website Sie auf uns aufmerksam geworden sind und ob unsere dortige Werbung Ihr Interesse an unseren Produkten geweckt hat. Cookies ermöglichen uns damit, z.B. die Effektivität unserer Werbung im Internet zu gewährleisten und unsere Werbung an den richtigen Stellen zu platzieren.
            Dies funktioniert so: Sofern Sie auf unsere Website durch z.B. Klicken auf eine Bannerwerbung gelangt sind, speichert das Cookie Informationen über diejenige Website ab, auf der die von Ihnen angeklickte Werbung platziert war. Auf dem Cookie werden nun die Informationen verknüpft und auf unserer Website gesammelt, so dass unsere Marketing-Abteilung ermitteln kann, welche Werbung auf welcher Website unsere Kunden besonders interessiert hat.
            Das Internet sowie die Informationen Ihres Computers, die oft automatisch und ohne Wissen des Einzelnen übertragen werden, bieten einigen Website-Betreibern die ideale Plattform, um das Surf- und Kaufverhalten der Internetnutzer eingehend zu studieren. Die dabei gesammelten Daten können unter Umständen auch auf einzelne Personen zurückgeführt werden. Von einer solchen Praxis sehen wir bewusst ab. Wir haben uns für einen sehr zurückhaltenden Umgang mit Cookie-Informationen entschieden. Wir verarbeiten nur solche Cookie-Informationen, die für die Verbesserung der Qualität unserer Arbeit unerlässlich sind. Deshalb verwenden wir die Informationen der Cookies ausschliesslich zu Statistik- und Marketingzwecken. Wir erstellen keine Nutzerprofile, welche Aufschluss über das persönliche Surf- und Kaufverhalten unserer Kunden geben, und verknüpfen die Informationen der Cookies niemals mit Ihrer IP-Adresse oder gar mit Angaben zu Ihrer Person.
            Cookies sind für Ihren Computer nicht gefährlich und können dort keinen Schaden verursachen. Insbesondere übertragen Cookies keine Viren oder Ähnliches. Darüber hinaus ist es durch den Einsatz von Cookies nicht möglich, weitere Daten auf Ihrem Computer „auszuspähen“. Sie können auch aber gegen den Einsatz von Cookies entscheiden und deren Verwendung auf Ihrem Computer selbst regeln. Die Hilfefunktion in Ihrer Menüleiste Ihres Browsers erklärt Ihnen, wie Sie Cookies zulassen, ablehnen, einsehen und löschen können.
            Soweit die Cookies der ordnungsgemässen Auslieferung unseres Webangebotes dienen, ist Rechtsgrundlage der Verarbeitung im Anwendungsbereich der DSGVO Art. 6 I lit. b) DSGVO. Im Übrigen ist die Verarbeitung durch Art. 6 I lit. f) DSGVO gerechtfertigt, da die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens erforderlich ist. Unser berechtigtes Interesse liegt darin begründet, dass wir unser Webangebot einerseits speziell an den Bedürfnissen unserer Nutzer ausrichten und andererseits über die Webanalyse das Nutzungsverhalten in Bezug auf unsere Website in Erfahrung bringen können, um unser Angebot stetig zu verbessern.
            </p>
            <p className={s.aboutDescription}>
            <b>3.3	Webanalyse Tools</b><br/>
            <b>Google Analytics</b><br/>
            Wir nutzen Google Analytics, einen Webanalysedienst der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA («Google»). Google Analytics verwendet sog. «Cookies», Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Im Falle der Aktivierung der IP-Anonymisierung auf dieser Webseite, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt.
            Google ist nach dem EU-U.S. Privacy-Shield (www.privacyshield.gov) zertifiziert, für den ein Angemessenheitsbeschluss der EU-Kommission besteht (s. http://ec.europa.eu/newsroom/just/item-detail.cfm?item_id=605819), so dass ein angemessenes Datenschutzniveau gewährleistet ist.
            Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie aber darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem Sie das unter dem folgenden Link verfügbare Browser-Plugin installieren: Plugin herunterladen: [https://tools.google.com/dlpage/gaoptout]
            Wenn dies bei Ihnen nicht funktioniert, können Sie die Erfassung durch Google Analytics verhindern, indem Sie auf folgenden Link klicken. Es wird ein Opt-out-Cookie gesetzt, der die zukünftige Erfassung Ihrer Daten beim Besuch dieser Website verhindert: [Klicken Sie hier, um von der Erfassung über Google Analytics ausgeschlossen zu werden.]. 
            Die Nutzung von Google Analytics erfolgt im Anwendungsbereich der DSGVO auf Grundlage von Art. 6 I lit. f) DSGVO. Unser berechtigtes Interesse liegt darin begründet, näher zu erfahren, wie unsere Website konkret genutzt wird. Demgegenüber verarbeiten wir Ihre Daten nur zu statistischen Zwecken und dies in aller Regel nur anonymisiert.
            </p>



            <h3 className={s.aboutUsHeader}>III.	Ihre Rechte</h3>
            <p className={s.aboutDescription}>
            Die folgenden Rechte können Sie unmittelbar uns gegenüber geltend machen.
            </p>
            <p className={s.aboutDescription}>
            <b>1.	Auskunfts- oder Bestätigungsrecht</b><br/>
            Auf Anfrage teilen wir Ihnen kostenfrei mit, ob und welche persönlichen Daten wir von Ihnen bei uns gespeichert haben. Ebenso bestätigen wir Ihnen auf Anfrage, ob bestimmte Daten verarbeitet werden. Darüber hinaus erteilen wir Ihnen Auskunft über die Verarbeitungszwecke, die Kategorien der verarbeiteten Daten, die Empfänger oder Kategorien von Empfängern der Daten und, sofern möglich, über die geplante Dauer, für die die Daten gespeichert werden, oder, falls dies nicht möglich ist, die Kriterien für die Festlegung dieser Dauer, das Bestehen eines Rechts auf Berichtigung oder Löschung der Sie betreffenden personenbezogenen Daten oder auf Einschränkung der Verarbeitung durch uns oder eines Widerspruchsrechts gegen die Verarbeitung, das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde.
            Sofern die personenbezogenen Daten nicht bei Ihnen erhoben werden, geben wir Ihnen sämtliche zur Verfügung stehenden Informationen über die Herkunft der Daten, das Bestehen einer automatisierten Entscheidungsfindung einschliesslich Profiling, die Tragweite und die angestrebten Auswirkungen einer derartigen Verarbeitung. Ferner erteilen wir Ihnen Auskunft darüber, ob Ihre personenbezogenen Daten in ein Drittland oder an eine internationale Organisation übermittelt wurden. Wenn dies der Fall ist, erteilen wir Ihnen Auskunft über die geeigneten Garantien im Zusammenhang mit der Übermittlung.
            </p>
            <p className={s.aboutDescription}>
            <b>2.	Berichtigungsrecht</b><br/>
            Sie haben das Recht, die Berichtigung oder Vervollständigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen.
            </p>
            <p className={s.aboutDescription}>
            <b>3.	Löschungsrecht</b><br/>
            Sie haben das Recht von uns zu verlangen, dass die Sie betreffenden personenbezogenen Daten unverzüglich gelöscht werden, sofern einer der folgenden Gründe zutrifft und soweit die Verarbeitung nicht erforderlich ist.<br/>
            <br/>
            -	Die personenbezogenen Daten wurden für solche Zwecke erhoben oder auf sonstige Weise verarbeitet, für welche sie nicht mehr notwendig sind.<br/>
            -	Sie haben Ihre Einwilligung, auf die sich die Verarbeitung gemäss Art. 6 I lit. a) DSGVO oder Art. 9 II lit. a) DSGVO stützte, widerrufen und es fehlt an einer anderweitigen Rechtsgrundlage für die Verarbeitung.<br/>
            -	Sie legen gemäss Art. 21 I DSGVO Widerspruch gegen die Verarbeitung ein und es liegen keine vorrangigen berechtigten Gründe für die Verarbeitung vor, oder Sie legen gemäss Art. 21 II DSGVO Widerspruch gegen die Verarbeitung ein.<br/>
            -	Die personenbezogenen Daten wurden unrechtmässig verarbeitet.<br/>
            -	Die Löschung der personenbezogenen Daten ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich.<br/>
            -	Die personenbezogenen Daten wurden in Bezug auf angebotene Dienste der Informationsgesellschaft gemäss Art. 8 I DSGVO erhoben.<br/>
            </p>
            <p className={s.aboutDescription}>
            <b>4.	Recht auf Einschränkung der Verarbeitung</b><br/>
            Sie können von uns die Einschränkung der Verarbeitung verlangen, wenn eine der folgenden Voraussetzungen gegeben ist:<br/>
            <br/>
            -	Die Richtigkeit der personenbezogenen Daten wird von Ihnen bestritten, und zwar für eine Dauer, die es dem Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen Daten zu überprüfen.<br/>
            -	Die Verarbeitung ist unrechtmässig, Sie lehnen die Löschung der personenbezogenen Daten ab und verlangen stattdessen die Einschränkung der Nutzung der personenbezogenen Daten.<br/>
            -	Wir benötigen die personenbezogenen Daten für die Zwecke der Verarbeitung nicht länger, Sie benötigen sie jedoch zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.<br/>
            -	Sie haben Widerspruch gegen die Verarbeitung gem. Art. 21 I DSGVO eingelegt und es steht noch nicht fest, ob unsere berechtigten Gründe gegenüber Ihren überwiegen.
            </p>
            <p className={s.aboutDescription}>
            <b>5.	Recht auf Datenübertragung</b><br/>
            Sie haben das Recht, Sie betreffende personenbezogene Daten, die wir mithilfe automatisierter Verfahren auf Grundlage Ihrer Einwilligung (Art. 6 I lit. a) oder Art. 9 II lit. a) DSGVO) oder auf Grundlage eines Vertrages (Art. 6 I lit. b) DSGVO) verarbeiten, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten. Diese Daten können Sie an einen anderen Verantwortlichen übermitteln oder von uns übermitteln lassen, soweit dies technisch machbar ist und sofern hiervon nicht die Rechte und Freiheiten anderer Personen beeinträchtigt werden.
            </p>
            <p className={s.aboutDescription}>
            <b>6.	Widerspruchsrecht</b><br/>
            Sie können aus Gründen, die sich aus ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 I lit. e) oder f) DSGVO erfolgt, Widerspruch erheben. Nach Erhalt Ihres Widerspruches verarbeiten wir die entsprechenden personenbezogenen Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechten und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.<br/>
            <br/>
            Der Verarbeitung Ihrer Daten zum Zwecke der Direktwerbung können Sie jederzeit widersprechen. In diesem Fall werden wir die personenbezogenen Daten nicht mehr für diese Zwecke verarbeiten. Dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.<br/>
            </p>
            <p className={s.aboutDescription}>
            <b>6.	Widerspruchsrecht</b><br/>
            Sie können aus Gründen, die sich aus ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 I lit. e) oder f) DSGVO erfolgt, Widerspruch erheben. Nach Erhalt Ihres Widerspruches verarbeiten wir die entsprechenden personenbezogenen Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechten und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.<br/>
            <br/>
            Der Verarbeitung Ihrer Daten zum Zwecke der Direktwerbung können Sie jederzeit widersprechen. In diesem Fall werden wir die personenbezogenen Daten nicht mehr für diese Zwecke verarbeiten. Dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.<br/>
            </p>
            <p className={s.aboutDescription}>
            <b>7.	Recht auf Widerruf einer datenschutzrechtlichen Einwilligung</b><br/>
            Sie können von Ihnen zur Verarbeitung personenbezogener Daten erteilte Einwilligungen jederzeit ohne Angaben von Gründen widerrufen.
            </p>
            <p className={s.aboutDescription}>
            <b>8.	Beschwerderecht</b><br/>
            Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht, Beschwerde bei einer zuständigen Aufsichtsbehörde für Datenschutz (in der Schweiz beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten) eine Beschwerde einreichen zu erheben, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen den Datenschutz verstösst. Die Aufsichtsbehörde, bei der die Beschwerde eingereicht wird, unterrichtet Sie über den Stand und die Ergebnisse Ihrer Beschwerde einschliesslich der Möglichkeit eines gerichtlichen Rechtsbehelfs.
            </p>





            <h3 className={s.aboutUsHeader}>IV.	Löschung</h3>
            <p className={s.aboutCommonDescription}>
            Wir behalten die erhobenen Daten nur, solange es erforderlich ist. Die im Rahmen der Vertragsabwicklung erhobenen Daten löschen wir, sobald sie für die Vertragserfüllung, steuerliche Gründe und die Bearbeitung von Beanstandungen und/oder die Geltendmachung von oder die Verteidigung gegen Rechtsansprüche nicht mehr erforderlich sind. Soweit gesetzliche Aufbewahrungspflichten bestehen, löschen wir die Daten erst nach deren Ablauf.
            </p>



            <h3 className={s.aboutUsHeader}>V.	Sicherheit</h3>
            <p className={s.aboutCommonDescription}>
            Zum Schutz Ihrer Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen setzen wir technische und organisatorische Sicherheitsmassnahmen gemäss Art. 32 DSGVO ein. Unsere Sicherheitsmassnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert. Der Zugriff darauf ist nur wenigen Befugten und zum besonderen Datenschutz verpflichteten Personen möglich, die mit der technischen, administrativen oder der redaktionellen Betreuung von Daten befasst sind.
            </p>



            <h3 className={s.aboutUsHeader}>VI.	Rechtliche Grundlage</h3>
            <p className={s.aboutCommonDescription}>
            Bei der Bearbeitung Ihrer Daten berücksichtigen wir nicht nur das Schweizer Datenschutzgesetz und seine Verordnung, sondern – sofern und soweit anwendbar – auch die Datenschutzgrundverordnung der Europäischen Union ("DSGVO").
            </p>


            <h3 className={s.aboutUsHeader}>VII.	Änderungen und Zustimmung zu diesen Datenschutzbestimmungen</h3>
            <p className={s.aboutCommonDescription}>
            Wir passen diese Datenschutzbestimmungen jeweils neuen oder sich ändernden Bedürfnissen an. Die jeweils neue Fassung wird Ihnen an geeigneter Stelle zugänglich gemacht.
            Es gelten jeweils die aktuellen, von uns veröffentlichten Datenschutzbestimmungen. Mit der fortgesetzten Nutzung der Webseite von [www.byzumi.com] stimmen die Nutzer den jeweils geltenden Datenschutzbestimmungen zu.

            </p>

            <div className={s.aboutUsSection}>
              <p className={s.footerDate}>Stand: 11. Dezember 2018</p>
            </div>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {registerMailChimp}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(About)))
