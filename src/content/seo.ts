/**
 * SEO-описания страниц: метатеги и микроразметка Schema.org.
 *
 * Перенесено из документов SEO-специалиста (по одному .docx на страницу),
 * тексты дословно. Здесь только данные — как их разложить по тегам, знают
 * src/lib/site.ts (метатеги) и компонент JsonLd (микроразметка).
 *
 * Три отступления от документов, все осознанные:
 *
 * 1. Адреса страниц (canonical, og:url, `url` и `item` в графе) приведены к
 *    виду с завершающим слэшем — именно так их отдаёт сайт (`trailingSlash`
 *    в next.config). В документах слэша нет, и canonical указывал бы на
 *    адрес, который отвечает переадресацией. `@id` оставлены дословно: это
 *    идентификаторы узлов графа, по ним страницы ссылаются друг на друга.
 *
 * 2. og:image везде — карточка 1200×630 из src/lib/site.ts. В документе
 *    главной стоял ещё не существующий /og/home.jpg, у «О платформе» —
 *    незаполненная заглушка.
 *
 * 3. В роликах «Обучающих видео» заглушки заменены настоящими значениями:
 *    contentUrl — файлы из public/video, thumbnailUrl — постеры первых
 *    кадров (public/img/guides), uploadDate — дата появления роликов в
 *    проекте. Её стоит заменить на настоящую дату публикации.
 */

