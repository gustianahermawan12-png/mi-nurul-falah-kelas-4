import type { backendInterface } from "@/backend";
import { vi } from "vitest";

/**
 * A typed, local stand-in for the generated backend actor.
 *
 * Every method is a Vitest mock so a test can assert the exact calls the UI
 * makes. This is a frontend consumer seam only: it proves the components call
 * the actor with the expected arguments, never that the real canister behaves.
 */
export type ActorMock = {
  [K in keyof backendInterface]: ReturnType<typeof vi.fn>;
};

export function createActorMock(overrides: Partial<ActorMock> = {}): ActorMock {
  const base = {
    getTeacherCredentials: vi.fn(),
    loginTeacher: vi.fn(),
    loginParent: vi.fn(),
    getSession: vi.fn(),
    logout: vi.fn(),
    listClasses: vi.fn().mockResolvedValue([]),
    addClass: vi.fn(),
    updateClass: vi.fn(),
    deleteClass: vi.fn(),
    listSubjects: vi.fn().mockResolvedValue([]),
    addSubject: vi.fn(),
    updateSubject: vi.fn(),
    deleteSubject: vi.fn(),
    listStudents: vi.fn().mockResolvedValue([]),
    getStudent: vi.fn().mockResolvedValue(null),
    addStudent: vi.fn(),
    updateStudent: vi.fn(),
    deleteStudent: vi.fn(),
    listCategories: vi.fn().mockResolvedValue([]),
    addCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    listGrades: vi.fn().mockResolvedValue([]),
    listSubjectSummaries: vi.fn().mockResolvedValue([]),
    getOverallAverage: vi.fn().mockResolvedValue(0n),
    setGrade: vi.fn(),
    deleteGrade: vi.fn(),
    listAttendance: vi.fn().mockResolvedValue([]),
    getAttendanceSummary: vi.fn().mockResolvedValue({
      hadir: 0n,
      alpa: 0n,
      izin: 0n,
      sakit: 0n,
    }),
    setAttendance: vi.fn(),
    deleteAttendance: vi.fn(),
    listLeaveRequests: vi.fn().mockResolvedValue([]),
    listAllLeaveRequests: vi.fn().mockResolvedValue([]),
    createLeaveRequest: vi.fn(),
    reviewLeaveRequest: vi.fn(),
    listSavings: vi.fn().mockResolvedValue({
      balance: 0n,
      totalIn: 0n,
      totalOut: 0n,
      transactions: [],
    }),
    addSavings: vi.fn(),
    deleteSavings: vi.fn(),
    listInfaq: vi.fn().mockResolvedValue([]),
    getInfaqTotal: vi.fn().mockResolvedValue(0n),
    addInfaq: vi.fn(),
    deleteInfaq: vi.fn(),
  } as unknown as ActorMock;

  return { ...base, ...overrides };
}
