const SITE_URL = "";
const TOURNAMENT_ID = 2434;
const NUM_ROUNDS = 13;

import { parseArgs } from "util";
import { runScrape } from "./runner";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    url: {
      type: "string",
      short: "u",
      default:
        "http://db.eurobridge.org/repository/competitions/24wroclaw/microsite/Asp/",
    },
    tournamentId: {
      type: "string",
      short: "t",
      default: "2434",
    },
    rounds: {
      type: "string",
      short: "r",
      default: "1",
    },
    speed: {
      type: "string",
      short: "s",
      default: "1000",
    },
  },
  strict: true,
  allowPositionals: true,
});

const url = values.url ?? "";
const numRounds = parseInt(values.rounds ?? "");
const speed = parseInt(values.speed ?? "");
const tournamentId = parseInt(values.tournamentId ?? "");

runScrape({ url, numRounds, tournamentId, speed }).then((r) =>
  console.log(JSON.stringify(r))
);
