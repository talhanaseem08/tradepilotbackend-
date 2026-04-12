import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ProjectStatus {
  name: string;
  duration: string;
  progressBg: string;
  stock: string;
};

const projectStates: ProjectStatus[] = [
  {
    name: "Gold",
    duration: "2 Months",
    progressBg: "bg-red-600",
    stock: "30%",
  },
  {
    name: "Dollars",
    duration: "3 Months",
    progressBg: "bg-yellow-600",
    stock: "50%",
  },
  {
    name: "Stock Market",
    duration: "1 Months",
    progressBg: "bg-cyan-600",
    stock: "60%",
  },
  {
    name: "Dimond",
    duration: "5 Months",
    progressBg: "bg-green-600",
    stock: "80%",
  },
  {
    name: "S&P 400",
    duration: "4 Months",
    progressBg: "bg-primary",
    stock: "70%",
  },
];

const ProjectStatusTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-start rounded-tl-lg">
            Name
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
            Duration
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center text-center rounded-tr-lg">
            Stock
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectStates.map((order, index) => {
          const isLast = index === projectStates.length - 1;
          return (
            <TableRow key={index}>
              <TableCell
                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-start ${isLast ? "rounded-bl-lg" : ""
                  }`}
              >
                {order.name}
              </TableCell>
              <TableCell
                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                  }`}
              >
                {order.duration}
              </TableCell>
              <TableCell
                className={`py-3 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${isLast ? "rounded-bl-lg" : ""
                  }`}
              >
                <div className="mx-auto text-center space-y-1">
                  <div className="w-[66px] mx-auto">
                    <div className="rounded-full h-2 bg-gray-200 dark:bg-neutral-700">
                      <div
                        className={`${order.progressBg} h-2 rounded-full`}
                        style={{ width: `${order.stock}` }}
                      ></div>
                    </div>
                  </div>
                  <span className="">{order.stock}</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProjectStatusTable;
