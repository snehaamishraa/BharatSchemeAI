import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  GraduationCap,
  HeartPulse,
  Home,
  Languages,
  Leaf,
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  MoonStar,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Mail,
  X,
  IndianRupee
} from 'lucide-react'

const COPY = {
  en: {
    navHome: 'Home',
    navExplore: 'Explore Schemes',
    navAssistant: 'AI Assistant',
    navAbout: 'About',
    login: 'Login',
    tryAi: 'Try AI',
    heroKicker: 'Trusted scheme discovery for India',
    heroTitle: 'Discover the Right Government Schemes Instantly',
    heroCopy:
      'Bharat Scheme AI uses smart search and eligibility-aware recommendations to help citizens find relevant schemes quickly, clearly, and with confidence.',
    explore: 'Explore Schemes',
    startChat: 'Start AI Chat',
    searchLabel: 'Smart search + AI input',
    searchPlaceholder: 'Search by scheme, category, benefit, or ask a question...',
    searchMode: 'Search',
    askMode: 'Ask AI',
    assistantPrompt: 'Ask AI about eligibility, benefits, documents, or the best schemes for you.',
    sectionFeatures: 'Why Bharat Scheme AI',
    sectionFeaturesCopy: 'A modern SaaS experience designed for clarity, trust, and fast decision-making.',
    sectionSteps: 'How It Works',
    sectionSchemes: 'Recommended Schemes',
    sectionSchemesCopy: 'A curated view of public schemes with intelligent filtering and clear detail cards.',
    sectionChat: 'AI Assistant',
    sectionChatCopy: 'Ask in plain language and get a concise, actionable response with scheme matches.',
    sectionTrust: 'Built for trust',
    sectionTrustCopy: 'Designed for a government-facing workflow with readable surfaces and transparent guidance.',
    footerTagline: 'Empowering citizens with the right schemes 🇮🇳',
    footerProduct: 'Product',
    footerResources: 'Resources',
    footerCompany: 'Company',
    footerLinks: 'Links',
    loginTitle: 'Sign in to continue',
    loginCopy: 'A polished authentication surface for future Clerk, OAuth, or custom auth integration.',
    loginName: 'Full name',
    loginEmail: 'Work email',
    loginPassword: 'Password',
    loginCta: 'Continue',
    loginHint: 'Demo session only. Wire this to your auth provider when ready.',
    aiTyping: 'Thinking...'
  },
  hi: {
    navHome: 'होम',
    navExplore: 'योजनाएं देखें',
    navAssistant: 'AI सहायक',
    navAbout: 'अबाउट',
    login: 'लॉगिन',
    tryAi: 'AI आज़माएं',
    heroKicker: 'भारत के लिए भरोसेमंद योजना खोज',
    heroTitle: 'सही सरकारी योजना तुरंत खोजें',
    heroCopy:
      'Bharat Scheme AI स्मार्ट सर्च और पात्रता-आधारित सुझावों के साथ नागरिकों को जल्दी, साफ़ और भरोसे के साथ योजना ढूंढने में मदद करता है।',
    explore: 'योजनाएं देखें',
    startChat: 'AI चैट शुरू करें',
    searchLabel: 'स्मार्ट सर्च + AI इनपुट',
    searchPlaceholder: 'योजना, श्रेणी, लाभ खोजें या सवाल पूछें...',
    searchMode: 'खोजें',
    askMode: 'AI से पूछें',
    assistantPrompt: 'पात्रता, लाभ, दस्तावेज़ या अपने लिए सबसे अच्छी योजना पूछें।',
    sectionFeatures: 'Bharat Scheme AI क्यों',
    sectionFeaturesCopy: 'स्पष्टता, भरोसा और तेज निर्णय के लिए बनाया गया आधुनिक SaaS अनुभव।',
    sectionSteps: 'यह कैसे काम करता है',
    sectionSchemes: 'अनुशंसित योजनाएं',
    sectionSchemesCopy: 'पब्लिक योजनाओं का एक साफ़, फ़िल्टर किया हुआ दृश्य.',
    sectionChat: 'AI सहायक',
    sectionChatCopy: 'साधारण भाषा में पूछें और संक्षिप्त, उपयोगी जवाब पाएं।',
    sectionTrust: 'भरोसे के लिए बनाया गया',
    sectionTrustCopy: 'सरकारी उपयोग के लिए स्पष्ट, पढ़ने में आसान और पारदर्शी UI.',
    footerTagline: 'सही योजनाओं से नागरिकों को सशक्त बनाना 🇮🇳',
    footerProduct: 'प्रोडक्ट',
    footerResources: 'रिसोर्स',
    footerCompany: 'कंपनी',
    footerLinks: 'लिंक्स',
    loginTitle: 'जारी रखने के लिए साइन इन करें',
    loginCopy: 'भविष्य में Clerk, OAuth, या custom auth के लिए तैयार authentication surface.',
    loginName: 'पूरा नाम',
    loginEmail: 'वर्क ईमेल',
    loginPassword: 'पासवर्ड',
    loginCta: 'आगे बढ़ें',
    loginHint: 'यह डेमो session है। आवश्यकता अनुसार auth provider जोड़ें।',
    aiTyping: 'सोच रहा है...'
  }
}

