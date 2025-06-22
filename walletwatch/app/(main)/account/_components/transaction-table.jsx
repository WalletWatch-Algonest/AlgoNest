"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import { Checkbox } from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
const router = useRouter();
const [selectedIds, setSelectedIds] = useState([]);
const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

    console.log(selectedIds);
    
    
    const filteredAndSortedTransactions = transactions;

    const handleSort =(field)=>{
      setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
    };


    const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };


  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  return (
    <div className="space-y-4">
        {/* Filters */}

        {/*Transactions */}
        <div className="rounded-md border">
        <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox checked={
                    selectedIds.length === filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
        onCheckedChange={handleSelectAll}/>
      </TableHead>
      <TableHead className="cursor-pointer"
      onClick={() => handleSort("date")}
      >
        <div className="flex items-center"> Date{sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}</div>
      </TableHead>
      <TableHead>Description</TableHead>
      <TableHead className="cursor-pointer"
      onClick={() => handleSort("category")}
      >
        <div className="flex items-center"> Category{sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}</div>
      </TableHead>
      <TableHead className="cursor-pointer"
      onClick={() => handleSort("amount")}
      >
        <div className="flex items-center justify-normal"> Amount
          {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
        </div>
      </TableHead>
      <TableHead>Recurring</TableHead>
      <TableHead className="w-[50px]" />
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredAndSortedTransactions.length === 0?(
        <TableRow>
            <TableCell colSpan={7}  className="text-center text-muted-foreground">
                No Transactions Found
            </TableCell>
        </TableRow>
    ):(
        filteredAndSortedTransactions.map((transaction)=>(
            <TableRow key={transaction.id}>
      <TableCell >
        <Checkbox checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}/>
      </TableCell>
      <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell className="capitalize">
        <span style={{
          background: categoryColors[transaction.category],
        }}
        className="px-2 py-1 rounded text-white text-sm"
        >{transaction.category}</span>
          </TableCell>
      <TableCell className={cn(
                      "text-right font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    )}>
        {transaction.type === "EXPENSE" ? "-" : "+"}
        ${transaction.amount.toFixed(2)}</TableCell>
        <TableCell>{transaction.isRecurring?(
          <TooltipProvider>
          <Tooltip>
  <TooltipTrigger>
    <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
          <RefreshCw className="h-3 w-3"/>
          {RECURRING_INTERVALS[transaction.recurringInterval]}
          </Badge>
  </TooltipTrigger>
  <TooltipContent>
    <div className="text-sm">
      <div className="font-medium">Next Date:</div>
      <div>{format(new Date(transaction.nextRecurringDate),"PP")}</div>
    </div>
  </TooltipContent>
</Tooltip>
</TooltipProvider>
        ):(<Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3"/>
          One-time</Badge>
        )}</TableCell>
        <TableCell>
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="h-8 w-8 p-0">
      <MoreHorizontal className="h-4 w-4"/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel
      onClick={() =>
        router.push(
          `/transaction/create?edit=${transaction.id}`
        )
      }
    >Edit</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive"
    onClick={() => deleteFn([transaction.id])}
    >Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </TableCell>
    </TableRow>
        ))
    )}
  </TableBody>
</Table>
</div>
    </div>
  );
};

export default TransactionTable;