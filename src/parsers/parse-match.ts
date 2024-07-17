import { load, type Cheerio, type CheerioAPI, type Element } from "cheerio";
import type { Board, Match, MatchSummary } from "../types";

export function parseMatch(page: string, summary: MatchSummary): Match {
  const $ = load(page);
  const $playerTable = $($("table table table table")[1]);
  const $boardsTable = $($("table table table")[4]);

  const { homePlayers, awayPlayers } = parsePlayers($, $playerTable);
  const boards = parseBoards($, $boardsTable);

  return {
    ...summary,
    homePlayers,
    awayPlayers,
    boards,
  };
}

function parsePlayers($: CheerioAPI, $table: Cheerio<Element>) {
  const $rows = $table.find("tr");
  const $nRow = $($rows[1]);
  const $ewRow = $($rows[2]);
  const $sRow = $($rows[3]);

  const homeN = $($nRow.find("td")[0]).text().trim();
  const awayN = $($nRow.find("td")[1]).text().trim();

  const awayW = $($ewRow.find("td")[0]).text().trim();
  const awayE = $($ewRow.find("td")[2]).text().trim();
  const homeW = $($ewRow.find("td")[3]).text().trim();
  const homeE = $($ewRow.find("td")[5]).text().trim();

  const homeS = $($sRow.find("td")[0]).text().trim();
  const awayS = $($sRow.find("td")[1]).text().trim();

  return {
    homePlayers: {
      N: homeN,
      E: homeE,
      S: homeS,
      W: homeW,
    },
    awayPlayers: {
      N: awayN,
      E: awayE,
      S: awayS,
      W: awayW,
    },
  };
}

function parseBoards($: CheerioAPI, $table: Cheerio<Element>) {
  const $rows = $table.find("> tbody > tr");

  const boards: Board[] = [];

  for (let i = 1; i < $rows.length; i++) {
    // For now, just delete all auction spans before we parse
    $($rows[i]).find("> td span").remove();

    const $cells = $($rows[i]).find("> td");

    const num = parseInt($($cells[0]).text());

    const openContract = $($cells[1]).text().trim();
    const openDeclarer = $($cells[2]).text().trim();
    const openLead = $($cells[3]).text().trim();
    const openTricks = parseInt($($cells[4]).text());
    const openScore = parseScore($($cells[5]), $($cells[6]));

    const closedContract = $($cells[7]).text().trim();
    const closedDeclarer = $($cells[8]).text().trim();
    const closedLead = $($cells[9]).text().trim();
    const closedTricks = parseInt($($cells[10]).text());
    const closedScore = parseScore($($cells[11]), $($cells[12]));

    const homeImps = parseScore($($cells[13]), $($cells[14]));

    boards.push({
      num,
      openResult: {
        contract: openContract,
        declarer: openDeclarer,
        lead: openLead,
        tricks: openTricks,
        score: openScore ?? 0,
      },
      closedResult: {
        contract: closedContract,
        declarer: closedDeclarer,
        lead: closedLead,
        tricks: closedTricks,
        score: closedScore ?? 0,
      },
      homeImps: homeImps ?? 0,
    });
  }

  return boards;
}

function parseScore($cell1: Cheerio<Element>, $cell2: Cheerio<Element>) {
  if ($cell1.text().trim() !== "") {
    return parseInt($cell1.text().trim());
  }

  if ($cell2.text().trim() !== "") {
    return -parseInt($cell2.text().trim());
  }

  return 0;
}
