import type { Metadata } from "next"

import BookVisitClientPage from "./client"

export const metadata: Metadata = {
  title: "Book a Property Visit - Virtual or Physical Tour",
  description:
    "Schedule a virtual 3D tour or physical property visit with OdiBrix. Explore your dream property in Odisha with our expert guides.",
  openGraph: {
    title: "Book a Property Visit | OdiBrix",
    description: "Schedule a virtual 3D tour or physical property visit with OdiBrix.",
  },
}

export default function BookVisitPage() {
  return <BookVisitClientPage />
}
