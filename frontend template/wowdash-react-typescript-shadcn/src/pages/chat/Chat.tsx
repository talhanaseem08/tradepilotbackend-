import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const ChatBox = lazy(() => import("./components/ChatBox"));

const Chat = () => {
    return (
        <>
            <Breadcrumb title="Chat" text="Chat" />

            <LazyWrapper>
                <ChatBox />
            </LazyWrapper>

        </>
    );
};

export default Chat;