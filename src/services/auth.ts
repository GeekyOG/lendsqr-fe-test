const SIMULATED_LATENCY_MS = 600;

const ERROR_TRIGGER_EMAIL = "error@lendsqr.com";

export interface LoginCredentials {
  email: string;
  password: string;
}

export function login({ email, password }: LoginCredentials): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!password) {
        reject(new Error("Password is required."));
        return;
      }
      if (email.trim().toLowerCase() === ERROR_TRIGGER_EMAIL) {
        reject(new Error("Invalid email or password."));
        return;
      }
      sessionStorage.setItem("lendsqr_session", JSON.stringify({ email, loggedInAt: Date.now() }));
      resolve();
    }, SIMULATED_LATENCY_MS);
  });
}
