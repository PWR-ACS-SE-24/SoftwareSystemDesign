<div align="center">
<p><b>Wyniki etapu I: Modelowanie biznesowe, <br/> specyfikacja i analiza wymagań</b></p>
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

# Model biznesowy

## Lista symboli, oznaczeń i akronimów

- **MPK** - Miejskie Przedsiębiorstwo Komunikacyjne

## Cel i zakres projektu

### Krótki opis projektu

Celem projektu jest stworzenie systemu informatycznego wspomagającego komunikację miejską. System ma ułatwić pasażerom korzystanie z komunikacji miejskiej poprzez możliwość zakupu biletów online, przeglądanie rozkładu jazdy oraz dostęp do informacji o awariach. System ma również ułatwić pracę kierowcom i bileterom poprzez możliwość kontroli ważności biletów oraz zgłaszania awarii.

### Cele projektu

- Wdrożenie systemu informatycznego w przeciągu 6 miesięcy od rozpoczęcia projektu, wraz z jednoczesnym wsparciem istniejącego systemu.
- Całkowite przejście na nowy system informatyczny w przeciągu 3 miesięcy od wdrożenia.
- Skrócenie czasu potrzebnego na _zakup_ _biletu_ przez _pasażera_ w _pojeździe_ o 40% w przeciągu 4 miesięcy od całkowitego wdrożenia systemu. Porównanie wyników poprzez przeprowadzenie pomiaru czasów przed i po wdrożeniu systemu.
- Skrócenie czasu potrzebnego na _sprawdzenie ważności biletu_ o 45% w przeciągu 4 miesięcy od pełnego wdrożenia systemu.
- Skrócenie czasu potrzebnego na wystawienie _mandatu_ o 70% w przeciągu 6 miesięcy od całkowitego wdrożenia systemu. Zarówno poprzedni jak i nowy system mierzą czas trwania tej czynności.
- Zwiększenie odsetku płatności za _mandaty_ o 20% w przeciągu 6 miesięcy od całkowitego wdrożenia systemu. Porównanie wyników poprzez przeprowadzenie pomiaru liczby opłaconych _mandatów_ przed i po wdrożeniu systemu.
- Wzrost liczby usatysfakcjonowanych _pasażerów_ korzystających z komunikacji miejskiej o przynajmniej 30% w przeciągu 6 miesięcy od całkowitego wdrożenia systemu. Porównanie wyników poprzez przeprowadzenie ankiety satysfakcji _pasażerów_ przed i po wdrożeniu systemu.

### Zakres projektu

W zakres projektu wchodzi:

- obsługa kont (logowanie, rejestracja, ustawienia konta)
- obsługa biletów (oferta biletowa, kasowanie, sprawdzanie ważności)
- obsługa płatności (dodawanie środków do portfela, zarządzanie metodami płatności, sprzedaż biletów, mandaty)
- obsługa logistyki MPK (pojazdy, linie, przystanki, rozkłady jazdy, awarie)

## Słownik pojęć

| Termin                          | Synonimy              | Definicja terminu                                                                                                                                      |
| ------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Administrator**               | _admin_               | Typ _konta_, użytkownik należący do organizacji, który zarządza _kontami_, _ofertami biletów_ i _logistyką_.                                           |
| **Awaria**                      | _accident_            | Nieprzewidziane zdarzenie, które powoduje przerwanie kursu _pojazdu_ z _rozkładu jazdy_ i jest zgłaszane przez pracownika.                             |
| **Bilet**                       | _ticket_              | Wirtualne potwierdzenie prawa _pasażera_ do podróży _pojazdem_ transportu publicznego, _zakupione_ za pomocą systemu.                                  |
| **Bilet czasowy**               | _time-limited ticket_ | _Bilet_, który jest _ważny_, jeśli jego _czas ważności_, liczony od _skasowania_, nie minął.                                                           |
| **Bilet jednorazowy**           | _single-fare ticket_  | _Bilet_, który jest _ważny_, jeśli został _skasowany_ w tym samym _pojeździe_ co _sprawdzony_.                                                         |
| **Bilet normalny**              | _standard ticket_     | _Bilet_, który może być używany przez każdego.                                                                                                         |
| **Bilet okresowy**              | _long-term ticket_    | _Bilet_, który jest _ważny_, jeśli jest używany w swoim _okresie ważności_.                                                                            |
| **Bilet ulgowy**                | _reduced ticket_      | _Bilet_, który może być używany przez osoby uprawnione (studentów, seniorów, itp.).                                                                    |
| **Bileter**                     | _inspector_           | Typ _konta_, użytkownik należący do organizacji, który może _sprawdzać ważność biletu_, wystawiać _mandaty_ i zgłaszać _awarie_.                       |
| **BLIK**                        | _BLIK_                | System płatności mobilnych, który pozwala na dokonywanie płatności za pomocą 6 cyfrowego kodu.                                                         |
| **Cena biletu**                 | _price_               | Kwota pieniężna, którą _pasażer_ musi zapłacić za _bilet_.                                                                                             |
| **Czas ważności**               | _duration_            | Czas od _skasowania_, przez który _bilet czasowy_ jest _ważny_.                                                                                        |
| **Dane karty kredytowej**       | _credit card info_    | Informacje o karcie kredytowej, które pozwalają na dodanie karty do _konta_.                                                                           |
| **Gość**                        | _guest_               | Osoba, która nie jest zalogowana do systemu.                                                                                                           |
| **Kasownik**                    | _validator_           | Fizyczne urządzenie w _pojeździe_, które pozwala _pasażerowi_ _skasować_ _bilet_.                                                                      |
| **Kierowca**                    | _driver_              | Typ _konta_, użytkownik należący do organizacji, który prowadzi _pojazd_ i zgłasza _awarie_.                                                           |
| **Kod biletu**                  | _code_                | Unikalny identyfikator zakupionego _biletu_.                                                                                                           |
| **Konto**                       | _account_             | Uogólnienie _pasażera_, _biletera_, _kierowcy_ i _administratora_.                                                                                     |
| **Kurs**                        | _route_               | Trasa, którą pokonuje _pojazd_ na danej _linii_                                                                                                        |
| **Linia**                       | _line_                | Trasa identyfikowana cyframi lub literami, zawierająca _przystanki_, którą pokonują _pojazdy_ podczas jazdy.                                           |
| **Logistyka**                   | _logistics_           | Część systemu odpowiedzialna za _pojazdy_, _przystanki_, _rozkłady jazdy_ i _awarie_.                                                                  |
| **Mandat**                      | _fine_                | Kara pieniężna, którą _bileter_ może nałożyć na _pasażera_ za nieważny _bilet_.                                                                        |
| **Mandat anulowany**            | _fine cancelled_      | _Mandat_, który został unieważniony przez _biletera_.                                                                                                  |
| **Mandat nieopłacony**          | _fine unpaid_         | _Mandat_, który jest aktywny i oczekuje na uregulowanie przez _pasażera_.                                                                              |
| **Mandat opłacony**             | _fine paid_           | _Mandat_, który został uregulowany przez _pasażera_.                                                                                                   |
| **Oferta biletu**               | _ticket offer_        | Kombinacja _zakresu biletu_ i _typu biletu_.                                                                                                           |
| **Okres ważności**              | _interval_            | Daty, w których _bilet okresowy_ jest _ważny_.                                                                                                         |
| **Osoba zalogowana**            | _member_              | Osoba zalogowana do systemu jako _administrator_, _bileter_, _kierowca_ albo _pasażer_.                                                                |
| **Pasażer**                     | _passenger_           | Typ _konta_, użytkownik zewnętrzny dla organizacji, który może _zakupywać_ _bilety_.                                                                   |
| **Płatność**                    | _payment_             | Proces dokonywania opłaty za _bilet_.                                                                                                                  |
| **Pojazd**                      | _vehicle_             | Autobus lub tramwaj, identyfikowany unikalnym numerem bocznym, na który _pasażer_ kupuje _bilety_ i w którym są _kasowniki_.                           |
| **Portfel**                     | _wallet_              | Stan wirtualnego konta _pasażera_, z którego pobierane są opłaty za _bilety_.                                                                          |
| **Powód mandatu**               | _fine reason_         | Przyczyna nałożenia _mandatu_, może przyjmować wartości brak biletu, nieważny bilet, wygasły bilet, brak dokumentu, nieuprawnione zatrzymanie pojazdu. |
| **Przystanek**                  | _stop_                | Miejsce, w którym _pasażer_ może wsiąść lub wysiąść z _pojazdu_.                                                                                       |
| **Rozkład jazdy**               | _timetable_           | Plan, w którym są zapisane godziny odjazdów _pojazdów_ danej _linii_ z _przystanków_.                                                                  |
| **Skasowanie**                  | _validation_          | Proces, w którym _pasażer_ wykorzystuje _kasownik_ aby _bilet jednorazowy_ lub _bilet czasowy_ stał się _ważny_.                                       |
| **Sprawdzenie ważności biletu** | _inspection_          | Proces, w którym _bileter_ sprawdza, czy _bilet_ _pasażera_ jest _ważny_.                                                                              |
| **Status mandatu**              | _fine status_         | Stan _mandatu_, może przyjmować wartości _opłacony_ , _nieopłacony_ lub _anulowany_.                                                                   |
| **Typ biletu**                  | _ticket kind_         | Rodzaj zniżki _biletu_, czyli _normalny_ lub _ulgowy_.                                                                                                 |
| **Ważność**                     | _validity_            | Stan _biletu_, ważny (_valid_) albo nieważny (_invalid_), tylko ważny _bilet_ daje prawo do podróży.                                                   |
| **Zakres biletu**               | _ticket scope_        | Rodzaj określenia ważności _biletu_, czyli _jednorazowy_, _czasowy_ lub _okresowy_.                                                                    |
| **Zakup**                       | _purchase_            | Proces nabywania _biletu_ przez _pasażera_, potwierdzony przez _płatność_.                                                                             |

