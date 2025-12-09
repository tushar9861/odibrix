import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: December 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                OdiBrix collects information you provide directly to us, including your name, email address, phone
                number, and property preferences when you fill out forms on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to provide, maintain, and improve our services, to process
                transactions, and to communicate with you about properties and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell or rent your personal information to third parties. We may share information with service
                providers who assist us in operating our website and conducting our business.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: odibrix@gmail.com
                <br />
                Phone: 8763022010
                <br />
                Address: Baleshwar, Odisha, India
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
