import { createActor } from "@/backend";
import type {
  AttendanceStatus,
  Class,
  GradeCategory,
  GradeInput,
  InfaqInput,
  LeaveRequestInput,
  LeaveRequestStatus,
  SavingsInput,
  Semester,
  StudentId,
  StudentInput,
  Subject,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export function useTeacherCredentials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["teacherCredentials"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTeacherCredentials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLoginTeacher() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor) throw new Error("Backend belum siap");
      const result = await actor.loginTeacher(username, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

export function useLoginParent() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: { identifier: string; password: string }) => {
      if (!actor) throw new Error("Backend belum siap");
      const result = await actor.loginParent(identifier, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

export function useLogout() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.logout(token);
    },
  });
}

/* ------------------------------------------------------------------ */
/* Classes                                                             */
/* ------------------------------------------------------------------ */

export function useClasses() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addClass(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: Class["id"]; name: string }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateClass(id, name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useDeleteClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Class["id"]) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteClass(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Subjects                                                            */
/* ------------------------------------------------------------------ */

export function useSubjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addSubject(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: Subject["id"]; name: string }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateSubject(id, name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Subject["id"]) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Students                                                            */
/* ------------------------------------------------------------------ */

export function useStudents() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudent(id: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["student", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useAddStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StudentInput) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addStudent(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: StudentId; input: StudentInput }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateStudent(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: StudentId) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Grades                                                              */
/* ------------------------------------------------------------------ */

export function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCategory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      semester,
    }: { name: string; semester: Semester }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addCategory(name, semester);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      semester,
    }: { id: GradeCategory["id"]; name: string; semester: Semester }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateCategory(id, name, semester);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: GradeCategory["id"]) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
}

export function useGrades(
  studentId: StudentId | undefined,
  semester: Semester,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["grades", studentId?.toString(), semester],
    queryFn: async () => {
      if (!actor || studentId === undefined) return [];
      return actor.listGrades(studentId, semester);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useSubjectSummaries(
  studentId: StudentId | undefined,
  semester: Semester,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["subjectSummaries", studentId?.toString(), semester],
    queryFn: async () => {
      if (!actor || studentId === undefined) return [];
      return actor.listSubjectSummaries(studentId, semester);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useOverallAverage(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["overallAverage", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return 0n;
      return actor.getOverallAverage(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useSetGrade() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: GradeInput) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.setGrade(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["grades"] });
      void queryClient.invalidateQueries({ queryKey: ["subjectSummaries"] });
      void queryClient.invalidateQueries({ queryKey: ["overallAverage"] });
    },
  });
}

export function useDeleteGrade() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteGrade(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["grades"] });
      void queryClient.invalidateQueries({ queryKey: ["subjectSummaries"] });
      void queryClient.invalidateQueries({ queryKey: ["overallAverage"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Attendance                                                          */
/* ------------------------------------------------------------------ */

export function useAttendance(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["attendance", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return [];
      return actor.listAttendance(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useAttendanceSummary(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["attendanceSummary", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return null;
      return actor.getAttendanceSummary(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useSetAttendance() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      date,
      status,
      note,
    }: {
      studentId: StudentId;
      date: string;
      status: AttendanceStatus;
      note: string;
    }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.setAttendance(studentId, date, status, note);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
      void queryClient.invalidateQueries({ queryKey: ["attendanceSummary"] });
    },
  });
}

export function useDeleteAttendance() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteAttendance(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
      void queryClient.invalidateQueries({ queryKey: ["attendanceSummary"] });
    },
  });
}

export function useLeaveRequests(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["leaveRequests", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return [];
      return actor.listLeaveRequests(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useAllLeaveRequests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allLeaveRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllLeaveRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLeaveRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: LeaveRequestInput) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createLeaveRequest(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      void queryClient.invalidateQueries({ queryKey: ["allLeaveRequests"] });
    },
  });
}

export function useReviewLeaveRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      teacherNote,
    }: {
      id: bigint;
      status: LeaveRequestStatus;
      teacherNote: string;
    }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.reviewLeaveRequest(id, status, teacherNote);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allLeaveRequests"] });
      void queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    },
  });
}

/* ------------------------------------------------------------------ */
/* Finance                                                             */
/* ------------------------------------------------------------------ */

export function useSavings(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["savings", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return null;
      return actor.listSavings(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useAddSavings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SavingsInput) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addSavings(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });
}

export function useDeleteSavings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteSavings(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });
}

export function useInfaq(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["infaq", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return [];
      return actor.listInfaq(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useInfaqTotal(studentId: StudentId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["infaqTotal", studentId?.toString()],
    queryFn: async () => {
      if (!actor || studentId === undefined) return 0n;
      return actor.getInfaqTotal(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== undefined,
  });
}

export function useAddInfaq() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InfaqInput) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.addInfaq(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["infaq"] });
      void queryClient.invalidateQueries({ queryKey: ["infaqTotal"] });
    },
  });
}

export function useDeleteInfaq() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteInfaq(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["infaq"] });
      void queryClient.invalidateQueries({ queryKey: ["infaqTotal"] });
    },
  });
}