# Specyfikacja i analiza wymagań

## Definicja wymagań funkcjonalnych

### Konto (Tomasz Chojnacki)

- `ACC/01` - Jako _gość_ chcę mieć możliwość rejestracji _konta_ _pasażera_.
- `ACC/02` - Jako _gość_ chcę mieć możliwość zalogowania się do _konta_ (_administratora_, _biletera_, _kierowcy_, _pasażera_).
- `ACC/03` - Jako _osoba zalogowana_ chcę mieć możliwość wylogowania się ze swojego _konta_.
- `ACC/04` - Jako _osoba zalogowana_ chcę mieć możliwość wyświetlenia informacji o swoim _koncie_.
- `ACC/05` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany imienia i nazwiska przypisanego do swojego _konta_.
- `ACC/06` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany hasła przypisanego do swojego _konta_.
- `ACC/07` - Jako _osoba zalogowana_ chcę mieć możliwość wyświetlenia swoich preferencji (motywu kolorystycznego, języka aplikacji).
- `ACC/08` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany motywu kolorystycznego.
- `ACC/09` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany języka aplikacji.
- `ACC/10` - Jako _osoba zalogowana_ chcę mieć możliwość dezaktywacji swojego _konta_.
- `ACC/11` - Jako _administrator_ chcę mieć możliwość tworzenia _konta_ _biletera_.
- `ACC/12` - Jako _administrator_ chcę mieć możliwość tworzenia _konta_ _kierowcy_.
- `ACC/13` - Jako _administrator_ chcę mieć możliwość przeglądania listy wszystkich _kont_ (_administratorów_, _bileterów_, _kierowców_, _pasażerów_).
- `ACC/14` - Jako _administrator_ chcę mieć możliwość wyświetlenia informacji o cudzym _koncie_ (_administratora_, _biletera_, _kierowcy_, _pasażera_).
- `ACC/15` - Jako _administrator_ chcę mieć możliwość dezaktywacji cudzych _kont_ niebędących _administratorami_ (_biletera_, _kierowcy_, _pasażera_).
- `ACC/16` - Jako _pasażer_ chcę mieć możliwość zmiany i usunięcia numeru telefonu przypisanego do swojego _konta_.
- `ACC/17` - Jako _pasażer_ chcę mieć możliwość sprawdzenia i zmiany domyślnego _typu biletu_ (po otworzeniu aplikacji pokazane będą _oferty biletów_ tego typu).

### Bilet (Jakub Zehner)

- `TIC/01` - Jako _pasażer_ chcę mieć możliwość _zakupu_ _biletu jednorazowego_.
- `TIC/02` - Jako _pasażer_ chcę mieć możliwość _zakupu_ _biletu czasowego_.
- `TIC/03` - Jako _pasażer_ chcę mieć możliwość _zakupu_ _biletu okresowego_.
- `TIC/04` - Jako _pasażer_ chcę mieć możliwość _zakupu_ _biletu ulgowego_.
- `TIC/05` - Jako _pasażer_ chcę mieć możliwość _zakupu_ _biletu normalnego_.
- `TIC/06` - Jako _pasażer_ chcę mieć możliwość wyświetlenia listy swoich zakupionych _biletów_.
- `TIC/07` - Jako _pasażer_ chcę mieć możliwość wyświetlenia szczegółów zakupionego _biletu_.
- `TIC/08` - Jako _pasażer_ chcę mieć możliwość _skasowania biletu_.
- `TIC/09` - Jako _pasażer_ chcę mieć możliwość okazania _biletu_ do _sprawdzenia ważności biletu_.
- `TIC/10` - Jako _pasażer_ chcę mieć możliwość zobaczenia _oferty biletów_.
- `TIC/11` - Jako _pasażer_ chcę mieć możliwość zobaczenia historii zakupionych _biletów_.
- `TIC/12` - Jako _bileter_ chcę mieć możliwość _sprawdzenia ważności_ _biletu_ _pasażera_.
- `TIC/13` - Jako _administrator_ chcę mieć możliwość wyświetlenia _oferty biletów_.
- `TIC/14` - Jako _administrator_ chcę mieć możliwość dodawania nowych _biletów_ do _oferty biletów_.
- `TIC/15` - Jako _administrator_ chcę mieć możliwość edytowania _biletów_ w _ofercie biletów_.
- `TIC/16` - Jako _administrator_ chcę mieć możliwość usuwania _biletów_ z _oferty biletów_.

### Płatność (Piotr Kot)

