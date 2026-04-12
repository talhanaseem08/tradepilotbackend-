import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface sellingProductType {
    name: string;
    price: string;
    stockLabel: string;
    stockPercent: number;
    color: string;
}

const sellingProduct:sellingProductType[] = [
  {
    name: "Nike Air Shoes",
    price: "$400.00",
    stockLabel: "Out of Stock",
    stockPercent: 10,
    color: "bg-red-600",
  },
  {
    name: "Nike Air Shoes",
    price: "$300.00",
    stockLabel: "18 Low Stock",
    stockPercent: 40,
    color: "bg-yellow-500",
  },
  {
    name: "Nike Air Shoes",
    price: "$400.00",
    stockLabel: "80 High Stock",
    stockPercent: 80,
    color: "bg-green-600",
  },
  {
    name: "Nike Air Shoes",
    price: "$300.00",
    stockLabel: "50 High Stock",
    stockPercent: 50,
    color: "bg-green-600",
  },
  {
    name: "Nike Air Shoes",
    price: "$150.00",
    stockLabel: "70 High Stock",
    stockPercent: 70,
    color: "bg-green-600",
  },
];

const StockReportTable = () => {
  return (
    <Table className="table-auto border-spacing-0 border-separate">
      <TableHeader>
        <TableRow className="border-0">
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg">
            Items
          </TableHead>
          <TableHead className="px-4 h-12 bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">
            Price
          </TableHead>
          <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">
            Stock
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sellingProduct.map((product, index) => {
          const isLast = index === sellingProduct.length - 1;
          return (
            <TableRow key={index}>
              {/* Item */}
              <TableCell
                className={`py-5 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                  }`}
              >
                {product.name}
              </TableCell>

              {/* Price */}
              <TableCell className="py-5 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                {product.price}
              </TableCell>

              {/* Stock */}
              <TableCell
                className={`py-5 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-br-lg" : ""
                  }`}
              >
                <div className="max-w-[100px] mx-auto space-y-1">
                  <div className="w-full h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${product.color}`}
                      style={{ width: `${product.stockPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground block text-center dark:text-white">
                    {product.stockLabel}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StockReportTable;
