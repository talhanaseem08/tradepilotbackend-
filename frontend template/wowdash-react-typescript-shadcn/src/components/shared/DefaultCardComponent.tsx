import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface ButtonCardProps {
  title: string;
  children: ReactNode;
};

const DefaultCardComponent = ({ title, children }: ButtonCardProps) => {
  return (
    <Card className="card h-full !p-0 !block border-0 overflow-hidden">
      <CardHeader className="border-b !block border-neutral-200 dark:border-slate-600 !py-4 px-6">
        <CardTitle className="text-lg font-semibold capitalize">{title}</CardTitle>
      </CardHeader>
      <CardContent className="card-body p-6">
        {children}
      </CardContent>
    </Card>
  );
};
export default DefaultCardComponent;
