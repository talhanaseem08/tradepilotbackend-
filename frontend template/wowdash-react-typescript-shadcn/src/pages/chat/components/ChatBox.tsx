import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Ban, CircleX, EllipsisVertical, ImageIcon, LinkIcon, Phone, Send, Settings, User, Video } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import ChatImage1 from '@/assets/images/chat/1.png';
import ChatImage10 from '@/assets/images/chat/10.png';
import ChatImage11 from '@/assets/images/chat/11.png';
import ChatImage2 from '@/assets/images/chat/2.png';
import ChatImage3 from '@/assets/images/chat/3.png';
import ChatImage4 from '@/assets/images/chat/4.png';
import ChatImage5 from '@/assets/images/chat/5.png';
import ChatImage6 from '@/assets/images/chat/6.png';
import ChatImage7 from '@/assets/images/chat/7.png';
import ChatImage8 from '@/assets/images/chat/8.png';
import ChatImage9 from '@/assets/images/chat/9.png';
import { Link } from 'react-router-dom';

type ChatItem = {
    id: number;
    name: string;
    message: string;
    time: string;
    unreadCount: number;
    imgSrc: string;
    isActive?: boolean;
};

const chatList: ChatItem[] = [
    {
        id: 1,
        name: "Kathryn Murphy",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage1, isActive: true
    },
    {
        id: 2,
        name: "James Michael",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage2, isActive: true
    },
    {
        id: 3,
        name: "Russell Lucas",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage3
    },
    {
        id: 4,
        name: "Caleb Bradley",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage4
    },
    {
        id: 5,
        name: "Bobby Roy",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage5, isActive: true
    },
    {
        id: 6,
        name: "Vincent Liam",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage6, isActive: true
    },
    {
        id: 7,
        name: "Randy Mason",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage7, isActive: true
    },
    {
        id: 8,
        name: "Albert Wayne",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage8, isActive: true
    },
    {
        id: 9,
        name: "Elijah Willie",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage9, isActive: true
    },
    {
        id: 10,
        name: "Kathryn Murphy",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage10, isActive: true
    },
    {
        id: 11,
        name: "James Michael",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage1
    },
    {
        id: 12,
        name: "Russell Lucas",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage2
    },
    {
        id: 13,
        name: "Caleb Bradley",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage3
    },
    {
        id: 14,
        name: "Bobby Roy",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage4, isActive: true
    },
    {
        id: 15,
        name: "Vincent Liam",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage5, isActive: true
    },
    {
        id: 16,
        name: "Randy Mason",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage6, isActive: true
    },
    {
        id: 17,
        name: "Albert Wayne",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage7, isActive: true
    },
    {
        id: 18,
        name: "Elijah Willie",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage8, isActive: true
    },
    {
        id: 19,
        name: "Kathryn Murphy",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage9
    },
    {
        id: 20,
        name: "James Michael",
        message: "hey! there i'm...",
        time: "12:30 PM",
        unreadCount: 8,
        imgSrc: ChatImage10
    },
];

type PrevChatMessage = {
    id: number;
    sender: "me" | "other";
    text: string;
    time: string;
    avatar?: string;
};

const prevDataData: PrevChatMessage[] = [
    {
        id: 1,
        sender: "other",
        text: "Hi There!",
        time: "6:30 pm",
        avatar: ChatImage11,
    },
    {
        id: 2,
        sender: "me",
        text: "Hello! Nice to meet you! How are you dear..??",
        time: "6:31 pm",
    },
    {
        id: 3,
        sender: "other",
        text: "I am very well. How about you.??",
        time: "6:32 pm",
        avatar: ChatImage11,
    },
    {
        id: 4,
        sender: "me",
        text: "I am also very well. So, How is going on your study.??",
        time: "6:33 pm",
    },
    {
        id: 5,
        sender: "other",
        text: "My study is going nice. Some day ago I have given my final exam. My result also published.",
        time: "6:34 pm",
        avatar: ChatImage11,
    },
    {
        id: 6,
        sender: "me",
        text: "Oh great! How is your result??",
        time: "6:35 pm",
    },
    {
        id: 7,
        sender: "other",
        text: "I have got Golden A+ in the examination.",
        time: "6:36 pm",
        avatar: ChatImage11,
    },
    {
        id: 8,
        sender: "me",
        text: "Wow!! such a good news.",
        time: "6:37 pm",
    },
];


