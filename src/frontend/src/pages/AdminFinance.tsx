import { SavingsDirection } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddInfaq,
  useAddSavings,
  useDeleteInfaq,
  useDeleteSavings,
  useInfaq,
  useInfaqTotal,
  useSavings,
  useStudents,
} from "@/hooks/useQueries";
import { formatDate, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Loader2, PiggyBank, Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";

export function AdminFinance() {
  const students = useStudents();
  const [studentId, setStudentId] = useState<string>("");
  const selectedId = studentId ? BigInt(studentId) : undefined;

  const savings = useSavings(selectedId);
  const infaq = useInfaq(selectedId);
  const infaqTotal = useInfaqTotal(selectedId);
  const addSavings = useAddSavings();
  const addInfaq = useAddInfaq();
  const deleteSavings = useDeleteSavings();
  const deleteInfaq = useDeleteInfaq();

  const [savingsOpen, setSavingsOpen] = useState(false);
  const [infaqOpen, setInfaqOpen] = useState(false);
  const [savingsForm, setSavingsForm] = useState({
    direction: SavingsDirection.masuk,
    amount: "",
    date: "",
    note: "",
  });
  const [infaqForm, setInfaqForm] = useState({
    amount: "",
    date: "",
    note: "",
  });

  const handleAddSavings = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId || !savingsForm.amount || !savingsForm.date) return;
    addSavings.mutate(
      {
        studentId: selectedId,
        direction: savingsForm.direction,
        amount: BigInt(savingsForm.amount),
        date: savingsForm.date,
        note: savingsForm.note,
      },
      {
        onSuccess: () => {
          setSavingsForm({
            direction: SavingsDirection.masuk,
            amount: "",
            date: "",
            note: "",
          });
          setSavingsOpen(false);
        },
      },
    );
  };

  const handleAddInfaq = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId || !infaqForm.amount || !infaqForm.date) return;
    addInfaq.mutate(
      {
        studentId: selectedId,
        amount: BigInt(infaqForm.amount),
        date: infaqForm.date,
        note: infaqForm.note,
      },
      {
        onSuccess: () => {
          setInfaqForm({ amount: "", date: "", note: "" });
          setInfaqOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Keuangan Siswa
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Catat tabungan dan infak
        </p>
      </header>

      <div className="space-y-1.5">
        <Label htmlFor="finance-student">Pilih Siswa</Label>
        <Select value={studentId} onValueChange={setStudentId}>
          <SelectTrigger
            id="finance-student"
            data-ocid="admin.finance.select.student"
          >
            <SelectValue placeholder="Pilih siswa" />
          </SelectTrigger>
          <SelectContent>
            {students.data?.map((student) => (
              <SelectItem
                key={student.id.toString()}
                value={student.id.toString()}
              >
                {student.name} · {student.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedId ? (
        <Card className="border-dashed border-border shadow-none">
          <CardContent
            data-ocid="admin.finance.empty_state"
            className="flex flex-col items-center px-4 py-10 text-center"
          >
            <Wallet
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium">Pilih siswa</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih siswa untuk melihat dan mencatat keuangan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">Tabungan</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  data-ocid="admin.savings.open_modal_button"
                  onClick={() => setSavingsOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Transaksi
                </Button>
              </div>
              {savings.isLoading ? (
                <Skeleton className="mt-3 h-8 w-40" />
              ) : (
                <p className="mt-2 font-display text-xl font-semibold nums-tabular">
                  {savings.data ? formatRupiah(savings.data.balance) : "—"}
                </p>
              )}
              {savings.data && savings.data.transactions.length > 0 ? (
                <ul className="mt-3 divide-y divide-border border-t border-border">
                  {savings.data.transactions.map((tx) => (
                    <li
                      key={tx.id.toString()}
                      data-ocid={`admin.savings.item.${tx.id}`}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate text-muted-foreground">
                        {formatDate(tx.date)}
                        {tx.note ? ` · ${tx.note}` : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className={cn(
                            "font-medium nums-tabular",
                            tx.direction === "masuk"
                              ? "text-primary"
                              : "text-destructive",
                          )}
                        >
                          {tx.direction === "masuk" ? "+" : "−"}
                          {formatRupiah(tx.amount)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          data-ocid={`admin.savings.delete_button.${tx.id}`}
                          aria-label={`Hapus transaksi ${formatDate(tx.date)}`}
                          disabled={deleteSavings.isPending}
                          onClick={() => deleteSavings.mutate(tx.id)}
                        >
                          <Trash2
                            className="h-4 w-4 text-destructive"
                            aria-hidden="true"
                          />
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-gold" aria-hidden="true" />
                  <span className="text-sm font-medium">Infak</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-ocid="admin.infaq.open_modal_button"
                  onClick={() => setInfaqOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                  Infak
                </Button>
              </div>
              {infaqTotal.isLoading ? (
                <Skeleton className="mt-3 h-8 w-40" />
              ) : (
                <p className="mt-2 font-display text-xl font-semibold text-gold nums-tabular">
                  {infaqTotal.data !== undefined
                    ? formatRupiah(infaqTotal.data)
                    : "—"}
                </p>
              )}
              {infaq.data && infaq.data.length > 0 ? (
                <ul className="mt-3 divide-y divide-border border-t border-border">
                  {infaq.data.map((tx) => (
                    <li
                      key={tx.id.toString()}
                      data-ocid={`admin.infaq.item.${tx.id}`}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate text-muted-foreground">
                        {formatDate(tx.date)}
                        {tx.note ? ` · ${tx.note}` : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gold nums-tabular">
                          {formatRupiah(tx.amount)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          data-ocid={`admin.infaq.delete_button.${tx.id}`}
                          aria-label={`Hapus infak ${formatDate(tx.date)}`}
                          disabled={deleteInfaq.isPending}
                          onClick={() => deleteInfaq.mutate(tx.id)}
                        >
                          <Trash2
                            className="h-4 w-4 text-destructive"
                            aria-hidden="true"
                          />
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={savingsOpen} onOpenChange={setSavingsOpen}>
        <DialogContent data-ocid="admin.savings.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Transaksi Tabungan</DialogTitle>
            <DialogDescription>Catat setoran atau penarikan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSavings} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="savings-direction">Jenis</Label>
              <Select
                value={savingsForm.direction}
                onValueChange={(value) =>
                  setSavingsForm({
                    ...savingsForm,
                    direction: value as SavingsDirection,
                  })
                }
              >
                <SelectTrigger
                  id="savings-direction"
                  data-ocid="admin.savings.select.direction"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SavingsDirection.masuk}>
                    Setoran
                  </SelectItem>
                  <SelectItem value={SavingsDirection.keluar}>
                    Penarikan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="savings-amount">Jumlah (Rp)</Label>
              <Input
                id="savings-amount"
                type="number"
                min="0"
                data-ocid="admin.savings.input.amount"
                value={savingsForm.amount}
                onChange={(e) =>
                  setSavingsForm({ ...savingsForm, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="savings-date">Tanggal</Label>
              <Input
                id="savings-date"
                type="date"
                data-ocid="admin.savings.input.date"
                value={savingsForm.date}
                onChange={(e) =>
                  setSavingsForm({ ...savingsForm, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="savings-note">Catatan</Label>
              <Input
                id="savings-note"
                data-ocid="admin.savings.input.note"
                value={savingsForm.note}
                onChange={(e) =>
                  setSavingsForm({ ...savingsForm, note: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSavingsOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.savings.submit_button"
                disabled={addSavings.isPending}
              >
                {addSavings.isPending ? (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={infaqOpen} onOpenChange={setInfaqOpen}>
        <DialogContent data-ocid="admin.infaq.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Catat Infak</DialogTitle>
            <DialogDescription>Tambahkan transaksi infak.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddInfaq} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="infaq-amount">Jumlah (Rp)</Label>
              <Input
                id="infaq-amount"
                type="number"
                min="0"
                data-ocid="admin.infaq.input.amount"
                value={infaqForm.amount}
                onChange={(e) =>
                  setInfaqForm({ ...infaqForm, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="infaq-date">Tanggal</Label>
              <Input
                id="infaq-date"
                type="date"
                data-ocid="admin.infaq.input.date"
                value={infaqForm.date}
                onChange={(e) =>
                  setInfaqForm({ ...infaqForm, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="infaq-note">Catatan</Label>
              <Input
                id="infaq-note"
                data-ocid="admin.infaq.input.note"
                value={infaqForm.note}
                onChange={(e) =>
                  setInfaqForm({ ...infaqForm, note: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInfaqOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.infaq.submit_button"
                disabled={addInfaq.isPending}
              >
                {addInfaq.isPending ? (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
