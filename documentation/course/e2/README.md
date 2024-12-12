<div align="center">
<p><b>Wyniki etapu II: <br/> Definicja architektury systemu</b></p>
<br/>
<p><b>System biletowy dla komunikacji miejskiej</b></p>
<br/>
<p><b>Projektowanie systemów informatycznych</b></p>
</div>
<div align="right">Prowadzący:<br/>dr inż. Marcin Kawalerowicz</div>
<div>
Skład zespołu:
<ul>
  <li>Przemysław Barcicki (260324)</li>
  <li>Tomasz Chojnacki (260365)</li>
  <li>Piotr Kot (259560)</li>
  <li>Jakub Zehner (260285)</li>
</ul>
</div>

# Cel

Dokument przedstawia kluczowe decyzje projektowe oraz ich uzasadnienie w kontekście systemu informatycznego wspomagającego miejską komunikację publiczną. Jego celem jest szczegółowe opisanie architektury technicznej, w tym komponentów systemu, ich funkcji oraz interakcji, które umożliwiają realizację założeń określonych w [specyfikacji wymagań](../e1/README.md).

System jest projektowany z myślą o ułatwieniu zakupu biletów, przeglądania rozkładów jazdy oraz uzyskiwania informacji o awariach przez pasażerów. Jednocześnie ma wspierać pracę kierowców i bileterów, umożliwiając sprawdzanie ważności biletów oraz zgłaszanie problemów.

Kluczowe ograniczenia i decyzje projektowe zawarte w dokumencie wynikają z potrzeb optymalizacji czasu operacji systemu oraz zapewnienia wysokiej dostępności i niezawodności.

# Cele i ograniczenia architektoniczne

<!--
[Insert a reference or link to the requirements that must be implemented to realize the architecture.
Formulate a set of goals that the architecture needs to meet in its structure and behavior. Identify critical issues that must be addressed by the architecture, such as: Are there hardware dependencies that should be isolated from the rest of the system? Does the system need to function efficiently under unusual conditions?]

Wymienić wymagania funkcjonalne i (głównie) niefunkcjonalne, które mają wpływ na architekturę systemu, mogą być z podziałem na epiki.
-->

TODO @everyone

# Decyzje i ich uzasadnienie

<!--
[List the decisions that have been made regarding architectural approaches and the constraints being placed on the way that the developers build the system. These will serve as guidelines for defining architecturally significant parts of the system. Justify each decision or constraint so that developers understand the importance of building the system according to the context created by those decisions and constraints. This may include a list of DOs and DON’Ts to guide the developers in building the system.]

Oba przykłady wskazują po kilka możliwych rozwiązań dla każdego celu.
-->

TODO @everyone

| **Cel** | **Sposób osiągnięcia (taktyki)** |
| ------- | -------------------------------- |
|         |                                  |

# Mechanizmy architektoniczne

<!--
[List the architectural mechanisms and describe the current state of each one. Initially, each mechanism may be only name and a brief description. They will evolve until the mechanism is a collaboration or pattern that can be directly applied to some aspect of the design.]

Rozpisać dokładniej taktyki z poprzedniego punktu.
-->

TODO @everyone

<!--
## Mechanizm 1

[Describe the purpose, attributes, and function of the architectural mechanism.]
-->

# Widoki architektoniczne

<!--
[Describe the architectural views that you will use to describe the software architecture. This illustrates the different perspectives that you will make available to review and to document architectural decisions.]
-->

TODO @tchojnacki

# Widok kontekstowy

## Diagram kontekstowy

TODO @everyone

## Scenariusze interakcji

TODO @everyone: brainstorming listy scenariuszy, po czym można się podzielić pracą

## Interfejsy integracyjne

<!-- Dla każdego "zewnętrznego" elementu z diagramu kontekstu. -->

TODO @everyone: prawodpodobnie będzie to jedynie bramka płatności, może wypełni @piterek130 jako specjalista od płatności?

