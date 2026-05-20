"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "@/lib/utils";

interface MonthNavigatorProps {
  currentDate: Date;
}

export function MonthNavigator({ currentDate }: MonthNavigatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(direction: -1 | 1) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newDate.getMonth().toString());
    params.set("year", newDate.getFullYear().toString());
    router.push(`?${params.toString()}`);
  }

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-slate-700 min-w-[140px] text-center capitalize">
        {formatMonthYear(currentDate)}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigate(1)}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
