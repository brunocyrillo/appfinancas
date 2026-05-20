import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">FinançasPessoais</h1>
        <p className="text-slate-500 mt-1 text-sm">Controle suas finanças de forma simples</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
