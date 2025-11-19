import ScoreCard from "./score-card";

interface TeamInfo {
  name: string;
  shortname: string;
  img: string;
}

interface ScoreItem {
  r: number;
  w: number;
  o: number;
  inning: string;
}

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  teams: string[];
  teamInfo: TeamInfo[];
  score: ScoreItem[];
}

export default async function Matches() {
  const response = await fetch(
    "https://api.cricapi.com/v1/currentMatches?apikey=a12ae87c-db9e-4174-92f7-20014e932aa3&offset=0",
    { next: { revalidate: 30 } }
  );

  const { data } = await response.json();
  const matches = data.slice(0, 4);

  return (
    <div className="md:grid hidden md:grid-cols-4 gap-4">
      {matches.map((match: Match) => (
        <ScoreCard key={match.id} {...match} />
      ))}
    </div>
  );
}
