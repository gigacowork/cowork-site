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
  notFound: {
    path: "404",
    title: "Страница не найдена — ошибка 404 | GigaCowork",
    description:
      "Возможно, страница переехала или в адресе допущена ошибка. Перейдите на главную страницу GigaCowork.",
  },
};
