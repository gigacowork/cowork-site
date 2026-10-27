import FirstTaskDemo from "@/components/academy/FirstTaskDemo";
import Button from "@/components/ui/Button";
import { SMB_LESSONS, smbLessonPath } from "@/content/ai-for-smb";

/** Переход от знакомства с интерфейсом к первой самостоятельной задаче. */
export default function FirstTaskTeaser({ stableHeight = false }: { stableHeight?: boolean }) {
  return (
    <section className="w-full bg-bg-page py-64 md:py-96">
      <div className="container-page grid items-start gap-40 lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)] lg:gap-64">
        <div className="flex flex-col items-start gap-16">
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">Первая задача</h2>
          <p className="text-body-l text-text-secondary">Не нужно придумывать идеальный запрос. Пройдите три шага — промпт, контекст из файлов и результат. Настроить агента, навык и команду можно позже.</p>
          <Button href={`${smbLessonPath(SMB_LESSONS[1].slug)}#first-task`} size="lg" className="mt-4">Пройти за 3 шага</Button>
        </div>
        <FirstTaskDemo compact stableHeight={stableHeight} />
      </div>
    </section>
  );
}
