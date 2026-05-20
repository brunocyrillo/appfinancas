import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTransactions } from "@/app/actions/transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { MonthNavigator } from "@/components/dashboard/month-navigator";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/dashboard/navbar";
import { getMonthRange } from "@/lib/utils";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  type CategoryExpense,
  type MonthlySummary,
  type Transaction,
} from "@/types";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

async function DashboardContent({ searchParams }: PageProps) {
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

  const summary: MonthlySummary = txList.reduce(
    (acc, t) => {
      if (t.type === "income") acc.totalIncome += t.amount;
      else acc.totalExpense += t.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );
  summary.balance = summary.totalIncome - summary.totalExpense;

  const expensesByCategory: CategoryExpense[] = CATEGORIES.filter((c) =>
    c.type.includes("expense")
  )
    .map((cat) => ({
      category: cat.value,
      label: cat.label,
      amount: txList
        .filter((t) => t.type === "expense" && t.category === cat.value)
        .reduce((sum, t) => sum + t.amount, 0),
      color: CATEGORY_COLORS[cat.value],
    }))
    .filter((c) => c.amount > 0);

  const recentTransactions = txList.slice(0, 5);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Visão geral do seu mês financeiro
            </p>
          </div>
          <Suspense fallback={null}>
            <MonthNavigator currentDate={currentDate} />
          </Suspense>
        </div>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <ExpenseChart data={expensesByCategory} />
          </div>
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Últimas transações
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="gap-1 text-xs text-primary"
                >
                  <Link href="/transactions">
                    Ver todas <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <TransactionList
                  transactions={recentTransactions}
                  showFilters={false}
                />
                {txList.length === 0 && (
                  <div className="flex justify-center pt-2">
                    <Button size="sm" asChild className="gap-2">
                      <Link href="/transactions">
                        <Plus className="h-4 w-4" />
                        Adicionar primeira transação
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted/30">
          <div className="h-16 bg-card border-b" />
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="h-8 bg-muted rounded animate-pulse w-48" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DashboardContent {...props} />
    </Suspense>
  );
}
