import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Terms.css'
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
          <div className={cn(s.aboutUsSection,'orderedlist')}>
            <ol className={'custom_ol'}>
              <li className={'custom_li_parent'}>Geltungsbereich
                <ol className={'custom_ol'}>
                  <li className={'custom_li'}>
                  Die nachstehenden allgemeinen Geschäftsbedingungen gelten für den Geschäftsbereich "byzumi" der Get a Concierge AG für sämtliche Rechtsgeschäfte welche der Vertragspartner, nachfolgend "Kunde" genannt, über die Web Plattform "byZumi" unter [www.byzumi.com] (nachfolgend "Web Plattform" genannt) abschliesst, soweit zwischen den Parteien nicht ausdrücklich schriftlich etwas anderes vereinbart worden ist.
                  </li>
                  <li className={'custom_li'}>
                  Zusammen mit der in der Bestellung über die Web Plattform enthaltenen individuellen Bedingungen stellen diese Allgemeinen Geschäftsbedingungen die abschliessende Vereinbarung (nachfolgend "Vereinbarung" genannt) zwischen dem Kunden und der Get a Concierge AG dar.
                  </li>
                </ol>
              </li>

              <li className={'custom_li_parent'}>Angebot<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Darstellung der Produkte und Preise auf der Web Plattform gilt als Angebot und stellt eine unverbindliche Offerte dar. 
                </li>
                <li className={'custom_li'}>
                Wenn der Kunde Produkte lediglich in den "Warenkorb" legt, gilt dies nicht als verbindliche Bestellung.
                </li>
                <li className={'custom_li'}>
                Die Abbildung von sämtlichen Informationen, Produkteangaben, Fotos, etc. erfolgen auf der Web Plattform ohne Gewähr und sind unverbindlich. Für den Kauf durch den Kunden sind die auf der Web Plattform einsehbaren Spezifikationen vom Hersteller zum Zeitpunkt der Bestellung durch den Kunden massgebend.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Bestellung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Eine Bestellung gilt als Angebot an die Web Plattform zum Abschluss eines Vertrages.
                </li>
                <li className={'custom_li'}>
                Die Web Plattform ist ohne Nennung von Gründen frei, Bestellungen ganz oder teilweise abzulehnen. In diesem Fall wird der Kunde informiert und allfällig bereits geleistete Zahlungen zurückerstattet. Weitere Ansprüche sind ausgeschlossen.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Vertrag<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Ein Vertrag kommt erst durch die Versandbestätigung von Get a Concierge AG, die mit einer E-Mail an den Kunden versendet wird, spätestens jedoch durch den Versand der bestellten Artikel zustande.
                </li>
              </ol></li>


              <li className={'custom_li_parent'}>Preise<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Alle Preise verstehen sich netto, in CHF (Schweizer Franken) und inkl. der gesetzlichen Mehrwertsteuer (MwSt.).
                </li>
                <li className={'custom_li'}>
                Massgebend ist der festgelegte Preis auf der Web Plattform zum Zeitpunkt der Bestellung. Technische Änderungen, Irrtümer, Schreib- und Druckfehler bleiben vorbehalten. Get a Concierge AG behält sich das Recht vor, die Preise jederzeit zu ändern.
                </li>
                <li className={'custom_li'}>
                Nebenkosten (z.B. Versandkosten, Verpackungskosten) werden separat im Bestellprozess ausgewiesen und zusätzlich verrechnet.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Lieferung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Auslieferung der Bestellung erfolgt ausschliesslich über Versand (nur innerhalb von Europa). Die bei der Bestellung angegebene Lieferadresse kann nachträglich nicht mehr geändert werden. Mit der Bestellbestätigung wird dem Kunden ein provisorischer Liefertermin mitgeteilt. Get a Concierge AG nennt Lieferfristen nur als unverbindliche Richtwerte und es kann aufgrund von Produktions- oder Lieferengpässen zu Lieferverzögerungen kommen. Alle Angaben zur Verfügbarkeit und Lieferzeit sind deshalb ohne Gewähr und können jederzeit geändert werden. Im Falle, dass eine Lieferfrist nicht eingehalten werden kann, stehen dem Kunden keine Ansprüche irgendwelcher Art zu. 
                </li>
                <li className={'custom_li'}>
                Get a Concierge AG hat zudem das Recht, bestätigte Bestellungen aufgrund äusserer, nicht beeinflussbarer Umstände ohne Kostenfolge zu annullieren.
                </li>
                <li className={'custom_li'}>
                Bei jeder Bestellung kommen Versandkosten hinzu. 
                </li>
                <li className={'custom_li'}>
                Der Versand der Bestellung erfolgt auf Gefahr des Kunden. Der Kunde verpflichtet sich, die angelieferte Ware sofort auf Richtigkeit, Vollständigkeit und Lieferschäden zu prüfen. Schäden an der bestellten Ware sowie Falsch- und unvollständige Lieferungen müssen der Get a Concierge innert 5 Kalendertagen nach Erhalt gemeldet werden.
                </li>
                <li className={'custom_li'}>
                Beanstandete Produkte müssen in der Originalverpackung aufbewahrt werden.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Rücknahme bestellter Produkte<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Auf bestellten Produkten besteht kein Rückgaberecht.
                </li>
              </ol></li>           

              <li className={'custom_li_parent'}>Bezahlung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Bezahlung hat ausschliesslich in Schweizer Franken zu erfolgen.
                </li>
                <li className={'custom_li'}>
                Vor Abschluss des Bestellvorgangs hat der Kunde die Möglichkeit, die Zahlungsart zu wählen. Es stehen folgende Möglichkeiten zur Verfügung:<br/>
                -	Beim Kauf mit der Kreditkarte (VISA, Master Card und AMEX) oder mit der PostFinance Card erfolgt die Belastung zum Zeitpunkt der Bestellung.<br/>
                -	Beim Kauf per PayPal erfolgt die Belastung gemäss den AGB von PayPal. Mit der Bestätigung der Bestellung erklärt der Kunde sich damit einverstanden.<br/>
                -	Beim Kauf auf Rechnung verpflichtet sich der Kunde, den Betrag innert 14 Kalendertagen ab Rechnungsdatum zu bezahlen.
                </li>
                <li className={'custom_li'}>
                Die aktuellen Gebühren für die Zahlungsmittel werden im Bestellprozess detailliert ausgewiesen. Get a Concierge AG hat das Recht, einzelne Zahlungsmittel ohne Begründung generell oder für einzelne Kunden auszuschliessen.
                </li>
                <li className={'custom_li'}>
                Nach Ablauf der Zahlungsfrist beim Kauf auf Rechnung befindet sich der Kunde im Verzug. Get a Concierge AG ist in diesem Fall berechtigt, dem Kunden für den ausstehenden Betrag einen Verzugszins von 5% p.a. sowie bei der ersten Mahnung eine Mahngebühr von CHF 10.00 und bei der zweiten Mahnung eine Mahngebühr von CHF 20.00 zu belasten. Nach Fälligkeit der 2. Mahnung kann der offene Rechnungsbetrag (inkl. Verzugszinsen von 5% p.a. und Mahngebühren von CHF 20.00) zum Zwecke des Inkassos abgegeben oder verkauft werden. Der Kunde ist neben der Begleichung des Rechnungsbetrages auch zum Ersatz sämtlicher Kosten verpflichtet, die durch den Zahlungsverzug entstehen.
                </li>
                <li className={'custom_li'}>
                Get a Concierge AG kann zur Wahrung ihrer berechtigten Interessen ggf. eine Bonitätsabklärung über den Kunden bei Dritten einholen und die Kundendaten zum Zahlungsverhalten an Dritte weitergeben.
                </li>
                <li className={'custom_li'}>
                Bei Bezahlung per Rechnung werden nach einer Bonitätsprüfung unterschiedliche Bestelllimiten eruiert. Get a Concierge AG behält sich das Recht vor, bei Überschreitung dieser Limite, die Option „Bezahlung per Rechnung“ nicht anzubieten.
                </li>
                <li className={'custom_li'}>
                Die Kreditkartendaten des Kunden werden mit bewährter SSL-Technologie verschlüsselt. Jede Transaktion wird online bei den zuständigen Kreditkarten-Unternehmen autorisiert. Auf der Kreditkartenabrechnung des Kunden sind die Einkäufe unter [Get a Concierge AG] ersichtlich. Die Kreditkarten-Nummer wird von Get a Concierge AG nicht gespeichert.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Gutscheine<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die auf der Web Plattform angebotenen Gutscheine sind ab dem Kauf 3 Jahre gültig. Die Gutscheineinlösung muss innerhalb der Gutscheingültigkeit erfolgen. Nach dieser Frist ist keine Verlängerung möglich.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Jugendschutz<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Alkoholische Getränke dürfen innerhalb der Schweiz und Europa gemäss den gesetzlichen Bestimmungen nicht an Jugendliche unter 16 Jahren, Spirituosen nicht an Minderjährige unter 18 Jahren verkauft werden. Mit der Bestellung von alkoholischen Getränken erkennt der Kunde diese Bestimmungen an und bestätigt, dass er aufgrund seines Alters zum Kauf berechtigt ist.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Datenschutz<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Über Art, Umfang und Zweck der Erhebung, Verarbeitung und Nutzung der für die Durchführung von Bestellungen erforderlichen personenbezogenen Daten durch die Get a Concierge AG wird der Kunde ausführlich in der Datenschutzerklärung unterrichtet und informiert. Die Datenschutzerklärung unter [www.byzumi.com(Datenschutzerklärung] ist integrierter Bestandteil dieser AGB. Mit dem Akzeptieren dieser AGB stimmt Der auch der Datenschutzerklärung zu.
                </li>
              </ol></li>

              <li className={'custom_li_parent'}>Haftung und Gewährleistung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Get a Concierge AG haftet bei absichtlicher oder grobfahrlässiger Verletzung ihrer vertraglichen Verpflichtungen. Für die fahrlässige Verletzung ihrer Verpflichtungen ist die Haftung auf maximal die Höhe der vom Kunden getätigten Bestellung über die Web Plattform beschränkt.
                </li>
                <li className={'custom_li'}>
                Die Haftung für Personen, denen die Get a Concierge AG die Besorgung von Dienstleistungen befugtermassen übertragen oder die sie dafür beigezogen hat, wird hiermit ganz ausgeschlossen. Diese Drittpersonen haften ausschliesslich selber.
                </li>
                <li className={'custom_li'}>
                Unter keinen Umständen haftet die Get a Concierge AG für Schäden, die sie nicht verschuldet hat. Sie haftet auch nicht für entgangene Gewinne und Umsätze und für nicht realisierte Einsparungen (selbst wenn diese die unmittelbare Ursache des schädigenden Ereignisses sind); mittelbare oder Folgeschäden (selbst wenn Get a Concierge AG auf das mögliche Eintreten hingewiesen wurde.).
                </li>
                <li className={'custom_li'}>
                Es besteht keine Gewährleistung irgendwelcher Art.
                </li>
              </ol></li>


              <li className={'custom_li_parent'}>Geheimhaltung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Parteien verpflichten sich, Stillschweigen zu wahren über alle vertraulichen Informationen, von denen sie anlässlich oder in Zusammenhang mit der Erbringung von Dienstleistungen im Rahmen der Abwicklung der Vereinbarung Kenntnis erlangen. Als vertraulich gelten alle Daten über Tatsachen, Methoden und Kenntnisse, die zumindest in ihrer konkreten Anwendung im Rahmen der Abwicklung der Vereinbarung nicht<br/>
                a.	der Öffentlichkeit allgemein zugänglich sind oder werden, wobei dies nicht auf eine Verletzung einer Verpflichtung unter dieser Ziff. 13 zurückzuführen ist;<br/>
                b.	von einem Dritten ohne Vertraulichkeits-verpflichtung erworben wurden;<br/>
                c.	vom Empfänger der vertraulichen Informationen unabhängig erstellt werden bzw. wurden oder ihm vor dem Empfang bekannt waren; oder<br/>
                d.	allgemein bekannt sind oder von Dritten mit allgemeinen Kenntnissen einfach ermittelt werden können.
                </li>
                <li className={'custom_li'}>
                Ausgenommen hiervon ist die Offenlegung und Weitergabe von vertraulichen Informationen durch die Get a Concierge AG an Dritte im Rahmen der Erbringung der Dienstleistungen gemäss der Vereinbarung oder zur Datenverarbeitung und -speicherung, sofern die jeweiligen Dritten einer gleichwertigen Verpflichtung oder gesetzlichen Vorschrift zur Geheimhaltung unterstehen.
                </li>
                <li className={'custom_li'}>
                Die Geheimhaltungsverpflichtung besteht über die Beendigung des Vertragsverhältnisses hinaus fort.
                </li>
                <li className={'custom_li'}>
                Der Kunde nimmt zur Kenntnis, dass die Get a Concierge AG für ihre Kommunikation mit ihm und mit Dritten im Zusammenhang mit den vereinbarten Dienstleistungen auch elektronische Medien wie Telefon, Fax, E-Mail und Websites nutzt. Bei der elektronischen Übermittlung können Daten abgefangen, vernichtet, manipuliert oder anderweitig nachteilig beeinflusst werden sowie aus anderen Gründen verloren gehen und verspätet oder unvollständig ankommen. Jede Partei hat in eigener Verantwortung angemessene Vorkehren zur Sicherstellung einer fehlerfreien Übermittlung und Entgegennahme von elektronischen Daten zu treffen. Der Kunde nimmt zur Kenntnis, dass ein absoluter Schutz nicht möglich ist. Die Get a Concierge AG lehnt daher jede Haftung für unberechtigten Zugriff und Manipulation von elektronisch übermittelten Daten ab.
                </li>
              </ol></li>


              <li className={'custom_li_parent'}>Aufbewahrung<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Die Get a Concierge AG hat das Recht, Kundendaten und Akten nach Ablauf von zehn Jahren seit Erledigung der jeweiligen Tätigkeit ohne vorherige Anfrage zu vernichten.
                </li>
              </ol></li>            


              <li className={'custom_li_parent'}>Schutz- und Nutzungsrechte<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Sämtliche Schutzrechte wie Immaterialgüter- und Lizenzrechte an den von Get a Concierge AG im Zusammenhang mit den erbrachten Dienstleistungen angefertigten Unterlagen, Produkten oder sonstigen Arbeitsergebnissen sowie dem dabei entwickelten und verwendeten Know-how stehen ausschliesslich der Get a Concierge AG zu.
                </li>
                <li className={'custom_li'}>
                Die Get a Concierge AG räumt dem Kunden jeweils ein nicht ausschliessliches und nicht übertragbares Nutzungsrecht zum ausschliesslichen Eigengebrauch während der Vertragsdauer an den ihm überlassenen Unterlagen, Produkten und sonstigen Arbeitsergebnissen, einschliesslich des jeweils zugehörigen Know-hows, ein.
                </li>
              </ol></li>


              <li className={'custom_li_parent'}>Verschiedene Bestimmungen<ol className={'custom_ol'}>
                <li className={'custom_li'}>
                Mit Ausnahme der Zahlungsverpflichtung des Kunden für die erbrachten Dienstleistungen ist keine der Parteien für die Nichterfüllung von Verpflichtungen unter dieser Vereinbarung aus Gründen verantwortlich, die ausserhalb ihres eigenen Einflussbereichs liegen.
                </li>
                <li className={'custom_li'}>
                Sind einzelne Bestimmungen dieser Vereinbarung ganz oder teilweise ungültig, wird die Gültigkeit der übrigen Bestimmungen dadurch nicht beeinträchtigt. Die entsprechende Bestimmung ist durch eine zulässige Bestimmung zu ersetzen, welche dem beabsichtigten Zweck möglichst entspricht.
                </li>
                <li className={'custom_li'}>
                Änderungen der Vereinbarung bedürfen der Schriftform.
                </li>
                <li className={'custom_li'}>
                Diese Vereinbarung untersteht schweizerischem materiellem Recht unter Ausschluss des Kollisionsrechts und internationaler Abkommen, insbesondere des Übereinkommens der Vereinten Nationen über Verträge über den internationalen Warenkauf vom 11. April 1980.
                </li>
                <li className={'custom_li'}>
                Erfüllungsort für alle Verpflichtungen aus dieser Vereinbarung ist 8903 Birmensdorf.
                </li>
                <li className={'custom_li'}>
                Zuständig für alle Streitigkeiten aus dieser Vereinbarung ist das für 8903 Birmensdorf zuständige Gericht. Die Get a Concierge AG ist ebenfalls berechtigt, den Kunden an seinem Sitz zu belangen.
                </li>
              </ol></li>
            </ol>
            <p className={s.footerDate}>Stand: 11. Dezember 2018</p>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {registerMailChimp}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(About)))
