import Link from "next/link";

import FirstTaskDemo, { FIRST_TASK_PROMPT, FIRST_TASK_PROMPT_NO_FILES } from "@/components/academy/FirstTaskDemo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { SmbOfferCta } from "@/components/sections/SmbOfferCta";
import {
  SMB_COURSE_PATH,
  SMB_COURSE_SHORT_TITLE,
  SMB_LESSONS,
  smbLessonPath,
  type SmbLesson,
} from "@/content/ai-for-smb";
import { GUIDES, guidePoster, type Guide } from "@/content/guides";
import { asset } from "@/lib/asset";
import SourceTextBlock from "@/app/(site)/marketplace-plugin/SourceTextBlock";

const LESSON_NAV_CLASS =
  "group flex min-h-[148px] min-w-0 items-center justify-between gap-16 rounded-24 border border-border-subtle bg-neutral-0 p-24 shadow-elevation-xs transition-shadow hover:shadow-drop-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary";
const LESSON_HIGHLIGHT_CLASS =
  "rounded-24 bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)] p-24 md:p-40";

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

function LessonTextContent({
  sections,
  numbered = true,
}: {
  sections: NonNullable<SmbLesson["textSections"]>;
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-col gap-48 md:gap-64">
      {sections.map((section, index) => (
        <section key={section.title} className="flex flex-col gap-16">
          <h2 className="text-h3 font-medium text-text-primary">
            {numbered ? `${index + 1}. ` : null}{section.title}
          </h2>
          {section.opening?.map((paragraph) => (
            <p key={paragraph} className="text-body-l text-text-secondary">{paragraph}</p>
          ))}
          {section.bullets ? (
            <ul className="list-disc space-y-8 pl-24 text-body-l text-text-secondary">
              {section.bullets.map((bullet) => (
                <li key={bullet.text}>
                  {bullet.label ? <strong className="font-medium text-text-primary">{bullet.label}: </strong> : null}
                  {bullet.text}
                </li>
              ))}
            </ul>
          ) : null}
          {section.steps ? (
            <ul className="flex flex-col gap-24">
              {section.steps.map((step) => (
                <li key={step.title} className="flex items-start gap-12">
                  <span aria-hidden="true" className="mt-[14px] size-[8px] shrink-0 rounded-full bg-icon-primary" />
                  <div className="flex flex-col gap-8">
                    <h3 className="text-h4 font-medium text-text-primary">{step.title}</h3>
                    <p className="text-body-l text-text-secondary">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          {section.closing?.map((paragraph) => (
            <p key={paragraph} className="text-body-l text-text-secondary">{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

function SupplementalLessonVideo({ guide }: { guide: Guide }) {
  return (
    <section className="flex flex-col gap-24">
      <div className="flex flex-col gap-12">
        <Kicker>Дополнительное видео</Kicker>
        <h2 className="text-h4 font-medium text-text-primary">{guide.title}</h2>
      </div>
      <GuideVideo guide={guide} />
    </section>
  );
}

function GuideVideo({ guide }: { guide: Guide }) {
  return <LessonVideo src={guide.video} poster={guidePoster(guide.id)} title={guide.title} />;
}

function LessonVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-24 border border-border-subtle bg-neutral-50 shadow-drop-sm">
      <video
        src={asset(src)}
        poster={poster ? asset(poster) : undefined}
        controls
        preload="metadata"
        playsInline
        aria-label={title}
        className="size-full object-cover"
      />
    </div>
  );
}

function EmbeddedLessonVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-24 border border-border-subtle bg-neutral-50 shadow-drop-sm">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
        allowFullScreen
        className="size-full border-0"
      />
    </div>
  );
}

export default function SmbLessonPage({ lesson, index }: { lesson: SmbLesson; index: number }) {
  const previous = SMB_LESSONS[index - 1];
  const next = SMB_LESSONS[index + 1];
  const supplemental = GUIDES.find(
    (guide) => guide.id === lesson.supplementalGuideId,
  );
  const lessonGuide = GUIDES.find(
    (guide) => guide.id === lesson.videoGuideId,
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
              { label: SMB_COURSE_SHORT_TITLE, href: SMB_COURSE_PATH },
              { label: `Урок ${index + 1}` },
            ]}
          />
          <div className="mt-40 flex max-w-[900px] flex-col items-start gap-24 md:mt-64">
            <div className="flex flex-wrap gap-8">
              <Kicker>Урок {index + 1}</Kicker>
              <Kicker>{lesson.durationLabel ?? `≈ ${lesson.estimatedMinutes} мин`}</Kicker>
            </div>
            <h1 className={`${index === 0 ? "text-[clamp(24px,7.5vw,30px)] leading-[1.2] text-balance" : "text-h2"} font-medium text-text-primary md:text-h1`}>
              {index === 0 ? (
                <>
                  <span>ИИ в малом бизнесе:</span>{" "}
                  <span className="md:block">
                    где он <span className="whitespace-nowrap">действительно полезен</span>
                  </span>
                </>
              ) : lesson.title}
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
            {(lesson.overview ?? [lesson.summary]).map((paragraph) => (
              <p key={paragraph} className="text-body-l text-text-secondary">
                {paragraph}
              </p>
            ))}
          </section>

          <section className={LESSON_HIGHLIGHT_CLASS}>
            <h2 className="text-h3 font-medium text-text-primary">
              Цель урока
            </h2>
            <p className="mt-16 text-body-l text-text-primary">
              {lesson.goal}
            </p>
          </section>

          {lesson.textSections ? (
            <LessonTextContent
              sections={lesson.textSections}
              numbered={lesson.numberTextSections !== false}
            />
          ) : (
            <section aria-labelledby="lesson-video" className="flex flex-col gap-24">
              <h2 id="lesson-video" className="text-h3 font-medium text-text-primary">
                Видео и материалы урока
              </h2>
              {lesson.videoEmbedSrc ? (
                <EmbeddedLessonVideo src={lesson.videoEmbedSrc} title={lesson.title} />
              ) : lesson.videoSrc ? (
                <LessonVideo src={lesson.videoSrc} poster={lesson.videoPoster} title={lesson.title} />
              ) : lessonGuide ? (
                <div className="flex flex-col gap-16">
                  <h3 className="text-h4 font-medium text-text-primary">{lessonGuide.title}</h3>
                  <GuideVideo guide={lessonGuide} />
                </div>
              ) : (
                <LessonVideoPlaceholder lesson={lesson} />
              )}
              {lesson.videoPlan ? (
                <div className="flex flex-col gap-12">
                  <h3 className="text-h4 font-medium text-text-primary">Описание видео</h3>
                  {(Array.isArray(lesson.videoPlan) ? lesson.videoPlan : [lesson.videoPlan]).map((paragraph) => (
                    <p key={paragraph} className="text-body-l text-text-secondary">{paragraph}</p>
                  ))}
                  {lesson.videoPlanBullets ? (
                    <ul className="list-disc space-y-8 pl-24 text-body-l text-text-secondary">
                      {lesson.videoPlanBullets.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  ) : null}
                  {lesson.videoPlanClosing ? (
                    <p className="text-body-l text-text-secondary">{lesson.videoPlanClosing}</p>
                  ) : null}
                </div>
              ) : null}
            </section>
          )}

          {lesson.lessonResources ? (
            <section className="flex flex-col gap-16">
              <h2 className="text-h3 font-medium text-text-primary">Материалы урока</h2>
              {lesson.lessonResources.map((resource) => (
                <div
                  key={resource.title}
                  className={`flex gap-16 rounded-16 border border-border-subtle p-16 ${resource.screenshotSrc ? "flex-col" : "items-start"} ${resource.href && /\.(pdf|zip)$/i.test(resource.href) ? "bg-action-secondary-hover" : "bg-bg-card"}`}
                >
                  {resource.screenshotSrc ? (
                    <>
                      <div className="flex flex-col gap-8">
                        <h3 className="text-body-l font-medium text-text-primary">{resource.title}</h3>
                        {resource.description ? <p className="text-body-m text-text-secondary">{resource.description}</p> : null}
                      </div>
                      <a
                        href={asset(resource.screenshotSrc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Открыть скриншот: ${resource.title}`}
                        className="block overflow-hidden rounded-12 border border-border-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                      >
                        <Image src={resource.screenshotSrc} alt="Раздел «Плагины» в каталоге GigaCowork" width={3420} height={1906} className="block h-auto w-full" />
                      </a>
                    </>
                  ) : (
                    <>
                      {resource.previewSrc && resource.href ? (
                        <a
                          href={asset(resource.href)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Посмотреть PDF: ${resource.title}`}
                          className="block h-[102px] w-[72px] shrink-0 overflow-hidden rounded-[10px] border border-border-subtle bg-neutral-0 shadow-elevation-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                        >
                          <Image src={resource.previewSrc} alt={`Первая страница: ${resource.title}`} width={495} height={700} className="size-full object-cover" />
                        </a>
                      ) : resource.href?.toLowerCase().endsWith(".zip") ? (
                        <span className="flex h-[102px] w-[72px] shrink-0 items-center justify-center rounded-[10px] border border-border-subtle bg-neutral-0 shadow-elevation-xs">
                          <Icon src="/img/icons/bot.svg" className="size-[40px] text-icon-primary" />
                        </span>
                      ) : (
                        <Icon src="/img/icons/document.svg" className="size-[24px] shrink-0 text-icon-primary" />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-12">
                        <div className="flex min-w-0 flex-col gap-4">
                          {resource.previewSrc || resource.href?.toLowerCase().endsWith(".zip") ? (
                            <span className="text-xs text-text-secondary">{resource.previewSrc ? "PDF" : "ZIP"}</span>
                          ) : null}
                          <span className="text-body-l text-text-primary">{resource.title}</span>
                        </div>
                        {resource.href ? (
                          <a
                            href={asset(resource.href)}
                            download={resource.href.startsWith("/") ? resource.downloadName ?? true : undefined}
                            target={resource.href.startsWith("/") ? undefined : "_blank"}
                            rel={resource.href.startsWith("/") ? undefined : "noopener noreferrer"}
                            aria-label={`Скачать: ${resource.title}`}
                            className="inline-flex shrink-0 items-center gap-8 rounded-full border border-border-subtle bg-neutral-0 px-16 py-8 text-body-m text-text-primary transition-colors hover:border-border-strong hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                          >
                            <Icon src="/img/icons/download.svg" className="size-[20px] text-icon-primary" />
                            Скачать
                          </a>
                        ) : (
                          <span className="text-body-m text-text-secondary">{resource.statusLabel ?? "Материал готовится"}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </section>
          ) : null}

          {supplemental && !lesson.supplementalAfterKeyPoints ? (
            <SupplementalLessonVideo guide={supplemental} />
          ) : null}

          {!lesson.textSections && !lesson.hidePdf ? (
            <section className="flex flex-col gap-16">
              <h2 className="text-h4 font-medium text-text-primary">PDF к уроку</h2>
              <div className="flex items-center gap-16 rounded-16 border border-border-subtle bg-action-secondary-hover p-20 text-body-m text-text-secondary">
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
            </section>
          ) : null}

          <section className="flex flex-col gap-24">
            <h2 className="text-h3 font-medium text-text-primary">
              {lesson.keyPointsTitle ?? "Главные поинты"}
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
            {lesson.keyPointsNote ? (
              <p className="text-body-l text-text-secondary">
                {lesson.keyPointsNote.before}
                <a
                  href={lesson.keyPointsNote.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary underline underline-offset-4 hover:no-underline"
                >
                  {lesson.keyPointsNote.linkLabel}
                </a>
                {lesson.keyPointsNote.after}
              </p>
            ) : null}
          </section>

          {supplemental && lesson.supplementalAfterKeyPoints ? (
            <SupplementalLessonVideo guide={supplemental} />
          ) : null}

          <section id={index === 0 ? "first-task" : undefined} className={`flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-16 ${LESSON_HIGHLIGHT_CLASS}`}>
            <h2 className="text-h3 font-medium text-text-primary">
              {lesson.practiceTitle ?? "Практика"}
            </h2>
            {lesson.practice && (
              <p className="text-body-l text-text-secondary">
                {lesson.practice}
              </p>
            )}
            {lesson.practiceParagraphs?.map((paragraph) => (
              <p key={paragraph} className="text-body-l text-text-secondary">{paragraph}</p>
            ))}
            {lesson.practiceSequence ? (
              <ol className="list-decimal space-y-12 pl-24 text-body-l text-text-secondary">
                {lesson.practiceSequence.map((step) => (
                  <li key={step.title} className="pl-4">
                    <strong className="font-medium text-text-primary">{step.title}</strong> — {step.text}
                  </li>
                ))}
              </ol>
            ) : null}
            {lesson.practicePromptIntro ? (
              <p className="text-body-l text-text-secondary">{lesson.practicePromptIntro}</p>
            ) : null}
            {lesson.practicePrompt ? (
              <SourceTextBlock label={lesson.practicePromptLabel ?? "Промпт"} text={lesson.practicePrompt} />
            ) : null}
            {lesson.practiceExample ? (
              <SourceTextBlock label={lesson.practiceExample.label} text={lesson.practiceExample.text} />
            ) : null}
            {lesson.practiceClosing ? (
              <p className="text-body-l text-text-secondary">{lesson.practiceClosing}</p>
            ) : null}
            {lesson.practiceSteps ? (
              <ol className="flex min-w-0 flex-col gap-32">
                {lesson.practiceSteps.map((step) => (
                  <li key={step.title} className="flex min-w-0 flex-col gap-16 border-t border-border-subtle pt-24">
                    <h3 className="text-h4 font-medium text-text-primary">{step.title}</h3>
                    <p className="text-body-l text-text-secondary">{step.instruction}</p>
                    <SourceTextBlock label={step.promptLabel ?? "Промпт"} text={step.prompt} />
                    {step.followup ? <p className="text-body-l text-text-secondary">{step.followup}</p> : null}
                  </li>
                ))}
              </ol>
            ) : null}
            {lesson.practiceWorkflow ? (
              <div className="flex min-w-0 flex-col gap-32">
                <div className="flex flex-col gap-16">
                  <p className="text-body-l text-text-secondary">{lesson.practiceWorkflow.intro}</p>
                  <div className="flex flex-col gap-12">
                    {lesson.practiceWorkflow.files.map((file) => (
                      <div key={file.href} className="flex flex-wrap items-center justify-between gap-16 rounded-16 border border-border-subtle bg-neutral-0 p-16">
                        <span className="flex items-center gap-12 text-body-m font-medium text-text-primary">
                          <Icon src="/img/icons/document.svg" className="size-[24px] shrink-0 text-icon-primary" />
                          {file.title}
                        </span>
                        <a
                          href={file.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Скачать: ${file.title}`}
                          className="inline-flex items-center gap-8 rounded-full border border-border-subtle px-16 py-8 text-body-m text-text-primary transition-colors hover:bg-action-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                        >
                          <Icon src="/img/icons/download.svg" className="size-[20px] text-icon-primary" />
                          Скачать
                        </a>
                      </div>
                    ))}
                  </div>
                  <p className="text-body-l text-text-secondary">{lesson.practiceWorkflow.afterFiles}</p>
                </div>
                {lesson.practiceWorkflow.steps.map((step, stepIndex) => (
                  <section key={step.title} className="flex min-w-0 flex-col gap-16 border-t border-border-subtle pt-24">
                    <h3 className="text-h4 font-medium text-text-primary">{step.title}</h3>
                    <p className="text-body-l text-text-secondary">{step.instruction}</p>
                    <SourceTextBlock label={`Промпт для шага ${stepIndex + 1}`} text={step.prompt} />
                    {step.followup ? <p className="text-body-l text-text-secondary">{step.followup}</p> : null}
                  </section>
                ))}
                <p className="text-body-l text-text-secondary">{lesson.practiceWorkflow.closing}</p>
              </div>
            ) : null}
            {index === 0 && (
              <div className="flex min-w-0 flex-col gap-32 md:gap-40">
                <FirstTaskDemo showSteps stableHeight />
                <div className="flex flex-col gap-24">
                  <p className="text-body-l text-text-secondary">Откройте GigaCowork, скопируйте промпт, приложите свои файлы и проверьте ответ.</p>
                  <div className="grid min-w-0 gap-16 xl:grid-cols-2">
                    <SourceTextBlock label="Если есть файлы" text={FIRST_TASK_PROMPT} />
                    <SourceTextBlock label="Если файлов пока нет" text={FIRST_TASK_PROMPT_NO_FILES} />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-16 rounded-24 border border-border-subtle p-24 md:p-40">
            <h2 className="text-h3 font-medium text-text-primary">
              Результат урока
            </h2>
            {(Array.isArray(lesson.outcome) ? lesson.outcome : [lesson.outcome]).map((paragraph) => (
              <p key={paragraph} className="text-body-l text-text-secondary">
                {paragraph}
              </p>
            ))}
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
      <SmbOfferCta />
    </>
  );
}
