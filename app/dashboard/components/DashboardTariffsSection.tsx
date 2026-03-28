type TariffRow = { key: string; label: string; priceFormatted: string };

type Props = {
  title: string;
  perKgLabel: string;
  rows: TariffRow[];
};

export default function DashboardTariffsSection({
  title,
  perKgLabel,
  rows,
}: Props) {
  if (rows.length === 0) return null;

  return (
    <section className="h-full w-full min-w-0 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm lg:border-sky-200/80 lg:shadow-md">
      <h2 className="bg-sky-100 px-4 py-3 font-semibold text-sky-900 lg:px-6 lg:py-4 ">
        {title}
      </h2>
      <ul className="grid w-full grid-cols-1 gap-px bg-slate-100 text-slate-800 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <li
            key={r.key}
            className="flex min-w-0 items-center justify-between gap-4 bg-white px-4 py-3 transition-colors sm:gap-6 lg:px-6 lg:py-4 lg:hover:bg-slate-50/90"
          >
            <span className="min-w-0 text-base font-semibold text-[#3a5bff] text-[15px]">
              {r.label}
            </span>
            <span className="shrink-0 tabular-nums text-[15px] text-slate-600">
              {perKgLabel} / {r.priceFormatted}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
