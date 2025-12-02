import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  const styles = {
    wrapper: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f6f6f6",
      padding: "40px"
    },
    container: {
      width: "100%",
      maxWidth: "500px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    btn: {
      padding: "20px",
      fontSize: "20px",
      borderRadius: "14px",
      border: "none",
      background: "#1e1e1e",
      color: "white",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button style={styles.btn} onClick={() => nav("/scores")}>
          Participante
        </button>

        <button style={styles.btn} onClick={() => nav("/judge")}>
          Juez (PIN)
        </button>

        <button style={styles.btn} onClick={() => nav("/sponsor")}>
          Sponsor
        </button>
      </div>
    </div>
  );
}
