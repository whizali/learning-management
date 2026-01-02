"use client";

import Loading from "@/components/Loading";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React, { useState, useMemo } from "react";
import { CreditCard, DollarSign, Receipt, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UserBilling = () => {
  const [paymentType, setPaymentType] = useState("all");
  const { user, isLoaded } = useUser();
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetTransactionsQuery(user?.id || "", {
      skip: !isLoaded || !user,
    });

  const filteredData =
    transactions?.filter((transaction) => {
      const matchesTypes =
        paymentType === "all" || transaction.paymentProvider === paymentType;
      return matchesTypes;
    }) || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalSpent: 0, transactionCount: 0, avgTransaction: 0 };
    }

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = transactions.length;
    const avgTransaction = totalSpent / transactionCount;

    return { totalSpent, transactionCount, avgTransaction };
  }, [transactions]);

  if (!isLoaded) return <Loading />;
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
            <p className="text-gray-600 mb-4">Sign in to view your billing information and transaction history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <p className="text-gray-400 dark:text-gray-400">Manage your payment history and view transaction details</p>
      </div>

      {/* Stats Cards */}
      {transactions && transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                    {formatPrice(stats.totalSpent)}
                  </p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Transactions</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{stats.transactionCount}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg. Transaction</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                    {formatPrice(stats.avgTransaction)}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Transaction History</CardTitle>
              <CardDescription className="mt-1">View all your payment transactions and receipts</CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : filteredData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Amount
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((transaction) => (
                    <TableRow key={transaction.transactionId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        {new Date(transaction.dateTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {transaction.paymentProvider}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Receipt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                {paymentType === "all" 
                  ? "You haven't made any purchases yet. Your transaction history will appear here."
                  : `No ${paymentType} transactions found. Try selecting a different payment type.`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBilling;