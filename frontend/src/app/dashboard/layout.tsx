'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { parseDashboardPathDynamic } from '@/utils/path';
import { getDashboardHome, getRoleLevel } from '@/utils/routing';
import { logoutUser } from '@/utils/api';
import Loading from '@/components/common/Loading';

const adminSections = [
  { label: 'Overview', path: 'overview' },
  { label: 'Products', path: 'products' },
  { label: 'Services', path: 'services' },
  { label: 'Categories', path: 'categories' },
  { label: 'Media', path: 'media' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    let redirectTo: string | null = null;

    if (!isAuthenticated || !user) {
      redirectTo = `/login?redirect=${encodeURIComponent(pathname)}`;
    } else if (pathname.startsWith('/dashboard/')) {
      const parsed = parseDashboardPathDynamic(pathname);

      if (!parsed) {
        redirectTo = '/403';
      } else {
        const { roleType: pathRoleType, role: pathRole } = parsed;
        const userRoleType = user.roleType;
        const userPrimaryRole = user.roles?.[0]?.toLowerCase() ?? 'user';

        if (pathRoleType !== userRoleType) {
          redirectTo = getDashboardHome(userRoleType, userPrimaryRole);
        } else {
          const userLevel = getRoleLevel(userRoleType, userPrimaryRole);
          const requiredLevel = getRoleLevel(pathRoleType, pathRole);

          if (requiredLevel === 0 || userLevel < requiredLevel) {
            redirectTo = '/403';
          }
        }
      }
    }

    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return <Loading size="large" text="Checking access..." />;
  }

  if (!isAuthenticated || !user) {
    return null; // Important: Don't render if no user yet
  }

  const roleType = user.roleType;
  const primaryRole = user.roles?.[0] ?? 'user';
  const baseDashboardPath = `/dashboard/${roleType}/${primaryRole}`;

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <header className="flex items-center justify-between bg-gray-800 text-white h-14 px-6">
        <div className="text-lg font-bold">Synix Dashboard</div>
        <div className="flex items-center gap-4">
          <span>{user.username}</span>
          <button
            onClick={async () => {
              await logoutUser();
              router.replace('/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4">
          <nav className="flex flex-col gap-3">
            {adminSections.map((section) => {
              const sectionPath = `${baseDashboardPath}/${section.path}`;
              const isActive = pathname.startsWith(sectionPath);

              return (
                <Link
                  key={section.path}
                  href={sectionPath}
                  className={`block p-2 rounded-md ${
                    isActive
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {section.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
