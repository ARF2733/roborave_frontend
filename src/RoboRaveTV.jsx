// RoboRaveTV.jsx
import { useEffect, useRef } from "react";

export default function RoboRaveTV() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Cambia este ID por el del live
  const VIDEO_ID = "WTrPmBuo7gw";

  useEffect(() => {
    // Cargar API de YouTube si no está
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("tvPlayer", {
        width: "100%",
        height: "100%",
        videoId: VIDEO_ID,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          autoplay: 1,
          playsinline: 1,
        },
        events: {
          onReady: (ev) => ev.target.playVideo(),
        },
      });
    };
  }, []);

  return (
    <div style={styles.root} ref={containerRef}>
      {/* HEADER IGUAL AL DE SCORES */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <img
            src="/roborave_logo_white.svg"
            alt="RoboRAVE Logo"
            style={styles.logo}
          />

          <div style={styles.headerRight}>
            <span style={styles.taglineTop}>MEXICO 2025</span>
            <span style={styles.taglineBottom}>ROBORAVE TV</span>
          </div>
        </div>
      </header>

      {/* CONTENEDOR DEL VIDEO */}
      <div style={styles.videoWrapper}>
        <div id="tvPlayer" style={styles.video}></div>

        {/* OVERLAY “EN VIVO” */}
        <div style={styles.liveTag}>
          <span style={styles.redDot}></span>
          EN VIVO
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    display: "flex",
    flexDirection: "column",
    color: "white",
  },

  header: {
    width: "100%",
    padding: "10px 0",
    background:
      "linear-gradient(180deg, #151515 0%, #080808 40%, #050505 100%)",
    borderBottom: "3px solid #c628285f",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.85)",
    zIndex: 5,
  },

  headerInner: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    height: "46px",
    objectFit: "contain",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    borderLeft: "1px solid rgba(255,255,255,0.18)",
    paddingLeft: "12px",
  },

  taglineTop: {
    fontSize: "10px",
    letterSpacing: "0.25em",
    opacity: 0.8,
  },

  taglineBottom: {
    marginTop: "4px",
    fontSize: "12px",
    letterSpacing: "0.22em",
    color: "#ffebee",
  },

  // VIDEO
  videoWrapper: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  video: {
    width: "100%",
    height: "100%",
    maxWidth: "1000px",
    maxHeight: "900px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  // LIVE TAG
  liveTag: {
    position: "absolute",
    top: "28px",
    right: "28px",
    background: "rgba(255,0,0,0.75)",
    padding: "6px 12px",
    borderRadius: "22px",
    fontWeight: "700",
    fontSize: "12px",
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backdropFilter: "blur(5px)",
    boxShadow: "0 0 12px rgba(255,0,0,0.6)",
  },

  redDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "white",
    boxShadow: "0 0 6px white",
  },
};