- `PAY/01` - Jako _pasażer_ chcę mieć możliwość wyświetlenia listy dostępnych metod płatności.
- `PAY/02` - Jako _pasażer_ chcę mieć możliwość dodania nowej karty kredytowej.
- `PAY/03` - Jako _pasażer_ chcę mieć możliwość usunięcia karty kredytowej ze swojego _konta_.
- `PAY/04` - Jako _pasażer_ chcę mieć możliwość wyboru _BLIK_ jako metodę płatności.
- `PAY/05` - Jako _pasażer_ chcę mieć możliwość wyboru karty kredytowej jako metodę płatności.
- `PAY/06` - Jako _pasażer_ chcę mieć możliwość wyboru _portfela_ jako metody płatności.
- `PAY/07` - Jako _pasażer_ chcę mieć możliwość dodania środków do swojego _portfela_.
- `PAY/08` - Jako _pasażer_ chcę mieć możliwość sprawdzenia stanu swojego _portfela_.
- `PAY/09` - Jako _pasażer_ chcę mieć możliwość przeglądania historii doładowań _portfela_.
- `PAY/10` - Jako _pasażer_ chcę mieć możliwość przeglądania historii płatności.
- `PAY/11` - Jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą _BLIK_.
- `PAY/12` - Jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą karty kredytowej.
- `PAY/13` - Jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą _portfela_.
- `PAY/14` - Jako _pasażer_ chcę mieć możliwość zapłaty za wystawiony _mandat_ za pomocą _BLIK_.
- `PAY/15` - Jako _pasażer_ chcę mieć możliwość zapłaty za wystawiony _mandat_ za pomocą karty kredytowej.
- `PAY/16` - Jako _pasażer_ chcę mieć możliwość zapłaty za wystawiony _mandat_ za pomocą _portfela_.
- `PAY/17` - Jako _pasażer_ chcę mieć możliwość przeglądania wystawionych _mandatów_.
- `PAY/18` - Jako _pasażer_ chcę mieć możliwość wyświetlenia szczegółów _mandatu_.
- `PAY/19` - Jako _pasażer_ chcę mieć możliwość wyświetlenia dodanych kart kredytowych.
- `PAY/20` - Jako _pasażer_ chcę mieć możliwość zaktualizowania danych karty kredytowej.
- `PAY/21` - Jako _bileter_ chcę mieć możliwość wystawienia _mandatu_.
- `PAY/22` - Jako _bileter_ chcę mieć możliwość zmiany _statusu mandatu_ na _anulowany_
- `PAY/23` - Jako _bileter_ chcę mieć możliwość przeglądania historii _mandatów_.

### Logistyka (Przemysław Barcicki)

- `LOG/01` - Jako _pasażer_ chce mieć mozliwość przeglądania _linii_.
- `LOG/02` - Jako _administrator_ chcę mieć możliwość przeglądania _linii_.
- `LOG/03` - Jako _administrator_ chce mieć możliwość dodawania _linii_.
- `LOG/04` - Jako _administrator_ chcę mieć możliwość edytowania _linii_.
- `LOG/05` - Jako _administrator_ chcę mieć możliwość usuwania _linii_.
- `LOG/06` - Jako _pasażer_ chce mieć mozliwość przeglądania _przystanków_.
- `LOG/07` - Jako _administrator_ chcę mieć możliwość przeglądania _przystanków_.
- `LOG/08` - Jako _administrator_ chcę mieć możliwość dodawania _przystanków_.
- `LOG/09` - Jako _administrator_ chcę mieć możliwość edytowania _przystanków_.
- `LOG/10` - Jako _administrator_ chcę mieć możliwość usuwania _przystanków_.
- `LOG/11` - Jako _pasażer_ chce mieć mozliwość przeglądania _rozkładów jazdy_.
- `LOG/12` - Jako _administrator_ chcę mieć możliwość przeglądania _rozkładów jazdy_.
- `LOG/13` - Jako _administrator_ chcę mieć możliwość dodawania _rozkładów jazdy_.
- `LOG/14` - Jako _administrator_ chcę mieć możliwość edytowania _rozkładów jazdy_.
- `LOG/15` - Jako _administrator_ chcę mieć możliwość usuwania _rozkładów jazdy_.
- `LOG/16` - Jako _administrator_ chcę mieć możliwość przeglądania _pojazdów_.
- `LOG/17` - Jako _administrator_ chcę mieć możliwość dodawania _pojazdów_.
- `LOG/18` - Jako _administrator_ chcę mieć możliwość edytowania _pojazdów_.
- `LOG/19` - Jako _administrator_ chcę mieć możliwość usuwania _pojazdów_.
- `LOG/20` - Jako _pasażer_ chce mieć mozliwość przeglądania _awarii_.
- `LOG/21` - Jako _kierowca_ chcę mieć możliwość przeglądania _awarii_.
- `LOG/22` - Jako _kierowca_ chcę mieć możliwość zgłaszania _awarii_.
- `LOG/23` - Jako _kierowca_ chcę mieć możliwość edytowania _awarii_.
- `LOG/24` - Jako _bileter_ chcę mieć możliwość przeglądania _awarii_.
- `LOG/25` - Jako _bileter_ chcę mieć możliwość zgłaszania _awarii_.
- `LOG/26` - Jako _bileter_ chcę mieć możliwość edytowania _awarii_.
- `LOG/27` - Jako _administrator_ chcę mieć możliwość przeglądania _awarii_.

## Wymagania niefunkcjonalne

Wyrażenia: musi, powinien, może, nie powinien, nie może są używane zgodnie z definicją ich anglojęzycznych odpowiedników zawartych w RFC 2119.

Wymagania niefunkcjonalne zostały podzielone zgodnie z metodyką FURPS+ (Functionality, Usability, Reliability, Performance, Supportability).

### Wymagania systemowe

- `NF/SYS/01` - Strona internetowa powinna być możliwa do wyświetlenia na przeglądarkach internetowych "Evergreen Browser".
- `NF/SYS/02` - System umożliwia obsługę z użyciem ekranu dotykowego dla funkcjonalności _pasażera_, _kierowcy_, _biletera_.
- `NF/SYS/03` - System umożliwia obsługę z użyciem myszki i klawiatury dla funkcjonalności _administratora_.

### Użyteczność

- `NF/USE/01` - System powinien być zaprojektowany tak, aby przynajmniej 50% użytkowników więcej względem poprzedniego systemu mogło wykonać podstawowe czynności, takie jak zakup biletu czy sprawdzenie rozkładu jazdy, bez konieczności korzystania z instrukcji lub pomocy technicznej. Sprawdzane poprzez wywiady z użytkownikami.
- `NF/USE/02` - System powinien być zoptymalizowany zarówno dla urządzeń desktopowych, jak i mobilnych, oferując pełną funkcjonalność na ekranach o rozdzielczościach od 360x800 pikseli (najpopularniejsza rozdzielczość małych telefonów). Wyjątkiem od reguły są interfejsy administratora.
- `NF/USE/03` - System powinien być dostępny w języku polskim i angielskim.
- `NF/USE/04` - System powinien oferować dwa motywy kolorystyczne: jasny i ciemny.
- `NF/USE/05` - System musi być zgodny z wytycznymi WCAG 2.1 poziom AA, umożliwiając dostęp osobom z niepełnosprawnościami, np. poprzez kontrast tekstu, możliwość korzystania z klawiatury, oraz wsparcie czytników ekranu.
- `NF/USE/06` - Kluczowe operacje, takie jak zakup biletu, powinny być możliwe do wykonania w maksymalnie 5 kliknięciach.

