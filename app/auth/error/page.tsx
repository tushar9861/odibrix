import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/images/odibrix-logo.jpg"
              alt="OdiBrix"
              width={100}
              height={100}
              className="rounded-full shadow-lg"
            />
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>{searchParams.message || "There was a problem signing you in"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Please try again or contact support if the problem persists.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/auth/login">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Website
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
