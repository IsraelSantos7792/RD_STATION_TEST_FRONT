"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isAuthenticated, signIn } from "@/lib/auth";
import { Language, getLanguage, t } from "@/lib/i18n";
import { LanguageMenu } from "@/components/LanguageMenu";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [lang, setLang] = useState<Language>("pt");

  const canSubmit = useMemo(() => username.trim().length > 0 && password.length > 0, [username, password]);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/");
  }, [router]);

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const ok = signIn(username.trim(), password);
      if (!ok) {
        setError(t(lang, "login.invalid"));
        return;
      }
      router.replace("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-10 h-16 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full items-center px-5">
          <div className="flex items-center">
            <Image
              src="/rd-station-black.svg"
              alt="RD Station"
              width={110}
              height={24}
              className="h-7 w-auto"
              priority
            />
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] w-full lg:grid-cols-2">
        <a
          href="https://materiais.rdstation.com/webinar-ia-vendas-diferencial-quem-bate-metas/?utm_source=referral&utm_medium=referral&utm_campaign=br-inb-crm-rdu-novos_leads_webinar_ia_vendas_diferencial_quem_bate_metas_tela_login_rd"
          target="_blank"
          rel="noopener noreferrer"
          className="relative hidden cursor-pointer lg:block"
          aria-label="Abrir página do webinar"
          title="Abrir página do webinar"
        >
          <Image
            src="/login-tema.png"
            alt="Webinar IA+Vendas"
            fill
            sizes="(min-width: 1024px) 60vw, 0vw"
            className="object-cover"
            priority
          />
        </a>

        <div className="relative flex items-center justify-center bg-zinc-100 px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-3 flex items-center justify-center gap-3 text-xs text-zinc-600">
              <span>{t(lang, "login.noAccount")}</span>
              <a
                href="https://accounts.rdstation.com/signup?product=marketing&trial_origin=mkt--free--plan--trial&utm_source=search&utm_medium=cpc&utm_campaign=BR-INB-MULTIPRODUCT-SEARCH-INST-RD_STATION_ONLY_EXACT&utm_content=rd-station_only&utm_term=rd+station-e&ledger_uuid=d8a26eb6-b278-4467-a726-ecde1a8276db&cf_deviceid=f3c1054a-41d4-4491-a013-16db3f11a237&c_utmz=00000000.0000000000.00.00.utmcsr%3Dsearch%7Cutmccn%3DBR-INB-MULTIPRODUCT-SEARCH-INST-RD_STATION_ONLY_EXACT%7Cutmcmd%3Dcpc%7Cutmcct%3Drd-station_only%7Cutmctr%3Drd+station-e&adwords_gclid=Cj0KCQjwjb3SBhDgARIsAMKiWziM1tBy8jejHb-_5EqGWPMFY9Ok2d8YxjaZJDcclyojN1etYaLWyQ4aArwgEALw_wcB&facebook_data=JTdCJTIyZmJjJTIyJTNBJTIyJTIyJTJDJTIyZmJwJTIyJTNBJTIyZmIuMS4xNzgzNDI3ODgwOTEwLjMwNTc1MTQ0ODU2Nzg5NzAwMCUyMiUyQyUyMmV4dGVybmFsX2lkJTIyJTNBJTIydHJrMTc4MzYwMTc4ODQyMCUyMiUyQyUyMnVzZXJfYWdlbnQlMjIlM0ElMjJNb3ppbGxhJTJGNS4wJTIwKE1hY2ludG9zaCUzQiUyMEludGVsJTIwTWFjJTIwT1MlMjBYJTIwMTBfMTVfNyklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkYxNTAuMC4wLjAlMjBTYWZhcmklMkY1MzcuMzYlMjIlMkMlMjJpcCUyMiUzQSUyMjE4Ny44NC4xLjE3NSUyMiUyQyUyMmNpdHklMjIlM0ElMjJCb2l0dXZhJTIyJTJDJTIyemlwJTIyJTNBJTIyMTg1NTAtMDAwJTIyJTdE&cf_origemmidiapaga=gAds&cf_idmidiapaga=Cj0KCQjwjb3SBhDgARIsAMKiWziM1tBy8jejHb-_5EqGWPMFY9Ok2d8YxjaZJDcclyojN1etYaLWyQ4aArwgEALw_wcB&client_id=e92ca045-703a-48aa-b93a-b223eda70461"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#bfefff] px-3 py-1 font-semibold text-[#056f9b] hover:bg-[#aeeaff]"
              >
                {t(lang, "login.freeTrial")}
              </a>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_18px_80px_rgba(0,0,0,0.12)]">
                <div className="text-2xl font-semibold tracking-tight text-zinc-900">{t(lang, "login.hello")}</div>

                <form onSubmit={onSubmit} className="mt-6">
                  <label className="block text-xs font-semibold text-[#405466]">{t(lang, "login.email")}</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00DBFF] focus:ring-4 focus:ring-[rgba(0,18,36,0.16)]"
                    placeholder=""
                  />

                  <label className="mt-5 block text-xs font-semibold text-[#405466]">{t(lang, "login.password")}</label>
                  <div className="relative mt-2">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#00DBFF] focus:ring-4 focus:ring-[rgba(0,18,36,0.16)]"
                      placeholder=""
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-xl px-3 text-zinc-500 hover:text-zinc-700"
                      onClick={() => setShowPassword((s) => !s)}
                      title={showPassword ? t(lang, "login.hidePassword") : t(lang, "login.showPassword")}
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 3l18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.58 10.58A2 2 0 0 0 12 15a2 2 0 0 0 1.42-.58"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.88 5.47A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.7 18.7 0 0 1-4.2 5.06"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.11 6.11C3.73 7.79 2 12 2 12s3 7 10 7c1.02 0 1.98-.15 2.87-.4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <a href="#" className="mt-3 inline-block text-xs font-semibold text-sky-700 hover:underline">
                    {t(lang, "login.forgot")}
                  </a>

                  <label className="mt-4 flex items-center gap-2 text-xs text-zinc-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="size-4 rounded border-zinc-300"
                    />
                    {t(lang, "login.remember14")}
                  </label>

                  {error ? (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {error}
                    </div>
                  ) : null}

                  <button
                    disabled={!canSubmit || busy}
                    className={classNames(
                      "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-[16px] font-semibold transition-colors duration-150",
                      "bg-[#003D5C] text-[#00DBFF] shadow-sm",
                      "border border-[#00DBFF]/40 enabled:hover:border-[#66E9FF]/60",
                      "enabled:hover:bg-[#005A87] enabled:hover:text-[#66E9FF]",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00DBFF]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      "disabled:opacity-60 disabled:cursor-not-allowed"
                    )}
                  >
                    {busy ? t(lang, "login.advancing") : t(lang, "login.advance")}
                  </button>

                  <div className="mt-4 text-center">
                    <a href="#" className="text-xs font-semibold text-sky-700 hover:underline">
                      {t(lang, "login.sso")}
                    </a>
                  </div>

                  <div className="mt-6 text-center text-[11px] text-zinc-500">
                    {t(lang, "login.testCreds")}
                  </div>
                </form>
              </div>

            <div className="mt-6 flex justify-center">
              <LanguageMenu lang={lang} onChange={setLang} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

