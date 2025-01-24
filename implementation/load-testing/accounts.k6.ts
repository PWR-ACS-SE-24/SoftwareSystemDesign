import { check, sleep } from "k6";
import http from "k6/http";

/*
- `NF/PRF/01` - System powinien obsługiwać zapytania użytkowników, zakładając brak problemów sieciowych:
  1. dotyczące biletów w czasie poniżej 1 sekundy dla co najmniej 90% przypadków.
  2. dotyczące kont w czasie poniżej 2 sekundy dla co najmniej 90% przypadków.
  3. dotyczące płatności w czasie poniżej 10 sekundy dla co najmniej 90% przypadków.
  4. dotyczące logistyki w czasie poniżej 1 sekundy dla co najmniej 90% przypadków.
- `NF/PRF/02` - System powinien działać bez zarzutu przy jednoczesnym korzystaniu przez 5000 użytkowników.
 */

const REQUIRED_VUS = 1000; // assuming 5 instances of the service
const REQUIRED_SLO = "p(90)<2000"; // 90% of requests must be below 2s

const JOBBERKNOLL_API = "http://localhost:8000";
const FEATHER_API = "http://localhost:8001";

const randomString = () => Math.random().toString(36);
const randomEmail = () =>
  `${randomString()}${randomString()}${randomString()}@${randomString()}.com`;

export const options = {
  scenarios: {
    smoke: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      gracefulStop: "10s",
    },
    average_load: {
      startTime: "10s", // smokeTest.startTime + smokeTest.gracefulStop
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: REQUIRED_VUS },
        { duration: "4m", target: REQUIRED_VUS },
        { duration: "30s", target: 0 },
      ],
      gracefulStop: "10s",
    },
    spike: {
      startTime: "5m20s", // averageLoad.startTime + averageLoad.duration + averageLoad.gracefulStop
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 2 * REQUIRED_VUS },
        { duration: "30s", target: 0 },
      ],
      gracefulStop: "10s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // less than 1% of requests can fail
    http_req_duration: [REQUIRED_SLO],
  },
};

export default function () {
  // Query service health
  const jkHealthRes = http.get(`${JOBBERKNOLL_API}/int/v1/health`);
  check(jkHealthRes, { "Jobberknoll healthy": (r) => r.status === 200 });
  const feHealthRes = http.get(`${FEATHER_API}/int/v1/health`);
  check(feHealthRes, { "Feather healthy": (r) => r.status === 200 });

  // Register an account
  const email = randomEmail();
  const password = "Password";
  const registerRes = http.post(
    `${JOBBERKNOLL_API}/ext/v1/register`,
    JSON.stringify({
      fullName: "John Smith",
      email,
      password,
      phoneNumber: "123456789",
    }),
    {
      headers: {
        "content-type": "application/json",
        "jp-user-id": "00000000-0000-0000-0000-000000000000",
        "jp-user-role": "guest",
      },
    }
  );
  check(registerRes, { "account registered": (r) => r.status === 201 });
  const id = registerRes.json("id");
  sleep(1);

  // Login into the account
  const loginRes = http.post(
    `${JOBBERKNOLL_API}/ext/v1/login`,
    JSON.stringify({ email, password }),
    {
      headers: {
        "content-type": "application/json",
        "jp-user-id": "00000000-0000-0000-0000-000000000000",
        "jp-user-role": "guest",
      },
    }
  );
  check(loginRes, { "account logged in": (r) => r.status === 200 });
  const accessToken = loginRes.json("accessToken");
  sleep(1);

  // Make 100 authorized requests over 5 seconds
  for (let i = 0; i < 100; i++) {
    const authRes = http.post(
      `${FEATHER_API}/int/v1/verify`,
      JSON.stringify({ accessToken }),
      { headers: { "content-type": "application/json" } }
    );
    check(authRes, {
      "account verified": (r) => r.status === 200,
      "user-id correct": (r) => r.json("userId") === id,
      "user-role correct": (r) => r.json("userRole") === "passenger",
    });
    sleep(0.05);
  }

  sleep(2);
}
