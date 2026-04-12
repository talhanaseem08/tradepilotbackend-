import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import ItemImage1 from "@/assets/images/product/product-img1.png";
import ItemImage2 from "@/assets/images/product/product-img2.png";
import ItemImage3 from "@/assets/images/product/product-img3.png";
import ItemImage4 from "@/assets/images/product/product-img4.png";
import ItemImage5 from "@/assets/images/product/product-img5.png";

interface sellingProductType {
  name: string;
  category: string;
  image: string;
  price: string;
  discount: string;
  sold: number;
  totalOrders: number;
}

const sellingProduct:sellingProductType[] = [
  {
    name: "Blue t-shirt",
    category: "Fashion",
    image: ItemImage1,
    price: "$400.00",
    discount: "15%",
    sold: 300,
    totalOrders: 70,
  },
  {
    name: "Nike Air Shoe",
    category: "Fashion",
    image: ItemImage2,
    price: "$150.00",
    discount: "N/A",
    sold: 200,
    totalOrders: 70,
  },
  {
    name: "Woman Dresses",
    category: "Fashion",
    image: ItemImage3,
    price: "$300.00",
    discount: "$50.00",
    sold: 1400,
    totalOrders: 70,
  },
  {
    name: "Smart Watch",
    category: "Fashion",
    image: ItemImage4,
    price: "$400.00",
    discount: "$50.00",
    sold: 700,
    totalOrders: 70,
  },
  {
    name: "Hoodie Rose",
    category: "Fashion",
    image: ItemImage5,
    price: "$300.00",
    discount: "25%",
    sold: 400,
    totalOrders: 70,
  },
];

const TopSellingProductTable = () => {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto border-spacing-0 border-separate">
        {/* Table Header */}
        <TableHeader>
          <TableRow className="border-0">
            <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
              Items
            </TableHead>
            <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
              Price
            </TableHead>
            <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
              Discount
            </TableHead>
            <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
              Sold
            </TableHead>
            <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
              Total Orders
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {sellingProduct.map((product, index) => {
            const isLastRow = index === sellingProduct.length - 1;

            return (
              <TableRow key={index}>
                {/* Item Column */}
                <TableCell
                  className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                    }`}
                >
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="shrink-0 me-3 rounded-lg"
                    />
                    <div className="grow">
                      <h6 className="text-base mb-0 font-normal">{product.name}</h6>
                      <span className="text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Price Column */}
                <TableCell
                  className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                    }`}
                >
                  {product.price}
                </TableCell>

                {/* Discount Column */}
                <TableCell
                  className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                    }`}
                >
                  {product.discount}
                </TableCell>

                {/* Sold Column */}
                <TableCell
                  className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-bl-lg" : ""
                    }`}
                >
                  {product.sold}
                </TableCell>

                {/* Total Orders Column */}
                <TableCell
                  className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${isLastRow ? "rounded-br-lg" : ""
                    } text-center`}
                >
                  <span className="bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 px-8 py-1.5 rounded-full font-medium text-sm">
                    {product.totalOrders}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopSellingProductTable;