### Niezawodność

- `NF/REL/01` - Klasa niezawodności systemu powinna wynosić co najmniej 99,9%.
- `NF/REL/02` - W przypadku awarii nieobejmującej sprzętu system powinien mieć możliwość powrotu do stanu sprzed awarii w czasie poniżej 1 godziny.
- `NF/REL/03` - System powinien wykonywać codzienną kopię zapasową danych.
- `NF/REL/04` - Dostęp do funkcjonalności pasażerów, bileterów, kierowców i administratorów powinien być możliwy tylko w sposób autoryzowany.
- `NF/REL/05` - Dostęp do funkcjonalności gościa (logowanie, rejestracja - zgodnie z wymaganiami funkcjonalnymi) powinien być możliwy w sposób nieautoryzowany.
- `NF/REL/06` - Części systemów powinny komunikować się ze sobą w sposób uniemożliwiający ingerecję osób trzecich.
- `NF/REL/07` - System musi być zabezpieczony przed utratą zasilania oraz połączenia internetowego.
- `NF/REL/08` - System powinien respektować zasady RODO.
- `NF/REL/09` - System powinien przetworzyć wszystkie płatności i emaile niezależnie od dostępności usługi w momencie ich zlecenia.

### Wydajność

- `NF/PRF/01` - System powinien obsługiwać zapytania użytkowników, zakładając brak problemów sieciowych:
  1. dotyczące biletów w czasie poniżej 1 sekundy dla co najmniej 90% przypadków.
  2. dotyczące kont w czasie poniżej 2 sekundy dla co najmniej 90% przypadków.
  3. dotyczące płatności w czasie poniżej 10 sekundy dla co najmniej 90% przypadków.
  4. dotyczące logistyki w czasie poniżej 1 sekundy dla co najmniej 90% przypadków.
- `NF/PRF/02` - System powinien działać bez zarzutu przy jednoczesnym korzystaniu przez 5000 użytkowników [^nf-prf-2].

### Wsparcie

- `NF/SUP/01` - Zapewniona jest pełna dokumentacja systemu:
  1. Dokumentacja powinna być dostępna w języku polskim i angielskim.
  2. Dokumentacja powinna być dostępna w formie pliku PDF.
  3. Dokumentacja powinna zawierać instrukcję obsługi dla użytkowników oraz instrukcję konfiguracji dla administratorów.
  4. Dokumentacja powinna obejmować najczęściej zadawane pytania (FAQ).
- `NF/SUP/02` - Powinno być dostępne wsparcie techniczne w godzinach 8:00-16:00 czasu lokalnego w dni robocze.
- `NF/SUP/03` - System powinien w przejrzysty sposób informować użytkownika o błędach.

## Model informacyjny

<img src="./images/information-model-class-diagram.drawio.svg">

## Reguły biznesowe i ograniczenia systemowe

Reguły zostały podzielone według encji, których dotyczą oraz są uporządkowane alfabetycznie zgodnie z angielskimi tłumaczeniami nazw encji.

### Awaria (`Accident`)

- `REG/01/01` - Może istnieć wiele awarii.
- `REG/01/02` - Awaria musi mieć unikalny identyfikator.
- `REG/01/03` - Awaria musi zawierać czas zgłoszenia.
- `REG/01/04` - Czas zgłoszenia nie może być w przyszłości.
- `REG/01/05` - Awaria musi zawierać opis.
- `REG/01/06` - Opis nie może być pusty.
- `REG/01/07` - Opis nie może przekraczać 255 znaków.
- `REG/01/08` - Awaria musi wystąpić na dokładnie jednej trasie.
- `REG/01/09` - Awaria może być rozwiązana.
- `REG/01/10` - Awaria jest domyślnie nierozwiązana.

### Konto (`Account`)

- `REG/02/01` - Może istnieć wiele kont.
- `REG/02/02` - Konto musi mieć unikalny identyfikator.
- `REG/02/03` - Konto musi zawierać pełne imię i nazwisko.
- `REG/02/04` - Imię i nazwisko nie mogą być puste.
- `REG/02/05` - Imię i nazwisko nie mogą przekraczać 255 znaków.
- `REG/02/06` - Konto musi zawierać adres e-mail.
- `REG/02/07` - Adres e-mail musi być poprawnym i unikalnym adresem.
- `REG/02/08` - Konto musi zawierać zahaszowane hasło.
- `REG/02/09` - Konto musi zawierać status aktywności.
- `REG/02/10` - Status aktywności jest domyślnie aktywny.

### Administrator (`Admin`)

- `REG/03/01` - Może istnieć wiele administratorów.
- `REG/03/02` - Administrator musi być kontem.

### Dane karty kredytowej (`CreditCardInfo`)

- `REG/04/01` - Może istnieć wiele danych kart kredytowych.
- `REG/04/02` - Dane karty kredytowej muszą mieć unikalny identyfikator.
- `REG/04/03` - Dane karty kredytowej muszą zawierać numer karty.
- `REG/04/04` - Numer karty musi być poprawny (algorytm Luhna).
- `REG/04/05` - Dane karty kredytowej muszą zawierać imię i nazwisko posiadacza.
- `REG/04/06` - Imię i nazwisko posiadacza nie mogą być puste.
- `REG/04/07` - Imię i nazwisko posiadacza nie mogą przekraczać 255 znaków.
- `REG/04/08` - Dane karty kredytowej muszą zawierać datę ważności.
- `REG/04/09` - Dane karty kredytowej mogą zawierać etykietę.
- `REG/04/10` - Etykieta nie może przekraczać 255 znaków.
- `REG/04/11` - Dane karty kredytowej muszą być zawarte w dokładnie jednym portfelu.

### Kierowca (`Driver`)

- `REG/05/01` - Może istnieć wiele kierowców.
- `REG/05/02` - Kierowca musi być kontem.
- `REG/05/03` - Kierowca może jeździć na wielu trasach.

### Mandat (`Fine`)

- `REG/06/01` - Może istnieć wiele mandatów.
- `REG/06/02` - Mandat musi mieć unikalny identyfikator.
- `REG/06/03` - Mandat musi zawierać odbiorcę.
- `REG/06/04` - Odbiorca nie może być pusty.
- `REG/06/05` - Odbiorca nie może przekraczać 255 znaków.
- `REG/06/06` - Mandat musi zawierać kwotę do zapłaty.
- `REG/06/07` - Kwota do zapłaty musi być większa od zera.
- `REG/06/08` - Mandat musi zawierać czas nałożenia.
- `REG/06/09` - Czas nałożenia nie może być w przyszłości.
- `REG/06/10` - Czas nałożenia jest domyślnie równy czasowi utworzenia mandatu.
- `REG/06/11` - Mandat musi zawierać powód.
- `REG/06/12` - Mandat musi być wystawiony przez dokładnie jednego biletera.
- `REG/06/13` - Mandat może karać dokładnie jednego pasażera.
- `REG/06/14` - Mandat musi posiadać status.

### Powód mandatu (`FineReason`)

- `REG/07/01` - Istnieje pięć powodów mandatu: brak biletu, nieważny bilet, wygasły bilet, brak dokumentu, nieuprawnione zatrzymanie pojazdu.

