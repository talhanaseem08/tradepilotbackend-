import CardBG from "@/assets/images/card/card-bg.png";
import Logo from "@/assets/images/card/card-logo.png";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

interface CreditCardType {
    id: number;
    type: string;
    number: string;
    name: string;
    expiry: string;
    cardBg: string;
    cardLogo: string;
}

const creditCardData: CreditCardType[] = [
    {
        id: 1,
        type: "Master Card",
        number: "2356 9854 3652 5612",
        name: "Arlene McCoy",
        expiry: "05/26",
        cardBg: CardBG,
        cardLogo: Logo,
    },
    {
        id: 2,
        type: "Visa Card",
        number: "1234 5678 9012 3456",
        name: "Wade Warren",
        expiry: "08/27",
        cardBg: CardBG,
        cardLogo: Logo,
    },
    {
        id: 3,
        type: "Master Card",
        number: "9988 7766 5544 3322",
        name: "Courtney Henry",
        expiry: "11/28",
        cardBg: CardBG,
        cardLogo: Logo,
    },
];

function MasterCardSlider() {

    const [sliderRef] = useKeenSlider()

    return (
        <div className="w-full keen-slider" ref={sliderRef} >
            {creditCardData.map((card) => (
                <div
                    className={`p-5 h-[240px] rounded-lg overflow-hidden relative z-[1] keen-slider__slide`}
                    key={card.id}
                >
                    <img
                        src={card.cardBg}
                        alt="BG"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="absolute start-0 top-0 w-full h-full object-cover -z-[1]"
                    />
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between flex-wrap">
                            <h6 className="text-white mb-0">{card.type}</h6>
                            <img
                                src={card.cardLogo}
                                alt="Logo"
                                width={70}
                                height={40}
                                className="w-[70px] h-[40px]"
                            />
                        </div>
                        <div>
                            <span className="text-white text-xs font-normal text-opacity-75">
                                Credit Card Number
                            </span>
                            <h6 className="text-white text-xl font-semibold mt-1 mb-0">
                                {card.number}
                            </h6>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-white text-xs font-normal text-opacity-75">
                                    Name
                                </span>
                                <h6 className="text-white text-xl font-semibold mb-0">
                                    {card.name}
                                </h6>
                            </div>
                            <div>
                                <span className="text-white text-xs font-normal text-opacity-75">
                                    Exp. Date
                                </span>
                                <h6 className="text-white text-xl font-semibold mb-0">
                                    {card.expiry}
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MasterCardSlider;
