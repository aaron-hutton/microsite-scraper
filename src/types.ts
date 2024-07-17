export interface Players {
  N: string;
  E: string;
  S: string;
  W: string;
}

export interface MatchSummary {
  table: number;
  home: string;
  away: string;
  homeImps: number;
  awayImps: number;
  homeVPs: number;
  awayVPs: number;
}

export interface BoardResult {
  contract: string;
  declarer: string;
  lead: string;
  tricks: number;
  score: number;
}

export interface Board {
  num: number;
  openResult: BoardResult;
  closedResult: BoardResult;
  homeImps: number;
}

export interface Match extends MatchSummary {
  homePlayers: Players;
  awayPlayers: Players;

  boards: Board[];
}

export interface Round {
  num: number;
  matches: Match[];
}
