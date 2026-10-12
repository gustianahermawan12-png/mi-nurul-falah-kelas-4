import { Semester } from "@/backend";
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
  useAddCategory,
  useAddSubject,
  useCategories,
  useDeleteCategory,
  useDeleteGrade,
  useDeleteSubject,
  useGrades,
  useSetGrade,
  useStudents,
  useSubjects,
  useUpdateSubject,
} from "@/hooks/useQueries";
import { semesterLabel } from "@/lib/format";
import { GraduationCap, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function AdminGrades() {
  const subjects = useSubjects();
  const categories = useCategories();
  const students = useStudents();
  const addSubject = useAddSubject();
  const deleteSubject = useDeleteSubject();
  const updateSubject = useUpdateSubject();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const setGrade = useSetGrade();
  const deleteGrade = useDeleteGrade();

  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categorySemester, setCategorySemester] = useState<Semester>(
    Semester.semester1,
  );

  const [gradeStudentId, setGradeStudentId] = useState("");
  const [gradeSemester, setGradeSemester] = useState<Semester>(
    Semester.semester1,
  );
  const [gradeSubjectId, setGradeSubjectId] = useState("");
  const [gradeCategoryId, setGradeCategoryId] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [gradeError, setGradeError] = useState<string | null>(null);

  const selectedStudentId = gradeStudentId ? BigInt(gradeStudentId) : undefined;
  const grades = useGrades(selectedStudentId, gradeSemester);

  const semesterCategories =
    categories.data?.filter((c) => c.semester === gradeSemester) ?? [];

  const handleSetGrade = (event: React.FormEvent) => {
    event.preventDefault();
    setGradeError(null);
    if (!selectedStudentId || !gradeSubjectId || !gradeCategoryId) {
      setGradeError("Lengkapi siswa, mapel, dan kategori.");
      return;
    }
    const score = Number(gradeScore);
    if (!gradeScore || Number.isNaN(score) || score < 0 || score > 100) {
      setGradeError("Nilai harus berupa angka 0–100.");
      return;
    }
    setGrade.mutate(
      {
        studentId: selectedStudentId,
        subjectId: BigInt(gradeSubjectId),
        categoryId: BigInt(gradeCategoryId),
        score: BigInt(Math.round(score)),
      },
      {
        onSuccess: () => setGradeScore(""),
        onError: (err) => setGradeError(err.message),
      },
    );
  };

  const handleAddSubject = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subjectName.trim()) return;
    addSubject.mutate(subjectName.trim(), {
      onSuccess: () => {
        setSubjectName("");
        setSubjectOpen(false);
      },
    });
  };

  const handleUpdateSubject = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editSubjectId || !editSubjectName.trim()) return;
    updateSubject.mutate(
      { id: BigInt(editSubjectId), name: editSubjectName.trim() },
      {
        onSuccess: () => {
          setEditSubjectId(null);
          setEditSubjectName("");
        },
      },
    );
  };

  const handleAddCategory = (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    addCategory.mutate(
      { name: categoryName.trim(), semester: categorySemester },
      {
        onSuccess: () => {
          setCategoryName("");
          setCategoryOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Mapel & Kategori
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Kelola mata pelajaran, kategori penilaian, dan input nilai
        </p>
      </header>

      <section>
        <h2 className="mb-2 font-display text-base font-semibold">
          Input Nilai
        </h2>
        <Card className="border-border shadow-card">
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="grade-student">Siswa</Label>
                <Select
                  value={gradeStudentId}
                  onValueChange={setGradeStudentId}
                >
                  <SelectTrigger
                    id="grade-student"
                    data-ocid="admin.grade.select.student"
                  >
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.data?.map((student) => (
                      <SelectItem
                        key={student.id.toString()}
                        value={student.id.toString()}
                      >
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="grade-semester">Semester</Label>
                <Select
                  value={gradeSemester}
                  onValueChange={(value) => {
                    setGradeSemester(value as Semester);
                    setGradeCategoryId("");
                  }}
                >
                  <SelectTrigger
                    id="grade-semester"
                    data-ocid="admin.grade.select.semester"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Semester.semester1}>
                      Semester 1
                    </SelectItem>
                    <SelectItem value={Semester.semester2}>
                      Semester 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedStudentId ? (
              <>
                <form onSubmit={handleSetGrade} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="grade-subject">Mapel</Label>
                      <Select
                        value={gradeSubjectId}
                        onValueChange={setGradeSubjectId}
                      >
                        <SelectTrigger
                          id="grade-subject"
                          data-ocid="admin.grade.select.subject"
                        >
                          <SelectValue placeholder="Pilih mapel" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.data?.map((subject) => (
                            <SelectItem
                              key={subject.id.toString()}
                              value={subject.id.toString()}
                            >
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="grade-category">Kategori</Label>
                      <Select
                        value={gradeCategoryId}
                        onValueChange={setGradeCategoryId}
                      >
                        <SelectTrigger
                          id="grade-category"
                          data-ocid="admin.grade.select.category"
                        >
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesterCategories.map((category) => (
                            <SelectItem
                              key={category.id.toString()}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label htmlFor="grade-score">Nilai (0–100)</Label>
                      <Input
                        id="grade-score"
                        type="number"
                        min="0"
                        max="100"
                        data-ocid="admin.grade.input.score"
                        value={gradeScore}
                        onChange={(e) => setGradeScore(e.target.value)}
                      />
                    </div>
                    <Button
                      type="submit"
                      data-ocid="admin.grade.submit_button"
                      disabled={setGrade.isPending}
                    >
                      {setGrade.isPending ? (
                        <Loader2
                          className="mr-1 h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : null}
                      Simpan Nilai
                    </Button>
                  </div>
                  {gradeError ? (
                    <p
                      data-ocid="admin.grade.error_state"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {gradeError}
                    </p>
                  ) : null}
                </form>

                {grades.isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : grades.data && grades.data.length > 0 ? (
                  <ul className="divide-y divide-border border-t border-border">
                    {grades.data.map((grade) => (
                      <li
                        key={grade.id.toString()}
                        data-ocid={`admin.grade.item.${grade.id}`}
                        className="flex items-center justify-between gap-3 py-2 text-sm"
                      >
                        <span className="min-w-0 truncate text-muted-foreground">
                          {grade.subjectName} · {grade.categoryName}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-display font-semibold nums-tabular">
                            {grade.score.toString()}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.grade.delete_button.${grade.id}`}
                            aria-label={`Hapus nilai ${grade.subjectName}`}
                            disabled={deleteGrade.isPending}
                            onClick={() => deleteGrade.mutate(grade.id)}
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
                ) : (
                  <p
                    data-ocid="admin.grade.empty_state"
                    className="border-t border-border pt-3 text-sm text-muted-foreground"
                  >
                    Belum ada nilai untuk {semesterLabel(gradeSemester)}.
                  </p>
                )}
              </>
            ) : (
              <p
                data-ocid="admin.grade.empty_state"
                className="text-sm text-muted-foreground"
              >
                Pilih siswa untuk mengisi nilai.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            Mata Pelajaran
          </h2>
          <Button
            type="button"
            size="sm"
            data-ocid="admin.subject.open_modal_button"
            onClick={() => setSubjectOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            Mapel
          </Button>
        </div>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {subjects.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 3 },
                  (_, i) => `subject-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-9 w-full" />
                ))}
              </div>
            ) : subjects.data && subjects.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {subjects.data.map((subject) => (
                  <li
                    key={subject.id.toString()}
                    data-ocid={`admin.subject.item.${subject.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span className="min-w-0 truncate text-sm font-medium">
                      {subject.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-ocid={`admin.subject.edit_button.${subject.id}`}
                        aria-label={`Ubah ${subject.name}`}
                        onClick={() => {
                          setEditSubjectId(subject.id.toString());
                          setEditSubjectName(subject.name);
                        }}
                      >
                        <Pencil
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-ocid={`admin.subject.delete_button.${subject.id}`}
                        aria-label={`Hapus ${subject.name}`}
                        onClick={() => deleteSubject.mutate(subject.id)}
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
            ) : (
              <div
                data-ocid="admin.subject.empty_state"
                className="px-4 py-8 text-center"
              >
                <GraduationCap
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada mata pelajaran.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            Kategori Nilai
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-ocid="admin.category.open_modal_button"
            onClick={() => setCategoryOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            Kategori
          </Button>
        </div>
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {categories.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from(
                  { length: 3 },
                  (_, i) => `category-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-9 w-full" />
                ))}
              </div>
            ) : categories.data && categories.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {categories.data.map((category) => (
                  <li
                    key={category.id.toString()}
                    data-ocid={`admin.category.item.${category.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {semesterLabel(category.semester)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      data-ocid={`admin.category.delete_button.${category.id}`}
                      aria-label={`Hapus ${category.name}`}
                      onClick={() => deleteCategory.mutate(category.id)}
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
              <div
                data-ocid="admin.category.empty_state"
                className="px-4 py-8 text-center"
              >
                <GraduationCap
                  className="mx-auto h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada kategori nilai.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog open={subjectOpen} onOpenChange={setSubjectOpen}>
        <DialogContent data-ocid="admin.subject.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Masukkan nama mata pelajaran baru.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubject} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject-name">Nama Mapel</Label>
              <Input
                id="subject-name"
                data-ocid="admin.subject.input.name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubjectOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.subject.submit_button"
                disabled={addSubject.isPending}
              >
                {addSubject.isPending ? (
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
        open={editSubjectId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditSubjectId(null);
            setEditSubjectName("");
          }
        }}
      >
        <DialogContent
          data-ocid="admin.subject.edit_modal"
          className="max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Ubah Mata Pelajaran</DialogTitle>
            <DialogDescription>Perbarui nama mata pelajaran.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubject} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject-edit-name">Nama Mapel</Label>
              <Input
                id="subject-edit-name"
                data-ocid="admin.subject.edit_input.name"
                value={editSubjectName}
                onChange={(e) => setEditSubjectName(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditSubjectId(null);
                  setEditSubjectName("");
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.subject.edit_submit_button"
                disabled={updateSubject.isPending}
              >
                {updateSubject.isPending ? (
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

      <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
        <DialogContent data-ocid="admin.category.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>
              Kategori penilaian per semester.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Nama Kategori</Label>
              <Input
                id="category-name"
                data-ocid="admin.category.input.name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-semester">Semester</Label>
              <Select
                value={categorySemester}
                onValueChange={(value) =>
                  setCategorySemester(value as Semester)
                }
              >
                <SelectTrigger
                  id="category-semester"
                  data-ocid="admin.category.select.semester"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Semester.semester1}>Semester 1</SelectItem>
                  <SelectItem value={Semester.semester2}>Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                data-ocid="admin.category.submit_button"
                disabled={addCategory.isPending}
              >
                {addCategory.isPending ? (
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
