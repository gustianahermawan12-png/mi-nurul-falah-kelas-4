import type { StudentInput, StudentView } from "@/backend";
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
  useAddClass,
  useAddStudent,
  useClasses,
  useDeleteClass,
  useDeleteStudent,
  useStudents,
  useUpdateClass,
  useUpdateStudent,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Trash2, UserCircle } from "lucide-react";
import { useState } from "react";

interface FormState {
  name: string;
  nisn: string;
  parentPhone: string;
  parentPassword: string;
  classId: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  name: "",
  nisn: "",
  parentPhone: "",
  parentPassword: "",
  classId: "",
  isActive: true,
};

export function AdminStudents() {
  const students = useStudents();
  const classes = useClasses();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const addClass = useAddClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudentView | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [editingClassId, setEditingClassId] = useState<bigint | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  };

  const openEdit = (student: StudentView) => {
    setEditing(student);
    setForm({
      name: student.name,
      nisn: student.nisn,
      parentPhone: "",
      parentPassword: "",
      classId: student.classId.toString(),
      isActive: student.isActive,
    });
    setError(null);
    setOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.classId) {
      setError("Pilih kelas terlebih dahulu.");
      return;
    }
    if (!form.parentPassword) {
      setError("Kata sandi orang tua wajib diisi.");
      return;
    }
    const input: StudentInput = {
      name: form.name.trim(),
      nisn: form.nisn.trim(),
      parentPhone: form.parentPhone.trim(),
      parentPassword: form.parentPassword,
      classId: BigInt(form.classId),
      isActive: form.isActive,
    };
    if (editing) {
      updateStudent.mutate(
        { id: editing.id, input },
        {
          onSuccess: () => setOpen(false),
          onError: (err) => setError(err.message),
        },
      );
    } else {
      addStudent.mutate(input, {
        onSuccess: () => setOpen(false),
        onError: (err) => setError(err.message),
      });
    }
  };

  const handleSaveClass = (event: React.FormEvent) => {
    event.preventDefault();
    const name = className.trim();
    if (!name) return;
    if (editingClassId !== null) {
      updateClass.mutate(
        { id: editingClassId, name },
        {
          onSuccess: () => {
            setClassName("");
            setEditingClassId(null);
          },
        },
      );
    } else {
      addClass.mutate(name, {
        onSuccess: () => setClassName(""),
      });
    }
  };

  const startEditClass = (id: bigint, name: string) => {
    setEditingClassId(id);
    setClassName(name);
  };

  const cancelEditClass = () => {
    setEditingClassId(null);
    setClassName("");
  };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight">
            Daftar Siswa
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {students.data?.length ?? 0} siswa terdaftar
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="admin.class.open_modal_button"
            onClick={() => setClassOpen(true)}
          >
            Kelas
          </Button>
          <Button
            type="button"
            size="sm"
            data-ocid="admin.student.open_modal_button"
            onClick={openAdd}
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            Siswa
          </Button>
        </div>
      </header>

      {students.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => `student-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-16 w-full rounded-lg" />
            ),
          )}
        </div>
      ) : students.data && students.data.length > 0 ? (
        <ul className="space-y-2">
          {students.data.map((student) => (
            <li
              key={student.id.toString()}
              data-ocid={`admin.student.item.${student.id}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-primary">
                {student.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{student.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {student.className} · NISN {student.nisn}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                data-ocid={`admin.student.edit_button.${student.id}`}
                aria-label={`Ubah data ${student.name}`}
                onClick={() => openEdit(student)}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                data-ocid={`admin.student.delete_button.${student.id}`}
                aria-label={`Hapus data ${student.name}`}
                onClick={() => deleteStudent.mutate(student.id)}
              >
                <Trash2
                  className="h-4 w-4 text-destructive"
                  aria-hidden="true"
                />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="border-dashed border-border shadow-none">
          <CardContent
            data-ocid="admin.student.empty_state"
            className="flex flex-col items-center px-4 py-10 text-center"
          >
            <UserCircle
              className="h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium">Belum ada siswa</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan siswa untuk mulai mengelola nilai dan kehadiran.
            </p>
            <Button type="button" className="mt-4" onClick={openAdd}>
              Tambah Siswa
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.student.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah Siswa" : "Tambah Siswa"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Perbarui data siswa. Masukkan kembali kata sandi orang tua."
                : "Isi data siswa dan akun orang tua."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="student-name">Nama</Label>
              <Input
                id="student-name"
                data-ocid="admin.student.input.name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="student-nisn">NISN</Label>
                <Input
                  id="student-nisn"
                  data-ocid="admin.student.input.nisn"
                  value={form.nisn}
                  onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="student-class">Kelas</Label>
                <Select
                  value={form.classId}
                  onValueChange={(value) =>
                    setForm({ ...form, classId: value })
                  }
                >
                  <SelectTrigger
                    id="student-class"
                    data-ocid="admin.student.select.class"
                  >
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.data?.map((cls) => (
                      <SelectItem
                        key={cls.id.toString()}
                        value={cls.id.toString()}
                      >
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-phone">Nomor HP Orang Tua</Label>
              <Input
                id="student-phone"
                data-ocid="admin.student.input.phone"
                value={form.parentPhone}
                onChange={(e) =>
                  setForm({ ...form, parentPhone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-password">Kata Sandi Orang Tua</Label>
              <Input
                id="student-password"
                type="password"
                data-ocid="admin.student.input.password"
                value={form.parentPassword}
                onChange={(e) =>
                  setForm({ ...form, parentPassword: e.target.value })
                }
                required
              />
            </div>
            {error ? (
              <p
                data-ocid="admin.student.error_state"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.student.submit_button"
                disabled={addStudent.isPending || updateStudent.isPending}
              >
                {addStudent.isPending || updateStudent.isPending ? (
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

      <Dialog
        open={classOpen}
        onOpenChange={(next) => {
          setClassOpen(next);
          if (!next) cancelEditClass();
        }}
      >
        <DialogContent data-ocid="admin.class.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Kelola Kelas</DialogTitle>
            <DialogDescription>
              Tambah, ubah, atau hapus kelas.
            </DialogDescription>
          </DialogHeader>
          {classes.data && classes.data.length > 0 ? (
            <ul className="space-y-1.5">
              {classes.data.map((cls) => (
                <li
                  key={cls.id.toString()}
                  data-ocid={`admin.class.item.${cls.id}`}
                  className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium"
                >
                  <span className="min-w-0 flex-1 truncate">{cls.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-ocid={`admin.class.edit_button.${cls.id}`}
                    aria-label={`Ubah kelas ${cls.name}`}
                    onClick={() => startEditClass(cls.id, cls.name)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-ocid={`admin.class.delete_button.${cls.id}`}
                    aria-label={`Hapus kelas ${cls.name}`}
                    disabled={deleteClass.isPending}
                    onClick={() => deleteClass.mutate(cls.id)}
                  >
                    <Trash2
                      className="h-4 w-4 text-destructive"
                      aria-hidden="true"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada kelas.</p>
          )}
          <form onSubmit={handleSaveClass} className="flex gap-2">
            <Input
              data-ocid="admin.class.input.name"
              placeholder={
                editingClassId !== null ? "Ubah nama kelas" : "Nama kelas baru"
              }
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            {editingClassId !== null ? (
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.class.cancel_button"
                onClick={cancelEditClass}
              >
                Batal
              </Button>
            ) : null}
            <Button
              type="submit"
              data-ocid="admin.class.submit_button"
              disabled={addClass.isPending || updateClass.isPending}
            >
              {addClass.isPending || updateClass.isPending ? (
                <Loader2
                  className="mr-1 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              {editingClassId !== null ? "Simpan" : "Tambah"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