const ChatBox = () => {

    const [prevData, setPrevData] = useState<PrevChatMessage[]>(prevDataData);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });

        }
    }, [prevData]);


    const handleSubmitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true)
        if (!message.trim()) return;

        // Current time 
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        setPrevData((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                sender: "me",
                text: message,
                time: `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`,
            },
        ]);

        setMessage("")
        setTimeout(() => {
            setIsSubmitting(false)
        }, 500);
    }

    return (
        <div className="chat-wrapper grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="card border-0 overflow-hidden !p-0 col-span-12 md:col-span-4 xl:col-span-3">
                <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="">
                            <img src={ChatImage1} alt="image" width={40} height={40} />
                        </div>
                        <div className="">
                            <h6 className="text-base mb-0">Kathryn Murphy</h6>
                            <p className="mb-0 text-neutral-500 dark:text-neutral-100">Available</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical width={20} className='text-neutral-500 dark:text-neutral-100' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className='text-neutral-600 dark:text-neutral-100'>
                                <User width={18} className='text-neutral-600 dark:text-neutral-100' />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-neutral-600 dark:text-neutral-100'>
                                <Settings width={18} className='text-neutral-600 dark:text-neutral-100' />
                                Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Command>
                    <div className="border-t border-neutral-200">
                        <CommandInput placeholder="Search user..." />
                    </div>
                    <CommandList className='max-h-[580px]'>
                        <CommandEmpty>No user name found.</CommandEmpty>
                        <CommandGroup className='p-0'>
                            {chatList.map(({ id, name, message, time, unreadCount, imgSrc, isActive }) => (
                                <CommandItem
                                    key={id}
                                    value={name}
                                    className='p-0'
                                >
                                    <Link
                                        key={id}
                                        to="#"
                                        className={`flex items-center justify-between gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-slate-700 px-6 py-2.5 w-full ${isActive ? "active" : ""}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="img">
                                                <img src={imgSrc} alt={`${name} image`} width={40} height={40} />
                                            </div>
                                            <div className="info">
                                                <h6 className="text-sm mb-1 line-clamp-1">{name}</h6>
                                                <p className="mb-0 text-xs line-clamp-1">{message}</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-end">
                                            <p className="mb-0 text-neutral-400 text-xs lh-1">{time}</p>
                                            {unreadCount > 0 && (
                                                <span className="w-4 h-4 text-xs rounded-full bg-yellow-500 text-white inline-flex items-center justify-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>

            <div className=" col-span-12 md:col-span-8 xl:col-span-9">
                <div className="card border-0 overflow-hidden !p-0 flex flex-col">
                    <div className="flex items-center justify-between gap-2  px-6 py-2.5 active border-b border-neutral-200 dark:border-neutral-600">
                        <div className="flex items-center gap-2">
                            <div className="img">
                                <img src={ChatImage11} alt="image" width={40} height={40} />
                            </div>
                            <div className="info">
                                <h6 className="text-base mb-0">Kathryn Murphy</h6>
                                <p className="mb-0 text-neutral-500 dark:text-neutral-100">Available</p>
                            </div>
                        </div>
                        <div className="action inline-flex items-center gap-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" className="text-xl text-neutral-600 dark:text-neutral-200 flex !p-0 bg-transparent hover:bg-transparent">
                                        <Phone width={20} className='text-neutral-500 dark:text-neutral-100' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Audio Call</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" className="text-xl text-neutral-600 dark:text-neutral-200 flex !p-0 bg-transparent hover:bg-transparent">
                                        <Video width={20} className='text-neutral-500 dark:text-neutral-100' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Video Call</p>
                                </TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <EllipsisVertical width={20} className='text-neutral-500 dark:text-neutral-100' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem className='text-neutral-600 dark:text-neutral-100'>
                                        <CircleX width={20} className='text-neutral-500 dark:text-neutral-100' />
                                        All Clear
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className='text-neutral-600 dark:text-neutral-100'>
                                        <Ban width={20} className='text-neutral-500 dark:text-neutral-100' />
                                        Block
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="chat-message-list max-h-[568px] overflow-y-auto flex flex-col p-6 gap-6">
                        {prevData.map((msg) =>
                            msg.sender === "other" ? (
                                <div
                                    key={msg.id}
                                    className="max-w-[700px] duration-500 text-neutral-900 flex items-end gap-3"
                                >
                                    {msg.avatar && (
                                        <img
                                            src={msg.avatar}
                                            alt="avatar"
                                            className="avatar-lg object-cover rounded-full"
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                    <div className="bg-neutral-50 dark:bg-slate-800 dark:text-white rounded-2xl rounded-es-none p-5">
                                        <p className="mb-3">{msg.text}</p>
                                        <p className="chat-time mb-0 text-xs text-end text-neutral-500 dark:text-neutral-100">
                                            <span>{msg.time}</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={msg.id}
                                    className="max-w-[700px] duration-500 ms-auto text-white"
                                >
                                    <div className="bg-primary rounded-2xl rounded-ee-none p-5">
                                        <p className="mb-3">{msg.text}</p>
                                        <p className="chat-time mb-0 text-xs">
                                            <span>{msg.time}</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <form
                        className="chat-message-box flex items-center justify-between py-4 border-t border-neutral-200 dark:border-neutral-600 mt-auto px-3"
                        onSubmit={handleSubmitMessage}
                    >
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={cn(
                                `border-0 focus:border-0 grow bg-white dark:bg-transparent 
                                focus:outline-none focus:ring-0 py-2 px-3 focus-visible:ring-0 
                                resize-none shadow-none h-5`
                            )}
                            autoComplete="off"
                            name="chatMessage"
                            placeholder="Write message"
                            required
                        />


                        <div className="chat-message-box-action flex items-center gap-4">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label
                                        htmlFor="addAttachment"
                                        className="text-xl flex !p-0 bg-transparent hover:bg-transparent cursor-pointer"
                                    >
                                        <LinkIcon
                                            width={20}
                                            className="text-neutral-500 dark:text-neutral-100 hover:text-primary"
                                        />
                                        <Input type="file" id="addAttachment" hidden />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add Attachment</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label
                                        htmlFor="addImage"
                                        className="text-xl flex !p-0 bg-transparent hover:bg-transparent cursor-pointer"
                                    >
                                        <ImageIcon
                                            width={20}
                                            className="text-neutral-500 dark:text-neutral-100 hover:text-primary"
                                        />
                                        <Input type="file" id="addImage" hidden />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add Image</p>
                                </TooltipContent>
                            </Tooltip>



                            <Button
                                type="submit"
                                className="rounded-lg inline-flex items-center gap-1"
                            >
                                {
                                    isSubmitting ? "Sending" : "Send"
                                }
                                <Send width={20} />
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div >
    );
};

export default ChatBox;
