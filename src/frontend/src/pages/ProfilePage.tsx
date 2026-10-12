import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudent } from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Mail, Phone, ShieldCheck, User } from "lucide-react";

export function ProfilePage() {
  const { session, logout } = useSession();
  const student = useStudent(session?.studentId);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Profil
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Informasi akun dan siswa
        </p>
      </header>

      <Card className="border-border shadow-card">
        <CardContent className="p-5">
          {student.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : student.data ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 font-display text-xl font-semibold text-primary">
                  {student.data.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">
                    {student.data.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {student.data.className}
                  </p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <User
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <dt className="text-muted-foreground">NISN</dt>
                  <dd className="ml-auto font-medium nums-tabular">
                    {student.data.nisn}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="ml-auto font-medium">
                    {student.data.isActive ? "Aktif" : "Tidak Aktif"}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Data siswa tidak ditemukan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-card">
        <CardContent className="p-5">
          <h3 className="font-display text-base font-semibold">Akun</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Peran</span>
              <span className="ml-auto font-medium">
                {session?.kind === "guru" ? "Guru" : "Orang Tua"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Akses</span>
              <span className="ml-auto font-medium">
                {session?.kind === "guru" ? "Baca & Tulis" : "Hanya Baca"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Sesi</span>
              <span className="ml-auto font-medium">Aktif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="button"
        variant="outline"
        data-ocid="profile.logout_button"
        onClick={handleLogout}
        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
        Keluar
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MI Nurul Falah. Dibuat dengan{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
