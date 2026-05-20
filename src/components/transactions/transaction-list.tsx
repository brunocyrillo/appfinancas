"use client";

import { useState } from "react";
import { TransactionItem } from "./transaction-item";
import { TransactionForm } from "./transaction-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Receipt } from "lucide-react";
import { CATEGORIES, type Transaction } from "@/types";
import { Separator } from "@/components/ui/separator";

interface TransactionListProps {
  transactions: Transaction[];
  showFilters?: boolean;
}

export function TransactionList({
  transactions,
  showFilters = true,
}: TransactionListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44 h-9">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto">
            <Button
              size="sm"
              onClick={() => setFormOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova transação
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Receipt className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma transação encontrada</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 gap-2"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar transação
          </Button>
        </div>
      ) : (
        <div>
          {filtered.map((t, i) => (
            <div key={t.id}>
              <TransactionItem transaction={t} />
              {i < filtered.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      )}

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
