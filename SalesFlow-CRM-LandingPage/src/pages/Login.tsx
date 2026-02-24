import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    // Demo: aceita qualquer email/senha preenchidos
    if (email && password.length >= 6) {
      onLogin();
    } else {
      setError('Email ou senha inválidos. Use qualquer email e senha com 6+ caracteres.');
    }
    setIsLoading(false);
  };

  const inputClass = cn(
    'w-full pl-11 pr-4 py-3.5 rounded-xl',
    'bg-white/5 border border-white/10 text-white placeholder:text-[#B8C5D6]/50',
    'focus:outline-none focus:border-[#1F74FF]/60 focus:ring-2 focus:ring-[#1F74FF]/20',
    'transition-all duration-200'
  );

  return (
    <div className="min-h-screen bg-[#0B1B36] flex items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#1F74FF]/10 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#00C853]/10 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 80, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0E2D66]/60 blur-[120px] pointer-events-none"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card-strong rounded-3xl p-8 border border-white/10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F74FF] to-[#0E2D66] flex items-center justify-center shadow-xl shadow-[#1F74FF]/30 mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SalesFlow CRM</h1>
            <p className="text-sm text-[#B8C5D6] mt-1">Faça login para continuar</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-[#B8C5D6] mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C5D6]/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClass, 'pr-12')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8C5D6]/60 hover:text-[#B8C5D6] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Forgot password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end"
            >
              <button
                type="button"
                className="text-sm text-[#1F74FF] hover:text-[#1F74FF]/80 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#EF5350]/10 border border-[#EF5350]/30 text-[#EF5350] text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl',
                  'bg-[#1F74FF] text-white font-semibold text-base',
                  'shadow-lg shadow-[#1F74FF]/30 transition-all duration-200',
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1F74FF]/90'
                )}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 my-6"
          >
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[#B8C5D6]/50">ou continue com</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="grid grid-cols-2 gap-3"
          >
            {['Google', 'Microsoft'].map((provider) => (
              <motion.button
                key={provider}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-[#B8C5D6] text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                {provider === 'Google' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.5 2H2v9.5h9.5V2zm1 0v9.5H22V2h-9.5zM2 12.5V22h9.5v-9.5H2zm10.5 0V22H22v-9.5h-9.5z"/>
                  </svg>
                )}
                {provider}
              </motion.button>
            ))}
          </motion.div>

          {/* Sign up */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-[#B8C5D6] mt-6"
          >
            Não tem uma conta?{' '}
            <button className="text-[#1F74FF] font-medium hover:underline transition-all">
              Criar conta grátis
            </button>
          </motion.p>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-[#B8C5D6]/40 mt-4"
        >
          Demo: use qualquer email e senha com 6+ caracteres
        </motion.p>
      </motion.div>
    </div>
  );
}
