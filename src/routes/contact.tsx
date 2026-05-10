import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: "Contact Us — Stayly" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.success"));
  };

  return (
    <div className="flex min-h-screen flex-col animate-fade-in bg-muted/10">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl text-balance">
              {t("contact.title")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="mx-auto">

          

            {/* Contact Form */}
            <div className="lg:col-span-2 ">
              <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-elegant">
                <h2 className="font-display text-2xl font-bold mb-6">{t("contact.form")}</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">{t("contact.name")}</span>
                    <input type="text" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={t("contact.name")} />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">{t("contact.email")}</span>
                    <input type="email" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">{t("contact.message")}</span>
                    <textarea required rows={5} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" placeholder={t("contact.subtitle")}></textarea>
                  </label>

                  <Button type="submit" size="lg" className="w-full sm:w-auto gap-2">
                    <Send className="h-4 w-4" /> {t("contact.submit")}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, detail, sub }: { icon: React.ReactNode; title: string; detail: string; sub: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 font-medium text-primary">{detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
