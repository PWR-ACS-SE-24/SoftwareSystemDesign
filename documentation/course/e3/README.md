<div align="center">
<p><b>Wyniki etapu III: <br/> Implementacja</b></p>
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

# Linki do utworzonych artefaktów

- **Dokumentacja:**
  - [`system-parts.md` - podział systemu ](../../system-parts.md)
  - [`contracts.md` - kontrakty obowiązujące między serwisami](../../contracts.md)
  - **ADR** - opisy wszystkich niezgodności z poprzednimi etapami wraz z uzasadnieniem:
    - [ADR-001: Vertical partitioning of the Jobberknoll API package structure](../../adrs/001-jobberknoll-api-structure.md)
    - [ADR-002: Domain model and database schema changes for Jobberknoll](../../adrs/002-jobberknoll-domain-model.md)
    - [ADR-003: Password hashing and storage requirements for Jobberknoll](../../adrs/003-password-hashing.md)
- **Implementacja:**
  - [Kod serwisu Clabbert (Java)](../../../implementation/clabbert/)
  - [Kod serwisu Feather (TypeScript)](../../../implementation/feather/)
  - [Kod serwisu Inferius (Java)](../../../implementation/inferius/)
  - [Kod serwisu Jobberknoll (TypeScript)](../../../implementation/jobberknoll/)
  - [Kod serwisu Leprechaun (TypeScript)](../../../implementation/leprechaun/)
  - [Kod serwisu Phoenix (Java)](../../../implementation/phoenix/)
- **Infrastruktura:**
  - [Kod CI/CD (GitHub Actions)](../../../.github/workflows/)
  - [Definicja usług AWS (Terraform) i konfiguracja Kubernetes](../../../infrastructure/)

# Procent ukończenia projektu

TODO @tchojnacki: tabelka z podsumowaniem wszystkich README części implementacji

TODO @tchojnacki: uprzejme podkreślenie wymagań Pani Hnatkowskiej

TODO @tchojnacki: screeny ze Swaggerów

TODO @tchojnacki: screeny z GitHub Actions

# Ilość pracy

```
───────────────────────────────────────────────────────────────────────────────
Language                 Files     Lines   Blanks  Comments     Code Complexity
───────────────────────────────────────────────────────────────────────────────
TypeScript                 249     11165     1740       333     9092        415
Java                       158      5642      815       275     4552        121
JSON                        19       244        2         0      242          0
YAML                        10      6188     1318         1     4869          0
Dockerfile                   7       127       42         2       83          5
Properties File              6        58        1        32       25          0
gitignore                    6       170       22        25      123          0
Markdown                     4       211       32         0      179          0
Batch                        3       392       51         0      341         49
Shell                        3       770       56       199      515         81
Gradle                       2       123       23         0      100          0
XML                          2       213        6         0      207          0
Python                       1        23        9         0       14          1
───────────────────────────────────────────────────────────────────────────────
Total                      470     25326     4117       867    20342        672
───────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $638,864
Estimated Schedule Effort (organic) 11.60 months
Estimated People Required (organic) 4.89
───────────────────────────────────────────────────────────────────────────────
```

TODO @tchojnacki: opis powyższego + zaktualizować powyższe na świeżo przed zajęciami

TODO @tchojnacki: screen Milestones z GitHub

# Testy

TODO @tchojnacki: liczba testów, pokrycie testów

TODO @tchojnacki: jakby mi się udało to testy obciążeniowe

TODO anyone: coś gdzieś z Dockera/Terraforma/Kubernetesa ktoś?
