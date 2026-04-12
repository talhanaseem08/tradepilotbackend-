import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const SearchBox = () => {
    return (
        <Dialog>
            <DialogTrigger className=" md:flex hidden">
                <InputGroup className="border border-neutral-300 dark:border dark:border-slate-600 !bg-transparent shadow-none">
                    <InputGroupInput placeholder="Search..." readOnly />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </DialogTrigger>
             <DialogContent className={cn('p-0 !max-w-[620px] overflow-hidden')}>
                <DialogTitle className='hidden'>Search...</DialogTitle>
                <Command>
                    <CommandInput placeholder="Type a command or search..." className={cn('pe-6')} />
                    <CommandList className='scrollbar-thin max-h-[400px]'>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Application" className="mt-2">
                            <CommandItem className="p-0">
                                <Link to="/email" className='py-2 px-3 w-full'> 
                                    Email
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/chat" className='py-2 px-3 w-full'> 
                                    Chat
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/calendar" className='py-2 px-3 w-full'> 
                                    Calendar
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator className="my-2" />
                        <CommandGroup heading="UI Elements">
                            <CommandItem className="p-0">
                                <Link to="/typography" className='py-2 px-3 w-full'> 
                                    Typography
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/colors" className='py-2 px-3 w-full'> 
                                    Colors
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/buttons" className='py-2 px-3 w-full'> 
                                    Button
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/dropdown" className='py-2 px-3 w-full'> 
                                    Dropdown
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/alert" className='py-2 px-3 w-full'> 
                                    Alert
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator className="my-2" />
                        <CommandGroup heading="Auth">
                            <CommandItem className="p-0">
                                <Link to="/signIn" className='py-2 px-3 w-full'> 
                                    Sign In
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/signUp" className='py-2 px-3 w-full'> 
                                    Sign Up
                                </Link>
                            </CommandItem>
                            <CommandItem className="p-0">
                                <Link to="/forgotPassword" className='py-2 px-3 w-full'> 
                                    Forgot Password
                                </Link>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default SearchBox;