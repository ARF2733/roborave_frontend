import LiveHeatsGrid from "./LiveHeatsGrid";

export default function LiveHeatsByCategory({ teams }) {
  // Agrupar por categoría
  const grouped = teams.reduce((acc, team) => {
    const cat = team.category || "Uncategorized";
    (acc[cat] ||= []).push(team);
    return acc;
  }, {});

  // Orden oficial por categoría
  const orderedEntries = Object.entries(grouped).sort(([a], [b]) =>
    sortCategories(a, b)
  );

  return (
    <div style={styles.wrapper}>
      {orderedEntries.map(([category, list]) => {

        // ⭐ ORDENAR POR PUNTAJE (mayor → menor)
        const sortedList = [...list].sort((a, b) => b.score - a.score);
        // si es "points" o "total", solo cambia score por el nombre correcto

        return (
          <div key={category} style={styles.section}>
            
            {/* Título */}
            <div style={styles.titleRow}>
              <h2 style={styles.title}>{formatCategory(category)}</h2>
              <span style={styles.count}>{sortedList.length} teams</span>
            </div>

            {/* Línea separadora */}
            <div style={styles.divider} />

            {/* Grid con medallas */}
            <LiveHeatsGrid teams={sortedList} />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------- */
/* -------------------- ESTILOS ---------------------- */
/* -------------------------------------------------- */

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    width: "100%",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "8px",
  },

  title: {
    fontSize: "24px",
    fontWeight: 800,
    color: "white",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  count: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.06em",
  },

  divider: {
    width: "100%",
    height: "1px",
    background:
      "linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0))",
  },
};

/* -------------------------------------------------- */
/* ----------- CATEGORÍAS + ORDEN OFICIAL ------------ */
/* -------------------------------------------------- */

const CATEGORY_ORDER = [
  "a-MAZE-ing",
  "SumoBot Lego",
  "SumoBot 1 Kg",
  "SumoBot",
  "SumoBot 3 Kg",
  "Fire Fighting",
  "Entrepreneurial",
  "Soccer Futbol",
  "Fastbot",
  "Line Following",
];

// Orden por categoría usando nombres formateados
function sortCategories(a, b) {
  const cleanA = formatCategory(a).split("•")[0].trim();
  const cleanB = formatCategory(b).split("•")[0].trim();
  return CATEGORY_ORDER.indexOf(cleanA) - CATEGORY_ORDER.indexOf(cleanB);
}

/* -------------------------------------------------- */
/* --------- FORMATTER — NOMBRES PREMIUM ------------- */
/* -------------------------------------------------- */

function formatCategory(cat) {
  const map = {
    // a-MAZE-ing
    "A-MAZE-ING_ES": "a-MAZE-ing • ES",
    "A-MAZE-ING_MS": "a-MAZE-ing • MS",

    // SumoBot Lego
    "SUMO_ES": "SumoBot Lego • ES",
    "SUMO_MS": "SumoBot Lego • MS",

    // SumoBot 1 Kg
    "SUMO1K_ES": "SumoBot 1 Kg • ES",
    "SUMO1K_MS": "SumoBot 1 Kg • MS",
    "SUMO1K_HS": "SumoBot 1 Kg • HS",
    "SUMO1K_UP": "SumoBot 1 Kg • UP",

    "SUMO_OPEN": "SumoBot • OPEN",

    // Fire Fighting
    "FIRE_HS": "Fire Fighting • HS",

    // SumoBot 3 Kg
    "SUMO3K_HS": "SumoBot 3 Kg • HS",
    "SUMO3K_UP": "SumoBot 3 Kg • UP",

    // Soccer Futbol
    "SOCCER_ES": "Soccer Futbol • ES",
    "SOCCER_MS": "Soccer Futbol • MS",
    "SOCCER_HS": "Soccer Futbol • HS",

    // Fastbot
    "FAST_MS": "Fastbot • MS",
    "FAST_HS": "Fastbot • HS",
    "FAST_UP": "Fastbot • UP",

    // Line Following
    "LINE_HS": "Line Following • HS",

    // Entrepreneurial
    "ENTRE_HS": "Entrepreneurial • HS",
  };

  return map[cat] || cat;
}
