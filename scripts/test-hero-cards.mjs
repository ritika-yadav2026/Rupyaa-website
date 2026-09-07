/**
 * Test script: Login with phone numbers, fetch user-stage + active-loan,
 * and log responses to analyze Hero card logic.
 * Run: node scripts/test-hero-cards.mjs
 * Calls NEXT_PUBLIC_API_URL (or default) directly.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://lending-api.wecredit.click"
).replace(/\/$/, "");
const API_PATH_PREFIX = (process.env.NEXT_PUBLIC_API_PATH_PREFIX || "/api/v1")
  .trim()
  .replace(/\/$/, "");

const API_ENDPOINTS = {
  otpGenerate: "/otp",
  authSessions: "/auth/sessions",
  userStage: "/user/stage",
  loanActive: "/loans/active",
  currentOffer: "/offer/current",
};

function apiPath(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_PATH_PREFIX || API_PATH_PREFIX === "/") {
    return normalizedPath;
  }
  const normalizedPrefix = API_PATH_PREFIX.startsWith("/")
    ? API_PATH_PREFIX
    : `/${API_PATH_PREFIX}`;
  return `${normalizedPrefix}${normalizedPath}`;
}
const PHONES = [
  "8547087878",
  "7338345954",
  "8121076445",
  "9666289815",
  "8847763572",
  "7822139920",
  "8882048615",
];
const TEST_OTP = "8888";

async function api(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getCommonHeaders(),
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { _raw: text };
  }
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

async function login(phone) {
  const gen = await api(apiPath(API_ENDPOINTS.otpGenerate), {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone }),
  });
  if (!gen.success) throw new Error(gen.message || "OTP generate failed");
  const auth = await api(apiPath(API_ENDPOINTS.authSessions), {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone, otp: TEST_OTP }),
  });
  if (!auth.token) throw new Error("No token in response");
  return auth.token;
}

async function fetchWithToken(path, token, extraHeaders = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
      ...extraHeaders,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { _raw: text };
  }
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

async function run() {
  const results = [];
  for (const phone of PHONES) {
    try {
      console.log(`\n--- Testing ${phone} ---`);
      const token = await login(phone);
      const [userStage, activeLoan] = await Promise.all([
        fetchWithToken(`${apiPath(API_ENDPOINTS.userStage)}?device=web`, token).catch((e) => ({ error: e.message })),
        fetchWithToken(apiPath(API_ENDPOINTS.loanActive), token),
      ]);
      let currentOffer = null;
      const loanStatus = activeLoan?.loanStatus?.toLowerCase?.();
      if (
        userStage?.stage === "OFFERINGS" ||
        (activeLoan?.hasActiveLoan && loanStatus === "verified")
      ) {
        currentOffer = await fetchWithToken(apiPath(API_ENDPOINTS.currentOffer), token).catch((e) => ({ error: e.message }));
      }
      const r = { phone, userStage, activeLoan, currentOffer };
      results.push(r);
      console.log("userStage:", JSON.stringify(userStage, null, 2));
      console.log("activeLoan:", JSON.stringify(activeLoan, null, 2));
      if (currentOffer) console.log("currentOffer:", JSON.stringify(currentOffer, null, 2));
    } catch (err) {
      console.error(`Error for ${phone}:`, err.message);
      results.push({ phone, error: err.message });
    }
  }
  return results;
}

run()
  .then((results) => {
    console.log("\n\n=== SUMMARY ===");
    results.forEach((r) => {
      if (r.error) {
        console.log(`${r.phone}: ERROR - ${r.error}`);
        return;
      }
      const stage = r.userStage?.stage ?? "?";
      const hasLoan = r.activeLoan?.hasActiveLoan ?? false;
      const loanStatus = r.activeLoan?.loanStatus ?? "?";
      const offerStatus = r.currentOffer?.offer?.status ?? "-";
      console.log(`${r.phone}: stage=${stage} hasActiveLoan=${hasLoan} loanStatus=${loanStatus} offerStatus=${offerStatus}`);
    });
  })
  .catch(console.error);
