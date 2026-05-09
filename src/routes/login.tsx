import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Hotel as HotelIcon } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Stayly" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

function LoginPage() {
  const { t } = useTranslation();
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate({ to: "/admin-dashboard" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok) {
        toast.error(t("auth.invalid"));
        setLoading(false);
        return;
      }
      toast.success(t("auth.loggedIn", { name: email.split("@")[0] }));
      // Navigation will happen in useEffect
    } catch (error) {
      toast.error(t("auth.invalid"));
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold">{t("auth.loginTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSub")}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label={t("auth.email")} error={errors.email}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label={t("auth.password")} error={errors.password}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{t("auth.submitLogin")}</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link to="/register" className="text-primary hover:underline">{t("auth.toRegister")}</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md animate-fade-in items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            <HotelIcon className="h-6 w-6" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-semibold">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
