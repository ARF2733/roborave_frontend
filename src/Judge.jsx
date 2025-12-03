import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Judge() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const loginJudge = async () => {
    if (!pin || pin.length < 1) {
      alert("Ingresa tu PIN");
      return;
    }

    setLoading(true);

    try {
      const r = await fetch("https://roborave.onrender.com/api/judge/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const json = await r.json();

      if (!json.ok) {
        setLoading(false);
        alert("PIN incorrecto");
        return;
      }

      // Guardar token válido
      localStorage.setItem("judgeToken", json.token);

      // Ir al dashboard del juez
      navigate("/judge/dashboard");

    } catch (err) {
      alert("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.panel} className="score-card">

        <img
          src="/roborave_logo_white.svg"
          alt="RoboRAVE"
          style={styles.logo}
        />

        <div style={styles.title}>ACCESO PARA JUECES</div>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Ingresa tu PIN"
          style={styles.input}
        />

        <button
          onClick={loginJudge}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Conectando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- ESTILOS PREMIUM ---------------- */

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
  },

  panel: {
    width: "100%",
    maxWidth: "420px",
    padding: "34px 30px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.12)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "28px",
  },

  logo: {
    height: "60px",
    objectFit: "contain",
    filter:
      "drop-shadow(0 0 6px rgba(255,255,255,0.18)) drop-shadow(0 0 12px rgba(255,255,255,0.25))",
    marginBottom: "-8px",
  },

  title: {
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#ffebee",
    marginBottom: "4px",
  },

  input: {
    padding: "14px 16px",
    width: "100%",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "white",
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
    transition: "0.25s ease",
  },
};
