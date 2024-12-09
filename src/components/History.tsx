/* eslint-disable */
import { useEffect, useState } from "react";
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Coins,
  ExternalLink,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";

// Mock data for demonstration
const transactions = [
  {
    id: "1",
    type: "Sell",
    tokenFrom: {
      symbol: "GOLD",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    },
    tokenTo: {
      symbol: "METIS",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    amount: "0.5 GOLD",
    amountTo: "750 METIS",
    date: "2023-05-10T14:30:00Z",
    status: "Completed",
  },
  {
    id: "2",
    type: "Buy",
    tokenFrom: {
      symbol: "METIS",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    tokenTo: {
      symbol: "GOLD",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    },
    amount: "100 METIS",
    amountTo: "25 GOLD",
    date: "2023-05-09T10:15:00Z",
    status: "Completed",
  },
  {
    id: "3",
    type: "Sell",
    tokenFrom: {
      symbol: "GOLD",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    },
    tokenTo: {
      symbol: "METIS",
      logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    amount: "2 GOLD",
    amountTo: "100 METIS",
    date: "2023-05-08T18:45:00Z",
    status: "Completed",
  },
];

interface HistoryType {
  tx_hash: string;
  from: string;
  to: string;
  timestamp: string;
  type: string;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

const ITEMS_PER_PAGE = 8;

export default function History() {
  const [filter, setFilter] = useState("all");
  const [historyData, setHistoryData] = useState<HistoryType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { address } = useAccount();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!address) return;
      const response = await fetch(
        `https://dgt-dev.vercel.app/v1/token/txs?addr=${address}`
      );
      if (response.ok) {
        const result = await response.json();
        setHistoryData(result);
      }
    };

    fetchHistory();
  }, [address]);

  const filteredTransactions = historyData.filter((tx) => {
    if (filter === "all") return true;
    return tx.type.toLowerCase() === filter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="p-0 w-full bg-transparent	border-0">
      <CardHeader className="py-4 px-0">
        <CardTitle className="text-2xl font-bold text-grad">
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex justify-between items-center mb-5">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-[#282E3A] text-white">
              <SelectValue placeholder="Filter transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="buy">Buys</SelectItem>
              <SelectItem value="sell">Sells</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="btn-grad border-0">
            Export CSV
          </Button>
        </div>
        <Table className="bg-[#282e3a] rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">From</TableHead>
              <TableHead className="text-white">To</TableHead>
              {/* <TableHead className="text-white">Assets</TableHead>
              <TableHead className="text-white">Amount</TableHead> */}
              <TableHead className="text-white">Date</TableHead>
              {/* <TableHead className="text-white">Status</TableHead> */}
              <TableHead className="text-right text-white">Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((tx) => (
              <TableRow key={tx.tx_hash}>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-white ${
                      tx.type === "sell" ? "bg-[#cc0000]" : "bg-[#006e2e]"
                    }`}
                  >
                    {tx.type === "sell" ? (
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                    ) : (
                      <Coins className="w-4 h-4 mr-1" />
                    )}
                    {`${tx.type.slice(0, 1).toUpperCase()}${tx.type.slice(1)}`}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  <Link
                    href={`https://sepolia.uniscan.xyz/address/${tx.from}`}
                    target="_blank"
                  >
                    {truncateAddress(tx.from)}
                  </Link>
                </TableCell>
                <TableCell className="text-white">
                  <Link
                    href={`https://sepolia.uniscan.xyz/address/${tx.to}`}
                    target="_blank"
                  >
                    {truncateAddress(tx.to)}
                  </Link>
                </TableCell>
                {/* <TableCell>
                  <div className="flex items-center space-x-2 text-white">
                    <Avatar className="w-6 h-6">
                      <Image
                        src={tx.tokenFrom.logo_url}
                        alt={tx.tokenFrom.symbol}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span>{tx.tokenFrom.symbol}</span>
                    <ArrowRightLeft className="w-4 h-4" />
                    <Avatar className="w-6 h-6">
                      <Image
                        src={tx.tokenTo.logo_url}
                        alt={tx.tokenTo.symbol}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <span>{tx.tokenTo.symbol}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {tx.amount}
                  <br />
                  <span className="text-sm text-[#9B9B9B]">{tx.amountTo}</span>
                </TableCell> */}
                <TableCell className="text-white">
                  {new Date(tx.timestamp).toLocaleString()}
                </TableCell>
                {/* <TableCell>
                  <Badge
                    variant={
                      tx.status === "Completed" ? "default" : "destructive"
                    }
                  >
                    {tx.status}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right text-white">
                  <Button variant="ghost" size="sm">
                    <Link
                      href={`https://sepolia.uniscan.xyz/tx/${tx.tx_hash}`}
                      target="_blank"
                      className="flex gap-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-white">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="text-white btn-grad"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-white btn-grad"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
