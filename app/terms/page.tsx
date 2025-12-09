import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: December 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using OdiBrix services, you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
              <p className="text-muted-foreground mb-4">
                OdiBrix provides real estate listing, consultation, and related services. Our consultancy package
                includes floor plans, cost estimations, and expert consultation calls.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Payments & Refunds</h2>
              <p className="text-muted-foreground mb-4">
                The consultancy fee of ₹1,499 is non-refundable once the service delivery has begun. Refunds may be
                considered on a case-by-case basis if services are not delivered as promised.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                Users agree to provide accurate information and use our services in compliance with applicable laws. Any
                misuse of services may result in account termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                OdiBrix acts as an intermediary and is not responsible for property conditions, legal issues, or
                disputes between buyers and sellers. Users should conduct their own due diligence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at:
                <br />
                Email: odibrix@gmail.com
                <br />
                Phone: 8763022010
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
