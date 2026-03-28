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
    <section className="mb-6 w-full md:w-[300px] overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
      <h2 className="bg-sky-100 px-4 py-3 md:text-[18px] text-[16px] font-semibold text-sky-900">
        {title}
      </h2>
      <ul className="w-full divide-y divide-slate-100 px-4 py-1 text-slate-800">
        {rows.map((r) => (
          <li
            key={r.key}
            className="flex w-full md:text-[18px] text-[16px] min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
          >
            <span className="font-medium text-[#3a5bff]">{r.label}</span>
            <span className="tabular-nums text-slate-600">
              {perKgLabel} / {r.priceFormatted}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
