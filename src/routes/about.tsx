import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Globe, Users, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — Stayly" }] }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30 pt-24 pb-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-balance">
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            {t("about.hero")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            {t("about.heroSub")}
          </p>
        </div>
      </section>

      {/* Stats/Values grid */}
      <section className="py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{t("about.values")}</h2>
            <p className="mt-4 text-muted-foreground">{t("about.subtitle")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={<Globe />}
              title={t("about.value1.title")}
              text={t("about.value1.desc")}
            />
            <ValueCard
              icon={<Users />}
              title={t("about.value2.title")}
              text={t("about.value2.desc")}
            />
            <ValueCard
              icon={<Shield />}
              title={t("about.value3.title")}
              text={t("about.value3.desc")}
            />
            <ValueCard
              icon={<Zap />}
              title={t("about.value4.title")}
              text={t("about.value4.desc")}
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl mb-6">
                {t("about.mission")}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">{t("about.missionDesc")}</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"
                className="object-cover w-full h-[400px]"
                alt="Modern apartment interior"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-border/50 bg-background shadow-soft hover:-translate-y-1 transition-all duration-300">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
        {icon}
      </span>
      <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
    </div>
  );
}
