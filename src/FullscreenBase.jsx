export default function FullscreenBase({ children }) {
  return (
    <div style={styles.root}>
      <div style={styles.content}>
        {children}
      </div>
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
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #ffffff, #ececec)",
    boxSizing: "border-box",
  },
  content: {
    width: "100%",
    height: "100%",
    maxWidth: "1400px",
    display: "flex",
    flexDirection: "column",
    padding: "40px",
    boxSizing: "border-box",
  },
};
