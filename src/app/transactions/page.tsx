import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTransactions } from "@/app/actions/transactions";
import { TransactionList } from "@/components/transactions/transaction-list";
import { MonthNavigator } from "@/components/dashboard/month-navigator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/dashboard/navbar";
import { getMonthRange } from "@/lib/utils";
import type { Transaction } from "@/types";

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

async function TransactionsContent({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const month =
    params.month !== undefined ? parseInt(params.month) : now.getMonth();
  const year =
    params.year !== undefined ? parseInt(params.year) : now.getFullYear();
  const currentDate = new Date(year, month, 1);

  const { start, end } = getMonthRange(currentDate);
  const { data: transactions } = await getTransactions({
    startDate: start,
    endDate: end,
  });
  const txList: Transaction[] = transactions ?? [];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Transações</h1>
            <p className="text-sm text-muted-foreground">
              {txList.length} transaç{txList.length !== 1 ? "ões" : "ão"} no período
            </p>
          </div>
          <Suspense fallback={null}>
            <MonthNavigator currentDate={currentDate} />
          </Suspense>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Todas as transações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TransactionList transactions={txList} showFilters={true} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function TransactionsPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted/30">
          <div className="h-16 bg-card border-b" />
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-48" />
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      }
    >
      <TransactionsContent {...props} />
    </Suspense>
  );
}
