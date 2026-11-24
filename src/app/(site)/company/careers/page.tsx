import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { ClientLogoMarquee } from "@/components/sections/Clients";
import Button from "@/components/ui/Button";
import HeroImage from "@/components/ui/HeroImage";
import Icon from "@/components/ui/Icon";
import Image from "@/components/ui/Image";
import Kicker from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";

import {
  BENEFITS,
  EMPLOYER_URL,
  HIRING_STEPS,
  RECRUITER_TELEGRAM_URL,
  RECRUITMENT_EMAIL,
  RECRUITMENT_MAILTO,
  STATS,
  TEAMS,
  VACANCIES_URL,
} from "./content";
import styles from "./careers.module.css";
import VacanciesWidget from "./VacanciesWidget";

const IMAGE_ROOT = "/img/careers";

export const metadata = pageMetadata({
  title: "Работа у нас — вакансии GigaCowork",
  description: "Работа в GigaCowork. Узнайте о командах, открытых вакансиях и процессе найма.",
  path: "/company/careers/",
});

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-16">
      <Kicker>{kicker}</Kicker>
      <h2 className="text-h3 md:text-h2">{title}</h2>
      {description && <p className="text-body-l text-text-secondary">{description}</p>}
    </div>
  );
}

function GrowthIllustration() {
  return (
    <div className={styles.featureIllustration} aria-hidden="true">
      <p>Темп роста</p>
      <div className="grid gap-4">
        <p className="text-text-secondary">Рынок корпоративного ИИ</p>
        <div className={styles.growthTrack}>
          <span className="w-[24%]" />
        </div>
      </div>
      <div className="grid gap-4">
        <p className="flex items-center gap-8">
          GigaCowork <span className={styles.growthChip}>×3</span>
        </p>
        <div className={styles.growthTrack}>
          <span className="w-[72%]" />
        </div>
      </div>
    </div>
  );
}

function TechnologyIllustration() {
  return (
    <div className={styles.featureIllustration} aria-hidden="true">
      <p>Развертывание</p>
      <ul className={styles.technologyTabs}>
        <li>Облако</li>
        <li>Гибрид</li>
        <li>ПАК</li>
      </ul>
      <ul className={styles.technologyLayers}>
        <li>LLM</li>
        <li>Навыки</li>
        <li>MCP-интеграции</li>
      </ul>
    </div>
  );
}

