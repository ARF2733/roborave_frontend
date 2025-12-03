export default function RoboRaveTV() {
  const YT_ID = "WTrPmBuo7gw"; // cambia por tu stream real

  return (
    <div style={styles.root}>
      
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>

          <img
            src="/roborave_logo_white.svg"
            alt="RoboRAVE"
            style={styles.logo}
          />

          <div style={styles.headerRight}>
            <span style={styles.taglineTop}>MEXICO 2025</span>
            <span style={styles.taglineBottom}>ROBORAVE TV</span>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main style={styles.content}>
        
        {/* Chip “En Vivo” */}
        <div style={styles.liveChip}>
          <span style={styles.liveDot}></span>
          EN VIVO
        </div>

        {/* VIDEO WRAPPER */}
        <div style={styles.videoWrapper}>
          
          {/* IFRAME */}
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=0&controls=0&modestbranding=1&playsinline=1`}
            style={styles.iframe}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />

          {/* MASK PARA TAPAR LOGOS */}
          <div style={styles.overlayBottom} />
        </div>

      </main>
    </div>
  );
}

/* ---------------------------------------------- */
/* -------------------- ESTILOS ----------------- */
/* ---------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    color: "white",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  /* HEADER */
  header: {
    width: "100%",
    padding: "10px 0",
    background:
      "linear-gradient(180deg, #151515 0%, #080808 40%, #050505 100%)",
    borderBottom: "3px solid #c628285f",
    boxShadow: "0 6px 24px rgba(0,0,0,0.85)",
    zIndex: 10,
  },

  headerInner: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 22px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  logo: {
    height: "48px",
    objectFit: "contain",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingLeft: "12px",
    borderLeft: "1px solid rgba(255,255,255,0.18)",
  },

  taglineTop: {
    fontSize: "10px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    opacity: 0.85,
  },

  taglineBottom: {
    marginTop: "4px",
    fontSize: "12px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#ffebee",
  },

  /* CONTENT */
  content: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    padding: "0 20px",
    overflowY: "auto",
  },

  /* EN VIVO CHIP */
  liveChip: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "8px 16px",
    borderRadius: "32px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    letterSpacing: "0.06em",
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "14px",
  },

  liveDot: {
    width: "10px",
    height: "10px",
    background: "#ff1744",
    borderRadius: "50%",
    boxShadow: "0 0 8px #ff1744",
    animation: "pulse 1.2s infinite",
  },

  /* VIDEO WRAPPER */
  videoWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    aspectRatio: "16/9",
    borderRadius: "16px",
    overflow: "hidden",
    background: "black",
    boxShadow: "0 10px 32px rgba(0,0,0,0.6)",
  },

  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "55px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))",
    pointerEvents: "none",
  },
};
