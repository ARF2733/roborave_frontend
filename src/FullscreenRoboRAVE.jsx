export default function FullscreenRoboRAVE({ children }) {
  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <img
            src="/roborave_logo_white.svg"
            alt="RoboRAVE Logo"
            style={styles.logo}
          />

          <div style={styles.headerRight}>
            <span style={styles.taglineTop}>ROBORAVE INTERNATIONAL</span>
            <span style={styles.taglineBottom}>MEXICO 2025 · LIVE SCORES</span>
          </div>
        </div>
      </header>

      <main style={styles.content}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  root: {
    width: "100vw",
    height: "100dvh",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    color: "#f5f5f5",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },

  header: {
    width: "100%",
    padding: "10px 0",
    background:
      "linear-gradient(180deg, #151515 0%, #080808 40%, #050505 100%)",
    borderBottom: "3px solid #c628285f",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.85)",
    zIndex: 10,
  },

  headerInner: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },

  logo: {
    height: "60px",
    objectFit: "contain",
    filter:
      "drop-shadow(0 0 6px rgba(208, 148, 148, 0.25)) drop-shadow(0 0 12px rgba(255,255,255,0.18))",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    textAlign: "right",
    paddingLeft: "16px",
    borderLeft: "1px solid rgba(255,255,255,0.18)",
  },

  taglineTop: {
    fontSize: "11px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    opacity: 0.85,
  },

  taglineBottom: {
    marginTop: "4px",
    fontSize: "13px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#ffebee",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    overflowY: "auto",  
    overscrollBehavior: "contain",
  },
};
