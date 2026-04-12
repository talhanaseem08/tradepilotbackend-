import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash } from "lucide-react";
import React, { useState } from "react";

import IconPdf from "@/assets/images/home-eight/icon-pdf.png";
import IconText from "@/assets/images/home-eight/icon-text.png";
import CommonLink from "@/components/shared/CommonLink";
import { toast } from 'react-toastify';

interface DocumentItem {
    id: number;
    name: string;
    size: string;
    icon: string;
}

const initialDocuments: DocumentItem[] = [
    {
        id: 1,
        name: "Checkup Result.pdf",
        size: "2.5mb",
        icon: IconPdf
    },
    {
        id: 2,
        name: "Checkup Result.doc",
        size: "2mb",
        icon: IconText
    },
    {
        id: 3,
        name: "Prescription.pdf",
        size: "3mb",
        icon: IconPdf
    },
    {
        id: 4,
        name: "Xray Result.doc",
        size: "3mb",
        icon: IconText
    },
    {
        id: 5,
        name: "Glucose Level Report.pdf",
        size: "3mb",
        icon: IconPdf
    },
    {
        id: 6,
        name: "Checkup Result.doc",
        size: "2mb",
        icon: IconText
    },
];

const HealthReportsDocumentCard: React.FC = () => {

    const [items, setItems] = useState<DocumentItem[]>(initialDocuments);

    const handleRemoveItem = (id: number) => {
        const filteredItems = items.filter((item) => id !== item.id)
        setItems(filteredItems);
        toast.success('Deleted Successfully!')
    }

    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Health Reports Document</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="card-body py-4 px-6">
                        <div className="flex flex-col gap-4">
                            {items.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <img src={doc.icon} alt={doc.name} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="text-base mb-0 font-normal">{doc.name}</h6>
                                            <span className="text-xs text-gray-600 dark:text-neutral-100 font-normal">
                                                {doc.size}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveItem(doc.id)}
                                            className="w-8 h-8 flex justify-center items-center text-center bg-red-600/10 hover:bg-red-600 hover:text-white duration-300 active:scale-75 text-red-600 dark:text-red-500 dark:hover:text-white    rounded-full"
                                        >
                                            <Trash width={18} />
                                        </Button>
                                        <Button
                                            type="button"
                                            className="w-8 h-8 flex justify-center items-center text-center bg-green-600/10 hover:bg-green-600 hover:text-white duration-300 active:scale-75 text-green-600 dark:text-green-500 dark:hover:text-white    rounded-full"
                                        >
                                            <Download width={18} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HealthReportsDocumentCard;
