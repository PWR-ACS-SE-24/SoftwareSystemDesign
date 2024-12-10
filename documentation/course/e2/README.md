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

Dokument przedstawia decyzje i ich uzasadnienie oraz ograniczenia i ważne elementy projektu systemu rozwiązania, które wpływają na jego implementację.

<!--
Dokument przedstawia decyzje i ich uzasadnienie oraz ograniczenia i ważne elementy projektu systemu rozwiązania, które wpływają na jego implementację.
[Always address Sections 2 through 6 of this template. Other sections are recommended, depending on the amount of novel architecture, the amount of expected maintenance, the skills of the development team, and the importance of other architectural concerns.]

W obu przykładowych rozwiązaniach ta sekcja jest pusta i nie ma komentarzy, tak ma być?
-->

# Cele i ograniczenia architektoniczne
<!--
[Insert a reference or link to the requirements that must be implemented to realize the architecture.
Formulate a set of goals that the architecture needs to meet in its structure and behavior. Identify critical issues that must be addressed by the architecture, such as: Are there hardware dependencies that should be isolated from the rest of the system? Does the system need to function efficiently under unusual conditions?]

Wymienić wymagania funkcjonalne i (głównie) niefunkcjonalne, które mają wpływ na architekturę systemu, mogą być z podziałem na epiki.

Proponuję też dodać numerację do wymagań niefunkcjonalnych, żeby można było się do nich łatwiej odwoływać.
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

## Mechanizm 1
<!--
[Describe the purpose, attributes, and function of the architectural mechanism.]
-->

# Widoki architektoniczne
<!--
[Describe the architectural views that you will use to describe the software architecture. This illustrates the different perspectives that you will make available to review and to document architectural decisions.]
-->

## Widok kontekstowy

### Diagram kontekstowy

TODO @everyone

### Scenariusze interakcji
<!--
Do dopytania, w jednym dokumencie całkiem pominięte, w drugim jest jeden diagram sekwencji tłumaczący autoryzację.
-->

TODO @everyone

### Interfejsy integracyjne - poziom logiczny
<!-- Dla każdego "zewnętrznego" elementu z diagramu kontekstu. -->

TODO @everyone

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

![Diagram komponentów](./images/component-diagram.drawio.svg)

# Widok rozmieszczenia

## Diagram rozmieszczenia

![Diagram rozmieszczenia](./images/deployment-diagram.drawio.svg)

## Opis węzłów

TODO @everyone: Dodać informację, że większość z naszych węzłów jest skalowalna horyzontalnie, więc specyfikacja RAM itd. jest do pomnożenia.

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

### Konto (Tomasz Chojnacki)

TODO @tchojnacki: Dodać diagram klas do Jobberknoll.

### Bilet (Jakub Zehner)

![Clabbert Class Diagram](./images/clabbert-class-diagram.drawio.svg)

### Płatność (Piotr Kot)

![Inferius Class Diagram](./images/inferius-class-diagram.drawio.svg)

### Logistyka (Przemysław Barcicki)

![Leprechaun Class Diagram](./images/leprechaun-class-diagram-Leprechaun.drawio.svg)

## Projekt bazy danych

### Konto (Tomasz Chojnacki)

TODO @tchojnacki: Dodać diagram bazodanowy do Jobberknoll i uzupełnić tabelę.

<table>
  <tr>
    <th colspan="2">Ogólne informacje nt. bazy danych</th>
  </tr>
  <tr>
    <th>SID</th>
    <td>Nazwa instancji bazy/Nazwa usługi</td>
  </tr>
  <tr>
    <th>Nazwa serwera</th>
    <td>Hostname</td>
  </tr>
  <tr>
    <th>Port</th>
    <td>Port</td>
  </tr>
  <tr>
    <th>Typ</th>
    <td>Oracle 11gR2 11.1.1.1/...</td>
  </tr>
  <tr>
    <th>Kodowanie znaków</th>
    <td>UTF-8/...</td>
  </tr>
  <tr>
    <th>Opis</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Technologie</th>
    <td>Lista wykorzystywanych technologii w bazie (np. Partitioning)</td>
  </tr>
  <tr>
    <th>Backup</th>
    <td>W tym wolumen danych, zakres backupu, częstotliwość, tryb, okres protekcji</td>
  </tr>
  <tr>
    <th colspan="2">Informacje o schemacie</th>
  </tr>
  <tr>
    <th>Nazwa</th>
    <td>Nazwa schematu</td>
  </tr>
  <tr>
    <th>Początkowa pojemność</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (rok)</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Niezbędne prawa</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Inne</th>
    <td>...</td>
  </tr>
</table>


### Bilet (Jakub Zehner)

TODO @jakubzehner: Dodać diagram bazodanowy do Clobbert i uzupełnić tabelę.

