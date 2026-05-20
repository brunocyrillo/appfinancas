"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from "./transaction-form";
import { deleteTransaction } from "@/app/actions/transactions";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORIES, CATEGORY_COLORS, type Transaction } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const categoryLabel =
    CATEGORIES.find((c) => c.value === transaction.category)?.label ??
    transaction.category;
  const color = CATEGORY_COLORS[transaction.category] ?? "#94a3b8";

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteTransaction(transaction.id);
    if (result.error) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: result.error });
    } else {
      toast({ title: "Transação excluída" });
      setDeleteOpen(false);
    }
    setDeleting(false);
  }

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-4 hover:bg-accent/40 rounded-lg transition-colors group">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {transaction.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {categoryLabel} · {formatDate(transaction.date)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={transaction.type === "income" ? "income" : "expense"}
            className="text-xs hidden sm:flex"
          >
            {transaction.type === "income" ? "Receita" : "Despesa"}
          </Badge>
          <span
            className={`text-sm font-semibold tabular-nums ${
              transaction.type === "income"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <TransactionForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        transaction={transaction}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir transação</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{" "}
            <strong className="text-foreground">{transaction.description}</strong>? Esta
            ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
