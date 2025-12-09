"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Calendar,
  Phone,
  Eye,
  UserCheck,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

interface DashboardStats {
  totalLeads: number
  totalProperties: number
  totalRevenue: number
  completedPayments: number
  newLeads: number
  contactedLeads: number
  convertedLeads: number
  qualifiedLeads: number
}

interface LeadTypeStats {
  bookVisitLeads: number
  floorPlanLeads: number
  consultLeads: number
}

interface Lead {
  id: string
  name?: string
  email?: string
  phone?: string
  status?: string
  lead_type?: string
  created_at: string
}

interface AdminDashboardClientProps {
  stats: DashboardStats
  leadTypeStats: LeadTypeStats
  recentLeads: Lead[]
}

export function AdminDashboardClient({ stats, leadTypeStats, recentLeads }: AdminDashboardClientProps) {
  const {
    totalLeads,
    totalProperties,
    totalRevenue,
    completedPayments,
    newLeads,
    contactedLeads,
    convertedLeads,
    qualifiedLeads,
  } = stats

  const { bookVisitLeads, floorPlanLeads, consultLeads } = leadTypeStats

  const statCards = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      change: newLeads,
      changeLabel: "new",
      trend: "up",
    },
    {
      title: "Properties",
      value: totalProperties,
      icon: Building2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      change: totalProperties,
      changeLabel: "listed",
      trend: "up",
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-500",
      lightBg: "bg-purple-50",
      change: completedPayments,
      changeLabel: "payments",
      trend: "up",
    },
    {
      title: "Conversion",
      value: totalLeads > 0 ? `${((convertedLeads / totalLeads) * 100).toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-500",
      lightBg: "bg-amber-50",
      change: convertedLeads,
      changeLabel: "converted",
      trend: convertedLeads > 0 ? "up" : "neutral",
    },
  ]

  const leadTypes = [
    { label: "Site Visits", value: bookVisitLeads, color: "bg-blue-500", lightColor: "bg-blue-100" },
    { label: "Floor Plans", value: floorPlanLeads, color: "bg-emerald-500", lightColor: "bg-emerald-100" },
    { label: "Consultations", value: consultLeads, color: "bg-purple-500", lightColor: "bg-purple-100" },
  ]

  const pipelineStages = [
    { label: "New", value: newLeads, icon: Clock, color: "blue" },
    { label: "Contacted", value: contactedLeads, icon: Phone, color: "amber" },
    { label: "Qualified", value: qualifiedLeads, icon: Eye, color: "purple" },
    { label: "Converted", value: convertedLeads, icon: UserCheck, color: "emerald" },
  ]

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    contacted: "bg-amber-100 text-amber-800 border-amber-200",
    qualified: "bg-purple-100 text-purple-800 border-purple-200",
    converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    lost: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="p-4 lg:p-8">
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-accent/10">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Welcome to OdiBrix Admin Panel - Real-time business overview</p>
      </motion.div>

      {/* Stats Grid with animated cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="group">
            <Card className="relative overflow-hidden border-0 shadow-premium hover:shadow-premium-lg transition-all">
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${stat.bgColor}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <motion.p
                      className="text-3xl font-bold mt-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {stat.value}
                    </motion.p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className="text-muted-foreground">
                        {stat.change} {stat.changeLabel}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    className={`w-14 h-14 rounded-2xl ${stat.lightBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Lead Types & Pipeline */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Leads by Type */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg">Leads by Type</CardTitle>
              <CardDescription>Distribution of lead sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {leadTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                      <span className="font-bold text-lg">{type.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full ${type.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${totalLeads > 0 ? (type.value / totalLeads) * 100 : 0}%` }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Pipeline */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="h-full border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg">Lead Pipeline</CardTitle>
              <CardDescription>Track leads through your sales funnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pipelineStages.map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-5 rounded-2xl bg-${stage.color}-50 border border-${stage.color}-100 cursor-default`}
                    style={{
                      background: `linear-gradient(135deg, var(--${stage.color}-50) 0%, var(--${stage.color}-100) 100%)`,
                    }}
                  >
                    <motion.div
                      className={`w-12 h-12 mx-auto rounded-xl bg-${stage.color}-100 flex items-center justify-center mb-3`}
                      whileHover={{ rotate: 10 }}
                    >
                      <stage.icon className={`h-6 w-6 text-${stage.color}-600`} />
                    </motion.div>
                    <motion.p
                      className={`text-3xl font-bold text-${stage.color}-600`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      {stage.value}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{stage.label}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Leads */}
      <motion.div variants={fadeInUp}>
        <Card className="border-0 shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest enquiries from potential customers</CardDescription>
            </div>
            <Link href="/admin/leads">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  View All
                </Badge>
              </motion.div>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                    className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center shadow-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-lg font-bold text-white">
                          {lead.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </motion.div>
                      <div>
                        <p className="font-semibold">{lead.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <Badge className={`${statusColors[lead.status || "new"]} capitalize border`}>
                          {lead.status || "new"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {lead.lead_type?.replace("_", " ") || "General"}
                        </p>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <motion.a
                        href={`tel:${lead.phone}`}
                        className="p-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-muted/30 rounded-2xl"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4"
                >
                  <Users className="h-8 w-8 text-muted-foreground" />
                </motion.div>
                <p className="text-muted-foreground font-medium mb-2">No leads yet</p>
                <p className="text-sm text-muted-foreground">
                  Leads will appear here when customers submit forms on your website.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
