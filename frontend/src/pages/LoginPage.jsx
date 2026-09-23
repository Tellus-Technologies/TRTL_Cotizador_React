import { useState } from "react";
import { useNavigate } from "react-router-dom";
import triariiLogo from "../assets/logo-triarii.png";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // Por ahora no validamos usuarios.
    // Solo navegamos a la pantalla de módulos.
    navigate("/modulos");
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="left-panel">
          <div className="curved-bg" aria-hidden="true"></div>

         <div className="login-logo-container">
         <img
         src={triariiLogo}
         alt="Triarii Systems"
         className="login-logo-image"
         />
         </div>

          <div className="left-content">
            <div className="cyan-line"></div>

            <h1>
              Tus tickets,
              <br />
              bajo control.
            </h1>

            <p className="description">
              Registra, asigna y da seguimiento a cada solicitud hasta su
              resolución.
            </p>
          </div>

          <footer className="left-footer">
            Plataforma de gestión de tickets
          </footer>
        </section>

        <section className="right-panel">
          <div className="login-card">
            <div className="cyan-line"></div>

            <h2>Iniciar sesión</h2>

            <p className="subtitle">
              Accede y da seguimiento a tus tickets.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>

                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    ✉
                  </span>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="nombre@empresa.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>

                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    ◈
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? "◉" : "⊘"}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" name="remember" />
                  <span>Recordarme</span>
                </label>

                <a href="#" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="btn-submit">
                Iniciar sesión
              </button>

              <div className="divider">
                <span>o</span>
              </div>

              <p className="signup-text">
                ¿No tienes una cuenta? <a href="#">Crear cuenta</a>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;