const NAV_ITEMS = [
  { href: '#home', key: 'navHome' },
  { href: '#schemes', key: 'navExplore' },
  { href: '#assistant', key: 'navAssistant' },
  { href: '#about', key: 'navAbout' }
]

const FEATURES = [
  {
    title: 'AI-based recommendations',
    description: 'Query-aware matching surfaces the most relevant schemes based on your intent and profile.',
    icon: Brain
  },
  {
    title: 'Eligibility checker',
    description: 'Clear scheme cards help users understand the key conditions before they start applying.',
    icon: ShieldCheck
  },
  {
    title: 'Personalized results',
    description: 'Search results adapt to keywords, categories, and the context of the citizen’s request.',
    icon: Target
  },
  {
    title: 'Multi-language support',
    description: 'A multilingual UI makes the product more accessible and easier to trust.',
    icon: Languages
  }
]

const STEPS = [
  {
    step: '01',
    title: 'Enter your details',
    copy: 'Share your state, age, occupation, and simple preferences in one clean form.'
  },
  {
    step: '02',
    title: 'AI analyzes eligibility',
    copy: 'The recommendation layer checks the data and surfaces schemes that fit your situation.'
  },
  {
    step: '03',
    title: 'Get the best schemes instantly',
    copy: 'Review the shortlist, open details, and continue with clear next steps.'
  }
]

const TRUST_ITEMS = [
  { title: 'Powered by AI', copy: 'Designed to guide citizens with context-aware discovery and concise explanations.', icon: Sparkles },
  { title: 'Accurate scheme recommendations', copy: 'Eligibility-minded filtering helps users find relevant public schemes faster.', icon: BadgeCheck },
  { title: 'Secure by design', copy: 'The interface keeps the focus on clarity, trust, and low-friction navigation.', icon: ShieldCheck }
]

const QUICK_CHIPS = ['Farmer support', 'Student aid', 'Women schemes', 'Health cover', 'Pension plans', 'Housing']