### Status mandatu (`FineStatus`)

- `REG/08/01` - Istnieją trzy statusy mandatu: opłacony, nieopłacony, anulowany.
- `REG/08/02` - Status mandatu jest domyślnie nieopłacony.
- `REG/08/03` - Status mandatu zmienia się na opłacony po uregulowaniu opłaty.
- `REG/08/04` - Status mandatu zmienia się na anulowany po anulowaniu mandatu przez biletera.

### Bileter (`Inspector`)

- `REG/09/01` - Może istnieć wiele bileterów.
- `REG/09/02` - Bileter musi być kontem.
- `REG/09/03` - Bileter może nałożyć wiele mandatów.

### Linia (`Line`)

- `REG/10/01` - Może istnieć wiele linii.
- `REG/10/02` - Linia musi mieć unikalny identyfikator.
- `REG/10/03` - Linia musi zawierać nazwę.
- `REG/10/04` - Nazwa nie może być pusta.
- `REG/10/05` - Nazwa nie może przekraczać 4 znaków.
- `REG/10/06` - Linia może być przypisana do wielu tras.
- `REG/10/07` - Linia może odwiedzać wiele przystanków.
- `REG/10/08` - Linia musi zawierać status aktywności.
- `REG/10/09` - Status aktywności jest domyślnie aktywny.

### Oferta biletu okresowego (`LongTermOffer`)

- `REG/11/01` - Może istnieć wiele ofert biletów okresowych.
- `REG/11/02` - Oferta biletu okresowego musi być ofertą biletu.
- `REG/11/03` - Oferta biletu okresowego musi zawierać okres ważności w dniach.
- `REG/11/04` - Okres ważności w dniach musi być większy od zera.

### Pasażer (`Passenger`)

- `REG/12/01` - Może istnieć wiele pasażerów.
- `REG/12/02` - Pasażer musi być kontem.
- `REG/12/03` - Pasażer może mieć numer telefonu.
- `REG/12/04` - Numer telefonu pasażera musi być poprawnym i unikalnym numerem.
- `REG/12/05` - Pasażer może mieć zakupione wiele biletów.
- `REG/12/06` - Pasażer może być ukarany wieloma mandatami.
- `REG/12/07` - Pasażer może zarządzać jednym portfelem.

### Trasa (`Route`)

- `REG/13/01` - Może istnieć wiele tras.
- `REG/13/02` - Trasa musi mieć unikalny identyfikator.
- `REG/13/03` - Trasa musi zawierać czas rozpoczęcia.
- `REG/13/04` - Trasa musi zawierać czas zakończenia.
- `REG/13/05` - Czas zakończenia musi być późniejszy niż czas rozpoczęcia.
- `REG/13/06` - Trasa musi być przypisana do dokładnie jednej linii.
- `REG/13/07` - Trasą musi jeździć dokładnie jeden pojazd.
- `REG/13/08` - Trasa musi być przypisana do dokładnie jednego kierowcy.
- `REG/13/09` - Trasa może zawierać wiele awarii.
- `REG/13/10` - Trasa może zawierać wiele skasowań.

### Oferta biletu jednorazowego (`SingleFareOffer`)

- `REG/14/01` - Może istnieć wiele ofert biletów jednorazowych.
- `REG/14/02` - Oferta biletu jednorazowego musi być ofertą biletu.

### Przystanek (`Stop`)

- `REG/15/01` - Może istnieć wiele przystanków.
- `REG/15/02` - Przystanek musi mieć unikalny identyfikator.
- `REG/15/03` - Przystanek musi zawierać nazwę.
- `REG/15/04` - Nazwa nie może być pusta.
- `REG/15/05` - Nazwa nie może przekraczać 255 znaków.
- `REG/15/06` - Przystanek może być odwiedzany przez wiele linii.
- `REG/15/07` - Przystanek musi zawierać szerokość geograficzną.
- `REG/15/08` - Szerokość geograficzna musi być poprawną wartością.
- `REG/15/09` - Przystanek musi zawierać długość geograficzną.
- `REG/15/10` - Długość geograficzna musi być poprawną wartością.

### Bilet (`Ticket`)

- `REG/16/01` - Może istnieć wiele biletów.
- `REG/16/02` - Bilet musi mieć unikalny identyfikator.
- `REG/16/03` - Bilet musi zawierać unikalny alfanumeryczny kod.
- `REG/16/04` - Bilet musi zawierać czas zakupu.
- `REG/16/05` - Czas zakupu nie może być w przyszłości.
- `REG/16/06` - Czas zakupu jest domyślnie równy czasowi utworzenia biletu.
- `REG/16/07` - Bilet musi wykorzystywać dokładnie jedną ofertę biletu.
- `REG/16/08` - Bilet musi być zakupiony przez dokładnie jednego pasażera.
- `REG/16/09` - Bilet może być skasowany dokładnie jednym skasowaniem.
- `REG/16/10` - Bilet musi zawierać status.
- `REG/16/11` - Status biletu jest domyślnie w trakcie realizacji.

### Typ biletu (`TicketKind`)

- `REG/17/01` - Istnieją dwa typy biletów: normalny i ulgowy.
- `REG/17/02` - Zniżka biletu zależy od jego typu (normalny: 0%, ulgowy: 50%).

### Oferta biletu czasowego (`TimeLimitedOffer`)

- `REG/18/01` - Może istnieć wiele ofert biletów czasowych.
- `REG/18/02` - Oferta biletu czasowego musi być ofertą biletu.
- `REG/18/03` - Oferta biletu czasowego musi zawierać czas ważności.
- `REG/18/04` - Czas ważności musi być dłuższy od zera.

### Oferta biletu (`TicketOffer`)

- `REG/19/01` - Może istnieć wiele ofert biletów.
- `REG/19/02` - Oferta biletu musi mieć unikalny identyfikator.
- `REG/19/03` - Oferta biletu musi zawierać nazwę w języku angielskim.
- `REG/19/04` - Nazwa w języku angielskim nie może być pusta.
- `REG/19/05` - Nazwa w języku angielskim nie może przekraczać 255 znaków.
- `REG/19/06` - Oferta biletu musi zawierać nazwę w języku polskim.
- `REG/19/07` - Nazwa w języku polskim nie może być pusta.
- `REG/19/08` - Nazwa w języku polskim nie może przekraczać 255 znaków.
- `REG/19/09` - Oferta biletu musi zawierać typ biletu.
- `REG/19/10` - Oferta biletu musi zawierać cenę w PLN.
- `REG/19/11` - Cena w PLN musi być większa od zera.
- `REG/19/12` - Oferta biletu może być wykorzystana w wielu biletach.
- `REG/19/13` - Oferta biletu musi mieć status.
- `REG/19/14` - Status jest domyślnie aktywny.

### Status biletu (`TicketStatus`)

- `REG/20/01` - Istnieją trzy statusy biletu: zakupiony, w trakcie realizacji, anulowany.
- `REG/20/02` - Status biletu zmienia się na zakupiony po pomyślnym opłaceniu.
- `REG/20/03` - Status biletu zmienia się na anulowany po braku opłacenia w określonym czasie.

### Skasowanie (`Validation`)

