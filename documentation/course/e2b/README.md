<div align="center">
<p><b>Wyniki etapu IIb: <br/> Ocena architektury systemu</b></p>
<br/>
<p><b>System biletowy dla komunikacji miejskiej</b></p>
<br/>
<p><b>Projektowanie systemów informatycznych</b></p>
</div>
<div align="right">Prowadzący:<br/>dr inż. Marcin Kawalerowicz</div>
<div>
Skład zespołu <b>oceniającego</b>:
<ul>
  <li>Przemysław Barcicki (260324)</li>
  <li>Tomasz Chojnacki (260365)</li>
  <li>Piotr Kot (259560)</li>
  <li>Jakub Zehner (260285)</li>
</ul>
</div>

---

**Oceniany system:** [Deskly - system do zarządzania współdzielonymi przestrzeniami biurowymi](https://github.com/wrzchwc/software-system-design/blob/e874aa639524634d0ef89c67c0eda114bc6945f6/2/README.md) (stan na 11.01.2025 - commit `e874aa6`).

# Lista kontrola kompletności opisu architektury

> [!NOTE]
> Zgodnie z [Architecture Review Checklist - System Engineering / Overall Architecture](http://www.opengroup.org/public/arch/p4/comp/clists/syseng.htm) - wykład 7, slajd 15.

**Legenda:**
- 🟩 - element listy opisany w pełni,
- 🟨 - element listy opisany częściowo,
- 🟥 - element listy nieopisany.

<!--
TODO, niewymagane, ale najłatwiejsze ze wszystkiego także moim zdaniem warto zrobić
-->

# Przegląd podejść architektonicznych

> [!NOTE]
> Zgodnie z [ATAM: Method for Architecture Evaluation](https://insights.sei.cmu.edu/documents/629/2000_005_001_13706.pdf), strona 7, na tym etapie nie dokonuje się analizy ani opisu poszczególnych podejść - _Architectural approaches are identified by the architect, but are not analyzed._

<!--
TODO, w przykładowym dokumencie jest źle, powinno to zawrzeć wszystkie style, wzorce, taktyki i frameworki
-->

# Drzewo użyteczności

> [!NOTE]
> Lista charakterystyk jakościowych jest zgodna z normą ISO/IEC 25010.

**Legenda dla priorytetów:** `(<business-gain>, <difficulty>)`, gdzie:
- `<business-gain>`: korzyść biznesowa wg klienta: `H` (high), `M` (medium) lub `L` (low),
- `<difficulty>`: trudność implementacji wg architekta: `H` (high), `M` (medium) lub `L` (low).

<!--
TODO
functional, performance, compatibility, usability, reliability, security, maintainability, portability
-->

# Analiza wybranych scenariuszy

<table>
  <tr>
    <th>Scenariusz <code>SC1</code></th>
    <td colspan="4">Nazwa scenariusza</td>
  </tr>
  <tr>
    <th>Atrybut(y)</th>
    <td colspan="4">Atrybuty jakościowe, których dotyczy ten scenariusz</td>
  </tr>
  <tr>
    <th>Środowisko</th>
    <td colspan="4">Odpowiednie założenia dotyczące środowiska, w którym znajduje się </td>
  </tr>
  <tr>
    <th>Bodziec</th>
    <td colspan="4">Precyzyjne określenie bodźca atrybutu jakościowego (np. wywołana funkcja, awaria, zagrożenie, modyfikacja) związanego ze scenariuszem</td>
  </tr>
  <tr>
    <th>Odpowiedź</th>
    <td colspan="4">Precyzyjne określenie odpowiedzi atrybutu jakościowego (np. czas odpowiedzi, miara trudności wprowadzenia modyfikacji)</td>
  </tr>
  <tr>
    <th>Decyzje architektoniczne</th>
    <th>Wrażliwość</th>
    <th>Kompromis</th>
    <th>Ryzyko</th>
    <th>Nie-ryzyko</th>
  </tr>
  <tr>
    <td>Decyzja architektoniczna, związana z tym scenariuszem, która ma wpływ na odpowiedź atrybutu jakościowego</td>
    <td><code>SC1.S1</code>, <code>SC1.S2</code></td>
    <td><code>SC1.T1</code>, <code>SC1.T2</code></td>
    <td><code>SC1.R1</code>, <code>SC1.R2</code></td>
    <td><code>SC1.N1</code>, <code>SC1.N2</code></td>
  </tr>
  <tr>
    <th>Analiza</th>
    <td colspan="4">Jakościowe i/lub ilościowe racjonalne wyjaśnienie tego, dlaczego posiadana lista decyzji architektoniczych przyczynia się do spełnienia wymagań każdego atrybutu jakościowego podanego w scenariuszu</td>
  </tr>
  <tr>
    <th>Diagram architektoniczny</th>
    <td colspan="4">Diagram lub diagramy perspektyw architektonicznych opatrzone informacjami na temat architektury, których celem jest wsparcie podanych wyżej uzasadnień, wraz z tekstem wyjaśnienia tam, gdzie jest to konieczne</td>
  </tr>
</table>

- **`SC1.S1`:** ...
- **`SC1.S2`:** ...
- **`SC1.T1`:** ...
- **`SC1.T2`:** ...
- **`SC1.R1`:** ...
- **`SC1.R2`:** ...
- **`SC1.N1`:** ...
- **`SC1.N2`:** ...

# Wyniki

Poniżej znajdują się zagregowane punkty wrażliwości (_sensitivity points_), kompromisy (_trade-offs_), ryzyka (_risks_) i nie-ryzyka (_non-risks_) dla analizowanych scenariuszy.

## Punkty wrażliwości

> [!NOTE]
> Wszystkie punkty wrażliwości są kandydatami na ryzyka. Na końcu wszystkie muszą być skategoryzowane albo jako ryzyka albo jako nie-ryzyka - wykład 7, slajd 42.

- **`SC1.S1`:** ... - **ryzyko**.
- **`SC1.S2`:** ... - **nie-ryzyko**.
- **`SC2.S1`:** ... - **ryzyko**.
- **`SC2.S2`:** ... - **nie-ryzyko**.

## Kompromisy

- **`SC1.T1`:** ...
- **`SC1.T2`:** ...
- **`SC2.T1`:** ...
- **`SC2.T2`:** ...

## Ryzyka

- **`SC1.R1`:** ...
- **`SC1.R2`:** ...
- **`SC2.R1`:** ...
- **`SC2.R2`:** ...

## Nie-ryzyka

- **`SC1.N1`:** ...
- **`SC1.N2`:** ...
- **`SC2.N1`:** ...
- **`SC2.N2`:** ...

# Inne problemy

<!-- TODO -->

# Wnioski

<!-- TODO -->
