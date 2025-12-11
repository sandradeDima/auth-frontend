'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M4 20h16" />
    <rect x="6" y="11" width="3" height="5" rx="1" />
    <rect x="11" y="7" width="3" height="9" rx="1" />
    <rect x="16" y="4" width="3" height="12" rx="1" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
    <circle cx="18" cy="9" r="2.5" />
    <path d="M15.5 20c0-1.8 1.5-3.3 3.5-3.5" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 12a7.4 7.4 0 0 0-.1-1l1.8-1.4-1.7-2.9-2.1.7a7.3 7.3 0 0 0-1.7-1l-.3-2.2h-3.4l-.3 2.2c-.6.2-1.1.6-1.7 1l-2.1-.7-1.7 2.9 1.8 1.4a7.4 7.4 0 0 0 0 2l-1.8 1.4 1.7 2.9 2.1-.7c.5.4 1.1.7 1.7 1l.3 2.2h3.4l.3-2.2c.6-.2 1.1-.6 1.7-1l2.1.7 1.7-2.9-1.8-1.4c.1-.3.1-.7.1-1Z" />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M4 9.5 12 4l8 5.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14h-4v6.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.5Z" />
  </svg>
);

const navItems: NavItem[] = [
  { key: 'registros', label: 'Registro', href: '/registros', icon: PlusIcon },
  { key: 'reportes', label: 'Reportes', href: '/reportes', icon: ChartIcon },
  { key: 'clientes', label: 'Clientes', href: '/clientes', icon: UsersIcon },
  { key: 'usuarios', label: 'Usuarios', href: '/usuarios', icon: UserIcon },
  { key: 'configuraciones', label: 'Configuraciones', href: '/configuraciones', icon: SettingsIcon },
  { key: 'inicio', label: 'Inicio', href: '/home', icon: HomeIcon },
];

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 2;

  const filteredNavItems = isAdmin
    ? navItems
    : navItems.filter((item) => ['registros', 'reportes', 'clientes'].includes(item.key));

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f3eb] flex flex-col lg:flex-row">
        <aside className="hidden lg:flex lg:w-64 xl:w-72 bg-[#0B0B0D] border-r border-[#1F1F23] min-h-screen flex-col p-6 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-y-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="relative h-10 w-40">
              <Image
                src="/Assets/Images/logo espacio sobre negro.jpg"
                alt="Espacio V"
                fill
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
          </div>
          <nav className="flex flex-col gap-2 text-[#F4F4F5]">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#D4AF31] text-[#0B0B0D]'
                      : 'hover:bg-[#15151A] text-[#F4F4F5]'
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen pb-28 lg:pb-0">
          <header className="w-full max-w-6xl mx-auto px-4 pt-4 lg:px-8 xl:px-10 sticky top-0 z-30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0D] text-sm font-semibold text-white">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EV'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#1F2937]">{user?.name ?? 'Usuario'}</span>
                  <span className="text-xs text-[#6B7280]">{user?.email ?? 'correo no disponible'}</span>
                </div>
                <span className="rounded-full bg-[#fcd34f]/40 px-3 py-1 text-xs font-semibold text-[#7a5b00]">
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto rounded-xl bg-[#D14343] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b23535]"
              >
                Cerrar sesión
              </button>
            </div>
          </header>
          <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 xl:p-10">
            {children}
          </main>
        </div>

        <MobileBottomNav pathname={pathname} isAdmin={isAdmin} navItems={filteredNavItems} />

      </div>
    </ProtectedRoute>
  );
}

function MobileBottomNav({
  pathname,
  isAdmin,
  navItems,
}: {
  pathname: string;
  isAdmin: boolean;
  navItems: NavItem[];
}) {
  const reportesItem = navItems.find((item) => item.key === 'reportes');
  const registroItem = navItems.find((item) => item.key === 'registros');
  const clientesItem = navItems.find((item) => item.key === 'clientes');
  const usuariosItem = navItems.find((item) => item.key === 'usuarios');
  const configuracionesItem = navItems.find((item) => item.key === 'configuraciones');

  if (!reportesItem || !registroItem || !clientesItem) return null;

  const slots = isAdmin
    ? [
        { key: 'reportes', item: reportesItem },
        { key: 'clientes', item: clientesItem },
        null, // espacio central para el botón flotante
        { key: 'usuarios', item: usuariosItem },
        { key: 'configuraciones', item: configuracionesItem },
      ]
    : [
        { key: 'reportes', item: reportesItem },
        null, // espacio central para el botón flotante
        { key: 'clientes', item: clientesItem },
      ];
  const gridColsClass = slots.length === 5 ? 'grid-cols-5' : 'grid-cols-3';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <nav className="relative mx-auto max-w-3xl rounded-t-2xl bg-[#0B0B0D] shadow-[0_-12px_28px_rgba(0,0,0,0.28)] border-t border-[#1F1F23] px-5 pt-2 pb-6">
        <div className={`grid ${gridColsClass} items-center text-center text-[11px] font-semibold text-[#E5E7EB]`}>
          {slots.map((slot, idx) =>
            slot && slot.item ? (
              <Link
                key={slot.key}
                href={slot.item.href}
                className={`flex flex-col items-center gap-1.5 py-2 transition ${
                  pathname === slot.item.href ? 'text-[#D4AF31]' : 'text-[#9CA3AF] hover:text-[#D4AF31]'
                }`}
              >
                {slot.item.icon && <slot.item.icon className="h-5 w-5" />}
                <span>{slot.item.label}</span>
              </Link>
            ) : (
              <div key={`spacer-${idx}`} />
            )
          )}
        </div>

        <Link
          href={registroItem.href}
          aria-label="Registro"
          className="absolute left-1/2 -translate-x-1/2 -translate-y-8 w-16 h-16 rounded-full bg-linear-to-br from-[#D4AF31] to-[#b3861a] text-[#0B0B0D] flex items-center justify-center shadow-xl border-4 border-[#0B0B0D] active:scale-95 transition"
        >
          {registroItem.icon ? (
            <registroItem.icon className="h-7 w-7" />
          ) : (
            <span className="text-2xl">+</span>
          )}
        </Link>
      </nav>
    </div>
  );
}