export default function CareersPage() {
  return (
    <div className="text-text-primary">
      <section className={styles.hero}>
        <HeroImage
          desktop={`${IMAGE_ROOT}/hero.webp`}
          mobile={`${IMAGE_ROOT}/hero-mobile.webp`}
          className={styles.heroImage}
        />
        <div className="container-page">
          <div className="flex flex-col gap-32 text-center md:text-left">
            <div className="flex flex-col gap-16 md:gap-24">
              <h1 className="text-h1">Работа в&nbsp;GigaCowork</h1>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary md:max-w-[850px]">
                <p>Здесь строят корпоративный ИИ&nbsp;для&nbsp;российского бизнеса.</p>
                <p>
                  Присоединяйтесь, если хотите работать над&nbsp;продуктом,
                  который уже&nbsp;используют компании по&nbsp;всей стране.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-24 md:flex-row md:gap-16">
              <Button
                href={VACANCIES_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-[230px] max-w-full md:w-auto"
              >
                Смотреть вакансии
              </Button>
              <Button href="#hiring" size="lg" variant="secondary" className="w-[230px] max-w-full md:w-auto">
                Как&nbsp;к&nbsp;нам&nbsp;попасть
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col gap-32 pt-64 pb-64 md:pb-[71px]">
        <h2 className="text-h3 md:text-h2">О&nbsp;нас</h2>
        <ul className="grid gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-4">
          {STATS.map(({ value, lines }) => (
            <li key={value} className={`${styles.stat} flex flex-col gap-8 rounded-16 p-24`}>
              <p className="text-h1">{value}</p>
              <p className="text-body-m text-text-secondary">
                {lines.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <>{' '}<br className="hidden lg:inline" /></>}
                    {line}
                  </Fragment>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Клиенты GigaCowork" className="flex flex-col items-center pb-64">
        <ClientLogoMarquee singleRow />
        <Link
          href="/special-project/"
          className="inline-flex items-center gap-8 rounded-full px-24 py-12 text-body-m transition-colors hover:bg-action-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Все&nbsp;кейсы
          <Icon src="/img/icons/arrow-up-right.svg" className="size-[10px]" />
        </Link>
      </section>

      <section id="vacancies" className={`${styles.teams} ${styles.anchor} py-64 md:py-96`}>
        <div className="container-page flex flex-col gap-32 md:gap-64">
          <SectionHeading
            kicker="Вакансии"
            title="Открытые вакансии"
            description="Мы растем, и новые позиции открываются регулярно"
          />
          <div className="flex flex-col gap-64">
            {TEAMS.map(({ title, image, paragraphs, roles, note }) => (
              <article key={title} className={styles.team}>
                <div className="flex min-w-0 flex-col items-start gap-24">
                  <h3 className="text-h4 md:text-h3">{title}</h3>
                  <div className="flex flex-col gap-[14px] text-body-m text-text-secondary">
                    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  <div className="flex flex-col gap-12">
                    <p className="text-caption">Сейчас ищем</p>
                    <ul className="flex flex-wrap gap-8">
                      {roles.map((role) => <li key={role} className={styles.role}>{role}</li>)}
                    </ul>
                    {note && <p className="text-caption text-text-secondary">{note}</p>}
                  </div>
                  <Button
                    href={VACANCIES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    variant="secondary"
                    aria-label={`Смотреть вакансии — ${title}`}
                  >
                    Смотреть вакансии
                  </Button>
                </div>
                <div className={styles.teamIllustration} data-team={image}>
                  <Image
                    src={`${IMAGE_ROOT}/${image}.webp`}
                    alt=""
                    width={image === "business" ? 1600 : 964}
                    height={image === "business" ? 1200 : 600}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col gap-32 py-64 md:gap-48 md:py-96">
        <SectionHeading kicker="hh.ru" title="Посмотреть все вакансии" />
        <VacanciesWidget />
      </section>

      <section className={`${styles.contacts} py-64 md:py-96`}>
        <div className="container-page">
          <div className={`${styles.team} ${styles.contactRow}`}>
            <div className="flex flex-col gap-24">
              <SectionHeading
                kicker="Контакты"
                title={<a href={RECRUITMENT_MAILTO}>Не&nbsp;нашли свою роль?</a>}
                description="Напишите нам и расскажите о себе"
              />
              <div className="flex flex-col gap-16 md:flex-row">
                <Button href={RECRUITMENT_MAILTO} size="lg">Отправить резюме</Button>
                <Button href={EMPLOYER_URL} target="_blank" rel="noopener noreferrer" size="lg" variant="secondary">
                  Мы&nbsp;на&nbsp;hh.ru
                </Button>
              </div>
            </div>
            <div className={`${styles.contactCard} flex flex-col items-start gap-24 rounded-16 p-24 text-caption text-text-secondary`}>
              <div className="flex w-full flex-col items-start gap-8">
                <p>Наша почта, отвечаем быстро</p>
                <a className="py-4 hover:underline md:text-status-accent" href={RECRUITMENT_MAILTO}>
                  {RECRUITMENT_EMAIL}
                </a>
              </div>
              <div className="flex w-full flex-col items-start gap-8">
                <p>Telegram</p>
                <a
                  href={RECRUITER_TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-8 hover:underline md:text-status-accent"
                >
                  <Image src={`${IMAGE_ROOT}/telegram.svg`} alt="" width={27} height={27} className="shrink-0" />
                  Написать рекрутеру
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col gap-32 py-64 md:py-96">
        <SectionHeading kicker="Преимущества" title="Почему у нас хорошо" />
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {BENEFITS.slice(0, 2).map(({ title, paragraphs }, index) => (
            <article key={title} className={styles.feature}>
              <div className="flex flex-col gap-16">
                <h3 className="text-h4 md:text-h3">{title}</h3>
                <div className="flex flex-col gap-16 text-body-l text-text-secondary xl:whitespace-pre-line">
                  {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              {index === 0 ? <GrowthIllustration /> : <TechnologyIllustration />}
            </article>
          ))}
        </div>
        <div className="grid gap-16 md:grid-cols-3 md:gap-24">
          {BENEFITS.slice(2).map(({ title, paragraphs }) => (
            <article key={title} className={`${styles.benefit} flex flex-col gap-12 p-24`}>
              <h3 className="text-h4">{title}</h3>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary max-md:whitespace-pre-line">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="hiring" className={`${styles.hiring} ${styles.anchor} py-64 md:py-96`}>
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <SectionHeading
            kicker="Процесс найма"
            title="Как к нам попасть"
            description={
              <>
                Процесс найма занимает в&nbsp;среднем{" "}
                <br className="md:hidden" />
                2–3&nbsp;недели. После каждого этапа мы&nbsp;обязательно возвращаемся с&nbsp;обратной связью.
              </>
            }
          />
          <ol className="grid gap-24 md:grid-cols-3 lg:grid-cols-5">
            {HIRING_STEPS.map(({ title, description }, index) => (
              <li key={title} className="flex flex-col gap-[20px]">
                <span aria-hidden="true" className={`${styles.stepNumber} text-h1`}>0{index + 1}</span>
                <div className="flex flex-col gap-8">
                  <h3 className="text-h4 md:text-h3 lg:whitespace-pre-line">{title}</h3>
                  <p className="text-body-m text-text-secondary">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.cta} px-24 py-64 md:py-160`}>
        <Image src={`${IMAGE_ROOT}/cta.webp`} alt="" width={1024} height={677} className={styles.ctaImage} />
        <div className="relative mx-auto flex max-w-[588px] flex-col items-center gap-40 text-center">
          <div className="flex flex-col gap-32">
            <h2 className="text-h3 md:text-h2">Присоединяйтесь, если</h2>
            <div className="flex flex-col gap-16 text-body-l">
              <p>Хотите создавать востребованное в&nbsp;России ИИ-решение, которое уже&nbsp;работает в&nbsp;крупных компаниях</p>
              <p>Цените скорость, прямую обратную связь и&nbsp;возможность влиять на&nbsp;продукт</p>
              <p>Готовы отвечать за&nbsp;результат целиком, от&nbsp;идеи до&nbsp;внедрения</p>
            </div>
          </div>
          <Button href={RECRUITMENT_MAILTO} size="lg">Отправить резюме</Button>
        </div>
      </section>
    </div>
  );
}
