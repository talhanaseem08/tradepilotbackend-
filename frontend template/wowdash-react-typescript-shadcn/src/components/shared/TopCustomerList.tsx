import PerformerImg2 from "@/assets/images/users/user1.png";
import PerformerImg1 from "@/assets/images/users/user2.png";
import PerformerImg3 from "@/assets/images/users/user3.png";
import PerformerImg4 from "@/assets/images/users/user4.png";
import PerformerImg5 from "@/assets/images/users/user5.png";
import PerformerImg6 from "@/assets/images/users/user6.png";

export interface TopPerformerType {
  id: number;
  name: string;
  image: string;
  phone: string;
  order: string;
}

const topPerformers: TopPerformerType[] = [
  {
    id: 1,
    name: "Dianne Russell",
    image: PerformerImg1,
    phone: "017******58",
    order: "60",
  },
  {
    id: 2,
    name: "Wade Warren",
    image: PerformerImg2,
    phone: "017******58",
    order: "35",
  },
  {
    id: 3,
    name: "Albert Flores",
    image: PerformerImg3,
    phone: "017******58",
    order: "55",
  },
  {
    id: 4,
    name: "Bessie Cooper",
    image: PerformerImg4,
    phone: "017******58",
    order: "60",
  },
  {
    id: 5,
    name: "Arlene McCoy",
    image: PerformerImg5,
    phone: "017******58",
    order: "55",
  },
  {
    id: 6,
    name: "Arlene McCoy",
    image: PerformerImg6,
    phone: "017******58",
    order: "50",
  },
];

const TopCustomerList = () => {
  return (
    <>
      {topPerformers.map((topPerformer, index) => {
        return (
          <div className="flex items-center justify-between gap-2" key={index}>
            <div className="flex items-center gap-3">
              <img
                src={topPerformer.image}
                alt={topPerformer.name}
                className="w-10 h-10 rounded-sm shrink-0 overflow-hidden"
              />
              <div className="grow">
                <h6 className="text-base mb-0 font-medium">
                  {topPerformer.name}
                </h6>
                <span className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
                  {topPerformer.phone}
                </span>
              </div>
            </div>
            <span className="text-neutral-600 dark:text-neutral-100 text-base font-medium">
              Orders: {topPerformer.order}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default TopCustomerList;
