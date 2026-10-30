import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Image from "next/image";

import LaundryIcon from "@/components/LaundryIcon";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { careNotes, faqs, pickupSchedule, services, steps } from "@/data/laundry";
import heroPhoto from "@/public/lavanderia/hero.jpg";

/**
 * Laundry site landing page.
 *
 * Same contract as the car landing: static, and no client components beyond
 * the theme toggle in the header. Fraunces is loaded here rather than in the
 * root layout so the car pages never download it.
 */
export const dynamic = "force-static";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Lavandería a domicilio · Tu ropa lista, sin salir de casa" },
  description:
    "Recogemos tu ropa en la puerta, la lavamos con cuidado y te la devolvemos limpia, doblada y perfumada.",
  openGraph: {
    title: "Lavandería a domicilio",
    images: [{ url: heroPhoto.src, width: heroPhoto.width, height: heroPhoto.height }],
  },
};

const highlights = [
  { value: "24 h", label: "Entrega más rápida" },
  { value: String(services.length), label: "Servicios" },
  { value: "L–S", label: "Recogidas" },
];

export default function LaundryPage() {
  return (
    <div
      data-site="laundry"
      className={`${fraunces.variable} flex flex-1 flex-col bg-canvas text-ink`}
    >
      <SiteHeader site="lavanderia" />

      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(42rem_30rem_at_12%_8%,var(--accent-soft),transparent_70%),radial-gradient(34rem_26rem_at_88%_24%,color-mix(in_srgb,var(--accent-2)_16%,transparent),transparent_70%)]"
          />

          <div className="page-container relative grid items-center gap-14 pt-12 pb-20 md:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:pb-28">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[13px] font-medium text-ink-muted backdrop-blur-sm">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                Recogida y entrega a domicilio
              </p>

              <h1 className="mt-6 text-[clamp(2.75rem,6.6vw,5.1rem)]">
                Tu ropa lista, <em className="text-accent">sin salir de casa</em>.
              </h1>

              <p className="mt-6 max-w-[46ch] text-lg text-ink-muted">
                Pasamos por tu puerta, lavamos cada prenda con cuidado y te la devolvemos limpia,
                doblada y con aroma a lavanda.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#servicios"
                  className="rounded-full bg-accent px-6.5 py-3.5 text-[15px] font-semibold text-on-accent shadow-[0_12px_28px_-14px_var(--accent)] transition duration-200 ease-board hover:-translate-y-0.5"
                >
                  Ver servicios
                </a>
                <a
                  href="#como-funciona"
                  className="rounded-full border border-line-strong px-6.5 py-3.5 text-[15px] font-semibold transition-colors duration-200 ease-board hover:bg-surface"
                >
                  Cómo funciona
                </a>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {highlights.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[13px] text-ink-subtle">{item.label}</dt>
                    <dd className="mt-1 font-display text-[28px] leading-none">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line shadow-[0_40px_80px_-40px_rgb(0_0_0/0.45)] lg:aspect-[4/5]">
                <Image
                  src={heroPhoto}
                  alt="Un repartidor entrega en la puerta de una casa una bolsa con ropa limpia y doblada."
                  fill
                  preload
                  placeholder="blur"
                  sizes="(min-width: 1180px) 540px, (min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-[74%_center]"
                />
              </div>

              <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-line bg-surface-raised/95 py-3 pr-5 pl-3 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.5)] backdrop-blur sm:-left-6">
                <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                  <LaundryIcon name="sparkle" className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">Doblada a mano</span>
                  <span className="text-xs text-ink-muted">y con aroma a lavanda</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="servicios"
          aria-labelledby="servicios-heading"
          className="page-container scroll-mt-24 py-16"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent">Servicios</p>
            <h2 id="servicios-heading" className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)]">
              Todo lo que tu ropa necesita
            </h2>
            <p className="mt-4 text-[17px] text-ink-muted">
              Desde la ropa de todos los días hasta esa prenda que solo sale en ocasiones
              especiales.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex flex-col rounded-3xl border border-line bg-surface p-7 transition duration-300 ease-board hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.35)]"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <LaundryIcon name={service.icon} />
                </span>
                <h3 className="mt-6 text-2xl">{service.name}</h3>
                <p className="mt-2.5 text-[15px] text-ink-muted">{service.description}</p>
                <p className="mt-auto pt-6 text-sm text-ink-subtle">
                  Listo en <span className="font-semibold text-ink">{service.turnaround}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section
          id="como-funciona"
          aria-labelledby="como-funciona-heading"
          className="page-container scroll-mt-24 py-8"
        >
          <div className="rounded-[2.5rem] bg-accent-soft px-7 py-14 sm:px-12 md:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-accent">Cómo funciona</p>
              <h2 id="como-funciona-heading" className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)]">
                Tres pasos y te olvidas del lavado
              </h2>
            </div>

            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, index) => (
                <li key={step.title} className="border-t border-line-strong pt-6">
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl leading-none text-accent-2 italic"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-2xl">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Care */}
        <section
          aria-labelledby="cuidado-heading"
          className="page-container grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28"
        >
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line">
            <Image
              src={heroPhoto}
              alt="Camisas y toallas dobladas sobre una mesa, junto a un ramo de lavanda."
              fill
              placeholder="blur"
              sizes="(min-width: 1180px) 540px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover object-[16%_center]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-accent">Nuestro cuidado</p>
            <h2 id="cuidado-heading" className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)]">
              Tratamos tu ropa como si fuera nuestra
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {careNotes.map((note) => (
                <li key={note} className="flex items-start gap-3.5 text-[17px]">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <LaundryIcon name="check" className="size-4" />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ and schedule */}
        <div className="page-container grid gap-12 pb-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="preguntas-heading">
            <h2 id="preguntas-heading" className="text-[clamp(2rem,4.4vw,3.2rem)]">
              Preguntas frecuentes
            </h2>
            <div className="mt-8 border-t border-line">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-line py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      className="size-5 shrink-0 text-accent transition-transform duration-200 ease-board group-open:rotate-45"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-ink-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside
            aria-labelledby="horarios-heading"
            className="self-start rounded-[2rem] bg-accent p-8 text-on-accent sm:p-10"
          >
            <h2 id="horarios-heading" className="text-[clamp(1.8rem,3.4vw,2.4rem)]">
              Horarios de recogida
            </h2>
            <dl className="mt-7 flex flex-col">
              {pickupSchedule.map((slot) => (
                <div
                  key={slot.days}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/20 py-3.5"
                >
                  <dt className="font-medium">{slot.days}</dt>
                  <dd className="opacity-85">{slot.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[15px] opacity-85">
              Muy pronto podrás agendar tu recogida desde esta página.
            </p>
          </aside>
        </div>
      </main>

      <SiteFooter
        note="Sitio de demostración. Los servicios, horarios y tiempos de entrega son de prueba."
        showPanelLink={false}
      />
    </div>
  );
}
