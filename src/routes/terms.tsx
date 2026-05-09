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
          <h1 className="font-display text-4xl font-bold md:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground">Last updated: October 15, 2023</p>
        </header>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-10 flex flex-wrap gap-4 pt-4">
            <Pill icon={<Scale />} title="Legal Governance" />
            <Pill icon={<ShieldCheck />} title="Privacy Maintained" />
            <Pill icon={<Copy />} title="Version 2.1" />
          </div>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Stayly. By accessing and using our website, platform, and services, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by these terms, please do not use this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Stayly's website for personal, non-commercial transitory viewing only.
          </p>
          <ul>
            <li>Modify or copy the materials.</li>
            <li>Use the materials for any commercial purpose.</li>
            <li>Attempt to decompile or reverse engineer any software contained on Stayly.</li>
          </ul>

          <h2>3. Disclaimers and Limitations</h2>
          <p>
            The materials on Stayly's website are provided on an 'as is' basis. Stayly makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Bookings and Payments</h2>
          <p>
            When utilizing Stayly to book accommodations, you agree to pay all charges incurred. Our third-party payment processors handle transactions securely. Stayly does not directly store raw credit card data.
          </p>

          <div className="mt-12 rounded-xl bg-muted/30 p-6 border border-border">
            <p className="m-0 text-sm text-foreground">
              <strong>Need clarification?</strong> If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
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
