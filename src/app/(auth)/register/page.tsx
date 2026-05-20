import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
        <p className="text-slate-500 mt-1 text-sm">Comece a controlar suas finanças hoje</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-slate-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
