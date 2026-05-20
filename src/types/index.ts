export type TransactionType = "income" | "expense";

export type Category =
  | "alimentacao"
  | "transporte"
  | "saude"
  | "educacao"
  | "lazer"
  | "moradia"
  | "vestuario"
  | "salario"
  | "freelance"
  | "investimentos"
  | "outros";

export const CATEGORIES: { value: Category; label: string; type: TransactionType[] }[] = [
  { value: "salario", label: "Salário", type: ["income"] },
  { value: "freelance", label: "Freelance", type: ["income"] },
  { value: "investimentos", label: "Investimentos", type: ["income"] },
  { value: "alimentacao", label: "Alimentação", type: ["expense"] },
  { value: "transporte", label: "Transporte", type: ["expense"] },
  { value: "saude", label: "Saúde", type: ["expense"] },
  { value: "educacao", label: "Educação", type: ["expense"] },
  { value: "lazer", label: "Lazer", type: ["expense"] },
  { value: "moradia", label: "Moradia", type: ["expense"] },
  { value: "vestuario", label: "Vestuário", type: ["expense"] },
  { value: "outros", label: "Outros", type: ["income", "expense"] },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: "#f97316",
  transporte: "#3b82f6",
  saude: "#ec4899",
  educacao: "#8b5cf6",
  lazer: "#f59e0b",
  moradia: "#06b6d4",
  vestuario: "#84cc16",
  salario: "#22c55e",
  freelance: "#10b981",
  investimentos: "#6366f1",
  outros: "#94a3b8",
};

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  date: string;
  created_at: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  date: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryExpense {
  category: Category;
  label: string;
  amount: number;
  color: string;
}
