import mysql from "mysql2/promise";
// Note: Astro already loads .env for you—no need for `dotenv.config()` here.
const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port:     process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit:    5,
  queueLimit:         0,
});

/**
 * Fetch rows for the given list of [player1, player2] pairs and return
 * an array of objects:
 *   { player1_name, player2_name, prob_player1_wins, prob_player2_wins, tournament }
 */
async function getMatchupData(matchups, tournament) {
  const connection = await pool.getConnection();
  try {
    const results = [];

    for (const [p1, p2] of matchups) {
      // Adjust SQL column/table names exactly to match your schema
      const [rows] = await connection.execute(
        `SELECT
           player1_name,
           player2_name,
           prob_player1_wins,
           prob_player2_wins
         FROM model_matches
         WHERE player1_name = ? AND player2_name = ?
         LIMIT 1`,
        [p1, p2]
      );

      if (rows.length > 0) {
        const row = rows[0];
        results.push({
          player1_name:         row.player1_name,
          player2_name:         row.player2_name,
          prob_player1_wins:    typeof row.prob_player1_wins === "number"
                                  ? +row.prob_player1_wins.toFixed(4)
                                  : null,
          prob_player2_wins:    typeof row.prob_player2_wins === "number"
                                  ? +row.prob_player2_wins.toFixed(4)
                                  : null,
          tournament,
        });
      } else {
        // If no row in DB, still push a placeholder
        results.push({
          player1_name:      p1,
          player2_name:      p2,
          prob_player1_wins: null,
          prob_player2_wins: null,
          tournament,
        });
      }
    }

    return results;
  } finally {
    connection.release();
  }
}

// src/pages/api/tennis/hello.js
export async function get() {
    return {
      status: 200,
      body: JSON.stringify({ message: "Hello from Astro!" }),
    };
  }
  

/**
 * The HTTP GET handler for /api/tennis/predictions
 */
export async function get({ request }) {
  try {
    // Hardcode your “lineups” (or pull from some config). 
    // You had in Express:
    //    tournaments.roland = [
    //      ["Jannik Sinner", "Jiri Lehecka"],
    //      ["Alexander Zverev", "Flavio Cobolli"],
    //      … 
    //    ];
    //
    // Let’s copy exactly those names here. Feel free to replace with dynamic logic later.
    const rolandMatchups = [
      ["Jannik Sinner",      "Jiri Lehecka"],
      ["Alexander Zverev",   "Flavio Cobolli"],
      ["Lorenzo Musetti",    "Mariano Navone"],
      ["Quentin Halys",      "Holger Rune"],
      ["Hamad Medjedovic",   "Daniel Altmaier"],
      ["Nuno Borges",        "Alexei Popyrin"],
      ["Karen Khachanov",    "Tommy Paul"],
    ];

    // Call getMatchupData exactly as in your Express app
    const cards = await getMatchupData(rolandMatchups, "roland");

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cards),
    };
  } catch (err) {
    console.error("Error in /api/tennis/predictions:", err);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
