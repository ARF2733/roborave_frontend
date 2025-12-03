import FullscreenRoboRAVE from "./FullscreenRoboRAVE";

export default function RoboRaveTV() {
  // 👉 Solo cambia este ID
  const YT_ID = "WTrPmBuo7gw"; 

  return (
    <FullscreenRoboRAVE>

      <div style={styles.wrapper}>

        {/* LOGO FLOTADO */}
        <img
          src="/roborave_logo_white.svg"
          alt="RoboRAVE"
          style={styles.floatingLogo}
        />

        {/* BADGE EN VIVO */}
        <div style={styles.liveBadge}>🔴 EN VIVO</div>

        {/* CONTENEDOR DEL VIDEO */}
        <div style={styles.videoContainer}>
          <iframe
            src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&controls=0&mute=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0`}
            title="RoboRAVE TV Stream"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            style={styles.iframe}
          />
        </div>

        {/* SOMBRA PREMIUM */}
        <div style={styles.shadowBottom}></div>

      </div>

    </FullscreenRoboRAVE>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "24px",
    boxSizing: "border-box",
  },

  videoContainer: {
    width: "100%",
    maxWidth: "1280px",
    position: "relative",
    paddingTop: "56.25%", // 16:9
    borderRadius: "12px",
    overflow: "hidden",
    animation: "fadeIn 0.8s ease",
    background: "black",
    boxShadow: "0 12px 38px rgba(0,0,0,0.6)",
  },

  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  floatingLogo: {
    position: "absolute",
    top: "18px",
    left: "24px",
    height: "42px",
    opacity: 0.85,
    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
    zIndex: 5,
  },

  liveBadge: {
    position: "absolute",
    top: "22px",
    right: "24px",
    background: "rgba(255,0,0,0.85)",
    padding: "6px 14px",
    borderRadius: "14px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "white",
    zIndex: 5,
    boxShadow: "0 0 12px rgba(255,0,0,0.6)",
  },

  shadowBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80px",
    background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
    pointerEvents: "none",
  },
};

/* 
  Animación fadeIn global:
  (Agrega esto en index.css si quieres que funcione también fuera del TV)
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
*/