export type PageSeo = {
  /** Адрес страницы от корня сайта. */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** Заголовок карточки в соцсетях, если отличается от <title>. */
  ogTitle?: string;
  ogDescription?: string;
  /** Граф Schema.org — уходит в <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>;
};

export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    path: "/",
    title: "Платформа ИИ-агентов для бизнеса и автоматизации — GigaCowork",
    description:
      "GigaCowork — платформа ИИ-агентов для бизнеса. Автоматизируйте задачи сотрудников, подключайте корпоративные системы и ускоряйте рабочие процессы.",
    keywords:
      "ии для бизнеса, платформа ии агентов, ии-агенты для бизнеса, корпоративная ии платформа, автоматизация бизнеса с помощью ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Платформа ИИ-агентов для бизнеса — GigaCowork",
    ogDescription:
      "Автоматизируйте задачи сотрудников, подключайте корпоративные системы и ускоряйте рабочие процессы с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
          taxID: "7804568396",
          email: "info@gigab2b.ru",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Кутузовский проспект, д. 32",
            addressLocality: "Москва",
            postalCode: "121170",
            addressCountry: "RU",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/#webpage",
          url: "https://cowork.ru/",
          name: "Платформа ИИ-агентов для бизнеса и автоматизации — GigaCowork",
          description:
            "GigaCowork — платформа ИИ-агентов для бизнеса. Автоматизируйте задачи сотрудников, подключайте корпоративные системы и ускоряйте рабочие процессы.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          about: {
            "@id": "https://cowork.ru/ai-platform#software",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform#software",
          name: "GigaCowork",
          url: "https://cowork.ru/ai-platform/",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
      ],
    },
  },
  aiPlatform: {
    path: "/ai-platform/",
    title: "GigaCowork: корпоративная платформа ИИ-агентов для всей компании",
    description:
      "GigaCowork — корпоративная платформа ИИ-агентов: рабочие пространства, коннекторы, базы знаний, автоматизация по расписанию и безопасное развертывание.",
    keywords:
      "корпоративная платформа ии агентов, корпоративная ии платформа, ии агенты для компании, создание ии агентов без кода, автоматизация задач ии",
    ogTitle: "Корпоративная платформа ИИ-агентов — GigaCowork",
    ogDescription:
      "Рабочие пространства, ИИ-агенты без кода, интеграции, автоматизация задач и корпоративная безопасность.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform#webpage",
          url: "https://cowork.ru/ai-platform/",
          name: "GigaCowork: корпоративная платформа ИИ-агентов для всей компании",
          description:
            "Обзор возможностей корпоративной платформы ИИ-агентов GigaCowork.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform#software",
          name: "GigaCowork",
          url: "https://cowork.ru/ai-platform/",
          description:
            "Корпоративная платформа для создания ИИ-агентов, совместной работы и автоматизации задач сотрудников.",
          applicationCategory: "BusinessApplication",
          applicationSubCategory: "Корпоративная платформа ИИ-агентов",
          operatingSystem: "Web",
          inLanguage: "ru-RU",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Компании и корпоративные пользователи",
          },
          featureList: [
            "Создание ИИ-агентов без разработки",
            "Командные и личные рабочие пространства",
            "Подключение корпоративных систем и баз знаний",
            "Быстрые команды и навыки",
            "Запуск задач по расписанию или событию",
            "Ролевая модель доступа и SSO",
            "Мониторинг и логирование операций",
            "Облачное, гибридное и локальное развертывание",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
          ],
        },
      ],
    },
  },
  guides: {
    path: "/guides/",
    title: "Как работать с GigaCowork — видеоинструкции",
    description:
      "Короткие видеоинструкции по работе с платформой GigaCowork: агенты, задачи, пространства, коннекторы.",
    keywords:
      "видеоинструкции gigacowork, как работать с gigacowork, обучение работе с ии агентами, подключение коннекторов gigacowork, быстрые команды gigacowork, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Как работать с GigaCowork — видеоинструкции",
    ogDescription:
      "Короткие видео о ключевых возможностях платформы: постановка задач, навыки агентов, команды, коннекторы и совместные пространства.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/guides#webpage",
          url: "https://cowork.ru/guides/",
          name: "Как работать с GigaCowork — видеоинструкции",
          description:
            "Короткие видеоинструкции по работе с платформой GigaCowork: агенты, задачи, пространства, коннекторы.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/guides#collection",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/guides#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "CollectionPage",
          "@id": "https://cowork.ru/guides#collection",
          name: "Видеоинструкции по работе с GigaCowork",
          hasPart: [
            {
              "@type": "VideoObject",
              name: "Обзор возможностей платформы",
              description:
                "Первый релиз GigaCowork: анализ документов, автоматизация рутинных задач, навыки, подключение систем и совместная работа с коллегами.",
              thumbnailUrl: "https://cowork.ru/img/guides/overview-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/overview.mp4",
            },
            {
              "@type": "VideoObject",
              name: "Первый запуск: как поставить задачу",
              description:
                "Как сформулировать задачу агенту своими словами без предварительных настроек.",
              thumbnailUrl:
                "https://cowork.ru/img/guides/first-task-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/first-task.mp4",
            },
            {
              "@type": "VideoObject",
              name: "Как создать навык для агента",
              description:
                "Как описать набор правил для решения задачи и сохранить его как навык агента.",
              thumbnailUrl:
                "https://cowork.ru/img/guides/agent-skill-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/agent-skill.mp4",
            },
            {
              "@type": "VideoObject",
              name: "Быстрые команды",
              description:
                "Как сохранить повторяющийся запрос как /команду для запуска сценария за секунду.",
              thumbnailUrl:
                "https://cowork.ru/img/guides/quick-commands-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/quick-commands.mp4",
            },
            {
              "@type": "VideoObject",
              name: "Как подключить корпоративные системы",
              description:
                "Подключение корпоративных систем к агенту через открытый стандарт MCP и готовые коннекторы.",
              thumbnailUrl:
                "https://cowork.ru/img/guides/connectors-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/connectors.mp4",
            },
            {
              "@type": "VideoObject",
              name: "Как добавить коллег и создать общие документы",
              description:
                "Совместные пространства: общий доступ к документам и знаниям проекта для всей команды.",
              thumbnailUrl: "https://cowork.ru/img/guides/spaces-poster.webp",
              uploadDate: "2026-08-14",
              contentUrl: "https://cowork.ru/video/spaces.mp4",
            },
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/guides#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Обучающие видео",
              item: "https://cowork.ru/guides/",
            },
          ],
        },
      ],
    },
  },
  ceo: {
    path: "/use_cases/ceo/",
    title: "GigaCowork: ИИ-агенты для управленческих решений",
    description:
      "GigaCowork — ИИ-агенты для руководителей: управленческие сводки, анализ рынка, проверка стратегии и матрица ответственности RACI.",
    keywords:
      "ии агенты для руководителей, автоматизация управленческих решений, управленческая сводка ии, анализ рынка ии, проверка стратегии ии, матрица raci ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для управленческих решений — GigaCowork",
    ogDescription:
      "Ускоряйте принятие решений: управленческие сводки, актуальная картина рынка, проверка стратегии и матрица ответственности с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/ceo#webpage",
          url: "https://cowork.ru/use_cases/ceo/",
          name: "GigaCowork: ИИ-агенты для управленческих решений",
          description:
            "ИИ-агенты GigaCowork для руководителей: управленческие сводки, анализ рынка, проверка стратегии и матрица ответственности RACI.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/ceo#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/ceo#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/ceo#service",
          name: "ИИ-агенты для управленческих решений",
          description:
            "Подготовка управленческих сводок, суммаризация договорённостей из встреч и переписки, построение актуальной картины рынка, проверка стратегии с разных точек зрения и подготовка матрицы ответственности RACI с помощью ИИ-агентов GigaCowork.",
          serviceType:
            "Автоматизация управленческой аналитики с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Руководители и топ-менеджмент компаний",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/ceo#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Управление",
              item: "https://cowork.ru/use_cases/ceo/",
            },
          ],
        },
      ],
    },
  },
  finance: {
    path: "/use_cases/finance/",
    title: "GigaCowork: ИИ-агенты для финансового блока",
    description:
      "GigaCowork — платформа ИИ-агентов для бизнеса. Автоматизируйте задачи сотрудников, подключайте корпоративные системы и ускоряйте рабочие процессы.",
    keywords:
      "ии агенты для финансистов, автоматизация финансового учета, ии для финансового отдела, сверка документов ии, анализ отклонений бюджета ии, автоматизация отчетности, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для финансового блока — GigaCowork",
    ogDescription:
      "Автоматизируйте подготовку отчётов, сверку расхождений и анализ отклонений бюджета с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/finance#webpage",
          url: "https://cowork.ru/use_cases/finance/",
          name: "GigaCowork: ИИ-агенты для финансового блока",
          description:
            "ИИ-агенты GigaCowork для финансовых специалистов: подготовка отчётов, сверка расхождений и анализ отклонений бюджета.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/finance#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/finance#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/finance#service",
          name: "ИИ-агенты для финансового блока",
          description:
            "Автоматизация подготовки отчётности, сверки расхождений, анализа отклонений бюджета и подготовки сопроводительной документации по инвестиционным проектам с помощью ИИ-агентов GigaCowork.",
          serviceType:
            "Автоматизация финансовых процессов с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Финансовые специалисты и финансовый блок компаний",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/finance#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Финансы",
              item: "https://cowork.ru/use_cases/finance/",
            },
          ],
        },
      ],
    },
  },
  salesforce: {
    path: "/use_cases/salesforce/",
    title: "GigaCowork: ИИ-агенты для отдела продаж",
    description:
      "GigaCowork — ИИ-агенты для продаж: работа с CRM, подготовка КП и отчётов по плану продаж, анализ обратной связи клиентов.",
    keywords:
      "ии агенты для продаж, автоматизация отдела продаж, ии для crm, подготовка коммерческих предложений ии, анализ отзывов клиентов ии, отчеты по продажам ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для отдела продаж — GigaCowork",
    ogDescription:
      "Автоматизируйте работу с CRM, подготовку коммерческих предложений и отчётов по продажам с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/salesforce#webpage",
          url: "https://cowork.ru/use_cases/salesforce/",
          name: "GigaCowork: ИИ-агенты для отдела продаж",
          description:
            "ИИ-агенты GigaCowork для продаж: работа с CRM, подготовка коммерческих предложений и отчётов по плану продаж, анализ обратной связи клиентов.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/salesforce#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/salesforce#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/salesforce#service",
          name: "ИИ-агенты для отдела продаж",
          description:
            "Автоматизация работы с CRM, подготовка коммерческих предложений и писем клиентам, формирование ежемесячных отчётов по плану продаж и анализ обратной связи клиентов с помощью ИИ-агентов GigaCowork.",
          serviceType: "Автоматизация процессов продаж с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Специалисты и руководители отдела продаж",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/salesforce#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Продажи",
              item: "https://cowork.ru/use_cases/salesforce/",
            },
          ],
        },
      ],
    },
  },
  procurement: {
    path: "/use_cases/procurement/",
    title: "GigaCowork: ИИ-агенты для отдела закупок",
    description:
      "GigaCowork — ИИ-агенты для закупщиков: анализ предложений поставщиков, управление запасами, подбор аналогов и подготовка проектов договоров.",
    keywords:
      "ии агенты для закупок, автоматизация отдела закупок, анализ предложений поставщиков ии, управление запасами ии, подбор поставщиков ии, автоматизация тендеров, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для отдела закупок — GigaCowork",
    ogDescription:
      "Анализируйте предложения поставщиков, управляйте запасами и готовьте проекты договоров быстрее с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/procurement#webpage",
          url: "https://cowork.ru/use_cases/procurement/",
          name: "GigaCowork: ИИ-агенты для отдела закупок",
          description:
            "ИИ-агенты GigaCowork для закупщиков: анализ предложений поставщиков, управление запасами и подготовка проектов договоров.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/procurement#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/procurement#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/procurement#service",
          name: "ИИ-агенты для отдела закупок",
          description:
            "Анализ предложений поставщиков, управление запасами, подбор аналогов поставщиков и МТР, подготовка проектов договоров и рассмотрение заявок участников с помощью ИИ-агентов GigaCowork.",
          serviceType:
            "Автоматизация закупочных процессов с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Специалисты и руководители отдела закупок",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/procurement#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Закупки",
              item: "https://cowork.ru/use_cases/procurement/",
            },
          ],
        },
      ],
    },
  },
  legalTeam: {
    path: "/use_cases/legal-team/",
    title: "GigaCowork: ИИ-агенты для юристов и правового блока",
    description:
      "GigaCowork — ИИ-агенты для юристов: проверка договоров на риски, сравнение версий, подготовка претензий и анализ судебной практики.",
    keywords:
      "ии агенты для юристов, автоматизация юридического отдела, проверка договоров ии, сравнение версий договора ии, подготовка претензий ии, анализ рисков договора, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для юристов — GigaCowork",
    ogDescription:
      "Проверяйте договоры на риски, сравнивайте версии и готовьте претензии быстрее с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/legal-team#webpage",
          url: "https://cowork.ru/use_cases/legal-team/",
          name: "GigaCowork: ИИ-агенты для юристов и правового блока",
          description:
            "ИИ-агенты GigaCowork для юристов: проверка договоров на риски, сравнение версий и подготовка претензий.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/legal-team#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/legal-team#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/legal-team#service",
          name: "ИИ-агенты для юристов",
          description:
            "Проверка договоров на риски, сравнение версий, подготовка претензий и анализ судебной практики с помощью ИИ-агентов GigaCowork.",
          serviceType:
            "Автоматизация юридических процессов с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Юристы и правовой блок компаний",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/legal-team#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Юристы",
              item: "https://cowork.ru/use_cases/legal-team/",
            },
          ],
        },
      ],
    },
  },
  hrTeam: {
    path: "/use_cases/hr-team/",
    title: "GigaCowork: ИИ-агенты для HR и подбора персонала",
    description:
      "GigaCowork — ИИ-агенты для HR: подбор и оценка кандидатов, составление вакансий, онбординг сотрудников и автоматизация HR-коммуникаций.",
    keywords:
      "ии агенты для hr, автоматизация подбора персонала, ии для рекрутинга, оценка кандидатов ии, онбординг новых сотрудников ии, составление вакансий ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для HR — GigaCowork",
    ogDescription:
      "Автоматизируйте подбор кандидатов, составление вакансий и онбординг сотрудников с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/hr-team#webpage",
          url: "https://cowork.ru/use_cases/hr-team/",
          name: "GigaCowork: ИИ-агенты для HR и подбора персонала",
          description:
            "ИИ-агенты GigaCowork для HR: подбор и оценка кандидатов, составление вакансий и онбординг новых сотрудников.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/hr-team#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/hr-team#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/hr-team#service",
          name: "ИИ-агенты для HR",
          description:
            "Подбор и оценка кандидатов на основе анализа резюме, составление вакансий, адаптация новых сотрудников и автоматизация HR-коммуникаций с помощью ИИ-агентов GigaCowork.",
          serviceType: "Автоматизация HR-процессов с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "HR-специалисты и рекрутеры",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/hr-team#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "HR и кадры",
              item: "https://cowork.ru/use_cases/hr-team/",
            },
          ],
        },
      ],
    },
  },
  accounting: {
    path: "/use_cases/accounting/",
    title: "GigaCowork: ИИ-агенты для бухгалтерии",
    description:
      "GigaCowork — ИИ-агенты для бухгалтерии: обработка первичных документов, сверка расхождений, подготовка отчётности и работа с 1С.",
    keywords:
      "ии агенты для бухгалтерии, автоматизация бухгалтерского учета, обработка первичных документов ии, сверка расхождений ии, подготовка отчетности ии, ии для 1с, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для бухгалтерии — GigaCowork",
    ogDescription:
      "Автоматизируйте обработку первичных документов, сверку расхождений и подготовку отчётности с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/accounting#webpage",
          url: "https://cowork.ru/use_cases/accounting/",
          name: "GigaCowork: ИИ-агенты для бухгалтерии",
          description:
            "ИИ-агенты GigaCowork для бухгалтерии: обработка первичных документов, сверка расхождений и подготовка отчётности.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/accounting#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/accounting#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/accounting#service",
          name: "ИИ-агенты для бухгалтерии",
          description:
            "Автоматический ввод первичной документации в 1С, поиск расхождений, анализ договоров и подготовка бухгалтерской, налоговой и кадровой отчётности с помощью ИИ-агентов GigaCowork.",
          serviceType:
            "Автоматизация бухгалтерских процессов с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Бухгалтеры и сотрудники учётного блока",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/accounting#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Бухгалтерия",
              item: "https://cowork.ru/use_cases/accounting/",
            },
          ],
        },
      ],
    },
  },
  itSupport: {
    path: "/use_cases/it-support/",
    title: "GigaCowork: ИИ-агенты для ИТ-поддержки",
    description:
      "GigaCowork — ИИ-агенты для службы поддержки: обработка типовых заявок, разбор инцидентов и логов, работа с базой знаний и ITSM.",
    keywords:
      "ии агенты для ит поддержки, автоматизация service desk, ии для первой линии поддержки, разбор инцидентов ии, автоматизация itsm, ии агент сервис деска, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для ИТ-поддержки — GigaCowork",
    ogDescription:
      "Автоматизируйте обработку типовых заявок, разбор инцидентов и логов с ИИ-агентами GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/use_cases/it-support#webpage",
          url: "https://cowork.ru/use_cases/it-support/",
          name: "GigaCowork: ИИ-агенты для ИТ-поддержки",
          description:
            "ИИ-агенты GigaCowork для службы поддержки: обработка типовых заявок, разбор инцидентов и логов, работа с базой знаний и ITSM.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/use_cases/it-support#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/use_cases/it-support#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/use_cases/it-support#service",
          name: "ИИ-агенты для ИТ-поддержки",
          description:
            "Обработка типовых заявок первой линии, разбор инцидентов и логов приложений, работа с базой знаний, ITSM- и APM-системами, классификация обращений и эскалация сложных инцидентов специалистам с помощью ИИ-агентов GigaCowork.",
          serviceType: "Автоматизация ИТ-поддержки с помощью ИИ-агентов",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Специалисты и руководители ИТ-поддержки",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/use_cases/it-support#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "ИТ-поддержка",
              item: "https://cowork.ru/use_cases/it-support/",
            },
          ],
        },
      ],
    },
  },
  /*
    Десять страниц, размеченных последними: шесть разделов «О платформе»,
    «Безопасность», «Поставки», «О компании» и «Партнёрам». Тексты и графы —
    из документов SEO-специалиста, дословно, с теми же тремя отступлениями,
    что описаны в шапке файла.

    До появления документов у этих страниц метатеги были прописаны прямо в
    файлах страниц, а микроразметки не было вовсе. Черновой граф, собранный
    тогда своими силами, заменён полностью: в документах он подробнее —
    `Product` с каталогом поставок и `FAQPage` у «Поставок», `Service` плюс
    `FAQPage` у «Безопасности», `AboutPage` с реквизитами у «О компании».

    Ещё одно отступление, четвёртое к трём из шапки: тексты ответов в обоих
    `FAQPage` взяты со страниц, а не из документов. Разметка FAQ обязана
    повторять то, что человек видит на странице, — иначе Google считает её
    недостоверной и снимает расширенный сниппет. Вопросы совпадали и так,
    восемь ответов были переписаны под фразы со страниц.

    Два расхождения были не в одних словах:
      • «Какие данные передаются в облако при гибридном варианте» — в
        документе стояло «передаётся только вектор запроса» и перечислены
        TLS/mTLS/IPSec, на странице формулировка шире («только данные,
        необходимые для обработки запроса»). Это утверждение про
        безопасность, придумывать его за страницу нельзя;
      • «Есть ли сертификат ФСТЭК» — на странице указаны номера лицензий,
        в документе их не было. Оставлены номера.

    У «Поставок» в разметке три вопроса из четырёх: четвёртый, про требования
    к инфраструктуре ПАК, в документе сознательно опущен как слишком
    объёмный для FAQPage — на странице он свёрстан списками-спецификациями.
  */
  workspace: {
    path: "/ai-platform/workspace/",
    title: "GigaCowork: рабочие пространства для команд",
    description:
      "GigaCowork — рабочие пространства объединяют агентов, документы и доступы команды в одном месте для совместной работы с ИИ.",
    keywords:
      "рабочие пространства ии, совместная работа с ии агентами, командное пространство gigacowork, база знаний команды ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Рабочие пространства для команд — GigaCowork",
    ogDescription:
      "Объедините агентов, документы и доступы команды в одном рабочем пространстве GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/workspace#webpage",
          url: "https://cowork.ru/ai-platform/workspace/",
          name: "GigaCowork: рабочие пространства для команд",
          description:
            "GigaCowork — рабочие пространства объединяют агентов, документы и доступы команды в одном месте для совместной работы с ИИ.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/workspace#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/workspace#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/workspace#software",
          name: "Рабочие пространства GigaCowork",
          description:
            "Общая рабочая область для команды или процесса: агенты, документы и доступы к системам в одном месте. Документы и знания разделены по командам, агентами можно делиться, а сессии передавать коллегам без потери истории.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Команды и подразделения компаний",
          },
          featureList: [
            "Общее пространство для команды, проекта или процесса",
            "Документы и знания, разделённые по командам",
            "Совместное использование агентов внутри пространства",
            "Передача сессий коллегам без потери истории и документов",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/workspace#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Рабочие пространства",
              item: "https://cowork.ru/ai-platform/workspace/",
            },
          ],
        },
      ],
    },
  },
  agents: {
    path: "/ai-platform/agents/",
    title: "GigaCowork: ИИ-агенты для автоматизации задач",
    description:
      "GigaCowork — ИИ-агенты для бизнеса: самостоятельное построение плана действий, работа с документами, коннекторами и навыками, контроль через журнал событий.",
    keywords:
      "ии агенты gigacowork, автономные ии агенты, ии агент для задач, создание ии агента без кода, автоматизация бизнес процессов ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "ИИ-агенты для автоматизации задач — GigaCowork",
    ogDescription:
      "Создавайте ИИ-агентов, которые самостоятельно строят план действий, работают с документами и корпоративными системами.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/agents#webpage",
          url: "https://cowork.ru/ai-platform/agents/",
          name: "GigaCowork: ИИ-агенты для автоматизации задач",
          description:
            "GigaCowork — ИИ-агенты для бизнеса: самостоятельное построение плана действий, работа с документами, коннекторами и навыками, контроль через журнал событий.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/agents#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/agents#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/agents#software",
          name: "ИИ-агенты GigaCowork",
          description:
            "ИИ-агенты самостоятельно строят план действий по конечной цели, работают с документами, коннекторами и навыками, выполняют задачи параллельно с пользователем и по расписанию. Все действия фиксируются в журнале событий.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Сотрудники и команды компаний",
          },
          featureList: [
            "Автономное построение плана действий по цели",
            "Работа с документами и коннекторами к корпоративным системам",
            "Использование навыков и быстрых команд",
            "Запуск по расписанию",
            "Журнал событий и настраиваемый уровень автономности",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/agents#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "ИИ-агенты",
              item: "https://cowork.ru/ai-platform/agents/",
            },
          ],
        },
      ],
    },
  },
  skill: {
    path: "/ai-platform/skill/",
    title: "GigaCowork: навыки для ИИ-агентов",
    description:
      "GigaCowork — сохраняйте экспертизу сотрудников в навыках агентов: методику, данные и правила работы для использования всей компанией.",
    keywords:
      "навыки ии агента, корпоративная экспертиза в ии, обучение ии агента процессам компании, навыки для ии без кода, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Навыки для ИИ-агентов — GigaCowork",
    ogDescription:
      "Опишите экспертизу сотрудников один раз — и сделайте её доступной всей компании через навыки ИИ-агентов GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/skill#webpage",
          url: "https://cowork.ru/ai-platform/skill/",
          name: "GigaCowork: навыки для ИИ-агентов",
          description:
            "GigaCowork — сохраняйте экспертизу сотрудников в навыках агентов: методику, данные и правила работы для использования всей компанией.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/skill#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/skill#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/skill#software",
          name: "Навыки агентов GigaCowork",
          description:
            "Навык фиксирует методику, данные и правила выполнения задачи, чтобы агент использовал их независимо от того, кто поставил задачу. Централизованное управление правами доступа к навыкам и единый стандарт работы агентов.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Сотрудники и администраторы компаний",
          },
          featureList: [
            "Описание методики, данных и правил выполнения задачи",
            "Использование навыка всей компанией или отдельной командой",
            "Централизованное управление правами доступа к навыкам",
            "Подключение баз знаний и корпоративных систем к навыку",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/skill#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Навыки агентов",
              item: "https://cowork.ru/ai-platform/skill/",
            },
          ],
        },
      ],
    },
  },
  connectors: {
    path: "/ai-platform/connectors/",
    title: "GigaCowork: коннекторы к корпоративным системам",
    description:
      "GigaCowork — более 40 готовых коннекторов: CRM, 1С, почта, мессенджеры и другие сервисы, а также поддержка собственных MCP-интеграций.",
    keywords:
      "коннекторы для ии агентов, интеграция ии с crm, ии для 1с, mcp коннекторы, подключение корпоративных систем к ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Коннекторы к корпоративным системам — GigaCowork",
    ogDescription:
      "Более 40 готовых интеграций с CRM, 1С, почтой и мессенджерами, а также поддержка собственных MCP-коннекторов.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/connectors#webpage",
          url: "https://cowork.ru/ai-platform/connectors/",
          name: "GigaCowork: коннекторы к корпоративным системам",
          description:
            "GigaCowork — более 40 готовых коннекторов: CRM, 1С, почта, мессенджеры и другие сервисы, а также поддержка собственных MCP-интеграций.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/connectors#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/connectors#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/connectors#software",
          name: "Коннекторы GigaCowork",
          description:
            "Готовые интеграции с почтовыми сервисами, календарями, облачными хранилищами, CRM, ERP, таск-трекерами, мессенджерами и другими корпоративными системами, а также поддержка собственных MCP-коннекторов.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Сотрудники и ИТ-администраторы компаний",
          },
          featureList: [
            "40+ готовых коннекторов к корпоративным системам",
            "Поддержка собственных MCP-коннекторов",
            "Ролевой доступ агента к разрешённым системам",
            "Журнал аудита действий агента в подключённых системах",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/connectors#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Коннекторы",
              item: "https://cowork.ru/ai-platform/connectors/",
            },
          ],
        },
      ],
    },
  },
  quickCommands: {
    path: "/ai-platform/quick-commands/",
    title: "GigaCowork: быстрые команды для типовых задач",
    description:
      "GigaCowork — сохраняйте частые запросы как быстрые команды и запускайте типовые задачи одной командой без повторных инструкций.",
    keywords:
      "быстрые команды ии, сохраненные промпты ии, автоматизация типовых задач ии, шаблоны запросов ии агенту, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Быстрые команды для типовых задач — GigaCowork",
    ogDescription:
      "Сохраняйте часто используемые запросы как команды и запускайте задачи за секунды с GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/quick-commands#webpage",
          url: "https://cowork.ru/ai-platform/quick-commands/",
          name: "GigaCowork: быстрые команды для типовых задач",
          description:
            "GigaCowork — сохраняйте частые запросы как быстрые команды и запускайте типовые задачи одной командой без повторных инструкций.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/quick-commands#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/quick-commands#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/quick-commands#software",
          name: "Быстрые команды GigaCowork",
          description:
            "Сохранённые промпты для мгновенного запуска типовых задач: инструкция, данные и формат результата задаются один раз и используются всей командой единообразно.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Сотрудники и команды компаний",
          },
          featureList: [
            "Сохранение запроса как быстрой команды",
            "Единый сценарий выполнения задачи для всей команды",
            "Запуск командой «/» из любой сессии",
            "Повторное использование без повторного ввода инструкции",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/quick-commands#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Быстрые команды",
              item: "https://cowork.ru/ai-platform/quick-commands/",
            },
          ],
        },
      ],
    },
  },
  schedule: {
    path: "/ai-platform/schedule/",
    title: "GigaCowork: задачи по расписанию и триггерам",
    description:
      "GigaCowork — запускайте задачи ИИ-агентов по расписанию или по событию в корпоративных системах: ежедневно, еженедельно или по триггеру.",
    keywords:
      "задачи по расписанию ии, автоматический запуск ии агента, триггеры для ии агента, регулярные задачи ии, автоматизация по событию, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Задачи по расписанию и триггерам — GigaCowork",
    ogDescription:
      "Настройте расписание или событие — и агент GigaCowork выполнит задачу автоматически без участия сотрудников.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/ai-platform/schedule#webpage",
          url: "https://cowork.ru/ai-platform/schedule/",
          name: "GigaCowork: задачи по расписанию и триггерам",
          description:
            "GigaCowork — запускайте задачи ИИ-агентов по расписанию или по событию в корпоративных системах: ежедневно, еженедельно или по триггеру.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/ai-platform/schedule#software",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/ai-platform/schedule#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://cowork.ru/ai-platform/schedule#software",
          name: "Регулярные задачи GigaCowork",
          description:
            "Запуск задач агента по расписанию (ежедневно, еженедельно, ежемесячно) или по событию в корпоративных системах. Агент собирает данные, использует навыки и передаёт результат, подключая сотрудника только при необходимости согласования.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Сотрудники и команды компаний",
          },
          featureList: [
            "Запуск по расписанию: ежедневно, еженедельно, ежемесячно",
            "Запуск по событию (триггеру) в корпоративных системах",
            "Автономное выполнение задачи агентом",
            "Подключение сотрудника только для согласования",
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/ai-platform/schedule#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О платформе",
              item: "https://cowork.ru/ai-platform/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Расписание и триггеры",
              item: "https://cowork.ru/ai-platform/schedule/",
            },
          ],
        },
      ],
    },
  },
  trustAndSafety: {
    path: "/trust-and-safety/",
    title: "GigaCowork: безопасность корпоративного ИИ",
    description:
      "GigaCowork — защита данных на каждом этапе: шифрование, ролевая модель доступа, сертификаты ФСТЭК и развертывание в закрытом контуре.",
    keywords:
      "безопасность корпоративного ии, ии в закрытом контуре, сертификат фстэк ии, шифрование данных ии, on-premise ии платформа, защита от утечек данных ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Безопасность корпоративного ИИ — GigaCowork",
    ogDescription:
      "Шифрование каналов, ролевая модель доступа, сертификаты ФСТЭК и развертывание в закрытом контуре с GigaCowork.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/trust-and-safety#webpage",
          url: "https://cowork.ru/trust-and-safety/",
          name: "GigaCowork: безопасность корпоративного ИИ",
          description:
            "GigaCowork — защита данных на каждом этапе: шифрование, ролевая модель доступа, сертификаты ФСТЭК и развертывание в закрытом контуре.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/trust-and-safety#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/trust-and-safety#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/trust-and-safety#service",
          name: "Безопасность корпоративного ИИ GigaCowork",
          description:
            "Развертывание GigaCowork в собственном контуре безопасности: шифрование TLS, защита от DDoS, ролевая модель доступа с SSO, аудит и мониторинг действий, настраиваемое поведение модели, сертификаты ФСТЭК и поддержка on-premise (ПАК).",
          serviceType: "Информационная безопасность корпоративной ИИ-платформы",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Служба информационной безопасности компаний",
          },
        },
        {
          "@type": "FAQPage",
          "@id": "https://cowork.ru/trust-and-safety#faq",
          mainEntity: [
            {
              "@type": "Question",
              name: "Обучаются ли модели на моих данных?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Нет. Запросы пользователей и загруженные документы изолированы. Ваши данные не используются для дообучения базовых моделей.",
              },
            },
            {
              "@type": "Question",
              name: "Какие данные передаются в облако при гибридном варианте?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "В облако передаются только данные, необходимые для обработки запроса и генерации ответа. Рабочие данные и документы компании остаются в вашем контуре. Облачный сегмент не хранит историю запросов после генерации ответа.",
              },
            },
            {
              "@type": "Question",
              name: "Есть ли у вас сертификат ФСТЭК?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Да. ООО «Салют для Бизнеса» обладает лицензиями ФСТЭК: на техническую защиту конфиденциальной информации (Л024-00107-00/00582499) и на разработку средств защиты (Л050-00107-00/00584112).",
              },
            },
            {
              "@type": "Question",
              name: "Можно ли использовать GigaCowork в закрытом контуре?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Да, для этого предусмотрен ПАК (On-premise). Позволяет развернуть платформу полностью автономно без доступа к интернету.",
              },
            },
            {
              "@type": "Question",
              name: "Поддерживается ли интеграция с SIEM/DLP?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Да, платформа предоставляет детальные логи событий, которые могут быть переданы в ваш SIEM/DLP.",
              },
            },
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/trust-and-safety#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Безопасность",
              item: "https://cowork.ru/trust-and-safety/",
            },
          ],
        },
      ],
    },
  },
  pricing: {
    path: "/pricing/",
    title: "GigaCowork: тарифы и варианты поставки платформы",
    description:
      "GigaCowork — Облако, Гибрид или ПАК: выберите вариант поставки под требования к инфраструктуре и безопасности вашей компании.",
    keywords:
      "тарифы gigacowork, варианты поставки ии платформы, ии платформа on-premise, ии платформа гибрид, стоимость корпоративного ии, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Тарифы и варианты поставки — GigaCowork",
    ogDescription:
      "Облако, Гибрид или ПАК — выберите вариант развёртывания GigaCowork под требования вашей инфраструктуры и безопасности.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/pricing#webpage",
          url: "https://cowork.ru/pricing/",
          name: "GigaCowork: тарифы и варианты поставки платформы",
          description:
            "GigaCowork — Облако, Гибрид или ПАК: выберите вариант поставки под требования к инфраструктуре и безопасности вашей компании.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/pricing#product",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/pricing#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Product",
          "@id": "https://cowork.ru/pricing#product",
          name: "GigaCowork",
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          description:
            "Корпоративная платформа ИИ-агентов с тремя вариантами поставки: Облако (данные и модель в облаке), Гибрид (данные в контуре компании, модель в облаке) и ПАК (полностью автономное развертывание в контуре компании).",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Варианты поставки GigaCowork",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Облако",
                  description:
                    "Данные и модель (LLM) в облаке. Безлимитное количество токенов, тарификация по пользователям, ЦОД на территории РФ. От 100 пользователей.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Гибрид",
                  description:
                    "Данные в периметре компании, модель (LLM) в облаке. 100 часов консалтинга по внедрению, без затрат на собственную GPU-инфраструктуру. От 500 пользователей.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "ПАК",
                  description:
                    "Полностью автономное развёртывание на серверах в контуре компании, без доступа к интернету. Безлимитное количество пользователей, 200 часов консалтинга, 12 месяцев технической поддержки.",
                },
              },
            ],
          },
        },
        {
          "@type": "FAQPage",
          "@id": "https://cowork.ru/pricing#faq",
          mainEntity: [
            {
              "@type": "Question",
              name: "Чем отличаются Облако, Гибрид и ПАК?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Облако. Данные и модель в облаке. Гибрид. Платформа интегрируется в контур компании, модель – в облаке. ПАК. Решение работает на серверах внутри контура компании.",
              },
            },
            {
              "@type": "Question",
              name: "Можно ли начать с Облака, а затем перейти на Гибрид или ПАК?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Да. Условия и сроки обсуждаются с менеджером индивидуально.",
              },
            },
            {
              "@type": "Question",
              name: "Как тарифицируются токены?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Токены не тарифицируются отдельно. Во всех поставках безлимитное количество токенов – тарификация по пользователям. Для поставки ПАК доступно неограниченное количество пользователей.",
              },
            },
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/pricing#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Поставки",
              item: "https://cowork.ru/pricing/",
            },
          ],
        },
      ],
    },
  },
  about: {
    path: "/company/about/",
    title: "GigaCowork: о компании и команде",
    description:
      "GigaCowork разрабатывает «Салют для Бизнеса» — аккредитованная ИТ-компания группы Сбер. Работаем с клиентом до устойчивого результата и тестируем продукт на себе.",
    keywords:
      "о компании gigacowork, разработчик gigacowork, салют для бизнеса, ит компания группы сбер, команда gigacowork, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "О компании — GigaCowork",
    ogDescription:
      "GigaCowork разрабатывает «Салют для Бизнеса» — аккредитованная ИТ-компания группы Сбер.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
          foundingDate: "2026",
          parentOrganization: {
            "@type": "Organization",
            name: "Сбер",
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Садовая-Самотечная улица, 24/27",
            addressLocality: "Москва",
            addressCountry: "RU",
          },
          telephone: "+7 800 505-80-53",
          email: "info@gigab2b.ru",
          sameAs: ["https://t.me/GenAIeffect"],
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "AboutPage",
          "@id": "https://cowork.ru/company/about#webpage",
          url: "https://cowork.ru/company/about/",
          name: "GigaCowork: о компании и команде",
          description:
            "GigaCowork разрабатывает «Салют для Бизнеса» — аккредитованная ИТ-компания группы Сбер. Работаем с клиентом до устойчивого результата и тестируем продукт на себе.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/#organization",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/company/about#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/company/about#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "О компании",
              item: "https://cowork.ru/company/about/",
            },
          ],
        },
      ],
    },
  },
  partners: {
    path: "/company/partners/",
    title: "GigaCowork: партнёрская программа",
    description:
      "GigaCowork — станьте партнёром: продавайте, внедряйте и сопровождайте платформу ИИ-агентов, зарабатывайте на полном жизненном цикле клиента.",
    keywords:
      "партнерская программа gigacowork, стать партнером ии платформы, партнерство ии для бизнеса, монетизация ии платформы, GigaCowork, ГигаКоворк, Коворк, Cowork",
    ogTitle: "Партнёрская программа — GigaCowork",
    ogDescription:
      "Добавьте GigaCowork в портфель решений и зарабатывайте на продаже, внедрении и сопровождении корпоративных ИИ-проектов.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://cowork.ru/#organization",
          name: "Салют для Бизнеса",
          legalName: "ООО «Салют для Бизнеса»",
          url: "https://cowork.ru/",
        },
        {
          "@type": "Brand",
          "@id": "https://cowork.ru/#brand",
          name: "GigaCowork",
          url: "https://cowork.ru/",
        },
        {
          "@type": "WebSite",
          "@id": "https://cowork.ru/#website",
          url: "https://cowork.ru/",
          name: "GigaCowork",
          inLanguage: "ru-RU",
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "WebPage",
          "@id": "https://cowork.ru/company/partners#webpage",
          url: "https://cowork.ru/company/partners/",
          name: "GigaCowork: партнёрская программа",
          description:
            "GigaCowork — станьте партнёром: продавайте, внедряйте и сопровождайте платформу ИИ-агентов, зарабатывайте на полном жизненном цикле клиента.",
          inLanguage: "ru-RU",
          isPartOf: {
            "@id": "https://cowork.ru/#website",
          },
          mainEntity: {
            "@id": "https://cowork.ru/company/partners#service",
          },
          breadcrumb: {
            "@id": "https://cowork.ru/company/partners#breadcrumb",
          },
          publisher: {
            "@id": "https://cowork.ru/#organization",
          },
        },
        {
          "@type": "Service",
          "@id": "https://cowork.ru/company/partners#service",
          name: "Партнёрская программа GigaCowork",
          description:
            "Продажа, внедрение и сопровождение корпоративной ИИ-платформы GigaCowork: обучение команды, совместный пресейл, техническая и маркетинговая поддержка, персональный партнёрский менеджер.",
          serviceType:
            "Партнёрская программа по продаже и внедрению корпоративной ИИ-платформы",
          provider: {
            "@id": "https://cowork.ru/#organization",
          },
          brand: {
            "@id": "https://cowork.ru/#brand",
          },
          areaServed: "RU",
          audience: {
            "@type": "BusinessAudience",
            audienceType:
              "Системные интеграторы, ИТ-компании, консалтинговые компании и эксперты по внедрению корпоративных решений",
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://cowork.ru/company/partners#breadcrumb",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item: "https://cowork.ru/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Партнёрская программа",
              item: "https://cowork.ru/company/partners/",
            },
          ],
        },
      ],
    },
  },

  notFound: {
    path: "404",
    title: "Страница не найдена — ошибка 404 | GigaCowork",
    description:
      "Возможно, страница переехала или в адресе допущена ошибка. Перейдите на главную страницу GigaCowork.",
  },
};