const CATEGORY_META = {
  farmer: { label: 'Farmer', icon: Leaf, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20' },
  education: { label: 'Student', icon: GraduationCap, tone: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/20' },
  women: { label: 'Women', icon: Users, tone: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20' },
  health: { label: 'Health', icon: HeartPulse, tone: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20' },
  housing: { label: 'Housing', icon: Home, tone: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20' },
  pension: { label: 'Pension', icon: IndianRupee, tone: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/20' },
  general: { label: 'General', icon: LayoutDashboard, tone: 'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20' }
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function getCategoryMeta(category) {
  return CATEGORY_META[(category || 'general').toLowerCase()] || CATEGORY_META.general
}

function stripHtml(text) {
  return String(text || '').replace(/<[^>]*>/g, '')
}

function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-brand-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  )
}

function Pill({ children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset', className)}>
      {children}
    </span>
  )
}

function FeatureCard({ feature }) {
  const Icon = feature.icon

  return (
    <motion.article
      className="group rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft dark:border-white/10 dark:bg-slate-900/80"
      whileHover={{ y: -4 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition group-hover:scale-105 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
    </motion.article>
  )
}

function StepCard({ step, index }) {
  return (
    <motion.article
      className="relative rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-900/80"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-glow">
          {step.step}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step {index + 1}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.copy}</p>
      {index < 2 ? <div className="absolute right-[-18px] top-1/2 hidden h-px w-12 bg-gradient-to-r from-brand-400 to-transparent xl:block" /> : null}
    </motion.article>
  )
}

function SchemeCard({ scheme, onOpen }) {
  const meta = getCategoryMeta(scheme.category)
  const Icon = meta.icon

  return (
    <motion.article
      className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft dark:border-white/10 dark:bg-slate-900/80"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
          <Icon className="h-6 w-6" />
        </div>
        <Pill className={meta.tone}>{meta.label}</Pill>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{scheme.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{stripHtml(scheme.description)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill className="border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{meta.label}</Pill>
        <Pill className="border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Trusted</Pill>
      </div>

      <button
        type="button"
        onClick={() => onOpen(scheme)}
        className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
      >
        View Details
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.article>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-5 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-5 flex gap-2">
        <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-10 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[78%]', isUser ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-700 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200')}>
        {message.text}
      </div>
    </div>
  )
}

function App() {
  const [schemes, setSchemes] = useState([])
  const [loadingSchemes, setLoadingSchemes] = useState(true)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('bharat-theme') === 'dark' ? 'dark' : 'light'
  })
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return window.localStorage.getItem('bharat-language') === 'hi' ? 'hi' : 'en'
  })
  const [mode, setMode] = useState('search')
  const [query, setQuery] = useState('')
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signedInName, setSignedInName] = useState('Guest')
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' })
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello, I can help you find relevant schemes, summarize eligibility, and highlight the next best option for your situation.'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeChip, setActiveChip] = useState('')
  const chatEndRef = useState(null)

  const copy = COPY[language] || COPY.en

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('bharat-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('bharat-language', language)
  }, [language])

  useEffect(() => {
    let alive = true

    fetch('/schemes.json')
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return
        setSchemes(Array.isArray(data?.schemes) ? data.schemes : [])
      })
      .catch(() => {
        if (!alive) return
        setSchemes([])
      })
      .finally(() => {
        if (!alive) return
        setLoadingSchemes(false)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!messages.length) return
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  useEffect(() => {
    const body = document.body
    if (loginOpen || selectedScheme) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
    }
    return () => {
      body.style.overflow = ''
    }
  }, [loginOpen, selectedScheme])

  const filteredSchemes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return schemes

    return schemes.filter((scheme) => {
      const haystack = [scheme.name, scheme.description, scheme.eligibility, scheme.benefits, scheme.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [schemes, query])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    const schemeNames = schemes.slice(0, 6).map((scheme) => scheme.name)
    const base = [...QUICK_CHIPS, ...schemeNames]
    const unique = [...new Set(base)]
    if (!q) return unique.slice(0, 6)
    return unique.filter((item) => item.toLowerCase().includes(q)).slice(0, 6)
  }, [query, schemes])

  const assistantMatches = useMemo(() => {
    const q = chatInput.trim().toLowerCase() || query.trim().toLowerCase()
    if (!q) return schemes.slice(0, 3)
    return schemes.filter((scheme) => {
      const haystack = [scheme.name, scheme.description, scheme.eligibility, scheme.benefits, scheme.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [schemes, chatInput, query])

  const visibleSchemes = filteredSchemes.slice(0, 8)
  const highlightedScheme = visibleSchemes[0] || schemes[0]

  const scrollToId = (id) => {
    const node = document.getElementById(id)
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openScheme = (scheme) => {
    setSelectedScheme(scheme)
  }

  const submitChat = (text) => {
    const prompt = text.trim()
    if (!prompt || thinking) return

    const userMessage = { role: 'user', text: prompt }
    setMessages((current) => [...current, userMessage])
    setChatInput('')
    setThinking(true)

    window.setTimeout(() => {
      const bestMatches = assistantMatches.slice(0, 3)
      const response =
        bestMatches.length > 0
          ? `I found ${bestMatches.length} relevant scheme${bestMatches.length > 1 ? 's' : ''}. ${bestMatches
              .map((scheme) => scheme.name)
              .join(', ')} look like the strongest matches. If you want, I can also refine by state, occupation, age, or income.`
          : 'I could not find a direct match yet. Try terms like farmer, student, women, health, pension, or housing and I will narrow it down.'

      setMessages((current) => [...current, { role: 'assistant', text: response }])
      setThinking(false)
    }, 1100)
  }

  const handleSearchAction = () => {
    if (mode === 'ai') {
      submitChat(query)
      scrollToId('assistant')
      return
    }
    scrollToId('schemes')
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    const fallbackName = loginForm.name.trim() || loginForm.email.split('@')[0] || 'Guest'
    setSignedInName(fallbackName)
    setLoginOpen(false)
    setLoginForm({ name: '', email: '', password: '' })
  }

  const currentGreeting = signedInName === 'Guest' ? 'Login' : signedInName

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f9fafb_45%,#eef2ff_100%)] text-slate-900 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.22] dark:opacity-[0.12]" />
      <div className="pointer-events-none absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-400/10" />
      <div className="pointer-events-none absolute right-[-5rem] top-[12rem] h-80 w-80 rounded-full bg-saffron/10 blur-3xl dark:bg-saffron/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl dark:bg-accent/10" />

      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Bharat Scheme AI</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{copy.heroKicker}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
              >
                {copy[item.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              aria-label="Select language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:block"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:inline-flex"
            >
              {copy.login}
            </button>

            <button
              type="button"
              onClick={() => scrollToId('assistant')}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
            >
              <span className="hidden sm:inline">{copy.tryAi}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border-t border-white/60 bg-white/95 px-4 py-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {copy[item.key]}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setLoginOpen(true)
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  {copy.login}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="home" className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Pill className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {copy.heroKicker}
            </Pill>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 text-balance dark:text-white sm:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{copy.heroCopy}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollToId('schemes')}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
              >
                {copy.explore}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId('assistant')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {copy.startChat}
                <MessageCircleMore className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Pill className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                Trust-first experience
              </Pill>
              <Pill className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Languages className="mr-2 h-3.5 w-3.5" />
                Multilingual ready
              </Pill>
              <Pill className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <BarChart3 className="mr-2 h-3.5 w-3.5" />
                Clean SaaS layout
              </Pill>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['100+', 'scheme cards ready'],
                ['Smart', 'eligibility-aware search'],
                ['1 click', 'to open AI assistant']
              ].map(([value, label]) => (
                <div key={label} className="glass-panel rounded-[1.5rem] p-4">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass-strong relative overflow-hidden rounded-[2rem] p-5 shadow-soft">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-saffron to-indiaGreen" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">AI recommendation console</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Production-ready dashboard preview</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recommended match</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{highlightedScheme?.name || 'Loading schemes...'}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {stripHtml(highlightedScheme?.description || 'Curated details appear here once the scheme dataset loads.')}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Recommendation quality</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Eligibility + relevance</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-brand-500 via-saffron to-indiaGreen" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Structured for a clear, trustworthy citizen experience.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ['Secure', 'policy-first UX'],
                  ['Readable', 'high contrast surfaces'],
                  ['Fast', 'clean hierarchy and actions']
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[1.25rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {title}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{currentGreeting}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">UI ready for login, AI, and scheme search</p>
            </div>
          </motion.div>
        </section>

        <motion.section
          id="search"
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow={copy.searchLabel}
            title={copy.searchLabel}
            description={copy.assistantPrompt}
          />

          <div className="glass-strong mt-8 rounded-[2rem] p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => setMode('search')}
                    className={cn(
                      'flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                      mode === 'search'
                        ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {copy.searchMode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('ai')}
                    className={cn(
                      'flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                      mode === 'ai'
                        ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {copy.askMode}
                  </button>
                </div>

                <div className="relative mt-4">
                  <div className="flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-brand-300 dark:border-white/10 dark:bg-slate-950/60">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value)
                        setActiveChip('')
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSearchAction()
                        }
                      }}
                      placeholder={copy.searchPlaceholder}
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleSearchAction}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      {mode === 'ai' ? copy.startChat : copy.explore}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {suggestions.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 mt-3 w-full rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-soft dark:border-white/10 dark:bg-slate-950"
                      >
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Suggestions</div>
                        <div className="flex flex-wrap gap-2 px-2 pb-2">
                          {suggestions.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setQuery(item)
                                setActiveChip(item)
                                setMode('search')
                              }}
                              className={cn(
                                'rounded-full border px-3 py-2 text-sm transition',
                                activeChip === item
                                  ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setMode('search')
                    setActiveChip('')
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Reset search
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('assistant')}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  Open AI assistant
                  <MessageCircleMore className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader eyebrow={copy.sectionFeatures} title={copy.sectionFeatures} description={copy.sectionFeaturesCopy} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader eyebrow={copy.sectionSteps} title={copy.sectionSteps} description="A simple three-step flow keeps the experience readable and conversion-friendly." />
          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {STEPS.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </motion.section>

        <motion.section
          id="schemes"
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader eyebrow={copy.sectionSchemes} title={copy.sectionSchemes} description={copy.sectionSchemesCopy} />

          <div className="mt-8 flex flex-wrap gap-3">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setQuery(chip)
                  setMode('search')
                  setActiveChip(chip)
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition',
                  activeChip === chip
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                )}
              >
                {chip}
              </button>
            ))}
          </div>

          {loadingSchemes ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSchemes.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} onOpen={openScheme} />
                ))}
              </div>

              {visibleSchemes.length === 0 ? (
                <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">No schemes matched your search.</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try a broader term like farmer, education, women, health, pension, or housing.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setActiveChip('')
                    }}
                    className="mt-5 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Clear search
                  </button>
                </div>
              ) : null}
            </>
          )}
        </motion.section>

        <motion.section
          id="assistant"
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader eyebrow={copy.sectionChat} title={copy.sectionChat} description={copy.sectionChatCopy} />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-strong rounded-[2rem] p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Bharat Scheme AI</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Concise, citizen-friendly guidance</p>
                  </div>
                </div>
                <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Online
                </Pill>
              </div>

              <div className="mt-5 space-y-3 rounded-[1.75rem] bg-slate-50 p-4 dark:bg-white/5">
                {messages.map((message, index) => (
                  <ChatBubble key={`${message.role}-${index}`} message={message} />
                ))}
                {thinking ? (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-brand-500 motion-safe:animate-pulse" />
                      <span className="flex h-2.5 w-2.5 rounded-full bg-brand-400 motion-safe:animate-pulse" />
                      <span className="flex h-2.5 w-2.5 rounded-full bg-brand-300 motion-safe:animate-pulse" />
                      <span className="ml-2">{copy.aiTyping}</span>
                    </div>
                  </div>
                ) : null}
                <div ref={chatEndRef} />
              </div>

              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitChat(chatInput || query)
                }}
              >
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask about eligibility, documents, benefits, or the right scheme..."
                  className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-300 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={thinking}
                >
                  Send
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="grid gap-4">
              <div className="glass-panel rounded-[1.75rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Live insights</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Search by language</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Plain language, no jargon</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        <Globe2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Built for India</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">State-aware, future multilingual</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Matched schemes</p>
                <div className="mt-4 space-y-3">
                  {assistantMatches.slice(0, 3).map((scheme) => (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => openScheme(scheme)}
                      className="flex w-full items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-brand-200 hover:bg-brand-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-brand-500/10"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{scheme.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{getCategoryMeta(scheme.category).label}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                  {assistantMatches.length === 0 ? (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                      Try broader words like farmer, student, pension, health, women, or housing.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="about"
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader eyebrow={copy.sectionTrust} title={copy.sectionTrust} description={copy.sectionTrustCopy} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_10px_36px_-26px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-slate-900/80"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.copy}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.section>
      </main>

      <footer className="relative border-t border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Bharat Scheme AI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Modern scheme discovery platform</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.footerTagline}</p>
            <div className="mt-6 flex gap-3">
              {[
                { href: 'https://x.com', label: 'Twitter', icon: X },
                { href: 'https://bharatscheme.ai', label: 'Website', icon: Globe2 },
                { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: Users },
                { href: 'mailto:hello@bharatscheme.ai', label: 'Mail', icon: Mail }
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title={copy.footerProduct}
            items={[
              { label: copy.navHome, href: '#home' },
              { label: copy.navExplore, href: '#schemes' },
              { label: copy.navAssistant, href: '#assistant' },
              { label: copy.tryAi, href: '#assistant' }
            ]}
          />
          <FooterColumn
            title={copy.footerResources}
            items={[
              { label: 'How it works', href: '#search' },
              { label: 'Scheme data', href: '#schemes' },
              { label: 'Accessibility', href: '#about' },
              { label: 'Privacy', href: '#about' }
            ]}
          />
          <FooterColumn
            title={copy.footerCompany}
            items={[
              { label: 'About Bharat Scheme AI', href: '#about' },
              { label: 'Contact', href: 'mailto:hello@bharatscheme.ai' },
              { label: 'Terms', href: '#about' },
              { label: 'Support', href: '#assistant' }
            ]}
          />
        </div>
      </footer>

      <AnimatePresence>
        {loginOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-slate-950"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{copy.login}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{copy.loginTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.loginCopy}</p>

              <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{copy.loginName}</label>
                  <input
                    value={loginForm.name}
                    onChange={(event) => setLoginForm((current) => ({ ...current, name: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{copy.loginEmail}</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{copy.loginPassword}</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {copy.loginCta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy.loginHint}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedScheme ? (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScheme(null)}
          >
            <motion.div
              className="mx-auto w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-slate-950 sm:p-8"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Pill className={getCategoryMeta(selectedScheme.category).tone}>{getCategoryMeta(selectedScheme.category).label}</Pill>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{selectedScheme.name}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{stripHtml(selectedScheme.description)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScheme(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-6">
                  <DetailBlock title="Eligibility" icon={ShieldCheck} text={selectedScheme.eligibility} />
                  <DetailBlock title="Benefits" icon={BadgeCheck} text={selectedScheme.benefits} />
                  <DetailBlock
                    title="Required documents"
                    icon={FileText}
                    text={(selectedScheme.requiredDocuments || []).join(', ')}
                  />
                </div>

                <div className="space-y-6">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                        <Clock3 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">How to apply</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step guidance</p>
                      </div>
                    </div>
                    <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {(selectedScheme.howToApply || []).map((step, index) => (
                        <li key={index} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/50">
                          <span className="font-semibold text-slate-900 dark:text-white">Step {index + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Official link</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Open the scheme source</p>
                      </div>
                    </div>
                    <a
                      href={selectedScheme.officialLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      Visit official portal
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="transition hover:text-brand-600 dark:hover:text-white">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DetailBlock({ title, text, icon: Icon }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  )
}

export default App