- `REG/21/01` - Może istnieć wiele skasowań.
- `REG/21/02` - Skasowanie musi mieć unikalny identyfikator.
- `REG/21/03` - Skasowanie musi zawierać czas skasowania.
- `REG/21/04` - Czas skasowania nie może być w przyszłości.
- `REG/21/05` - Czas skasowania jest domyślnie równy czasowi utworzenia skasowania.
- `REG/21/06` - Skasowanie musi być wykonane na dokładnie jednej trasie.
- `REG/21/07` - Skasowanie musi kasować dokładnie jeden bilet.

### Pojazd (`Vehicle`)

- `REG/22/01` - Może istnieć wiele pojazdów.
- `REG/22/02` - Pojazd musi mieć unikalny identyfikator.
- `REG/22/03` - Pojazd musi zawierać numer boczny.
- `REG/22/04` - Numer boczny musi być unikalny.
- `REG/22/05` - Numer boczny nie może być pusty.
- `REG/22/06` - Numer boczny nie może przekraczać 16 znaków.
- `REG/22/07` - Pojazd może jeździć na wielu trasach.
- `REG/22/08` - Pojazd musi zawierać status aktywności.
- `REG/22/09` - Status aktywności jest domyślnie aktywny.

### Portfel (`Wallet`)

- `REG/23/01` - Może istnieć wiele portfeli.
- `REG/23/02` - Portfel musi mieć unikalny identyfikator.
- `REG/23/03` - Portfel musi zawierać saldo w PLN.
- `REG/23/04` - Saldo w PLN nie może być mniejsze od zera.
- `REG/23/05` - Portfel musi być zarządzany przez dokładnie jednego pasażera.
- `REG/23/06` - Portfel może zawierać wiele danych kart kredytowych.

## Prototypy interfejsu

### Wymaganie 1 (Tomasz Chojnacki)

1. `ACC/01` - Jako _gość_ chcę mieć możliwość rejestracji _konta_ _pasażera_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranRejestracji {
        <<ServerPage>>
        imieINazwisko
        email
        haslo
        powtorzHaslo
    }
    class LoginScreen["Ekran logowania"] { <<ServerPage>> }
    class MainScreen["Ekran główny"] { <<ServerPage>> }

    EkranRejestracji ..> LoginScreen: «Navigates»\n«EndUseCase»\n{ event = btnPrzejdzDoLogowania }
    EkranRejestracji ..> MainScreen: «Navigates»\n«EndUseCase»\n{ event = btnZarejestrujSie }
    LoginScreen ..> EkranRejestracji: «Navigates»\n{ event = btnPrzejdzDoRejestracji }
    LoginScreen ..> MainScreen: «Navigates»\n{ event = btnZalogujSie }
```

#### Prototypy ekranów

![ACC/01](images/Account1.png)

### Wymaganie 2 (Tomasz Chojnacki)

1. `ACC/02` - Jako _gość_ chcę mieć możliwość zalogowania się do _konta_ (_administratora_, _biletera_, _kierowcy_, _pasażera_).

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranRejestracji { <<ServerPage>> }
    class LoginScreen["Ekran logowania"] {
        <<ServerPage>>
        email
        haslo
    }
    class MainScreen["Ekran główny"] { <<ServerPage>> }

    EkranRejestracji ..> LoginScreen: «Navigates»\n«StartUseCase»\n{ event = btnPrzejdzDoLogowania }
    EkranRejestracji ..> MainScreen: «Navigates»\n{ event = btnZarejestrujSie }
    LoginScreen ..> EkranRejestracji: «Navigates»\n«EndUseCase»\n{ event = btnPrzejdzDoRejestracji }
    LoginScreen ..> MainScreen: «Navigates»\n«EndUseCase»\n{ event = btnZalogujSie }
```

#### Prototypy ekranów

![ACC/02](images/Account2.png)

### Wymaganie 3 (Tomasz Chojnacki)

1. `ACC/11` - Jako _administrator_ chcę mieć możliwość tworzenia _konta_ _biletera_.
2. `ACC/12` - Jako _administrator_ chcę mieć możliwość tworzenia _konta_ _kierowcy_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranGlowny { <<ServerPage>> }
    class EkranListyKont { <<ServerPage>> }
    class EkranTworzeniaKonta {
        <<ServerPage>>
        rodzajKonta
        imieINazwisko
        email
        haslo
        powtorzHaslo
    }

    EkranGlowny ..> EkranListyKont: «Navigates»\n{ event = btnZarzadzajKontami }
    EkranListyKont ..> EkranGlowny: «Navigates»\n{ event = btnPowrot }
    EkranListyKont ..> EkranTworzeniaKonta: «Navigates»\n«StartUseCase»\n{ event = btnDodajNowe }
    EkranTworzeniaKonta ..> EkranListyKont: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }
    EkranTworzeniaKonta ..> EkranListyKont: «Navigates»\n«EndUseCase»\n{ event = btnUtworzKonto }
```

#### Prototypy ekranów

![ACC/11 + ACC/12](images/Account3.png)

### Wymaganie 4 (Tomasz Chojnacki)

1. `ACC/07` - Jako _osoba zalogowana_ chcę mieć możliwość wyświetlenia swoich preferencji (motywu kolorystycznego, języka aplikacji).
2. `ACC/08` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany motywu kolorystycznego.
3. `ACC/09` - Jako _osoba zalogowana_ chcę mieć możliwość zmiany języka aplikacji.
4. `ACC/17` - Jako _pasażer_ chcę mieć możliwość sprawdzenia i zmiany domyślnego _typu biletu_ (po otworzeniu aplikacji pokazane będą _oferty biletów_ tego typu).

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranGlowny { <<ServerPage>> }
    class EkranUstawien {
        <<ServerPage>>
        jezyk
        motyw
        typBiletu
    }
    class EkranEdycjiKonta { <<ServerPage>> }
    class EkranLogowania { <<ServerPage>> }

    EkranGlowny ..> EkranUstawien: «Navigates»\n«StartUseCase»\n{ event = btnUstawienia }
    EkranUstawien ..> EkranGlowny: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }
    EkranUstawien ..> EkranEdycjiKonta: «Navigates»\n«EndUseCase»\n{ event = btnEdytuj }
    EkranUstawien ..> EkranLogowania: «Navigates»\n«EndUseCase»\n{ event = btnZmien }
    EkranEdycjiKonta ..> EkranUstawien: «Navigates»\n{ event = btnZapisz }
    EkranEdycjiKonta ..> EkranUstawien: «Navigates»\n{ event = btnPowrot }
    EkranLogowania ..> EkranGlowny: «Navigates»\n{ event = btnZalogujSie }
```

#### Prototypy ekranów

![ACC/07 + ACC/08 + ACC/09 + ACC/17](images/Account4.png)

<!-- ------------------------------------------------------------------------------------------------------------------------- -->

### Wymaganie 5 (Jakub Zehner)