<table>
  <tr>
    <th colspan="3">Interfejs 1</th>
  </tr>
  <tr>
    <th>Opis</th>
    <td colspan="2">Opcjonalny słowny opis interfejsu jeśli jest coś do dodania w stosunku do danych poniżej. W przypadku braku opisu należy wiersz należy usunąć.</td>
  </tr>
  <tr>
    <th>Status</th>
    <td colspan="2">Planowany/Istniejący/Modyfikowany/Zabroniony/Wycofany</td>
  </tr>
  <tr>
    <td></td>
    <th>Aplikacja źródłowa</th>
    <th>Aplikacja docelowa</th>
  </tr>
  <tr>
    <th>Nazwa aplikacji</th>
    <td>Aplikacja źródłowa (aplikacja, która inicjuje integrację na poziomie logicznym, czyli w większości przypadków aplikacja będąca przy końcu strzałki bez grotu)</td>
    <td>Aplikacja docelowa (aplikacja przy końcu strzałki z grotem)</td>
  </tr>
  <tr>
    <th>Technika integracji</th>
    <td>FTP/SSH/JDBC/ODBC/Oracle DBLink/SAP JCo/SAP RFC/ SOAP/HTTP / SOAP/HTTPS /Własny/...</td>
    <td>FTP/SSH/JDBC/ODBC/Oracle DBLink/SAP JCo/SAP RFC/ SOAP/HTTP / SOAP/HTTPS /Własny/...</td>
  </tr>
  <tr>
    <th>Mechanizm autentykacji</th>
    <td>Brak - niezalecane/HTTP Basic/WS-Security/Kerberos/Oracle Username and Password/...</td>
    <td>Brak - niezalecane/HTTP Basic/WS-Security/Kerberos/Oracle Username and Password/...</td>
  </tr>
  <tr>
    <th>Kontrakt danych</th>
    <td colspan="2">Lista wymienianych obiektów biznesowych (np. Partner Handlowy, Konto Umowy itp.)</td>
  </tr>
  <tr>
    <th>Czy interfejs manipuluje na danych wrażliwych (RODO)?</th>
    <td colspan="2">Tak/Nie + jakie dane objęte RODO</td>
  </tr>
  <tr>
    <th>Wykorzystywane oprogramowanie pośredniczące (middleware)</th>
    <td colspan="2">Brak/SAP PI/ESB/ODS/ESB i ODS/...</td>
  </tr>
  <tr>
    <th>Strona inicjująca</th>
    <td colspan="2">Aplikacja inicjująca połączenie na poziomie technicznym</td>
  </tr>
  <tr>
    <th>Model komunikacji</th>
    <td colspan="2">Synchroniczny na żądanie użytkownika/Asynchroniczny sterowany harmonogramem/Asynchroniczny wyzwalany zdarzeniem/...</td>
  </tr>
  <tr>
    <th>Wydajność</th>
    <td colspan="2">Jak często jest wywoływany interfejs, należy przedstawić największe wymaganie wydajnościowe w jednostce czasu dla której wymaganie musi być spełnione, np. 1000 / godz. Im krótsza jednostka czasu tym wymaganie ściślejsze.</td>
  </tr>
  <tr>
    <th>Wolumetria</th>
    <td colspan="2">Szacowana liczba wywołań w jednostce czasu znacząco dłuższej niż w określeniu wydajności. Potrzebne do oszacowania np. przestrzeni dyskowej niezbędnej do obsługi interfejsu.</td>
  </tr>
  <tr>
    <th>Wymagana dostępność</th>
    <td colspan="2">Np. 99,9%</td>
  </tr>
</table>

# Widok funkcjonalny

Poszczególnym częściom systemu zostały przypisane abstrakcyjne nazwy, zgodnie z poniższą tabelą:

