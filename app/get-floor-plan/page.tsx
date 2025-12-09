import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Get Floor Plan & Estimation - Expert Consultancy",
  description:
    "Get a professional floor plan and cost estimation for your property in Odisha. Book our ₹1,499 expert consultancy package with 30-minute consultation call.",
  openGraph: {
    title: "Get Floor Plan & Estimation | OdiBrix",
    description: "Professional floor plan and cost estimation for your property in Odisha.",
  },
}

export default function Page() {
  return <ClientPage />
}
