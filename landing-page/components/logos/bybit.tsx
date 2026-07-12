import type { SVGProps } from "react";

export default function Bybit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg role="img" viewBox="0 0 242.5 80.83" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
            <title>Bybit</title>
            {/* Orange symbol */}
            <path d="M435.59,405.9V343.58h12.53V405.9Z" transform="translate(-262.75 -343.58)" fill="#f7a600" />
            {/* Text "Bybit" - making fill currentColor for dark mode compatibility (orig: #15192a) */}
            <path d="M289.6,424.41H262.75V362.09h25.77c12.53,0,19.82,6.83,19.82,17.51a14.39,14.39,0,0,1-7.93,12.87c3.87,1.75,8.83,5.69,8.83,14C309.25,418.11,301.05,424.41,289.6,424.41Zm-2.07-51.46H275.28V387.3h12.26c5.32,0,8.29-2.89,8.29-7.18S292.85,372.95,287.53,372.95Zm.81,25.3H275.28v15.32h13.07c5.68,0,8.38-3.5,8.38-7.7S294,398.24,288.34,398.24Z" transform="translate(-262.75 -343.58)" fill="currentColor" />
            <path d="M347.45,398.85v25.56H335V398.85l-19.28-36.76h13.61l12,25.12,11.8-25.12h13.61Z" transform="translate(-262.75 -343.58)" fill="currentColor" />
            <path d="M402.25,424.41H375.39V362.09h25.77c12.53,0,19.82,6.83,19.82,17.51a14.39,14.39,0,0,1-7.93,12.87c3.87,1.75,8.83,5.69,8.83,14C421.89,418.11,413.69,424.41,402.25,424.41Zm-2.07-51.46H387.92V387.3h12.26c5.32,0,8.29-2.89,8.29-7.18S405.49,372.95,400.17,372.95Zm.81,25.3H387.92v15.32H401c5.68,0,8.38-3.5,8.38-7.7S406.66,398.24,401,398.24Z" transform="translate(-262.75 -343.58)" fill="currentColor" />
            <path d="M488.49,372.95v51.47H476V372.95H459.2V362.09h46.05v10.86Z" transform="translate(-262.75 -343.58)" fill="currentColor" />
        </svg>
    );
}
