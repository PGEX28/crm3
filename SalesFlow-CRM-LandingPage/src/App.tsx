import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  Clock,
  Target,
  PieChart,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Star,
  Quote,
  Play,
  ChevronRight,
  Sparkles,
  BarChart,
  LineChart,
  Activity,
  Layers,
  Globe,
  Lock,
  Smartphone,
  RefreshCw,
  Headphones,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Logo Component
const Logo = ({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizes = {
    sm: { container: "w-8 h-8", icon: 20, text: "text-lg" },
    md: { container: "w-10 h-10", icon: 24, text: "text-xl" },
    lg: { container: "w-14 h-14", icon: 32, text: "text-2xl" },
    xl: { container: "w-20 h-20", icon: 48, text: "text-4xl" }
  }

  const s = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${s.container} rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25`}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          <circle cx="12" cy="12" r="10" className="opacity-20" strokeWidth="1"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${s.text} bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight`}>
          SalesFlow
        </span>
        <span className="text-[10px] font-semibold text-blue-600 tracking-widest uppercase -mt-1">CRM</span>
      </div>
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Funcionalidades', href: '#features' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Integrações', href: '#integrations' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-transparent'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Entrar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-slate-600 hover:text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Separator className="my-3" />
              <Button variant="ghost" className="w-full justify-start">Entrar</Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Começar Grátis</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Nova versão 3.0 disponível</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Venda mais com{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  inteligência
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                O CRM que transforma seus leads em clientes. Automação, analytics e gestão completa em uma única plataforma poderosa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 h-14 px-8 text-lg">
                Teste Grátis 14 Dias
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-300 hover:bg-slate-50">
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-1"><strong>4.9/5</strong> de 2.500+ avaliações</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 overflow-hidden">
              {/* Browser Header */}
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    app.salesflow.com.br
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Receita', value: 'R$ 124K', change: '+12%', color: 'text-green-600' },
                    { label: 'Leads', value: '1,429', change: '+8%', color: 'text-blue-600' },
                    { label: 'Conversão', value: '24%', change: '+5%', color: 'text-violet-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                      <p className={`text-xs ${stat.color} font-medium`}>{stat.change}</p>
                    </div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="bg-slate-50 rounded-lg p-4 h-40 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Atividades Recentes</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Novo lead qualificado</p>
                        <p className="text-xs text-slate-500">Há {i * 5} minutos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Vendas Hoje</p>
                  <p className="text-lg font-bold text-slate-900">+R$ 12.450</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Meta do Mês</p>
                  <p className="text-lg font-bold text-slate-900">87% Alcançada</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Avançado',
      description: 'Dashboards em tempo real com métricas que importam para seu negócio crescer.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Gestão de Leads',
      description: 'Capture, qualifique e converta leads com automação inteligente e scoring.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Automação de Vendas',
      description: 'Automatize tarefas repetitivas e foque no que realmente importa: vender.',
      color: 'from-violet-500 to-violet-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança Enterprise',
      description: 'Seus dados protegidos com criptografia de ponta e conformidade LGPD.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'App Mobile',
      description: 'Acesse seu CRM de qualquer lugar com apps nativos para iOS e Android.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Integrações',
      description: 'Conecte com WhatsApp, Email, ERP e mais de 100 ferramentas.',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  return (
    <section id="features" className="w-full py-24 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            Funcionalidades
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              vender mais
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Uma plataforma completa com todas as ferramentas necessárias para gerenciar seu funil de vendas do início ao fim.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Dashboard Preview Section
const DashboardSection = () => {
  return (
    <section className="w-full py-24 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <Badge className="mb-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200">
                Dashboard Intuitivo
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Visualize seu negócio em{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  tempo real
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Acompanhe todas as métricas importantes do seu negócio em um único lugar. 
                Tome decisões baseadas em dados com relatórios personalizados e insights automáticos.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <BarChart className="w-5 h-5" />, text: 'Relatórios personalizáveis' },
                { icon: <LineChart className="w-5 h-5" />, text: 'Projeções e forecasts' },
                { icon: <Activity className="w-5 h-5" />, text: 'Alertas em tempo real' },
                { icon: <Layers className="w-5 h-5" />, text: 'Múltiplos pipelines' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {item.icon}
                  </div>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Explorar Dashboards
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900">Performance de Vendas</h3>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
                  <option>Últimos 30 dias</option>
                </select>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Total de Vendas</p>
                    <p className="text-2xl font-bold text-slate-900">R$ 458.920</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">+23%</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Novos Clientes</p>
                    <p className="text-2xl font-bold text-slate-900">142</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">+18%</span>
                    </div>
                  </div>
                </div>

                <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                    {[35, 55, 40, 70, 50, 85, 65, 90, 75, 95, 80, 100].map((h, i) => (
                      <div key={i} className="w-6 bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-lg opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 text-xs text-slate-400">Receita (R$ mil)</div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Top Vendedores</p>
                  {['Ana Silva', 'Carlos Mendes', 'Marina Costa'].map((name, i) => (
                    <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-sm font-bold">
                          {name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">R$ {(120 - i * 15).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '97',
      description: 'Ideal para pequenas equipes começando a organizar vendas',
      features: ['Até 3 usuários', '1.000 contatos', 'Pipeline básico', 'Relatórios simples', 'Suporte por email'],
      cta: 'Começar Grátis',
      popular: false
    },
    {
      name: 'Professional',
      price: '197',
      description: 'Para empresas em crescimento que precisam de mais poder',
      features: ['Até 10 usuários', '10.000 contatos', 'Pipelines ilimitados', 'Automação de tarefas', 'Integrações avançadas', 'Suporte prioritário', 'Analytics avançado'],
      cta: 'Começar Agora',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '497',
      description: 'Solução completa para grandes equipes de vendas',
      features: ['Usuários ilimitados', 'Contatos ilimitados', 'Automação completa', 'API dedicada', 'Onboarding personalizado', 'Gerente de conta', 'SLA garantido'],
      cta: 'Falar com Vendas',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="w-full py-24 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-violet-50 text-violet-700 hover:bg-violet-50 border-violet-200">
            Preços Transparentes
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Escolha o plano ideal para{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              seu negócio
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Comece gratuitamente e escale conforme seu time cresce. Sem taxas ocultas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${plan.popular ? 'bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-2xl shadow-violet-500/25 scale-105 z-10' : 'bg-white border border-slate-200 text-slate-900'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-400 font-bold px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-violet-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ {plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-violet-200' : 'text-slate-400'}`}>/mês</span>
                </div>

                <Button 
                  className={`w-full h-12 text-base font-semibold ${
                    plan.popular 
                      ? 'bg-white text-violet-600 hover:bg-slate-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </Button>

                <Separator className={`my-6 ${plan.popular ? 'bg-violet-500' : 'bg-slate-200'}`} />

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-violet-200' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-violet-100' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "O SalesFlow transformou nossa operação de vendas. Aumentamos a conversão em 40% no primeiro trimestre.",
      author: "Roberto Almeida",
      role: "Diretor Comercial",
      company: "TechCorp Brasil",
      avatar: "RA"
    },
    {
      quote: "Finalmente um CRM que minha equipe realmente usa. A interface é intuitiva e a automação economiza horas todo dia.",
      author: "Fernanda Lima",
      role: "Head de Vendas",
      company: "StartupXYZ",
      avatar: "FL"
    },
    {
      quote: "Migrar para o SalesFlow foi a melhor decisão. O suporte é incrível e as integrações funcionam perfeitamente.",
      author: "Carlos Mendes",
      role: "CEO",
      company: "Agência Digital Pro",
      avatar: "CM"
    }
  ]

  return (
    <section id="testimonials" className="w-full py-24 bg-slate-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-slate-800 text-slate-300 hover:bg-slate-800 border-slate-700">
            Depoimentos
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-slate-400">
            Mais de 5.000 empresas confiam no SalesFlow para gerenciar suas vendas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-blue-500 mb-6" />
                  <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                      <p className="text-sm text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logos */}
        <div className="mt-20 pt-12 border-t border-slate-800">
          <p className="text-center text-slate-500 mb-8 text-sm">Empresas que confiam no SalesFlow</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {['TechCorp', 'StartupXYZ', 'Agência Pro', 'VendasMax', 'LeadMaster', 'SalesPro'].map((company) => (
              <div key={company} className="text-xl font-bold text-slate-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Integrations Section
const IntegrationsSection = () => {
  const integrations = [
    { name: 'WhatsApp', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-green-500' },
    { name: 'Email', icon: <Mail className="w-6 h-6" />, color: 'bg-blue-500' },
    { name: 'Calendar', icon: <Calendar className="w-6 h-6" />, color: 'bg-red-500' },
    { name: 'Drive', icon: <FileText className="w-6 h-6" />, color: 'bg-yellow-500' },
    { name: 'Slack', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-purple-500' },
    { name: 'Zoom', icon: <Video className="w-6 h-6" />, color: 'bg-blue-600' },
  ]

  return (
    <section id="integrations" className="w-full py-24 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">
            Integrações
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Conecte com suas{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ferramentas favoritas
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Integre com mais de 100 aplicativos e mantenha seu workflow conectado.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-300 transition-all text-center group"
            >
              <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                {integration.icon}
              </div>
              <p className="font-medium text-slate-700">{integration.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-slate-300">
            Ver todas as integrações
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  return (
    <section className="w-full py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Pronto para transformar suas vendas?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Comece seu teste gratuito de 14 dias. Não precisa de cartão de crédito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 h-14 px-8 text-lg font-semibold shadow-xl">
                Começar Grátis Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg">
                <Headphones className="mr-2 w-5 h-5" />
                Falar com Especialista
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              ✓ Setup em 5 minutos ✓ Suporte 24/7 ✓ Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  const footerLinks = {
    'Produto': ['Funcionalidades', 'Preços', 'Integrações', 'Atualizações', 'Roadmap'],
    'Empresa': ['Sobre nós', 'Carreiras', 'Blog', 'Imprensa', 'Parceiros'],
    'Recursos': ['Documentação', 'Tutoriais', 'Webinars', 'API', 'Status'],
    'Suporte': ['Central de Ajuda', 'Contato', 'Treinamento', 'Comunidade', 'LGPD'],
  }

  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Logo className="mb-6" />
            <p className="text-sm text-slate-400 mb-6">
              O CRM moderno que ajuda empresas brasileiras a venderem mais e melhor.
            </p>
            <div className="flex gap-4">
              {[Mail, Phone, MapPin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2024 SalesFlow CRM. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white">Termos de Uso</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white">Privacidade</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Video Icon Component
const Video = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z"/>
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
  </svg>
)

// Main App
function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DashboardSection />
        <PricingSection />
        <TestimonialsSection />
        <IntegrationsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App
