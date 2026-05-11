import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line prettier/prettier
import { Moon, Sun, Globe, Menu, X, Hotel as HotelIcon, LogOut, User as UserIcon } from "lucide-react"
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Navbar() {
  const { t } = useTranslation();
  const { lang, setLang, theme, toggleTheme, user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/hotels", label: t("nav.hotels") },
    { to: "/about", label: t("about.title") },
    { to: "/contact", label: t("contact.title") },
  ] as const;

  const onLogout = () => {
    logout();
    toast.success(t("auth.loggedOut"));
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
            <HotelIcon className="h-5 w-5" />
          </span>
          <span className="bg-gradient-primary bg-clip-text text-transparent">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:text-primary"
            >
              {t("nav.dashboard")}
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:text-primary"
            >
              {t("admin.portal", "Admin Portal")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="gap-1.5"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">{lang === "en" ? "AR" : "EN"}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{(user.name || "User").split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                  <UserIcon className="me-2 h-4 w-4" /> {t("nav.dashboard")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="me-2 h-4 w-4" /> {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>
                {t("nav.login")}
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/register" })}>
                {t("nav.register")}
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {t("nav.dashboard")}
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin-dashboard"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {t("admin.portal", "Admin Portal")}
              </Link>
            )}
            {!user && (
              <div className="flex gap-2 pt-2">
                // eslint-disable-next-line prettier/prettier
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/login" });
                  }}
                >
                  {t("nav.login")}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/register" });
                  }}
                >
                  {t("nav.register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