1. `TIC/06` - Jako _pasażer_ chcę mieć możliwość wyświetlenia listy swoich zakupionych _biletów_.
2. `TIC/11` - Jako _pasażer_ chcę mieć możliwość zobaczenia historii zakupionych _biletów_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR

    class EkranZakupuBiletu {
        <<ServerPage>>
        }

    class PasekNawigacyjny {
        <<ServerPage>>
        }

    class EkranTwoichBiletow {
        <<ServerPage>>
        listaAktywnychBiletow
        listaArchiwalnychBiletow
        waznosciBiletow
        cenyBiletow
    }

    class EkranSzczegolowBiletu {
        <<ServerPage>>
        }

    class EkranOfertyBiletow {
        <<ServerPage>>
        }

    PasekNawigacyjny ..> EkranTwoichBiletow: «Navigates»\n«StartUseCase»\n{ event = btnBilety }
    PasekNawigacyjny ..> EkranOfertyBiletow: «Navigates»\n{ event = btnKupBilet }
    EkranTwoichBiletow ..> PasekNawigacyjny: «Navigates»\n«EndUseCase»\n{ event = dowolnyPrzyciskWMenu }

    EkranTwoichBiletow ..> EkranSzczegolowBiletu: «Navigates»\n«EndUseCase»\n{ event = btnPokazDoKontroli }
    EkranSzczegolowBiletu ..> EkranTwoichBiletow: «Navigates»\n«StartUseCase»\n{ event = btnPowrot }

    EkranTwoichBiletow ..> EkranZakupuBiletu: «Navigates»\n«EndUseCase»\n{ event = btnKupPonownie }
    EkranZakupuBiletu ..> EkranTwoichBiletow: «Navigates»\n«StartUseCase»\n{ event = btnPowrot }

    EkranTwoichBiletow ..> EkranOfertyBiletow: «Navigates»\n«EndUseCase»\n{ event = btnSklep }
    EkranOfertyBiletow ..> EkranTwoichBiletow: «Navigates»\n«StartUseCase»\n{ event = btnTwojeBilety }

```

#### Prototypy ekranów

![TIC/06](images/Ticket1.png)

### Wymaganie 6 (Jakub Zehner)

1. `TIC/10` - Jako _pasażer_ chcę mieć możliwość zobaczenia _oferty biletów_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR

    class EkranOfertyBiletow {
        <<ServerPage>>
        listaBiletowJednorazowych
        listaBiletowCzasowych
        listaBiletowOkresowych
        }

    class PasekNawigacyjny {
        <<ServerPage>>
        }

    class EkranTwoichBiletow {
        <<ServerPage>>
    }

    class EkranZakupuBiletu {
        <<ServerPage>>
        }

    PasekNawigacyjny ..> EkranTwoichBiletow: «Navigates»\n{ event = btnBilety }
    PasekNawigacyjny ..> EkranOfertyBiletow: «Navigates»\n«StartUseCase»\n{ event = btnKupBilet }
    EkranOfertyBiletow ..> PasekNawigacyjny: «Navigates»\n«EndUseCase»\n{ event = dowolnyPrzyciskWMenu }

    EkranOfertyBiletow ..> EkranZakupuBiletu: «Navigates»\n«EndUseCase»\n{ event = btnKup }
    EkranZakupuBiletu ..> EkranOfertyBiletow: «Navigates»\n«StartUseCase»\n{ event = btnPowrot }

    EkranTwoichBiletow ..> EkranOfertyBiletow: «Navigates»\n«StartUseCase»\n{ event = btnSklep }
    EkranOfertyBiletow ..> EkranTwoichBiletow: «Navigates»\n«EndUseCase»\n{ event = btnTwojeBilety }

    EkranOfertyBiletow ..>  EkranOfertyBiletow: «Reloads»\n{ event = btnUlgowe }
    EkranOfertyBiletow ..>  EkranOfertyBiletow: «Reloads»\n{ event = btnNormalne }
```

#### Prototypy ekranów

![TIC/07](images/Ticket2.png)

### Wymaganie 7 (Jakub Zehner)

1. `TIC/07` - Jako _pasażer_ chcę mieć możliwość wyświetlenia szczegółów zakupionego _biletu_.
2. `TIC/09` - Jako _pasażer_ chcę mieć możliwość okazania _biletu_ do _sprawdzenia ważności biletu_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR

    class EkranTwoichBiletow {
        <<ServerPage>>
    }

    class EkranSzczegolowBiletu {
        <<ServerPage>>
        qr
        waznyOd
        waznyDo
        wlasciciel
        cena
        kodBiletu
        typBiletu
        zakresBiletu
    }

    EkranTwoichBiletow ..> EkranSzczegolowBiletu: «Navigates»\n«StartUseCase»\n{ event = btnPokazDoKontroli }
    EkranSzczegolowBiletu ..> EkranTwoichBiletow: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }

```

#### Prototypy ekranów

![TIC/10](images/Ticket3.png)

### Wymaganie 8 (Jakub Zehner)

`TIC/12` - Jako _bileter_ chcę mieć możliwość _sprawdzenia ważności_ _biletu_ _pasażera_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR

    class PasekNawigacyjny {
        <<ServerPage>>
        }

    class EkranKontroliBiletu {
        <<ServerPage>>
        kodPojazdu
        obrazAparatu
        }

    class KomunikatKontroliBiletu {
        <<Popup>>
        trescKomunikatu
        }

    PasekNawigacyjny ..> EkranKontroliBiletu: «Navigates»\n«StartUseCase»\n{ event = btnKontrolaBiletu }
    EkranKontroliBiletu ..> PasekNawigacyjny: «Navigates»\n«EndUseCase»\n{ event = dowolnyPrzyciskWMenu }

    EkranKontroliBiletu ..> KomunikatKontroliBiletu: «Displays»\n{ event = zeskanowanoQR }
    KomunikatKontroliBiletu ..> EkranKontroliBiletu: «Hides»\n{ event = btnZamknij }


```

#### Prototypy ekranów

![TIC/12](images/Ticket4.png)

<!-- ------------------------------------------------------------------------------------------------------------------------- -->

### Wymaganie 9 (Piotr Kot)

1. `PAY/01` - Jako _pasażer_ chcę mieć możliwość wyświetlenia listy dostępnych metod płatności.
2. `PAY/04` - Jako _pasażer_ chcę mieć możliwość wyboru _BLIK_ jako metodę płatności.
3. `PAY/05` - Jako _pasażer_ chcę mieć możliwość wyboru karty kredytowej jako metodę płatności.
4. `PAY/06` - Jako _pasażer_ chcę mieć możliwość wyboru _portfela_ jako metody płatności.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranBiletów { <<ServerPage>> }
    class EkranZakupuBiletu {
        <<ServerPage>>
        typBiletu }
    class MetodaPlatnosciDropdown { <<Component>> }

    EkranBiletów ..> EkranZakupuBiletu: «Navigates»\n{ event = btnBilet }
    EkranZakupuBiletu ..> MetodaPlatnosciDropdown: «OpensDropdown»\n«StartUseCase»\n{ event = btnMetodyPlatnosci }
    MetodaPlatnosciDropdown ..> EkranZakupuBiletu: «CloseDropdown»\n«EndUseCase»\n{ event = btnMetodaPłatności }
```

#### Prototypy ekranów

![PAY/01](images/Payment2.png)

### Wymaganie 10 (Piotr Kot)

1. `PAY/02` - Jako _pasażer_ chcę mieć możliwość dodania nowej karty kredytowej.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranListyKart { <<ServerPage>> }
    class EkranDodawaniaKarty {
        <<ServerPage>>
        numerKarty
        imieINazwisko
        dataWaznosci
        etykieta}

    EkranListyKart ..> EkranDodawaniaKarty: «Navigates»\n«StartUseCase»\n{ event = btnDodajKarte }
    EkranDodawaniaKarty ..> EkranListyKart: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }
    EkranDodawaniaKarty ..> EkranListyKart: «Navigates»\n«EndUseCase»\n{ event = btnZapisz }
```

