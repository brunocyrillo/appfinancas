"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TransactionFormData } from "@/types";

export async function getTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Não autenticado" };

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (filters?.startDate) query = query.gte("date", filters.startDate);
  if (filters?.endDate) query = query.lte("date", filters.endDate);
  if (filters?.category && filters.category !== "all") query = query.eq("category", filters.category);
  if (filters?.type && filters.type !== "all") query = query.eq("type", filters.type);

  const { data, error } = await query;
  return { data, error: error?.message };
}

export async function createTransaction(formData: TransactionFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    type: formData.type,
    amount: formData.amount,
    description: formData.description,
    category: formData.category,
    date: formData.date,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function updateTransaction(id: string, formData: TransactionFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("transactions")
    .update({
      type: formData.type,
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
      date: formData.date,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}
