import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLoginParent,
  useLoginTeacher,
  useTeacherCredentials,
} from "@/hooks/useQueries";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { GraduationCap, KeyRound, Loader2, Phone, User } from "lucide-react";
import { useState } from "react";

type Mode = "parent" | "teacher";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [mode, setMode] = useState<Mode>("parent");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const credentials = useTeacherCredentials();
  const loginParent = useLoginParent();
  const loginTeacher = useLoginTeacher();
  const pending = loginParent.isPending || loginTeacher.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (mode === "parent") {
      loginParent.mutate(
        { identifier: identifier.trim(), password },
        {
          onSuccess: (session) => {
            login(session);
            void navigate({ to: "/" });
          },
          onError: (err) => setError(err.message),
        },
      );
    } else {
      loginTeacher.mutate(
        { username: identifier.trim(), password },
        {
          onSuccess: (session) => {
            login(session);
            void navigate({ to: "/admin" });
          },
          onError: (err) => setError(err.message),
        },
      );
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setIdentifier("");
    setPassword("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <div className="bg-gradient-primary px-6 pb-10 pt-12 text-primary-foreground">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              MI Nurul Falah
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Rapor Digital Siswa
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-6 w-full max-w-md flex-1 px-4 pb-10">
        <Card className="animate-fade-in border-border shadow-elevated">
          <CardContent className="p-5">
            <div
              role="tablist"
              aria-label="Pilih jenis akun"
              className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "parent"}
                data-ocid="login.tab.orangtua"
                onClick={() => switchMode("parent")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                  mode === "parent"
                    ? "bg-card text-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Orang Tua
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "teacher"}
                data-ocid="login.tab.guru"
                onClick={() => switchMode("teacher")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                  mode === "teacher"
                    ? "bg-card text-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Guru
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="identifier">
                  {mode === "parent" ? "NISN / Nomor HP" : "Username"}
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {mode === "parent" ? (
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <Input
                    id="identifier"
                    data-ocid="login.input.identifier"
                    className="pl-9"
                    autoComplete="username"
                    placeholder={mode === "parent" ? "1234567890" : "guru"}
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    data-ocid="login.input.password"
                    className="pl-9"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              {error ? (
                <p
                  data-ocid="login.error_state"
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                data-ocid="login.submit_button"
                disabled={pending}
                className="w-full"
              >
                {pending ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Memproses…
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {mode === "teacher" ? (
          <Card
            data-ocid="login.teacher_credentials"
            className="mt-4 border-accent/40 bg-accent/10 shadow-none"
          >
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/70">
                Akun Guru Awal
              </p>
              {credentials.isLoading ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Memuat kredensial…
                </p>
              ) : credentials.data ? (
                <div className="mt-2 space-y-1 text-sm text-foreground">
                  <p>
                    Username:{" "}
                    <span className="font-mono font-semibold">
                      {credentials.data.username}
                    </span>
                  </p>
                  <p>
                    Kata Sandi:{" "}
                    <span className="font-mono font-semibold">
                      {credentials.data.password}
                    </span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-ocid="login.use_credentials_button"
                    className="mt-2"
                    onClick={() => {
                      setIdentifier(credentials.data?.username ?? "");
                      setPassword(credentials.data?.password ?? "");
                    }}
                  >
                    Isi otomatis
                  </Button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Kredensial belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Orang tua hanya dapat melihat data. Perubahan dilakukan oleh guru.
        </p>
      </div>
    </div>
  );
}
