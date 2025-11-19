import Image from "next/image";

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

interface MatchCardProps {
  name: string;
  matchType: string;
  status: string;
  venue: string;
  teams: string[];
  teamInfo: TeamInfo[];
  score: ScoreItem[];
}

export default function ScoreCard(props: MatchCardProps) {
  const { name, matchType, status, venue, teamInfo, score } = props;

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-1.5 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center text-gray-600 text-xs uppercase font-semibold gap-1.5 px-3 pt-3">
        <span className="text-[10px] text-green-700 border border-green-300 px-2 py-px rounded-full w-fit bg-green-100">
          {matchType}
        </span>

        <span className="line-clamp-1 normal-case font-semibold text-gray-500 text-[11px]">
          {name}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3">
        {teamInfo.map((team, index) => {
          const teamScore = score[index];

          return (
            <div
              key={team.shortname}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-gray-200 p-1">
                  <Image
                    src={team.img}
                    alt={team.shortname}
                    width={16}
                    height={16}
                    className="rounded-full"
                    quality={40}
                    loading="eager"
                    priority
                    fetchPriority="high"
                  />
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {team.shortname}
                </span>
              </div>

              {teamScore && (
                <div className="flex flex-col items-end">
                  <span className="font-extrabold text-gray-800 text-sm leading-none">
                    {teamScore.r}/{teamScore.w}
                  </span>
                  <span className="font-semibold text-[10px]">
                    ({teamScore.o} overs)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs font-semibold border-t border-gray-200 px-3 py-1">
        {status.split("(")[0]}
      </div>
    </div>
  );
}
