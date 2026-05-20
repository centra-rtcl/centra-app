"use client";

import { useEffect, useMemo, useState } from "react";

const launchDate = new Date("2026-07-01T00:00:00-06:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return useMemo(() => {
    const distance = Math.max(launchDate - now, 0);
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }, [now]);
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = localStorage.getItem("centra-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("centra-theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

function Logo({ theme }: { theme: "dark" | "light" }) {
  return (
    <a href="/" className="flex items-center">
      <img
        src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"}
        alt="Centra"
        className="h-16 w-auto object-contain"
      />
    </a>
  );
}

function ThemeToggle({ theme, toggle }: { theme: "dark" | "light"; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] text-[color:var(--c-text-muted)] transition hover:text-[color:var(--c-text)] hover:border-blue-400/30"
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

const modules = [
  { title: "Ventas", text: "Ve qué vendes más y cuánto dinero entra cada día.", img: "/iconos/Ventas.png" },
  { title: "Inventario", text: "Evita quedarte sin producto o comprar de más.", img: "/iconos/Inventario.png" },
  { title: "Gastos", text: "Descubre por qué el dinero no te rinde.", img: "/iconos/Gastos.png" },
  { title: "Clientes", text: "Conoce quién te compra y cuándo vuelve.", img: "/iconos/Clientes.png" },
  { title: "Reportes", text: "Entiende tu negocio sin fórmulas ni palabras raras.", img: "/iconos/Reportes.png" },
  { title: "Control", text: "Todo tu negocio claro en una sola pantalla.", img: "/iconos/Control.png" },
  { title: "Caja", text: "Ve cuánto dinero entra y cuánto realmente queda.", img: "/iconos/Caja.png" },
  { title: "Alertas", text: "Recibe avisos antes de que el problema te alcance.", img: "/iconos/Alertas.png" },
  { title: "Configuración", text: "Acomoda Centra a la forma real en que trabajas.", img: "/iconos/Configuracion.png" },
];

const videos = [
  { src: "/video1.mp4", title: "Control diario", text: "Ve ventas, caja e inventario sin perderte." },
  { src: "/video2.mp4", title: "Menos caos", text: "Adiós a libretas, cuentas mentales y hojas sueltas." },
  { src: "/video3.mp4", title: "Ahora sí entiendo mi negocio", text: "Control simple para tomar mejores decisiones." },
];

function Countdown() {
  const c = useCountdown();
  const items: [string, number][] = [
    ["Días", c.days], ["Horas", c.hours], ["Min", c.minutes], ["Seg", c.seconds],
  ];
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {items.map(([label, value], i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-semibold tabular-nums tracking-tight text-[color:var(--c-text)] sm:text-5xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--c-text-soft)]">
              {label}
            </span>
          </div>
          {i < 3 && <span className="text-2xl font-light text-[color:var(--c-divider)] sm:text-3xl">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const { theme, toggle } = useTheme();

  return (
    <main className="min-h-screen bg-[color:var(--c-bg)] text-[color:var(--c-text)] antialiased selection:bg-blue-500/30 transition-colors duration-300">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/[0.18] blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-sky-500/[0.08] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--c-grid) 1px, transparent 1px), linear-gradient(90deg, var(--c-grid) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        <header className="sticky top-4 z-50 mx-auto mt-6 max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-header)] px-4 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:px-5 sm:py-3">
            <Logo theme={theme} />
            <nav className="hidden items-center gap-8 text-sm text-[color:var(--c-text-muted)] md:flex">
              <a href="#modulos" className="transition hover:text-[color:var(--c-text)]">Qué controla</a>
              <a href="#experiencia" className="transition hover:text-[color:var(--c-text)]">Experiencia</a>
              <a href="#comparativa" className="transition hover:text-[color:var(--c-text)]">Para quién es</a>
              <a href="#acceso" className="transition hover:text-[color:var(--c-text)]">Acceso</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle theme={theme} toggle={toggle} />
              <a
                href="#acceso"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-[color:var(--c-cta-bg)] px-3 py-2 text-xs font-medium text-[color:var(--c-cta-text)] transition hover:opacity-90 sm:px-4 sm:text-sm"
              >
                <span className="hidden sm:inline">Quiero probar Centra</span>
                <span className="sm:hidden">Acceso</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-28 lg:pb-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[color:var(--c-border)] bg-[color:var(--c-surface)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--c-text-muted)] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
                </span>
                Hecho para negocios reales
              </div>

              <h1 className="text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[4.5rem] lg:leading-[1.02]">
                Deja de trabajar
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  sin saber cuánto ganas.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--c-text-muted)] sm:mt-8 sm:text-lg">
                Si vendes mucho pero el dinero nunca alcanza, Centra te ayuda a entender gastos, ventas y ganancias sin fórmulas, sin Excel y sin complicaciones.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
                <a
                  href="#acceso"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_8px_32px_-8px_rgba(37,99,235,0.7)] transition hover:bg-blue-500"
                >
                  Quiero entender mi negocio
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#experiencia"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] px-6 py-3.5 text-sm font-medium text-[color:var(--c-text-muted)] transition hover:text-[color:var(--c-text)]"
                >
                  Ver cómo funciona
                </a>
              </div>

              <div className="mt-12 border-t border-[color:var(--c-border)] pt-8 sm:mt-14">
                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--c-text-soft)]">
                  Lanzamiento en
                </p>
                <Countdown />
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="absolute -inset-12 bg-blue-600/[0.12] blur-[80px]" />
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-sky-400/[0.05] blur-2xl" />

              <div className="absolute -left-4 top-12 z-20 hidden rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-card)] p-3.5 shadow-2xl backdrop-blur-xl sm:-left-6 sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17l6-6 4 4 8-8" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 7h7v7" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--c-text-soft)]">Ventas hoy</p>
                    <p className="text-sm font-semibold tabular-nums text-[color:var(--c-text)]">+24.8%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-16 z-20 hidden rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-card)] p-3.5 shadow-2xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--c-text-soft)]">Caja en vivo</p>
                    <p className="text-sm font-semibold tabular-nums text-[color:var(--c-text)]">$15,230</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-[1.75rem] border border-[color:var(--c-border)] bg-[color:var(--c-card-grad)] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="rounded-[1.4rem] border border-[color:var(--c-border-soft)] bg-[color:var(--c-card-inner)] p-4 sm:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-dot)]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-dot)]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-dot)]" />
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[color:var(--c-border-soft)] bg-[color:var(--c-surface)] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span className="text-[10px] font-medium text-[color:var(--c-text-muted)]">En control</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-[color:var(--c-text-soft)]">Buenos días, Andrea</p>
                    <p className="mt-0.5 text-lg font-semibold tracking-tight text-[color:var(--c-text)]">Hoy · Vista operativa</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      ["Ventas", "$24,850", "+12.5%"],
                      ["Ganancia", "$8,420", "+9.3%"],
                      ["Órdenes", "128", "+15.7%"],
                      ["Ticket prom.", "$194", "+3.2%"],
                    ].map(([label, value, change]) => (
                      <div
                        key={label as string}
                        className="rounded-2xl border border-[color:var(--c-border-soft)] bg-[color:var(--c-tile)] p-4"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-[color:var(--c-text-soft)]">{label}</p>
                        <p className="mt-2 text-xl font-semibold tabular-nums text-[color:var(--c-text)]">{value}</p>
                        <p className="mt-1 text-[11px] font-medium text-emerald-400">{change}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl border border-[color:var(--c-border-soft)] bg-[color:var(--c-tile)] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-medium text-[color:var(--c-text-muted)]">Ventas últimos 7 días</p>
                      <span className="text-[10px] text-[color:var(--c-text-soft)]">7d</span>
                    </div>
                    <div className="flex h-28 items-end gap-2">
                      {[38, 58, 45, 74, 62, 84, 96].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                          <div
                            className="w-full rounded-md bg-gradient-to-t from-blue-600/60 to-sky-400 shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[9px] text-[color:var(--c-text-soft)]">
                            {["L", "M", "M", "J", "V", "S", "D"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--c-text-soft)] sm:mt-24 sm:gap-x-12 sm:text-xs">
            <span>Diseñado en México</span>
            <span className="h-1 w-1 rounded-full bg-[color:var(--c-divider)]" />
            <span>Para negocios reales</span>
            <span className="h-1 w-1 rounded-full bg-[color:var(--c-divider)]" />
            <span>Si sabes usar WhatsApp, puedes usar Centra</span>
          </div>
        </div>
      </section>

      {/* ============ MÓDULOS ============ */}
      <section id="modulos" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-400">Lo que puedes controlar</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Todo claro.
            <br />
            <span className="text-[color:var(--c-text-soft)]">Sin cuentas mentales.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[color:var(--c-text-muted)]">
            Todo en un solo lugar para entender qué vendes, cuánto gastas y cuánto realmente ganas.
          </p>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:mt-20">
          {modules.map((m) => (
            <article
              key={m.title}
              className="group relative overflow-hidden rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] p-7 transition-all duration-500 hover:border-blue-400/20 hover:bg-blue-500/[0.03]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/[0.08] group-hover:to-transparent group-hover:opacity-100" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-tile)] transition group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.06] group-hover:shadow-[0_0_24px_rgba(37,99,235,0.25)]">
                  <img src={m.img} alt={m.title} className="h-9 w-9 object-contain" />
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-tight text-[color:var(--c-text)]">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--c-text-muted)]">{m.text}</p>

                <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-medium text-[color:var(--c-text-soft)] transition group-hover:text-blue-400">
                  Fácil de entender
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ VIDEOS ============ */}
      <section id="experiencia" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-400">Así se ve Centra</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Así se siente
            <br />
            <span className="text-[color:var(--c-text-soft)]">dejar de trabajar a ciegas.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
          {videos.map((v, i) => (
            <div
              key={v.src}
              className="group relative overflow-hidden rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] transition hover:border-blue-400/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--c-card-inner)]">
                <video
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  src={v.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-200 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-blue-400" />
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{v.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CLARIDAD ============ */}
      <section id="comparativa" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--c-border)] bg-[color:var(--c-card-grad)] p-8 sm:p-10 lg:p-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/[0.12] blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/[0.08] blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-400">Para negocios reales</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Necesitas claridad,
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  no complicaciones.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--c-text-muted)]">
                Centra fue creado para negocios reales: los que venden todos los días, trabajan muchísimo y aun así sienten que el dinero desaparece.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
                {[["9", "Áreas"], ["1", "Lugar"], ["0", "Enredos"]].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight text-[color:var(--c-text)] sm:text-4xl">{n}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--c-text-soft)]">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  side: "antes",
                  title: "Antes",
                  items: [
                    "Libretas, Excel y cuentas mentales",
                    "Vendes mucho pero no sabes si realmente ganas",
                    "El dinero entra… pero nunca sabes en qué se fue",
                    "Decides tarde porque no tienes todo claro",
                  ],
                },
                {
                  side: "ahora",
                  title: "Con Centra",
                  items: [
                    "Ventas, gastos, caja e inventario en un solo lugar",
                    "Claridad para saber qué está pasando",
                    "Avisos simples antes de que el problema crezca",
                    "Una experiencia fácil, aunque no seas técnico",
                  ],
                },
              ].map((block) => (
                <div
                  key={block.title}
                  className={
                    block.side === "ahora"
                      ? "rounded-2xl border border-blue-400/20 bg-blue-500/[0.04] p-6 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] backdrop-blur-sm"
                      : "rounded-2xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] p-6 backdrop-blur-sm"
                  }
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className={
                        block.side === "ahora"
                          ? "h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                          : "h-1.5 w-1.5 rounded-full bg-[color:var(--c-text-soft)]"
                      }
                    />
                    <p
                      className={
                        block.side === "ahora"
                          ? "text-sm font-semibold text-[color:var(--c-text)]"
                          : "text-sm font-medium text-[color:var(--c-text-soft)]"
                      }
                    >
                      {block.title}
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {block.items.map((it) => (
                      <li
                        key={it}
                        className={
                          block.side === "ahora"
                            ? "flex items-start gap-2.5 text-sm text-[color:var(--c-text)]"
                            : "flex items-start gap-2.5 text-sm text-[color:var(--c-text-soft)]"
                        }
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                          {block.side === "ahora" ? (
                            <path d="M4 12l5 5L20 6" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          ) : (
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          )}
                        </svg>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ACCESO ============ */}
      <section id="acceso" className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-96 max-w-2xl rounded-full bg-blue-600/[0.15] blur-[120px]" />

        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-400">Acceso anticipado</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Empieza a entender
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              tu negocio.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[color:var(--c-text-muted)]">
            Sin cursos. Sin capacitación. Sin términos complicados. Déjanos tus datos y te avisamos primero.
          </p>
        </div>

        <form
          action="https://formsubmit.co/contacto@centratunegocio.com"
          method="POST"
          className="mx-auto mt-12 max-w-2xl"
        >
          <input type="hidden" name="_subject" value="Nuevo interesado en Centra" />
          <input type="hidden" name="_captcha" value="false" />

          <div className="rounded-[1.5rem] border border-[color:var(--c-border)] bg-[color:var(--c-card-grad)] p-2 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)]">
            <div className="rounded-[1.2rem] border border-[color:var(--c-border-soft)] bg-[color:var(--c-card-inner)] p-5 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "nombre", placeholder: "Tu nombre", required: true },
                  { name: "email", placeholder: "Tu correo", type: "email", required: true },
                  { name: "negocio", placeholder: "Nombre de tu negocio" },
                  { name: "whatsapp", placeholder: "WhatsApp" },
                ].map((f) => (
                  <input
                    key={f.name}
                    name={f.name}
                    type={f.type || "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-tile)] px-4 py-3.5 text-sm text-[color:var(--c-text)] outline-none transition placeholder:text-[color:var(--c-text-soft)] focus:border-blue-400/40 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                ))}

                <textarea
                  name="mensaje"
                  placeholder="¿Qué problema quieres resolver primero? (opcional)"
                  className="min-h-28 resize-none rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-tile)] px-4 py-3.5 text-sm text-[color:var(--c-text)] outline-none transition placeholder:text-[color:var(--c-text-soft)] focus:border-blue-400/40 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] sm:col-span-2"
                />

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_8px_32px_-8px_rgba(37,99,235,0.7)] transition hover:bg-blue-500 sm:col-span-2"
                >
                  Quiero probar Centra
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <p className="mt-6 text-center text-[11px] text-[color:var(--c-text-soft)]">
                También puedes escribir a{" "}
                <a href="mailto:contacto@centratunegocio.com" className="text-[color:var(--c-text-muted)] hover:text-[color:var(--c-text)]">
                  contacto@centratunegocio.com
                </a>
              </p>
            </div>
          </div>
        </form>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[color:var(--c-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-xs text-[color:var(--c-text-soft)] sm:flex-row sm:px-6 lg:px-8">
          <Logo theme={theme} />
          <p className="text-center">© {new Date().getFullYear()} Centra · Claridad para negocios reales</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[color:var(--c-text)]">Privacidad</a>
            <a href="#" className="hover:text-[color:var(--c-text)]">Términos</a>
          </div>
        </div>
      </footer>
    </main>
  );
}