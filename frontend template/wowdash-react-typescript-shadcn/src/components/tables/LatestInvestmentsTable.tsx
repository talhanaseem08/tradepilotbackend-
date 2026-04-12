import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import AssetImage1 from "@/assets/images/asset/asset-img1.png";
import AssetImage2 from "@/assets/images/asset/asset-img2.png";
import AssetImage3 from "@/assets/images/asset/asset-img3.png";
import AssetImage4 from "@/assets/images/asset/asset-img4.png";
import AssetImage5 from "@/assets/images/asset/asset-img5.png";
import { Badge } from "../ui/badge";

interface AssetOrder {
  image: string;
  name: string;
  subText: string;
  quantity: string;
  unit: string;
  price: string;
  date: string;
  status: "Completed" | "In Progress";
  statusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "danger";
};

const orders: AssetOrder[] = [
  {
    image: AssetImage1,
    name: "Gold",
    subText: "Main Asset",
    quantity: "7400",
    unit: "Ounces",
    price: "$7,400.00",
    date: "25 May 2024",
    status: "Completed",
    statusVariant: "success",
  },
  {
    image: AssetImage2,
    name: "Dollars",
    subText: "Currency",
    quantity: "5,40,000",
    unit: "Dollars",
    price: "$5,40,000.00",
    date: "25 May 2024",
    status: "In Progress",
    statusVariant: "warning",
  },
  {
    image: AssetImage3,
    name: "Stock Market",
    subText: "Product",
    quantity: "1400",
    unit: "Products",
    price: "$50,000.00",
    date: "25 May 2024",
    status: "Completed",
    statusVariant: "success",
  },
  {
    image: AssetImage4,
    name: "Diamond",
    subText: "Asset",
    quantity: "350",
    unit: "Ounces",
    price: "$30,000.00",
    date: "25 May 2024",
    status: "In Progress",
    statusVariant: "warning",
  },
  {
    image: AssetImage5,
    name: "S&P 400",
    subText: "Index",
    quantity: "24,000",
    unit: "Shares",
    price: "$63,000.00",
    date: "25 May 2024",
    status: "Completed",
    statusVariant: "success",
  },
];

const LatestInvestmentsTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 rounded-tl-lg">
            Asset
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600">
            Quantity
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
            Price
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 text-center">
            Date
          </TableHead>
          <TableHead className="bg-neutral-100 dark:bg-slate-700 first:border-s last:border-e text-base px-4 h-12 border-t border-neutral-200 dark:border-slate-600 rounded-tr-lg text-center">
            Total Orders
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => {
          const isLast = index === orders.length - 1;
          return (
            <TableRow key={index}>
              <TableCell
                className={`py-3.5 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 ${
                  isLast ? "rounded-bl-lg" : ""
                }`}
              >
                <div className="flex items-center">
                  <img
                    src={order.image}
                    alt={order.name}
                    width={40}
                    height={40}
                    className="me-3 rounded-lg"
                  />
                  <div>
                    <h6 className="text-base mb-0 font-normal font-semibold">
                      {order.name}
                    </h6>
                    <span className="text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                      {order.subText}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600">
                <h6 className="text-base mb-0 font-normal font-semibold">
                  {order.quantity}
                </h6>
                <span className="text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                  {order.unit}
                </span>
              </TableCell>
              <TableCell className="py-3.5 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center">
                {order.price}
              </TableCell>
              <TableCell className="py-3.5 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center">
                {order.date}
              </TableCell>
              <TableCell
                className={`py-3.5 px-4 first:border-s last:border-e border-b border-neutral-200 dark:border-slate-600 text-center ${
                  isLast ? "rounded-br-lg" : ""
                }`}
              >
                <Badge variant={order.statusVariant}>{order.status}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LatestInvestmentsTable;
