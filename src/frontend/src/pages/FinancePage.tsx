import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfaq, useInfaqTotal, useSavings } from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import { formatDate, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";

export function FinancePage() {
  const { session } = useSession();
  const studentId = session?.studentId;
  const savings = useSavings(studentId);
  const infaq = useInfaq(studentId);
  const infaqTotal = useInfaqTotal(studentId);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Keuangan
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Tabungan dan infak siswa
        </p>
      </header>

      <Card className="overflow-hidden border-none bg-gradient-primary text-primary-foreground shadow-elevated">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <PiggyBank className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">
              Saldo Tabungan
            </span>
          </div>
          {savings.isLoading ? (
            <Skeleton className="mt-2 h-8 w-40 bg-primary-foreground/20" />
          ) : (
            <p className="mt-1 font-display text-2xl font-semibold nums-tabular">
              {savings.data ? formatRupiah(savings.data.balance) : "—"}
            </p>
          )}
          {savings.data ? (
            <div className="mt-3 flex gap-4 text-sm">
              <span className="flex items-center gap-1 text-primary-foreground/90">
                <ArrowDownLeft className="h-4 w-4" aria-hidden="true" />
                Masuk {formatRupiah(savings.data.totalIn)}
              </span>
              <span className="flex items-center gap-1 text-primary-foreground/90">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                Keluar {formatRupiah(savings.data.totalOut)}
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Riwayat Tabungan
        </h2>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {savings.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 3 },
                  (_, i) => `savings-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-10 w-full" />
                ))}
              </div>
            ) : savings.data && savings.data.transactions.length > 0 ? (
              <ul className="divide-y divide-border">
                {savings.data.transactions.map((tx) => (
                  <li
                    key={tx.id.toString()}
                    data-ocid={`finance.savings.item.${tx.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(tx.date)}
                      </p>
                      {tx.note ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {tx.note}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "font-display text-sm font-semibold nums-tabular",
                        tx.direction === "masuk"
                          ? "text-primary"
                          : "text-destructive",
                      )}
                    >
                      {tx.direction === "masuk" ? "+" : "−"}
                      {formatRupiah(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="finance.savings.empty_state"
                className="px-4 py-8 text-center"
              >
                <PiggyBank
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada transaksi tabungan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Infak</h2>
          <span className="font-display text-sm font-semibold text-gold nums-tabular">
            {infaqTotal.data !== undefined
              ? formatRupiah(infaqTotal.data)
              : "—"}
          </span>
        </div>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {infaq.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 3 }, (_, i) => `infaq-skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-10 w-full" />
                  ),
                )}
              </div>
            ) : infaq.data && infaq.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {infaq.data.map((tx) => (
                  <li
                    key={tx.id.toString()}
                    data-ocid={`finance.infaq.item.${tx.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDate(tx.date)}
                      </p>
                      {tx.note ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {tx.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="font-display text-sm font-semibold text-gold nums-tabular">
                      {formatRupiah(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                data-ocid="finance.infaq.empty_state"
                className="px-4 py-8 text-center"
              >
                <Wallet
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada catatan infak.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
