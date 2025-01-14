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

**Oceniany system:** [Deskly - system do zarządzania współdzielonymi przestrzeniami biurowymi](https://github.com/wrzchwc/software-system-design/tree/e874aa639524634d0ef89c67c0eda114bc6945f6) (stan na 11.01.2025 - commit `e874aa6`).

# Lista kontrola kompletności opisu architektury

> [!NOTE]
> Zgodnie z [Architecture Review Checklist - System Engineering / Overall Architecture](http://www.opengroup.org/public/arch/p4/comp/clists/syseng.htm) - wykład 7, slajd 15.

**Legenda:**

- 🟩 - element listy opisany w pełni,
- 🟨 - element listy opisany częściowo,
- 🟥 - element listy nieopisany,
- 🟫 - nie dotyczy.

<!--
TODO, niewymagane, ale najłatwiejsze ze wszystkiego także moim zdaniem warto zrobić
-->

<table>
  <tr>
    <th>Element opisu</th>
    <th>Status</th>
  </tr>
  <tr>
    <th colspan="2">General</th>
  </tr>
  <tr>
    <td>1. What other applications and/or systems require integration with yours?</td>
    <td></td>
  </tr>
  <tr>
    <td>2. Describe the integration level and strategy with each.</td>
    <td></td>
  </tr>
  <tr>
    <td>3. How geographically distributed is the user base?</td>
    <td></td>
  </tr>
  <tr>
    <td>4. What is the strategic importance of this system to other user communities inside or outside the enterprise?</td>
    <td></td>
  </tr>
  <tr>
    <td>5. What computing resources are needed to provide system service to users inside the enterprise? Outside the enterprise and using enterprise computing assets? Outside the enterprise and using their own assets?</td>
    <td></td>
  </tr>
  <tr>
    <td>6. How can users outside the native delivery environment access your applications and data?</td>
    <td></td>
  </tr>
  <tr>
    <td>7. What is the life expectancy of this application?</td>
    <td></td>
  </tr>
  <tr>
    <td>8. Describe the design that accommodates changes in the user base, stored data, and delivery system technology.</td>
    <td></td>
  </tr>
  <tr>
    <td>9. What is the size of the user base and their expected performance level?</td>
    <td></td>
  </tr>
  <tr>
    <td>10. What performance and stress test techniques do you use?</td>
    <td></td>
  </tr>
  <tr>
    <td>11. What is the overall organization of the software and data components?</td>
    <td></td>
  </tr>
  <tr>
    <td>12. What is the overall service and system configuration?</td>
    <td></td>
  </tr>
  <tr>
    <td>13. How are software and data configured mapped to the service and system configuration?</td>
    <td></td>
  </tr>
  <tr>
    <td>14. What proprietary technology (hardware and software) is needed for this system?</td>
    <td></td>
  </tr>
  <tr>
    <td>15. Describe how each and every version of the software can be reproduced and re-deployed over time.</td>
    <td></td>
  </tr>
  <tr>
    <td>16. Describe the current user base and how that base is expected to change over the next 3 to 5 years.</td>
    <td></td>
  </tr>
  <tr>
    <td>17. Describe the current geographic distribution of the user base and how that base is expected to change over the next 3 to 5 years.</td>
    <td></td>
  </tr>
  <tr>
    <td>18. Describe the how many current or future users need to use the application in a mobile capacity or who need to work off-line.</td>
    <td></td>
  </tr>
  <tr>
    <td>19. Describe what the application generally does, the major components of the application and the major data flows.</td>
    <td></td>
  </tr>
  <tr>
    <td>20. Describe the instrumentation included in the application that allows for the health and performance of the application to be monitored.</td>
    <td></td>
  </tr>
  <tr>
    <td>21. Describe the business justification for the system.</td>
    <td></td>
  </tr>
  <tr>
    <td>22. Describe the rationale for picking the system development language over other options in terms of initial development cost versus long term maintenance cost.</td>
    <td></td>
  </tr>
  <tr>
    <td>23. Describe the systems analysis process that was used to come up with the system architecture and product selection phase of the system architecture.</td>
    <td></td>
  </tr>
  <tr>
    <td>24. Who besides the original customer might have a use for or benefit from using this system?</td>
    <td></td>
  </tr>
  <tr>
    <td>25. What percentage of the users use the system in browse mode versus update mode?</td>
    <td></td>
  </tr>
  <tr>
    <td>26. What is the typical length of requests that are transactional?</td>
    <td></td>
  </tr>
  <tr>
    <td>27. Do you need guaranteed data delivery or update, or the system tolerate failure?</td>
    <td></td>
  </tr>
  <tr>
    <td>28. What are the up-time requirements of the system?</td>
    <td></td>
  </tr>
  <tr>
    <td>29. Describe where the system architecture adheres or does not adhere to standards.</td>
    <td></td>
  </tr>
  <tr>
    <td>30. Describe the project planning and analysis approach used on the project.</td>
    <td></td>
  </tr>
  <tr>
    <th colspan="2">Processors/Servers/Clients</th>
  </tr>
  <tr>
    <td>1. Describe the Client/Server application architecture.</td>
    <td></td>
  </tr>
  <tr>
    <td>2. Annotate the pictorial to illustrate where application functionality is executed.</td>
    <td></td>
  </tr>
  <tr>
    <th colspan="2">Client</th>
  </tr>
  <tr>
    <td>1. Are functions other than presentation performed on the user device?</td>
    <td></td>
  </tr>
  <tr>
    <td>2. Describe the data and process help facility being provided.</td>
    <td></td>
  </tr>
  <tr>
    <td>3. Describe the screen to screen navigation technique.</td>
    <td></td>
  </tr>
  <tr>
    <td>4. Describe how the user navigates between this and other applications.</td>
    <td></td>
  </tr>
  <tr>
    <td>5. How is this and other applications launched from the user device?</td>
    <td></td>
  </tr>
  <tr>
    <td>6. Are there any inter-application data and process sharing capabilities? If so, describe what is being shared and by what technique / technology.</td>
    <td></td>
  </tr>
  <tr>
    <td>7. Describe data volumes being transferred to the client.</td>
    <td></td>
  </tr>
  <tr>
    <td>8. What are the additional requirements for local data storage to support the application?</td>
    <td></td>
  </tr>
  <tr>
    <td>9. What are the additional requirements for local software storage/memory to support the application?</td>
    <td></td>
  </tr>
  <tr>
    <td>10. Are there any known hardware / software conflicts or capacity limitations caused by other application requirements or situations, which would affect the application users?</td>
    <td></td>
  </tr>
  <tr>
    <td>11. Describe how the look and feel of your presentation layer compares to the look and feel of the other existing applications.</td>
    <td></td>
  </tr>
  <tr>
    <td>12. Describe to what extent the client needs to support asynchronous and / or synchronous communication.</td>
    <td></td>
  </tr>
  <tr>
    <td>13. Describe how the presentation layer of the system is separated from other computational or data transfer layers of the system.</td>
    <td></td>
  </tr>
  <tr>
    <th colspan="2">Application Server</th>
  </tr>
  <tr>
    <td>1. Can/does the presentation layer and application layers run on separate processors?</td>
    <td></td>
  </tr>
  <tr>
    <td>2. Can/does the application layer and data access layer run on separate processors?</td>
    <td></td>
  </tr>
  <tr>
    <td>3. Can this application be placed on an application server independent of all other applications? If not, explain the dependencies.</td>
    <td></td>
  </tr>
  <tr>
    <td>4. Can additional parallel application servers be easily added? If so, what is the load balancing mechanism?</td>
    <td></td>
  </tr>
  <tr>
    <td>5. Has the resource demand generated by the application been measured and what is the value? If so, has the capacity of the planned server been confirmed at the application and aggregate levels?</td>
    <td></td>
  </tr>
  <tr>
    <th colspan="2">Data Server</th>
  </tr>
  <tr>
    <td>1. Are there other applications, which must share the data server? If so, please identify them and describe the data and data access requirements.</td>
    <td></td>
  </tr>
  <tr>
    <td>2. Has the resource demand generated by the application been measured and what is the value? If so, has the capacity of the planned server been confirmed at the application and aggregate levels?</td>
    <td></td>
  </tr>
</table>
 
# Przegląd podejść architektonicznych

> [!NOTE]
> Zgodnie z [ATAM: Method for Architecture Evaluation](https://insights.sei.cmu.edu/documents/629/2000_005_001_13706.pdf), strona 7, na tym etapie nie dokonuje się analizy ani opisu poszczególnych podejść - _Architectural approaches are identified by the architect, but are not analyzed._

<!--
TODO, w przykładowym dokumencie jest źle, powinno to zawrzeć wszystkie style, wzorce, taktyki i frameworki
-->

# Drzewo użyteczności

> [!NOTE]
> Lista wykorzystanych charakterystyk jakościowych jest zgodna z normą ISO/IEC 25010.

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

- ...

# Wnioski

TODO
