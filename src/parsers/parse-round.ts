import { load } from "cheerio";
import type { MatchSummary } from "../types";

export function parseRound(page: string) {
  const $ = load(page);
  const $tables = $("table table table");
  const $rows = $($tables[0]).find("tr");

  const matches: { summary: MatchSummary; link: string }[] = [];

  for (let i = 2; i < $rows.length; i++) {
    const $row = $($rows[i]);
    const $cells = $($row.find("td"));

    const link = $($cells[0]).find("a").attr("href") ?? "";

    const table = parseInt($($cells[0]).text());
    const home = $($cells[1]).text().trim();
    const away = $($cells[2]).text().trim();
    const homeImps = parseInt($($cells[3]).text());
    const awayImps = parseInt($($cells[4]).text());
    const homeVPs = parseFloat($($cells[5]).text());
    const awayVPs = parseFloat($($cells[6]).text());

    const summary = { table, home, away, homeImps, awayImps, homeVPs, awayVPs };

    matches.push({ link, summary });
  }

  return matches;
}
