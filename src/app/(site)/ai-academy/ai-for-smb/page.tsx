import type { Metadata } from "next";
import AcademyLessons from "@/components/academy/AcademyLessons";
import SmbLessonCard from "@/components/academy/SmbLessonCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { SMB_COURSE_SHORT_TITLE, SMB_COURSE_TITLE, SMB_LESSONS } from "@/content/ai-for-smb";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SMB_COURSE_TITLE} — Академия GigaCowork`,
  description:
    "Семь уроков о работе с ИИ в малом бизнесе: от первой задачи до агента, навыков и командного процесса.",
  path: "/ai-academy/ai-for-smb/",
});

export default function SmbCoursePage() {
  return (
    <>
      <section className="relative isolate flex min-h-[594px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-80 md:min-h-[760px] md:pt-[272px] md:pb-96">
        <Breadcrumbs
          items={[
            { label: "Академия", href: "/ai-academy" },
            { label: SMB_COURSE_SHORT_TITLE },
          ]}
        />
        <HeroImage
          desktop="/img/academy/hero.webp"
          mobile="/img/academy/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-24 text-center md:items-start md:text-left">
          <h1 className="max-w-[900px] text-h2 font-medium text-text-primary md:text-h1">
            {SMB_COURSE_TITLE}
          </h1>
          <p className="max-w-[620px] text-body-l text-text-secondary">
            Освойте GigaCowork на задачах малого бизнеса: от первого запроса
            до собственного агента и рабочего процесса для команды.
          </p>
          <Button href="#lessons" size="lg" className="mt-8">
            Перейти к урокам
          </Button>
        </div>
      </section>

      <section
        id="start"
        className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-120"
      >
        <div className="container-page flex flex-col gap-16">
          <Kicker>Обучение</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Начните работать с GigaCowork
          </h2>
          <p className="text-body-l text-text-primary">
            Короткие видео помогут освоить основные возможности платформы
            перед уроками курса.
          </p>
        </div>
        <div className="mt-32 md:mt-64">
          <AcademyLessons />
        </div>
      </section>

      <section
        id="lessons"
        className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-[linear-gradient(198.41deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)] py-64 md:py-120"
      >
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-16">
            <Kicker>Курс для малого бизнеса</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Уроки курса
            </h2>
            <p className="max-w-[740px] text-body-l text-text-secondary">
              Идите по порядку или начните с темы, которая сейчас важнее для
              вашего бизнеса. В каждом уроке есть рабочий пример и задание для
              практики.
            </p>
          </div>

          <ol className="grid gap-24 lg:grid-cols-2">
            {SMB_LESSONS.map((lesson, index) => (
              <li key={lesson.slug} className="min-w-0">
                <SmbLessonCard lesson={lesson} index={index} className="min-h-[300px]" />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