<table>
  <tr>
    <th colspan="2">Ogólne informacje nt. bazy danych</th>
  </tr>
  <tr>
    <th>SID</th>
    <td>Nazwa instancji bazy/Nazwa usługi</td>
  </tr>
  <tr>
    <th>Nazwa serwera</th>
    <td>Hostname</td>
  </tr>
  <tr>
    <th>Port</th>
    <td>Port</td>
  </tr>
  <tr>
    <th>Typ</th>
    <td>Oracle 11gR2 11.1.1.1/...</td>
  </tr>
  <tr>
    <th>Kodowanie znaków</th>
    <td>UTF-8/...</td>
  </tr>
  <tr>
    <th>Opis</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Technologie</th>
    <td>Lista wykorzystywanych technologii w bazie (np. Partitioning)</td>
  </tr>
  <tr>
    <th>Backup</th>
    <td>W tym wolumen danych, zakres backupu, częstotliwość, tryb, okres protekcji</td>
  </tr>
  <tr>
    <th colspan="2">Informacje o schemacie</th>
  </tr>
  <tr>
    <th>Nazwa</th>
    <td>Nazwa schematu</td>
  </tr>
  <tr>
    <th>Początkowa pojemność</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (rok)</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Niezbędne prawa</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Inne</th>
    <td>...</td>
  </tr>
</table>


### Płatność (Piotr Kot)

TODO @piterek130: Dodać diagram bazodanowy do Inferius i uzupełnić tabelę.

<table>
  <tr>
    <th colspan="2">Ogólne informacje nt. bazy danych</th>
  </tr>
  <tr>
    <th>SID</th>
    <td>Nazwa instancji bazy/Nazwa usługi</td>
  </tr>
  <tr>
    <th>Nazwa serwera</th>
    <td>Hostname</td>
  </tr>
  <tr>
    <th>Port</th>
    <td>Port</td>
  </tr>
  <tr>
    <th>Typ</th>
    <td>Oracle 11gR2 11.1.1.1/...</td>
  </tr>
  <tr>
    <th>Kodowanie znaków</th>
    <td>UTF-8/...</td>
  </tr>
  <tr>
    <th>Opis</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Technologie</th>
    <td>Lista wykorzystywanych technologii w bazie (np. Partitioning)</td>
  </tr>
  <tr>
    <th>Backup</th>
    <td>W tym wolumen danych, zakres backupu, częstotliwość, tryb, okres protekcji</td>
  </tr>
  <tr>
    <th colspan="2">Informacje o schemacie</th>
  </tr>
  <tr>
    <th>Nazwa</th>
    <td>Nazwa schematu</td>
  </tr>
  <tr>
    <th>Początkowa pojemność</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (rok)</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Niezbędne prawa</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Inne</th>
    <td>...</td>
  </tr>
</table>


### Logistyka (Przemysław Barcicki)

TODO @mlodybercik: Dodać diagram bazodanowy do Leprechaun i uzupełnić tabelę.

<table>
  <tr>
    <th colspan="2">Ogólne informacje nt. bazy danych</th>
  </tr>
  <tr>
    <th>SID</th>
    <td>Nazwa instancji bazy/Nazwa usługi</td>
  </tr>
  <tr>
    <th>Nazwa serwera</th>
    <td>Hostname</td>
  </tr>
  <tr>
    <th>Port</th>
    <td>Port</td>
  </tr>
  <tr>
    <th>Typ</th>
    <td>Oracle 11gR2 11.1.1.1/...</td>
  </tr>
  <tr>
    <th>Kodowanie znaków</th>
    <td>UTF-8/...</td>
  </tr>
  <tr>
    <th>Opis</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Technologie</th>
    <td>Lista wykorzystywanych technologii w bazie (np. Partitioning)</td>
  </tr>
  <tr>
    <th>Backup</th>
    <td>W tym wolumen danych, zakres backupu, częstotliwość, tryb, okres protekcji</td>
  </tr>
  <tr>
    <th colspan="2">Informacje o schemacie</th>
  </tr>
  <tr>
    <th>Nazwa</th>
    <td>Nazwa schematu</td>
  </tr>
  <tr>
    <th>Początkowa pojemność</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Przyrost pojemności (rok)</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Niezbędne prawa</th>
    <td>...</td>
  </tr>
  <tr>
    <th>Inne</th>
    <td>...</td>
  </tr>
</table>

# Widok wytwarzania

## Frontend

TODO @everyone

## Konto (Tomasz Chojnacki)

TODO @tchojnacki: Dodać diagram pakietów i opis architektury.

## Bilet (Jakub Zehner)

TODO @jakubzehner: Dodać diagram pakietów i opis architektury.

## Płatność (Piotr Kot)

TODO @piterek130: Dodać diagram pakietów i opis architektury.

## Logistyka (Przemysław Barcicki)

TODO @mlodybercik: Dodać diagram pakietów i opis architektury.

# Widok współbieżności (opcjonalny)

TODO @everyone

# Realizacja przypadków użycia

## Przypadek 1 (Tomasz Chojnacki)

TODO @tchojnacki

## Przypadek 2 (Tomasz Chojnacki)

TODO @tchojnacki

## Przypadek 3 (Jakub Zehner)

TODO @jakubzehner

## Przypadek 4 (Jakub Zehner)

TODO @jakubzehner

## Przypadek 5 (Piotr Kot)

TODO @piterek130

## Przypadek 6 (Piotr Kot)

TODO @piterek130

## Przypadek 7 (Przemysław Barcicki)

TODO @mlodybercik

## Przypadek 8 (Przemysław Barcicki)

TODO @mlodybercik
