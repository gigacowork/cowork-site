import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import {
  SMB_COURSE_PATH,
  SMB_COURSE_SHORT_TITLE,
  SMB_LESSONS,
  smbLessonPath,
  type SmbLesson,
} from "@/content/ai-for-smb";
import { GUIDES, guidePoster } from "@/content/guides";
import { asset } from "@/lib/asset";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

const LESSON_NAV_CLASS =
  "group flex min-h-[148px] min-w-0 items-center justify-between gap-16 rounded-24 border border-border-subtle bg-neutral-0 p-24 shadow-elevation-xs transition-shadow hover:shadow-drop-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary";

export const dynamicParams = false;

export function generateStaticParams() {
  return SMB_LESSONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = SMB_LESSONS.find((item) => item.slug === slug);
  if (!lesson) return {};

  return pageMetadata({
    title: `${lesson.title} — ${SMB_COURSE_SHORT_TITLE} — GigaCowork`,
    description: lesson.summary,
    path: `${smbLessonPath(slug)}/`,
  });
}

function LessonVideoPlaceholder({ lesson }: { lesson: SmbLesson }) {
  return (
    <div className="overflow-hidden rounded-24 border border-border-subtle bg-[linear-gradient(57.37deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)] p-16 shadow-drop-sm md:p-24">
      <div className="flex aspect-video flex-col items-center justify-center gap-16 rounded-16 bg-[#ffffffb8] px-24 text-center">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-neutral-0 shadow-drop-sm">
          <Icon src="/img/icons/play.svg" className="size-[40px] text-icon-primary" />
        </span>
        <div className="flex flex-col gap-8">
          <span className="text-h4 font-medium text-text-primary">
            Видеоурок готовится
          </span>
          <span className="max-w-[480px] text-body-m text-text-secondary">
            После записи здесь появится видео урока «{lesson.title}».
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function SmbLessonPage({ params }: PageProps) {
  const { slug } = await params;
  const index = SMB_LESSONS.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();

  const lesson = SMB_LESSONS[index];
  const previous = SMB_LESSONS[index - 1];
  const next = SMB_LESSONS[index + 1];
  const supplemental = GUIDES.find(
    (guide) => guide.id === lesson.supplementalGuideId,
  );
  const pdfMaterial =
    lesson.materials?.find((material) => material.includes("PDF")) ??
    "PDF к уроку — готовится";
  const otherMaterials =
    lesson.materials?.filter((material) => !material.includes("PDF")) ?? [];

  return (
    <>
      <section className="w-full bg-[linear-gradient(206.5deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)] pt-[calc(var(--header-h)+32px)] pb-64 md:pt-[calc(var(--header-h)+48px)] md:pb-96">
        <div className="container-page">
          <Breadcrumbs
            variant="inline"
            items={[
              { label: "Академия", href: "/ai-academy" },
              { label: SMB_COURSE_SHORT_TITLE, href: SMB_COURSE_PATH },
              { label: `Урок ${index + 1}` },
            ]}
          />
          <div className="mt-40 flex max-w-[900px] flex-col items-start gap-24 md:mt-64">
            <div className="flex flex-wrap gap-8">
              <Kicker>Урок {index + 1}</Kicker>
              <Kicker>≈ {lesson.estimatedMinutes} мин</Kicker>
            </div>
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              {lesson.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-48 py-64 md:py-96 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-64">
        <article className="min-w-0 space-y-64 md:space-y-80">
          <section className="flex flex-col gap-16">
            <h2 className="text-h3 font-medium text-text-primary">
              Общая информация об уроке
            </h2>
            <p className="text-body-l text-text-secondary">
              {lesson.summary}
            </p>
          </section>

          <section className="rounded-24 bg-[linear-gradient(227.17deg,#edf6ff_10.474%,#d4eeef_94.872%)] p-24 md:p-40">
            <h2 className="text-h3 font-medium text-text-primary">
              Цель урока
            </h2>
            <p className="mt-16 text-body-l text-text-primary">
              {lesson.goal}
            </p>
          </section>

          <section aria-labelledby="lesson-video" className="flex flex-col gap-24">
            <h2 id="lesson-video" className="text-h3 font-medium text-text-primary">
              Видео и материалы урока
            </h2>
            <LessonVideoPlaceholder lesson={lesson} />
            <div className="flex flex-col gap-12">
              <h3 className="text-h4 font-medium text-text-primary">
                Описание видео
              </h3>
              <p className="text-body-l text-text-secondary">
                {lesson.videoPlan}
              </p>
            </div>

            {supplemental ? (
              <div className="flex flex-col gap-24">
                <div className="flex flex-col gap-12">
                  <Kicker>Дополнительное видео</Kicker>
                  <h3 className="text-h4 font-medium text-text-primary">
                    {supplemental.title}
                  </h3>
                </div>
                <div className="aspect-video overflow-hidden rounded-24 border border-border-subtle bg-neutral-50 shadow-drop-sm">
                  <video
                    src={asset(supplemental.video)}
                    poster={asset(guidePoster(supplemental.id))}
                    controls
                    preload="metadata"
                    playsInline
                    aria-label={supplemental.title}
                    className="size-full object-cover"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-16">
              <h3 className="text-h4 font-medium text-text-primary">
                PDF к уроку
              </h3>
              <div className="flex items-center gap-16 rounded-16 border border-border-subtle bg-bg-card p-20 text-body-m text-text-secondary">
                <Icon src="/img/icons/document.svg" className="size-[24px] shrink-0 text-icon-primary" />
                {pdfMaterial}
              </div>
              {otherMaterials.map((material) => (
                <div
                  key={material}
                  className="flex items-center gap-16 rounded-16 border border-border-subtle bg-bg-card p-20 text-body-m text-text-secondary"
                >
                  <Icon src="/img/icons/document.svg" className="size-[24px] shrink-0 text-icon-primary" />
                  {material}
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-24">
            <h2 className="text-h3 font-medium text-text-primary">
              Главные поинты
            </h2>
            <ul className="flex flex-col gap-16">
              {lesson.keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-12 text-body-l text-text-secondary">
                  <Icon
                    src="/img/icons/check.svg"
                    className="mt-4 size-[18px] shrink-0 text-icon-primary"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-16 rounded-24 bg-[linear-gradient(54.73deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)] p-24 md:p-40">
            <h2 className="text-h3 font-medium text-text-primary">
              Практика
            </h2>
            <p className="text-body-l text-text-secondary">
              {lesson.practice}
            </p>
          </section>

          <section className="flex flex-col gap-16 rounded-24 border border-border-subtle bg-bg-card p-24 shadow-elevation-xs md:p-40">
            <h2 className="text-h3 font-medium text-text-primary">
              Пример
            </h2>
            <p className="text-body-l text-text-secondary">
              {lesson.example}
            </p>
          </section>

          <section className="flex flex-col gap-16 rounded-24 border border-border-subtle p-24 md:p-40">
            <h2 className="text-h3 font-medium text-text-primary">
              Результат урока
            </h2>
            <p className="text-body-l text-text-secondary">
              {lesson.outcome}
            </p>
          </section>

          <nav aria-label="Переход между уроками" className="grid gap-16 border-t border-border-subtle pt-32 md:grid-cols-2">
            {previous ? (
              <Link href={smbLessonPath(previous.slug)} className={LESSON_NAV_CLASS}>
                <Icon src="/img/icons/arrow-next.svg" className="size-[20px] shrink-0 rotate-180 transition-transform group-hover:-translate-x-4" />
                <span className="flex min-w-0 flex-1 flex-col gap-8">
                  <span className="text-body-m text-text-secondary">Предыдущий урок</span>
                  <span className="text-body-l font-medium text-text-primary">{previous.title}</span>
                </span>
              </Link>
            ) : null}
            {next ? (
              <Link href={smbLessonPath(next.slug)} className={`${LESSON_NAV_CLASS} ${previous ? "" : "md:col-start-2"}`}>
                <span className="flex min-w-0 flex-1 flex-col gap-8">
                  <span className="text-body-m text-text-secondary">Следующий урок</span>
                  <span className="text-body-l font-medium text-text-primary">{next.title}</span>
                </span>
                <Icon src="/img/icons/arrow-next.svg" className="size-[20px] shrink-0 transition-transform group-hover:translate-x-4" />
              </Link>
            ) : (
              <Link href={SMB_COURSE_PATH} className={`${LESSON_NAV_CLASS} ${previous ? "" : "md:col-start-2"}`}>
                <span className="flex min-w-0 flex-1 flex-col gap-8">
                  <span className="text-body-m text-text-secondary">{SMB_COURSE_SHORT_TITLE}</span>
                  <span className="text-body-l font-medium text-text-primary">Все уроки курса</span>
                </span>
                <Icon src="/img/icons/arrow-next.svg" className="size-[20px] shrink-0 transition-transform group-hover:translate-x-4" />
              </Link>
            )}
          </nav>
        </article>

        <aside className="self-start lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <div className="rounded-24 border border-border-subtle bg-bg-card p-24 shadow-elevation-xs">
            <h2 className="text-h4 font-medium text-text-primary">
              Содержание курса
            </h2>
            <ol className="mt-24 flex flex-col gap-4">
              {SMB_LESSONS.map((item, itemIndex) => (
                <li key={item.slug}>
                  <Link
                    href={smbLessonPath(item.slug)}
                    aria-current={itemIndex === index ? "page" : undefined}
                    className={`flex gap-12 rounded-12 px-12 py-12 text-body-m transition-colors hover:bg-action-secondary-hover ${itemIndex === index ? "bg-[linear-gradient(227.17deg,#edf6ff_10.474%,#d4eeef_94.872%)] font-medium text-text-primary" : "text-text-secondary"}`}
                  >
                    <span className="shrink-0">{String(itemIndex + 1).padStart(2, "0")}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href={SMB_COURSE_PATH}
              className="mt-24 inline-flex items-center gap-8 text-body-m font-medium text-text-primary underline-offset-4 hover:underline"
            >
              Все уроки
              <Icon src="/img/icons/arrow-next.svg" className="size-[16px]" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
