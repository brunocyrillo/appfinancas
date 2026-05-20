import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Shield,
  PieChart,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const features = [
    {
      icon: TrendingUp,
      title: "Receitas e despesas",
      description:
        "Registre todas as suas movimentações com categorias e acompanhe o saldo em tempo real.",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: PieChart,
      title: "Gráficos visuais",
      description:
        "Veja como seu dinheiro está sendo gasto por categoria com gráficos claros e intuitivos.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: BarChart3,
      title: "Histórico mensal",
      description:
        "Analise seus gastos mês a mês e identifique padrões para melhorar suas finanças.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">F</span>
            </div>
            <span className="font-semibold text-foreground">FinançasPessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Ir para Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Criar conta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
          <CheckCircle className="h-3.5 w-3.5" />
          Gratuito e sem limites
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Controle suas
          <br />
          <span className="text-primary">finanças pessoais</span>
          <br />
          de forma simples
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Registre receitas e despesas, visualize gráficos e tenha o controle
          total do seu dinheiro — tudo em um só lugar.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {user ? (
            <Button size="lg" asChild className="gap-2">
              <Link href="/dashboard">
                Acessar Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild className="gap-2">
                <Link href="/register">
                  Começar gratuitamente <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10">
          Tudo que você precisa para organizar seu dinheiro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  bg
                )}
              >
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-primary rounded-2xl p-10 text-center space-y-4">
            <div className="flex justify-center">
              <Shield className="h-10 w-10 text-primary-foreground/80" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground">
              Comece hoje mesmo
            </h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Crie sua conta em segundos e comece a controlar suas finanças de
              forma inteligente.
            </p>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link href="/register">
                Criar conta grátis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">F</span>
            </div>
            <span>FinançasPessoais</span>
          </div>
          <p>Gerencie suas finanças com simplicidade.</p>
        </div>
      </footer>
    </div>
  );
}
