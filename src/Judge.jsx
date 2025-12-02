import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Judge() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");

  const CORRECT_PIN = "2025"; // lo cambias luego

  const submit = () => {
    if (pin === CORRECT_PIN) {
      nav("/judge/dashboard");
    } else {
      alert("PIN incorrecto");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Acceso para Jueces</h1>

      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
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
        onClick={submit}
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
