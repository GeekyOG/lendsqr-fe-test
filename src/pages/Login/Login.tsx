import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/auth";
import { isValidEmail } from "@/utils/validators";
import logo from "@/assets/images/logo.svg";
import illustration from "@/assets/images/pablo-sign-in.png";
import styles from "./Login.module.scss";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/users");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.branding} aria-hidden="true">
        <img src={logo} alt="" className={styles.logoDesktop} />
        <img src={illustration} alt="" className={styles.illustration} />
      </aside>

      <main className={styles.formPane}>
        <div className={styles.formWrapper}>
          <img src={logo} alt="Lendsqr" className={styles.logoMobile} />
          <h1 className={styles.title}>Welcome!</h1>
          <p className={styles.subtitle}>Enter details to login.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {formError && (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            )}

            <div className={styles.field}>
              <label htmlFor="email" className={styles.visuallyHidden}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={styles.input}
              />
              {errors.email && (
                <p id="email-error" className={styles.fieldError} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.visuallyHidden}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className={styles.fieldError} role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <Link to="/forgot-password" className={styles.forgotPassword}>
              FORGOT PASSWORD?
            </Link>

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "LOGGING IN…" : "LOG IN"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
