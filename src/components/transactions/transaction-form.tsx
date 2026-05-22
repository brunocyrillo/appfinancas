"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createTransaction, updateTransaction } from "@/app/actions/transactions";
import { CATEGORIES, type Transaction, type TransactionFormData, type Category, type TransactionType } from "@/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

const today = new Date().toISOString().split("T")[0];

function parseBRAmount(str: string): number {
  let s = str.trim();
  if (s.includes(".") && s.includes(",")) {
    // Formato BR: 1.500,00 → remove pontos, troca vírgula por ponto
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    // Só vírgula: 1500,00 → 1500.00
    s = s.replace(",", ".");
  } else if (s.includes(".")) {
    // Só ponto: verifica se é separador de milhar (3 dígitos após o último ponto)
    const afterDot = s.substring(s.lastIndexOf(".") + 1);
    if (afterDot.length === 3) {
      s = s.replace(/\./g, ""); // 10.000 → 10000
    }
    // Senão mantém como decimal: 10.50 → 10.50
  }
  return parseFloat(s);
}

export function TransactionForm({ open, onClose, transaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? "");
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [category, setCategory] = useState<Category | "">(transaction?.category ?? "");
  const [date, setDate] = useState(transaction?.date ?? today);

  const filteredCategories = CATEGORIES.filter((c) => c.type.includes(type));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) {
      toast({ variant: "destructive", title: "Selecione uma categoria" });
      return;
    }
    const parsedAmount = parseBRAmount(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ variant: "destructive", title: "Valor inválido", description: 'Ex: 1.500,00 ou 1500,00' });
      return;
    }

    setLoading(true);
    const formData: TransactionFormData = {
      type,
      amount: parsedAmount,
      description,
      category: category as Category,
      date,
    };

    const result = transaction
      ? await updateTransaction(transaction.id, formData)
      : await createTransaction(formData);

    if (result.error) {
      toast({ variant: "destructive", title: "Erro", description: result.error });
    } else {
      toast({ title: transaction ? "Transação atualizada!" : "Transação criada!" });
      onClose();
    }
    setLoading(false);
  }

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategory("");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "py-2 rounded-md text-sm font-medium border transition-colors",
                type === "expense"
                  ? "bg-red-50 dark:bg-red-950 border-red-300 text-red-700 dark:text-red-400"
                  : "bg-background border-border text-muted-foreground hover:bg-accent"
              )}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={cn(
                "py-2 rounded-md text-sm font-medium border transition-colors",
                type === "income"
                  ? "bg-green-50 dark:bg-green-950 border-green-300 text-green-700 dark:text-green-400"
                  : "bg-background border-border text-muted-foreground hover:bg-accent"
              )}
            >
              Receita
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00  ex: 1.500,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Salvando..." : transaction ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
