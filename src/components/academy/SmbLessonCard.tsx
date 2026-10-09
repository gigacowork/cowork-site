import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { smbLessonPath, type SmbLesson } from "@/content/ai-for-smb";

const CARD_GRADIENT =
  "bg-[linear-gradient(54.73deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";

export function SmbLessonCard({
  lesson,
  index,
  className = "",
}: {
  lesson: SmbLesson;
  index: number;
  className?: string;
}) {
  return (
    <Link
      href={smbLessonPath(lesson.slug)}
      className={`group relative isolate flex h-full flex-col justify-between gap-40 overflow-hidden rounded-24 border border-border-subtle p-24 shadow-elevation-xs transition-[box-shadow,transform] duration-300 hover:-translate-y-4 hover:shadow-drop-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary motion-reduce:transition-none md:p-40 ${CARD_GRADIENT} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(227.17deg,#edf6ff_10.474%,#d4eeef_94.872%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <div className="relative z-10 flex flex-col gap-16">
        <span className="text-body-m text-text-secondary">
          Урок {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-h4 font-medium text-text-primary md:text-h3">
          {lesson.title}
        </h3>
        <p className="text-body-l text-text-secondary">{lesson.summary}</p>
      </div>
      <span className="relative z-10 flex items-center gap-8 text-body-m font-medium text-text-primary">
        Открыть урок
        <Icon
          src="/img/icons/arrow-next.svg"
          className="size-[16px] transition-transform group-hover:translate-x-4"
        />
      </span>
    </Link>
  );
}

export default SmbLessonCard;
