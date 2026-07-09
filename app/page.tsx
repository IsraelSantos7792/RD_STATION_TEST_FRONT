"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, Cart, Product } from "@/lib/api";
import { isAuthenticated, signOut } from "@/lib/auth";
import { getLanguage, Language, setLanguage, t } from "@/lib/i18n";
import { LanguageMenu } from "@/components/LanguageMenu";

function formatBRL(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return `R$ ${value}`;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [lang, setLang] = useState<Language>("pt");

  const cartItemsById = useMemo(() => {
    const map = new Map<number, number>();
    for (const p of cart?.products || []) map.set(p.id, p.quantity);
    return map;
  }, [cart]);

  async function refreshAll() {
    setError(null);
    const [p, c] = await Promise.all([api.listProducts(), api.getCart()]);
    setProducts(p);
    setCart(c);
  }

  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated()) {
          router.replace("/login");
          return;
        }
        setLang(getLanguage());
        await refreshAll();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar");
      } finally {
        setBooting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(action: () => Promise<Cart>) {
    try {
      setBusy(true);
      setError(null);
      const c = await action();
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  }

  async function clearCart() {
    if (!cart || cart.products.length === 0) return;
    try {
      setBusy(true);
      setError(null);
      for (const item of cart.products) {
        // remove item-by-item (backend não tem endpoint único de "clear")
        // eslint-disable-next-line no-await-in-loop
        await api.removeItem(item.id);
      }
      const c = await api.getCart();
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao limpar carrinho");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-white ring-1 ring-[var(--color-brand-soft-border)] shadow-sm dark:bg-zinc-950 dark:ring-[var(--color-brand-soft-border)]">
              <Image
                src="/rd-station-black.svg"
                alt="RD Station"
                width={26}
                height={26}
                className="h-6 w-6 dark:invert"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{t(lang, "home.headerTitle")}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageMenu
              lang={lang}
              onChange={(next) => {
                setLang(next);
                setLanguage(next);
              }}
              size="sm"
              direction="down"
            />

            <button
              className={classNames(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              )}
              onClick={() => {
                signOut();
                router.replace("/login");
              }}
              title={t(lang, "home.logout")}
            >
              {t(lang, "home.logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{t(lang, "home.products")}</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t(lang, "home.productsHint")}
                </p>
              </div>
              <div className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                {booting
                  ? t(lang, "home.loading")
                  : t(lang, "home.itemsCount", { count: products.length })}
              </div>
            </div>

            {booting ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                {t(lang, "home.noProducts")}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((p) => {
                  const inCartQty = cartItemsById.get(p.id) || 0;
                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            #{p.id}
                          </div>
                          <div className="mt-1 text-base font-semibold leading-6">{p.name}</div>
                          <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                            {formatBRL(p.price)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {t(lang, "home.inCart")}
                          </div>
                          <div className="mt-1 inline-flex items-center rounded-full bg-[var(--color-brand-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-brand-hover)] ring-1 ring-[var(--color-brand-soft-border)] dark:text-zinc-50">
                            {inCartQty}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          className={classNames(
                            "inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition",
                            "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]",
                            busy && "opacity-60 pointer-events-none"
                          )}
                          onClick={() => run(() => api.addToCart(p.id, 1))}
                        >
                          {t(lang, "home.add")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold">{t(lang, "home.cart")}</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {cart ? `ID ${cart.id}` : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className={classNames(
                        "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold transition",
                        "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                        (busy || !cart || cart.products.length === 0) &&
                          "opacity-60 pointer-events-none"
                      )}
                      onClick={clearCart}
                      title="Remove todos os itens do carrinho desta sessão"
                    >
                      {t(lang, "home.clear")}
                    </button>

                    <div className="text-right">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{t(lang, "home.total")}</div>
                      <div className="text-sm font-semibold">
                        {cart ? formatBRL(cart.total_price) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2">
                {!cart ? (
                  <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {booting ? t(lang, "home.loadingCart") : t(lang, "home.cartUnavailable")}
                  </div>
                ) : cart.products.length === 0 ? (
                  <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {t(lang, "home.cartEmpty")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.products.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{item.name}</div>
                            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                              {item.quantity} × {formatBRL(item.unit_price)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">{t(lang, "home.subtotal")}</div>
                            <div className="text-sm font-semibold">
                              {formatBRL(item.total_price)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            className={classNames(
                              "inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition",
                              "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                              busy && "opacity-60 pointer-events-none"
                            )}
                            onClick={() => run(() => api.addItem(item.id, 1))}
                          >
                            {t(lang, "home.plusOne")}
                          </button>
                          <button
                            className={classNames(
                              "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition",
                              "bg-rose-600 text-white hover:bg-rose-700",
                              busy && "opacity-60 pointer-events-none"
                            )}
                            onClick={() => run(() => api.removeItem(item.id))}
                          >
                            {t(lang, "home.remove")}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            <div className="font-semibold">{t(lang, "home.errorTitle")}</div>
            <div className="mt-1">{error}</div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
