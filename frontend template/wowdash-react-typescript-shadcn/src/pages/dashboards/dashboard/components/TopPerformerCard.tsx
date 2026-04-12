import { default as PerformerImg1, default as PerformerImg6 } from "@/assets/images/users/user1.png";
import PerformerImg2 from "@/assets/images/users/user2.png";
import PerformerImg3 from "@/assets/images/users/user3.png";
import PerformerImg4 from "@/assets/images/users/user4.png";
import PerformerImg5 from "@/assets/images/users/user5.png";
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

export interface TopPerformer {
  id: number;
  name: string;
  image: string;
  agentId: string;
  earnings: number;
}

const topPerformers: TopPerformer[] = [
  {
    id: 1,
    name: "Dianne Russell",
    image: PerformerImg1,
    agentId: "36254",
    earnings: 20,
  },
  {
    id: 2,
    name: "Wade Warren",
    image: PerformerImg2,
    agentId: "94352",
    earnings: 94,
  },
  {
    id: 3,
    name: "Albert Flores",
    image: PerformerImg3,
    agentId: "23265",
    earnings: 30,
  },
  {
    id: 4,
    name: "Bessie Cooper",
    image: PerformerImg4,
    agentId: "43694",
    earnings: 40,
  },
  {
    id: 5,
    name: "Arlene McCoy",
    image: PerformerImg5,
    agentId: "94355",
    earnings: 10,
  },
  {
    id: 6,
    name: "Arlene McCoy",
    image: PerformerImg6,
    agentId: "35685",
    earnings: 56,
  },
   {
    id: 7,
    name: "Albert Flores",
    image: PerformerImg3,
    agentId: "23265",
    earnings: 30,
  },
];

interface TopPerformerCardType {
  listClasses: string
}

const TopPerformerCard = ({ listClasses }: TopPerformerCardType) => {
  return (
    <Card className="card p-0">
      <CardContent className="card-body p-0">
        <div className="flex items-center justify-between p-6 pb-0">
          <h6 className="mb-0 font-semibold text-lg">Top Performer</h6>
          <CommonLink />
        </div>

      <div className="p-6 pe-0 pt-8">
        <div className={`pe-6 ${listClasses}`}>
          {topPerformers.map((topPerformer, index) => {
            return (
              <div
                className="flex items-center justify-between gap-2"
                key={index}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={topPerformer.image}
                    alt={topPerformer.name}
                    className="w-10 h-10 rounded-full shrink-0 overflow-hidden"
                  />
                  <div className="grow">
                    <h6 className="text-base mb-0 font-medium">
                      {topPerformer.name}
                    </h6>
                    <span className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
                      Agent ID: {topPerformer.agentId}
                    </span>
                  </div>
                </div>
                <span className="text-neutral-600 dark:text-neutral-100 text-base font-medium">
                  ${topPerformer.earnings}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformerCard;
