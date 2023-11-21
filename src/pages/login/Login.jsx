import React, { useState, useEffect } from "react";
import appHOT from "../../firebase/firebase.confidHOT";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import RecuperarContraseña from "./RecuperarContra";
import HomasLogo from "../../img/HomasLogo.png";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecuperarContraseña, setShowRecuperarContraseña] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  function handleLogin() {
    const auth = getAuth(appHOT);
    const db = getFirestore(appHOT);
    
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }


    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso", user);

        
        const usuariosRef = collection(db, "Usuarios");
        const q = query(usuariosRef);

        try {
          const usuariosSnapshot = await getDocs(q);

          let rolUsuario = "";

          usuariosSnapshot.forEach((doc) => {
            const usuario = doc.data();

            if (usuario.correoElectronico === email) {
              rolUsuario = usuario.rol;
            }
          });

          if (rolUsuario === "Cliente" || rolUsuario === "Admin") {
            setError("Lo siento, usted NO tiene permisos para ingresar.");
          } else if (rolUsuario === "SuperAdmin") {
            setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
          } else {
            setError("Rol de usuario no reconocido.");
          }
        } catch (error) {
          console.error("Error al obtener datos de usuario:", error.message);
          setError(
            "Error en la validación del rol. Por favor, inténtelo de nuevo."
          );
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password"
        ) {
          setError(
            "Credenciales inválidas. Por favor, verifique su correo y contraseña e inténtelo de nuevo."
          );
        } else {
          setError(
            "Error en el inicio de sesión. Por favor, inténtelo de nuevo."
          );
        }
        console.error("Error en el inicio de sesión:", errorMessage);
      });
  }

  function handleRecuperarContraseñaClick() {
    setShowRecuperarContraseña(true);
  }

  function handlePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSuccessMessageClose() {
    setSuccessMessage("");
  }

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  return (
    <div className="container-login">
      {!showRecuperarContraseña && (
        <div>
          <h1>Inicio de Sesión</h1>
          <div className="image-container">
            <img src={HomasLogo} alt="Logo" />
          </div>
          <div className="container-correo">
            <label className="objeto">Correo</label>
            <input
             className="input-log"
              placeholder="Ingrese su correo ..."
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="container-contraseña">
            <label>Contraseña</label>
            <div className="password-input">
              <input
              className="input-log"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña ..."
                value={password}
                onChange={handlePasswordChange}
              />
              <button type="button" onClick={handlePasswordVisibility}>
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} size="lg" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message" onClick={handleSuccessMessageClose}>
              {successMessage}
            </p>
          )}
          <div id="botones">
            <button id="btnIniciar" onClick={handleLogin}>
              Iniciar Sesión
            </button>
            <button
              id="btnRecuperarContraseña"
              onClick={handleRecuperarContraseñaClick}
            >
              Recuperar Contraseña
            </button>
          </div>
        </div>
      )}
      {showRecuperarContraseña && (
        <RecuperarContraseña
          onClose={() => setShowRecuperarContraseña(false)}
        />
      )}
    </div>
  );
}

export default Login;