#### Prototypy ekranów

![PAY/02](images/Payment3.png)

### Wymaganie 11 (Piotr Kot)

1. `PAY/07` - Jako _pasażer_ chcę mieć możliwość dodania środków do swojego _portfela_.
2. `PAY/08` - jako _pasażer_ chcę mieć możliwość sprawdzenia stanu swojego _portfela_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranBiletów { <<ServerPage>> }
    class EkranDoladowaniaPortfela {
        <<ServerPage>>
        kwota }
    class MetodaPlatnosciDropdown { <<Component>> }

    EkranBiletów ..> EkranDoladowaniaPortfela: «Navigates»\n«StartUseCase»\n{ event = btnDoladujPortfel }
    EkranDoladowaniaPortfela ..> MetodaPlatnosciDropdown: «OpensDropdown»\n{ event = btnMetodyPlatnosci }
    MetodaPlatnosciDropdown ..> EkranDoladowaniaPortfela: «CloseDropdown»\n{ event = btnMetodaPłatności }
    EkranDoladowaniaPortfela ..> EkranBiletów: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }
    EkranDoladowaniaPortfela ..> EkranBiletów: «Navigates»\n«EndUseCase»\n{ event = btnDoladuj }
```

#### Prototypy ekranów

![PAY/07](images/Payment4.png)

### Wymaganie 12 (Piotr Kot)

1. `PAY/11` - jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą _BLIK_.
2. `PAY/12` - jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą karty kredytowej.
3. `PAY/13` - jako _pasażer_ chcę mieć możliwość zapłaty za _bilet_ za pomocą _portfela_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class EkranBiletów { <<ServerPage>> }
    class EkranZakupuBiletu {
        <<ServerPage>>
        typBiletu }
    class MetodaPlatnosciDropdown { <<Component>> }
    class EkranPotwierdzeniaZakupu { <<ServerPage>> }

    EkranBiletów ..> EkranZakupuBiletu: «Navigates»\n«StartUseCase»\n{ event = btnKupBilet }
    EkranZakupuBiletu ..> MetodaPlatnosciDropdown: «OpensDropdown»\n{ event = btnMetodyPlatnosci }
    MetodaPlatnosciDropdown ..> EkranZakupuBiletu: «CloseDropdown»\n{ event = btnMetodaPłatności }
    EkranZakupuBiletu ..> EkranBiletów: «Navigates»\n«EndUseCase»\n{ event = btnPowrot }
    EkranZakupuBiletu ..> EkranPotwierdzeniaZakupu: «Navigates»\n«EndUseCase»\n{ event = btnZapłać }
```

#### Prototypy ekranów

![PAY/13](images/Payment1.png)

<!-- ------------------------------------------------------------------------------------------------------------------------- -->

### Wymaganie 13 (Przemysław Barcicki)

1. `LOG/07` - Jako _administrator_ chcę mieć możliwość przeglądania _przystanków_.
2. `LOG/08` - Jako _administrator_ chcę mieć możliwość dodawania _przystanków_.
3. `LOG/09` - Jako _administrator_ chcę mieć możliwość edytowania _przystanków_.
4. `LOG/10` - Jako _administrator_ chcę mieć możliwość usuwania _przystanków_.

#### Mapa nawigacyjna

<!-- EkranTwoichBiletow ..> EkranOfertyBiletow: «Navigates»\n«StartUseCase»\n{ event = btnSklep } -->

```mermaid
classDiagram
    direction LR
    class MenuAdministratora {<<serverPage>> }
    class ZarzadzaniePrzystankami {
        <<serverPage>>
        przystanki
    }
    class EdycjaPrzystanku {
        <<modalPopup>>
        nazwa
        szerokosc
        dlugosc
        linie
    }
    class UsuwaniePrzystanku {
        <<modalPopup>>
        nazwa
    }

    MenuAdministratora ..> ZarzadzaniePrzystankami: «Navigates»\n«StartUseCase»\n{ event = btnPrzystanki }
    ZarzadzaniePrzystankami ..> EdycjaPrzystanku: «OpenModal»\n{ event = btnEdytuj }
    EdycjaPrzystanku ..> ZarzadzaniePrzystankami: «CloseModal»\n{ event = btnZapisz }
    EdycjaPrzystanku ..> ZarzadzaniePrzystankami: «CloseModal»\n{ event = btnAnuluj }

    EdycjaPrzystanku ..> UsuwaniePrzystanku: «OpenModal»\n{event = btnUsuń }
    UsuwaniePrzystanku ..> ZarzadzaniePrzystankami: «CloseModal»\n{ event = btnTak }
    UsuwaniePrzystanku ..> ZarzadzaniePrzystankami: «CloseModal»\n{ event = btnAnuluj }
```

#### Prototypy ekranów

![LOG/05](images/Stop1.png)

![LOG/06](images/Stop2.png)
![LOG/07](images/Stop3.png)

![LOG/08](images/Stop4.png)

### Wymaganie 14 (Przemysław Barcicki)

1. `LOG/24` - Jako _bileter_ chcę mieć możliwość przeglądania _awarii_.
2. `LOG/25` - Jako _bileter_ chcę mieć możliwość zgłaszania _awarii_.
3. `LOG/26` - Jako _bileter_ chcę mieć możliwość edytowania _awarii_.

#### Mapa nawigacyjna

```mermaid
classDiagram
    direction LR
    class MenuBiletera { <<screen>> }
    class ListaAwarii {
        <<screen>>
        awarie
    }
    class EdycjaAwarii {
        <<screen>>
        nazwa
        data
        opis
        linia
        pojazd
        kurs
    }
    class DodawanieAwarii { <<screen>> }

    MenuBiletera ..> ListaAwarii: «Navigates»\n«StartUseCase»\n{ event = btnAwarie }
    ListaAwarii ..> EdycjaAwarii: «Navigates»\n{ event = btnEdytuj }
    EdycjaAwarii ..> ListaAwarii: «Navigates»\n{ event = btnZatwierdz }
    EdycjaAwarii ..> ListaAwarii: «Navigates»\n{ event = btnAnuluj }

    ListaAwarii ..> DodawanieAwarii: «Navigates»\n{ event = btnDodaj }
    DodawanieAwarii ..> ListaAwarii: «Navigates»\n{ event = btnZatwierdz }
    DodawanieAwarii ..> ListaAwarii: «Navigates»\n{ event = btnAnuluj }
```

#### Prototypy ekranów

![LOG/20](images/Accident4.png)
![LOG/20](images/Accident3.png)

![LOG/21](images/Accident2.png)

![LOG/22](images/Accident1.png)

[^nf-prf-2]: Zgodnie z danymi MPK Wrocław, dziennie korzysta z komunikacji miejskiej pół miliona pasażerów, co przy średnim szacowanym czasie korzystania z aplikacji wynoszącym 3 minuty daje średnio około 1000 użytkowników aplikacji w danym momencie.
