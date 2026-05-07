import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Stayly" }] }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      const ok = await register(name, email, password);
      if (!ok) {
        toast.error("Account with this email already exists.");
        return;
      }
      toast.success(t("auth.registered", { name: name.split(" ")[0] }));
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold">{t("auth.registerTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("auth.registerSub")}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label={t("auth.name")} error={errors.name}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label={t("auth.email")} error={errors.email}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label={t("auth.password")} error={errors.password}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Button type="submit" size="lg" className="w-full">{t("auth.submitRegister")}</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline">{t("auth.toLogin")}</Link>
      </p>
    </AuthShell>
  );
}
