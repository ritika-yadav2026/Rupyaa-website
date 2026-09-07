type ClarityCommand =
  | [command: "event", eventName: string]
  | [command: "identify", customUserId: string]
  | [command: "set", key: string, value: string];

type ClarityFunction = ((...args: ClarityCommand) => void) & {
  q?: ClarityCommand[];
};

type WindowWithClarity = Window & {
  clarity?: ClarityFunction;
};

export const CLARITY_EVENT = {
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",
} as const;

let lastAuthenticatedPhoneNumber: string | null = null;
let lastAuthenticatedUserStage: string | null = null;

function sendClarityCommand(...args: ClarityCommand): void {
  if (typeof window === "undefined") return;
  const clarityWindow = window as WindowWithClarity;
  if (!clarityWindow.clarity) {
    const queuedClarity: ClarityFunction = (...queuedArgs) => {
      queuedClarity.q = queuedClarity.q ?? [];
      queuedClarity.q.push(queuedArgs);
    };
    clarityWindow.clarity = queuedClarity;
  }
  clarityWindow.clarity(...args);
}

function setAuthenticatedUserTags(phoneNumber: string, userStage: string): void {
  lastAuthenticatedPhoneNumber = phoneNumber;
  lastAuthenticatedUserStage = userStage;
  sendClarityCommand("identify", phoneNumber);
  sendClarityCommand("set", "authStatus", "logged_in");
  sendClarityCommand("set", "phoneNumber", phoneNumber);
  sendClarityCommand("set", "userStage", userStage);
}

export function trackClarityLogin(phoneNumber: string, userStage: string): void {
  setAuthenticatedUserTags(phoneNumber, userStage);
  // Fires once authentication and user-stage data are ready, marking the start of an identified logged-in Clarity session.
  sendClarityCommand("event", CLARITY_EVENT.USER_LOGGED_IN);
}

export function updateClarityUserStage(phoneNumber: string, userStage: string): void {
  setAuthenticatedUserTags(phoneNumber, userStage);
}

export function trackClarityLogout(
  phoneNumber: string | null,
  userStage: string | null,
): void {
  const resolvedPhoneNumber = phoneNumber ?? lastAuthenticatedPhoneNumber;
  const resolvedUserStage = userStage ?? lastAuthenticatedUserStage;
  if (resolvedPhoneNumber) {
    sendClarityCommand("set", "phoneNumber", resolvedPhoneNumber);
  }
  if (resolvedUserStage) {
    sendClarityCommand("set", "userStage", resolvedUserStage);
  }
  sendClarityCommand("set", "authStatus", "logged_out");
  // Fires before the auth and flow stores are cleared, preserving the current user context on the Clarity logout event.
  sendClarityCommand("event", CLARITY_EVENT.USER_LOGGED_OUT);
  lastAuthenticatedPhoneNumber = null;
  lastAuthenticatedUserStage = null;
}
