/** Схема совместной работы агента и сотрудника для статьи и её превью. */
export function ProductivityVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid h-full grid-cols-2 gap-[8px] rounded-[16px] bg-[#f2fafa] p-[12px]" : "grid gap-16 rounded-24 bg-[#f2fafa] p-24 md:grid-cols-2 md:gap-24 md:p-48"}>
      <div className={compact ? "flex min-w-0 flex-col gap-[8px] rounded-[12px] border border-[#d6e8ed] bg-white/80 p-[12px] shadow-[0_8px_18px_rgba(23,61,99,0.1)]" : "flex flex-col gap-16 rounded-[18px] border border-[#d6e8ed] bg-white/80 p-16 shadow-[0_16px_34px_rgba(23,61,99,0.12)]"}>
        <span className={compact ? "text-[11px] text-text-secondary" : "text-[14px] text-text-secondary"}>ИИ-агент</span>
        <strong className={compact ? "text-[13px] leading-[1.15] font-medium" : "text-[20px] font-medium"}>Собирает данные</strong>
        <div className={compact ? "flex flex-wrap gap-[4px] text-[9px]" : "flex flex-wrap gap-8 text-[12px]"}>
          {["ERP", "MES", "CRM", "WMS"].map((system) => <span key={system} className={compact ? "rounded-full bg-[#e2f5f7] px-[4px] py-[2px]" : "rounded-full bg-[#e2f5f7] px-12 py-8"}>{system}</span>)}
        </div>
        {!compact ? <span className="text-[14px] text-text-secondary">Строит прогноз и предлагает варианты решения</span> : null}
      </div>
      <div className={compact ? "flex min-w-0 flex-col gap-[8px] rounded-[12px] border border-[#d6e8ed] bg-white/80 p-[12px] shadow-[0_8px_18px_rgba(23,61,99,0.1)]" : "flex flex-col gap-16 rounded-[18px] border border-[#d6e8ed] bg-white/80 p-16 shadow-[0_16px_34px_rgba(23,61,99,0.12)]"}>
        <span className={compact ? "text-[11px] text-text-secondary" : "text-[14px] text-text-secondary"}>Сотрудник</span>
        <strong className={compact ? "text-[13px] leading-[1.15] font-medium" : "text-[20px] font-medium"}>Управляет результатом</strong>
        <span className={compact ? "rounded-full bg-[#d8efdf] px-[4px] py-[2px] text-[9px]" : "rounded-full bg-[#d8efdf] px-12 py-8 text-[12px]"}>Проверяет → подтверждает</span>
        {!compact ? <span className="text-[14px] text-text-secondary">Ответственность за решение остаётся у человека</span> : null}
      </div>
    </div>
  );
}
