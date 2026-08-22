import InactivityGuard from '@/components/admin/InactivityGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <InactivityGuard>{children}</InactivityGuard>
}
