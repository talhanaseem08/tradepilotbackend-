import BoardImage1 from "@/assets/images/notice/board-img1.png";
import BoardImage2 from "@/assets/images/notice/board-img2.png";
import BoardImage3 from "@/assets/images/notice/board-img3.png";

interface NoticeItem {
  id: number;
  name: string;
  message: string;
  date: string;
  image: string;
};

const noticeData: NoticeItem[] = [
  {
    id: 1,
    name: "Admin",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy.",
    date: "25 Jan 2024",
    image: BoardImage1,
  },
  {
    id: 2,
    name: "Kathryn Murphy",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    date: "25 Jan 2024",
    image: BoardImage2,
  },
  {
    id: 3,
    name: "Cameron Williamson",
    message:
      "Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    date: "25 Jan 2024",
    image: BoardImage3,
  },
];

const NoticeBoardList = () => {
  return (
    <div>
      {noticeData.map((item) => (
        <div key={item.id} className="flex items-start gap-2 mb-5 last:mb-0">
          <img
            src={item.image}
            alt={item.name}
            width={40}
            height={40}
            className="shrink-0 w-10 h-10 me-3 rounded-lg object-cover"
          />
          <div className="grow">
            <h6 className="text-base mb-1 font-semibold">{item.name}</h6>
            <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium mb-1">
              {item.message}
            </p>
            <span className="text-sm text-neutral-700 dark:text-neutral-200 font-normal">
              {item.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeBoardList;
