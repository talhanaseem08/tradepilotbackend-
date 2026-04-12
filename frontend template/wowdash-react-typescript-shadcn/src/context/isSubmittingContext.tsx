import { createContext, useContext, useState } from "react";

type IsSubmittingContextType = {
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

const IsSubmittingContext = createContext<IsSubmittingContextType | null>(null);

export const IsSubmittingContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <IsSubmittingContext.Provider value={{ isSubmitting, setIsSubmitting }}>
            {children}
        </IsSubmittingContext.Provider>
    );
};

export const useIsSubmitting = () => {
    const context = useContext(IsSubmittingContext);

    if (!context) {
        throw new Error(
            "useIsSubmitting must be used within IsSubmittingContextProvider"
        );
    }

    return context;
};