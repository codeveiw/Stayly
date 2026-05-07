import { useTranslation } from "react-i18next";
import { Hotel as HotelIcon, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <HotelIcon className="h-5 w-5" />
            </span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">{t("brand")}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("footer.company")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">{t("footer.about")}</Link></li>
            <li><Link to="/" className="hover:text-foreground">{t("footer.contact")}</Link></li>
            <li><Link to="/" className="hover:text-foreground">{t("footer.terms")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow us</h4>
          <div className="flex gap-2">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
      </div>
    </footer>
  );
}
