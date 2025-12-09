"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FolderOpen,
  UserCog,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/agents", label: "Agents", icon: UserCog },
  { href: "/admin/brix", label: "Brix Points", icon: Award },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "Admin"

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/images/odibrix-logo.jpg" alt="OdiBrix" width={48} height={48} className="rounded-full" />
              <div>
                <h1 className="font-serif font-bold text-lg">OdiBrix</h1>
                <p className="text-xs text-muted-foreground">Control Center</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url || "/placeholder.svg"}
                    alt={displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Back to site */}
          <div className="p-4 border-t">
            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full">
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
