import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Judge() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  const loginJudge = async () => {
    if (!pin) {
      alert("Ingresa el PIN");
      return;
    }

    const r = await fetch("https://roborave.onrender.com/api/judge/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const json = await r.json();

    if (!json.ok) {
      alert("PIN incorrecto");
      return;
    }

    // Guardar token válido
    localStorage.setItem("judgeToken", json.token);

    // Ir al dashboard del juez
    navigate("/judge/dashboard");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Acceso para Jueces</h1>

      <input
        type="password"
        value={pin}
        onChange={e => setPin(e.target.value)}
        placeholder="Ingresa tu PIN"
        style={{
          padding: 12,
          width: "100%",
          marginTop: 20,
          borderRadius: 8,
          fontSize: 18,
        }}
      />

      <button
        onClick={loginJudge}
        style={{
          marginTop: 20,
          padding: 15,
          width: "100%",
          fontSize: 18,
          borderRadius: 8,
        }}
      >
        Entrar
      </button>
    </div>
  );
}
