'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner';
import { api } from './lib/api/client';
import { MensajeApi } from '@/types/api';
import { LoginResponse } from '@/types/loginResponse';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Authenticated, redirecting to registros");
      router.push('/registros');
    }else{
      console.log("Not authenticated, redirecting to login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner className="w-8 h-8 text-[#fcd34f]" />
      </div>
    );
  }

  // Don't render if already authenticated (will redirect)
  if (isAuthenticated) {
    console.log("Authenticated, redirecting to home");
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // Show spinner
    try{

      const response : MensajeApi<LoginResponse> = await api.post('/api/auth/login', { email, password });
      console.log("Full response:", response);
      console.log("Response error:", response?.error);
      console.log("Response data:", response?.data);
      
      if(response && !response.error && response.data){
        // Store login data in context and redirect
        console.log("Login successful, storing data and redirecting");
        login(response.data);
        router.push('/registros');
      }else{
        console.log("Login failed, setting error");
        setError(response?.message || 'Login failed');
      }
    }catch(error){
      setError('Invalid email or password');
      console.error(error);
    }finally{
      setIsSubmitting(false);
    }
    // Handle login logic here
    
  };

  return (
    <div className="h-dvh bg-[#0F0F12] flex flex-col overflow-hidden">
      {/* Mobile/Tablet: Single column, Desktop: Side by side */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-5xl mx-auto lg:my-auto lg:rounded-[24px] lg:border lg:border-[#1F1F23] lg:shadow-2xl lg:overflow-hidden lg:max-h-[90vh]">
        {/* Left Panel - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex relative items-center justify-center p-14 lg:w-1/2 bg-linear-to-br from-[#0B0B0D] via-[#111016] to-[#1F1A10]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_26%)]" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <div className="relative h-20 w-48">
              <Image
                src="/Assets/Images/logo espacio V-03.png"
                alt="Espacio V"
                fill
                className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                sizes="200px"
                priority
              />
            </div>
            <p className="text-lg text-[#E5E7EB]/90 max-w-sm">
              Bienvenida a Espacio V. Crea y gestiona reportes con una experiencia premium.
            </p>
          </div>
        </div>

        {/* Right Panel - Full height on mobile */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-8 lg:p-12 bg-[#0F0F12]">
          <div className="w-full max-w-sm mx-auto space-y-5">
            {/* Mobile logo */}
            <div className="flex flex-col items-center gap-4 lg:hidden mb-6">
              <div className="relative h-14 w-36">
                <Image
                  src="/Assets/Images/logo espacio V-03.png"
                  alt="Espacio V"
                  fill
                  className="object-contain"
                  sizes="144px"
                  priority
                />
              </div>
            </div>

            {/* Desktop logo bar */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative h-10 w-36 rounded-lg bg-white/90 px-2 py-1 shadow">
                <Image
                  src="/Assets/Images/logo espacio sobre blanco.jpg"
                  alt="Espacio V"
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </div>
              <div className="h-px flex-1 bg-linear-to-r from-[#fcd34f] via-[#fcd34f]/60 to-transparent" />
            </div>

            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Iniciar sesión</h1>
              <p className="text-sm text-[#A7AAB0]">
                Accede al panel profesional de Espacio V.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#E5E7EB]">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#fcd34f] focus:border-transparent text-base"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#E5E7EB]">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#fcd34f] focus:border-transparent text-base"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#fcd34f] text-[#0B0B0D] font-semibold py-3 px-4 rounded-lg hover:bg-[#c19722] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd34f]/60 focus:ring-offset-2 focus:ring-offset-[#0F0F12] disabled:opacity-70 shadow-lg"
              >
                {isSubmitting ? <Spinner className="w-5 h-5 text-[#0B0B0D] mx-auto" /> : 'Entrar'}
              </button>
            </form>

            {/* Bottom Accent - mobile only */}
            <div className="flex justify-center pt-4 lg:hidden">
              <div className="flex flex-col space-y-1">
                <div className="w-8 h-[2px] bg-[#fcd34f]/40 rounded-sm translate-x-0.5" />
                <div className="w-8 h-[2px] bg-[#fcd34f] rounded-sm" />
                <div className="w-8 h-[2px] bg-[#fcd34f]/40 rounded-sm -translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
