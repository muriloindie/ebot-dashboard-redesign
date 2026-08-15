export default function AppLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Carregando módulo">
      <div className="clinical-skeleton h-10 w-72 rounded-2xl" />
      <div className="clinical-skeleton h-5 w-[min(620px,90%)] rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="clinical-skeleton h-28 rounded-[24px]" />)}
      </div>
      <div className="clinical-skeleton min-h-[420px] rounded-[24px]" />
    </div>
  );
}
