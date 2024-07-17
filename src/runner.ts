import axios from "axios";
import { sleep } from "bun";
import { ROUND_ID_PARAM, ROUND_PAGE, TOURNAMENT_ID_PARAM } from "./config";
import { parseMatch } from "./parsers/parse-match";
import { parseRound } from "./parsers/parse-round";
import type { Match, Round } from "./types";

interface ScrapeOptions {
  url: string;
  tournamentId: number;
  numRounds: number;
  speed: number;
}

export async function runScrape({
  url,
  tournamentId,
  numRounds,
  speed,
}: ScrapeOptions) {
  const rounds: Round[] = [];
  for (let roundNum = 1; roundNum <= numRounds; roundNum++) {
    console.log("Fetching round: " + roundNum);

    const roundStr = await fetchRoundPage(url, tournamentId, roundNum);
    const round = parseRound(roundStr);

    console.log("Parsed round summary");
    await sleep(speed);

    const matches: Match[] = [];

    for (let matchNum = 0; matchNum < round.length; matchNum++) {
      console.log("Parse match: " + matchNum);
      const matchPage = await fetchMatchPage(url, round[matchNum].link);
      const match = parseMatch(matchPage, round[matchNum].summary);
      matches.push(match);
      await sleep(speed);
    }
    rounds.push({
      num: roundNum,
      matches,
    });

    console.log("Round " + roundNum + " complete");
    console.log("\n--------------------------------\n");
  }

  return rounds;
}

async function fetchRoundPage(
  url: string,
  tournamentId: number,
  round: number
) {
  const result = await axios.get(
    url +
      ROUND_PAGE +
      "?" +
      TOURNAMENT_ID_PARAM +
      "=" +
      tournamentId +
      "&" +
      ROUND_ID_PARAM +
      "=" +
      round
  );

  if (result.status === 200) {
    return result.data as string;
  }

  throw new Error("Failed to fetch round page. Round: " + round);
}

async function fetchMatchPage(url: string, link: string) {
  const result = await axios.get(url + link);

  if (result.status === 200) {
    return result.data as string;
  }

  throw new Error("Failed to fetch match page. Link: " + link);
}