| **Nazwa podsystemu**                                                     | **Część systemu**       | **Główny kontrybutor**           | **Posiadane encje**                                                                                         |
| ------------------------------------------------------------------------ | ----------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![#0088ff](https://placehold.co/16x16/0088ff/0088ff.png) **Jobberknoll** | Konto (_account_)       | **Tomasz Chojnacki** (260365)    | `Account`, `Admin`, `Driver`, `Inspector`, `Passenger`                                                      |
| ![#008800](https://placehold.co/16x16/008800/008800.png) **Clabbert**    | Bilet (_ticket_)        | **Jakub Zehner** (260285)        | `LongTermOffer`, `SingleFareOffer`, `Ticket`, `TicketKind`, `TimeLimitedOffer`, `TicketOffer`, `Validation` |
| ![#ff8800](https://placehold.co/16x16/ff8800/ff8800.png) **Inferius**    | Płatność (_payment_)    | **Piotr Kot** (259560)           | `CreditCardInfo`, `Fine`, `FineReason`, `Wallet`                                                            |
| ![#ff00ff](https://placehold.co/16x16/ff00ff/ff00ff.png) **Leprechaun**  | Logistyka (_logistics_) | **Przemysław Barcicki** (260324) | `Accident`, `Line`, `Route`, `Stop`, `Vehicle`                                                              |
| ![#ff0000](https://placehold.co/16x16/ff0000/ff0000.png) **Phoenix**     | API Gateway             | **Piotr Kot** (259560)           | —                                                                                                           |
| ![#8800ff](https://placehold.co/16x16/8800ff/8800ff.png) **Hogwart**     | Frontend                | —                                | —                                                                                                           |

![Diagram komponentów](./images/component-diagram-main.drawio.svg)

## Konto

![Diagram komponentów Jobberknoll](./images/component-diagram-jobberknoll.drawio.svg)

## Bilet

![Diagram komponentów Clabbert](./images/component-diagram-clabbert.drawio.svg)

## Płatność

![Diagram komponentów Inferius](./images/component-diagram-inferius.drawio.svg)

## Logistyka

![Diagram komponentów Leprechaun](./images/component-diagram-leprechaun.drawio.svg)

# Widok rozmieszczenia

## Diagram rozmieszczenia

![Diagram rozmieszczenia](./images/deployment-diagram.drawio.svg)

## Opis węzłów

TODO @everyone: Dodać informację, że większość z naszych węzłów jest skalowalna horyzontalnie, więc specyfikacja RAM itd. jest do pomnożenia. Dodatkowo aproksymacja liczby instancji dla każdego serwisu.

TODO @everyone: Trzeba zmienić layout poniższej tabelki, tak żeby pokazywał to, na co mamy wpływ. Będą to w sumie tylko pody, ponieważ na przeglądarkę i bramkę płatności nie mamy wpływu, a bazy danych są opisane w osobnych sekcjach. Może @mlodybercik jako nadworny DevOps?

<table>
  <tr>
    <th colspan="2">Ogólne informacje</th>
  </tr>
  <tr>
    <th>Nazwa</th>
    <th>Hostname</th>
  </tr>
  <tr>
    <th>Węzeł wirtualny?</th>
    <td>Tak/nie</td>
  </tr>
  <tr>
    <th>Centrum danych?</th>
    <td>Nie/PDC/BDC</td>
  </tr>
  <tr>
    <th>OS</th>
    <td>System operacyjny wraz z wersją</td>
  </tr>
  <tr>
    <th>Opis</th>
    <td></td>
  </tr>
  <tr>
    <th colspan="2">Konfiguracja sprzętowa</th>
  </tr>
  <tr>
    <th>Dostawca</th>
    <td>Nazwa sprzętu producenta</td>
  </tr>
  <tr>
    <th>Procesor</th>
    <td>Liczba i rodzaj procesorów</td>
  </tr>
  <tr>
    <th>RAM</th>
    <td>...</td>
  </tr>
  <tr>
    <th>HDD</th>
    <td>Wielkość i liczba dysków</td>
  </tr>
  <tr>  
    <th>RAID i HDD netto</th>
    <td>Rodzaj konfiguracji RAID i wielkość netto HDD.</td>
  </tr>
  <tr>
    <th>RAID?</th>
    <td>Brak/Do jakiej macierzy podłączony</td>
  </tr>
  <tr>
    <th>NIC bonding</th>
    <td>Nie/Tak</td>
  </tr>
  <tr>
    <th colspan="2">Konfiguracja oprogramowania</th>
  </tr>
  <tr>
    <th>Użytkownicy i grupy użytkowników</th>
    <td>Lista użytkowników do założenia na OSie.</td>
  </tr>
  <tr>
    <th>Poziom pracy systemu, czy jest wymagane środowisko graficzne</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Dodatkowe pakiety z dystrybucji systemu</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Dodatkowe pakiety spoza dystrybucji systemu</th>
    <td>...</td>
  </tr>
</table>

# Widok informacyjny

## Model informacyjny

### Konto

![Diagram klas Jobberknoll](./images/class-diagram-jobberknoll.drawio.svg)

### Bilet

![Diagram klas Clabbert](./images/class-diagram-clabbert.drawio.svg)

### Płatność

![Diagram klas Inferius](./images/class-diagram-inferius.drawio.svg)

### Logistyka

![Diagram klas Leprechaun](./images/class-diagram-leprechaun.drawio.svg)

## Projekt bazy danych

### Konto

TODO @tchojnacki: Dodać diagram bazodanowy do Jobberknoll, dodać uzasadnienia dla decyzji i uzupełnić tabelę.

<table>
  <tr>
    <th>Atrybut</th>
    <th>Terraform</th>
    <th>Wartość</th>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Informacje ogólne</div></th>
  </tr>
  <tr>
    <th>Identyfikator</th>
    <td><code>identifier</code></td>
    <td>np. <code>unikalny-identyfikator-rds</code></td>
  </tr>
  <tr>
    <th>Silnik i wersja</th>
    <td><code>engine</code>, <code>engine_version</code></td>
    <td>np. PostgreSQL 14.14-R1</td>
  </tr>
  <tr>
    <th>Klasa instancji</th>
    <td><code>instance_class</code></td>
    <td>np. <code>db.t3.micro</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Połączenie</div></th>
  </tr>
  <tr>
    <th>Nazwa bazy</th>
    <td><code>db_name</code></td>
    <td>np. <code>moja_baza</code></td>
  </tr>
  <tr>
    <th>Użytkownik</th>
    <td><code>username</code></td>
    <td>np. <code>moj_uzytkownik</code></td>
  </tr>
  <tr>
    <th>Port</th>
    <td><code>port</code></td>
    <td>np. <code>5432</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Składowanie</div></th>
  </tr>
  <tr>
    <th>Typ składowania</th>
    <td><code>storage_type</code></td>
    <td>np. <code>gp2</code></td>
  </tr>
  <tr>
    <th>Szyfrowanie bazy</th>
    <td><code>storage_encrypted</code></td>
    <td>TAK/NIE</td>
  </tr>
  <tr>
    <th>Początkowa pojemność (GB)</th>
    <td><code>allocated_storage</code></td>
    <td>np. 20</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (GB/rok)</th>
    <td>—</td>
    <td>np. 5</td>
  </tr>
  <tr>
    <th>Backup (retencja w dniach)</th>
    <td><code>backup_retention_period</code></td>
    <td>np. 7</td>
  </tr>
</table>

### Bilet

TODO @jakubzehner: Dodać diagram bazodanowy do Clobbert, dodać uzasadnienia dla decyzji i uzupełnić tabelę.

<table>
  <tr>
    <th>Atrybut</th>
    <th>Terraform</th>
    <th>Wartość</th>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Informacje ogólne</div></th>
  </tr>
  <tr>
    <th>Identyfikator</th>
    <td><code>identifier</code></td>
    <td>np. <code>unikalny-identyfikator-rds</code></td>
  </tr>
  <tr>
    <th>Silnik i wersja</th>
    <td><code>engine</code>, <code>engine_version</code></td>
    <td>np. PostgreSQL 14.14-R1</td>
  </tr>
  <tr>
    <th>Klasa instancji</th>
    <td><code>instance_class</code></td>
    <td>np. <code>db.t3.micro</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Połączenie</div></th>
  </tr>
  <tr>
    <th>Nazwa bazy</th>
    <td><code>db_name</code></td>
    <td>np. <code>moja_baza</code></td>
  </tr>
  <tr>
    <th>Użytkownik</th>
    <td><code>username</code></td>
    <td>np. <code>moj_uzytkownik</code></td>
  </tr>
  <tr>
    <th>Port</th>
    <td><code>port</code></td>
    <td>np. <code>5432</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Składowanie</div></th>
  </tr>
  <tr>
    <th>Typ składowania</th>
    <td><code>storage_type</code></td>
    <td>np. <code>gp2</code></td>
  </tr>
  <tr>
    <th>Szyfrowanie bazy</th>
    <td><code>storage_encrypted</code></td>
    <td>TAK/NIE</td>
  </tr>
  <tr>
    <th>Początkowa pojemność (GB)</th>
    <td><code>allocated_storage</code></td>
    <td>np. 20</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (GB/rok)</th>
    <td>—</td>
    <td>np. 5</td>
  </tr>
  <tr>
    <th>Backup (retencja w dniach)</th>
    <td><code>backup_retention_period</code></td>
    <td>np. 7</td>
  </tr>
</table>

### Płatność

TODO @piterek130: Dodać diagram bazodanowy do Inferius, dodać uzasadnienia dla decyzji i uzupełnić tabelę.

<table>
  <tr>
    <th>Atrybut</th>
    <th>Terraform</th>
    <th>Wartość</th>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Informacje ogólne</div></th>
  </tr>
  <tr>
    <th>Identyfikator</th>
    <td><code>identifier</code></td>
    <td>np. <code>unikalny-identyfikator-rds</code></td>
  </tr>
  <tr>
    <th>Silnik i wersja</th>
    <td><code>engine</code>, <code>engine_version</code></td>
    <td>np. PostgreSQL 14.14-R1</td>
  </tr>
  <tr>
    <th>Klasa instancji</th>
    <td><code>instance_class</code></td>
    <td>np. <code>db.t3.micro</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Połączenie</div></th>
  </tr>
  <tr>
    <th>Nazwa bazy</th>
    <td><code>db_name</code></td>
    <td>np. <code>moja_baza</code></td>
  </tr>
  <tr>
    <th>Użytkownik</th>
    <td><code>username</code></td>
    <td>np. <code>moj_uzytkownik</code></td>
  </tr>
  <tr>
    <th>Port</th>
    <td><code>port</code></td>
    <td>np. <code>5432</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Składowanie</div></th>
  </tr>
  <tr>
    <th>Typ składowania</th>
    <td><code>storage_type</code></td>
    <td>np. <code>gp2</code></td>
  </tr>
  <tr>
    <th>Szyfrowanie bazy</th>
    <td><code>storage_encrypted</code></td>
    <td>TAK/NIE</td>
  </tr>
  <tr>
    <th>Początkowa pojemność (GB)</th>
    <td><code>allocated_storage</code></td>
    <td>np. 20</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (GB/rok)</th>
    <td>—</td>
    <td>np. 5</td>
  </tr>
  <tr>
    <th>Backup (retencja w dniach)</th>
    <td><code>backup_retention_period</code></td>
    <td>np. 7</td>
  </tr>
</table>

### Logistyka

TODO @mlodybercik: Dodać diagram bazodanowy do Leprechaun, dodać uzasadnienia dla decyzji i uzupełnić tabelę.

<table>
  <tr>
    <th>Atrybut</th>
    <th>Terraform</th>
    <th>Wartość</th>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Informacje ogólne</div></th>
  </tr>
  <tr>
    <th>Identyfikator</th>
    <td><code>identifier</code></td>
    <td>np. <code>unikalny-identyfikator-rds</code></td>
  </tr>
  <tr>
    <th>Silnik i wersja</th>
    <td><code>engine</code>, <code>engine_version</code></td>
    <td>np. PostgreSQL 14.14-R1</td>
  </tr>
  <tr>
    <th>Klasa instancji</th>
    <td><code>instance_class</code></td>
    <td>np. <code>db.t3.micro</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Połączenie</div></th>
  </tr>
  <tr>
    <th>Nazwa bazy</th>
    <td><code>db_name</code></td>
    <td>np. <code>moja_baza</code></td>
  </tr>
  <tr>
    <th>Użytkownik</th>
    <td><code>username</code></td>
    <td>np. <code>moj_uzytkownik</code></td>
  </tr>
  <tr>
    <th>Port</th>
    <td><code>port</code></td>
    <td>np. <code>5432</code></td>
  </tr>
  <tr>
    <th colspan="3"><div align="center">Składowanie</div></th>
  </tr>
  <tr>
    <th>Typ składowania</th>
    <td><code>storage_type</code></td>
    <td>np. <code>gp2</code></td>
  </tr>
  <tr>
    <th>Szyfrowanie bazy</th>
    <td><code>storage_encrypted</code></td>
    <td>TAK/NIE</td>
  </tr>
  <tr>
    <th>Początkowa pojemność (GB)</th>
    <td><code>allocated_storage</code></td>
    <td>np. 20</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (GB/rok)</th>
    <td>—</td>
    <td>np. 5</td>
  </tr>
  <tr>
    <th>Backup (retencja w dniach)</th>
    <td><code>backup_retention_period</code></td>
    <td>np. 7</td>
  </tr>
</table>

# Widok wytwarzania

## Frontend

TODO @everyone

## Konto

TODO @tchojnacki: Dodać diagram pakietów, opis architektury i endpointy.

## Bilet

TODO @jakubzehner: Dodać diagram pakietów, opis architektury i endpointy.

## Płatność

TODO @piterek130: Dodać diagram pakietów, opis architektury i endpointy.

## Logistyka

TODO @mlodybercik: Dodać diagram pakietów, opis architektury i endpointy.

# Widok współbieżności (opcjonalny)

TODO @everyone

# Realizacja przypadków użycia

## Przypadek `ACC/??`

TODO @tchojnacki

## Przypadek `ACC/??`

TODO @tchojnacki

## Przypadek `TIC/??`

TODO @jakubzehner

## Przypadek `TIC/??`

TODO @jakubzehner

## Przypadek `PAY/??`

TODO @piterek130

## Przypadek `PAY/??`

TODO @piterek130

## Przypadek `LOG/??`

TODO @mlodybercik

## Przypadek `LOG/??`

TODO @mlodybercik
