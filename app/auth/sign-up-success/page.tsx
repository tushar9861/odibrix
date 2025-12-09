import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Image
              src="/images/odibrix-logo.jpg"
              alt="OdiBrix"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription className="text-base">
              Welcome to OdiBrix! We've sent you a confirmation email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Check your inbox</p>
                <p>
                  Click the verification link in your email to activate your account and start exploring properties.
                </p>
              </div>
            </div>

            <div className="text-center pt-2 space-y-2">
              <Link href="/auth/login" className="text-sm text-primary font-medium hover:underline block">
                Back to Sign In
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground block">
                Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
