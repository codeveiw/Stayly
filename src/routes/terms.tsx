import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from "react-i18next";
import { Copy, Scale, ShieldCheck } from "lucide-react";

export const Route = createFileRoute('/terms')({
  head: () => ({ meta: [{ title: "Terms and Conditions — Stayly" }] }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col animate-fade-in bg-muted/10">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{t("terms.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("terms.lastUpdated")} October 15, 2023</p>
        </header>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-10 flex flex-wrap gap-4 pt-4">
            <Pill icon={<Scale />} title={t("terms.governance")} />
            <Pill icon={<ShieldCheck />} title={t("terms.privacy")} />
            <Pill icon={<Copy />} title={t("terms.version")} />
          </div>

          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <h2>{i + 1}. {t(`terms.section${i + 1}`)}</h2>
              <p>{t(`terms.section${i + 1}Text`)}</p>
            </div>
          ))}

          <div className="mt-12 rounded-xl bg-muted/30 p-6 border border-border">
            <p className="m-0 text-sm text-foreground">
              {t("terms.clarification")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground">
      <span className="*:h-4 *:w-4 text-primary">{icon}</span>
      {title}
    </div>
  )
}
