import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function PaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  }

  const totalRevenue =
    payments?.filter((p) => p.payment_status === "completed").reduce((sum, p) => sum + p.amount, 0) || 0

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Payments</h1>
        <p className="text-muted-foreground">Track all payment transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{payments?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold">
              {payments?.filter((p) => p.payment_status === "completed").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transaction_id || payment.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.payment_type?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{payment.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.payment_status]}>{payment.payment_status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
