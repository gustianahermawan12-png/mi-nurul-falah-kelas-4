import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
import type { ExternalBlob } from "@caffeineai/object-storage";
export type { ExternalBlob } from "@caffeineai/object-storage";
export type AttendanceId = bigint;
export interface AttendanceRecord {
    id: AttendanceId;
    status: AttendanceStatus;
    studentId: StudentId;
    date: string;
    note: string;
}
export interface AttendanceSummary {
    hadir: bigint;
    alpa: bigint;
    izin: bigint;
    sakit: bigint;
}
export type CategoryId = bigint;
export interface Cell {
    value: Value;
    name: string;
}
export interface Class {
    id: ClassId;
    name: string;
}
export type ClassId = bigint;
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface GradeCategory {
    id: CategoryId;
    semester: Semester;
    name: string;
}
export interface GradeInput {
    categoryId: CategoryId;
    studentId: StudentId;
    score: bigint;
    subjectId: SubjectId;
}
export interface GradeView {
    id: bigint;
    categoryId: CategoryId;
    categoryName: string;
    semester: Semester;
    subjectName: string;
    score: bigint;
    subjectId: SubjectId;
}
export type InfaqId = bigint;
export interface InfaqInput {
    studentId: StudentId;
    date: string;
    note: string;
    amount: bigint;
}
export interface InfaqTransaction {
    id: InfaqId;
    studentId: StudentId;
    date: string;
    note: string;
    amount: bigint;
}
export interface LeaveRequest {
    id: LeaveRequestId;
    status: AttendanceStatus;
    studentId: StudentId;
    date: string;
    createdAt: Timestamp;
    teacherNote: string;
    requestStatus: LeaveRequestStatus;
    proof?: ExternalBlob;
    reason: string;
}
export type LeaveRequestId = bigint;
export interface LeaveRequestInput {
    status: AttendanceStatus;
    studentId: StudentId;
    date: string;
    proof?: ExternalBlob;
    reason: string;
}
export type LoginResult = {
    __kind__: "ok";
    ok: Session;
} | {
    __kind__: "err";
    err: string;
};
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type SavingsId = bigint;
export interface SavingsInput {
    direction: SavingsDirection;
    studentId: StudentId;
    date: string;
    note: string;
    amount: bigint;
}
export interface SavingsSummary {
    balance: bigint;
    totalIn: bigint;
    totalOut: bigint;
    transactions: Array<SavingsTransaction>;
}
export interface SavingsTransaction {
    id: SavingsId;
    direction: SavingsDirection;
    studentId: StudentId;
    date: string;
    note: string;
    amount: bigint;
}
export interface Session {
    token: string;
    studentId?: StudentId;
    kind: UserKind;
    createdAt: Timestamp;
}
export type StudentId = bigint;
export interface StudentInput {
    parentPassword: string;
    name: string;
    nisn: string;
    parentPhone: string;
    classId: ClassId;
    isActive: boolean;
}
export interface StudentView {
    id: StudentId;
    name: string;
    nisn: string;
    classId: ClassId;
    isActive: boolean;
    className: string;
}
export interface Subject {
    id: SubjectId;
    name: string;
}
export interface SubjectGradeSummary {
    semester: Semester;
    subjectName: string;
    components: Array<GradeView>;
    average: bigint;
    subjectId: SubjectId;
}
export type SubjectId = bigint;
export interface TeacherCredentials {
    username: string;
    password: string;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum AttendanceStatus {
    hadir = "hadir",
    alpa = "alpa",
    izin = "izin",
    sakit = "sakit"
}
export enum LeaveRequestStatus {
    disetujui = "disetujui",
    ditolak = "ditolak",
    menunggu = "menunggu"
}
export enum SavingsDirection {
    masuk = "masuk",
    keluar = "keluar"
}
export enum Semester {
    semester1 = "semester1",
    semester2 = "semester2"
}
export enum UserKind {
    guru = "guru",
    orangTua = "orangTua"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string, semester: Semester): Promise<GradeCategory>;
    addClass(name: string): Promise<Class>;
    addInfaq(input: InfaqInput): Promise<InfaqTransaction>;
    addSavings(input: SavingsInput): Promise<SavingsTransaction>;
    addStudent(input: StudentInput): Promise<StudentView>;
    addSubject(name: string): Promise<Subject>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createLeaveRequest(input: LeaveRequestInput): Promise<LeaveRequest>;
    deleteAttendance(id: AttendanceId): Promise<void>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteClass(id: ClassId): Promise<void>;
    deleteGrade(id: bigint): Promise<void>;
    deleteInfaq(id: InfaqId): Promise<void>;
    deleteSavings(id: SavingsId): Promise<void>;
    deleteStudent(id: StudentId): Promise<void>;
    deleteSubject(id: SubjectId): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getAttendanceSummary(studentId: StudentId): Promise<AttendanceSummary>;
    getCallerUserRole(): Promise<UserRole>;
    getInfaqTotal(studentId: StudentId): Promise<bigint>;
    getOverallAverage(studentId: StudentId): Promise<bigint>;
    getSession(token: string): Promise<Session | null>;
    getStudent(id: StudentId): Promise<StudentView | null>;
    getTeacherCredentials(): Promise<TeacherCredentials>;
    isCallerAdmin(): Promise<boolean>;
    listAllLeaveRequests(): Promise<Array<LeaveRequest>>;
    listAttendance(studentId: StudentId): Promise<Array<AttendanceRecord>>;
    listCategories(): Promise<Array<GradeCategory>>;
    listClasses(): Promise<Array<Class>>;
    listGrades(studentId: StudentId, semester: Semester): Promise<Array<GradeView>>;
    listInfaq(studentId: StudentId): Promise<Array<InfaqTransaction>>;
    listLeaveRequests(studentId: StudentId): Promise<Array<LeaveRequest>>;
    listSavings(studentId: StudentId): Promise<SavingsSummary>;
    listStudents(): Promise<Array<StudentView>>;
    listSubjectSummaries(studentId: StudentId, semester: Semester): Promise<Array<SubjectGradeSummary>>;
    listSubjects(): Promise<Array<Subject>>;
    loginParent(identifier: string, password: string): Promise<LoginResult>;
    loginTeacher(username: string, password: string): Promise<LoginResult>;
    logout(token: string): Promise<void>;
    reviewLeaveRequest(id: LeaveRequestId, status: LeaveRequestStatus, teacherNote: string): Promise<void>;
    schema(): Promise<string>;
    setAttendance(studentId: StudentId, date: string, status: AttendanceStatus, note: string): Promise<AttendanceRecord>;
    setGrade(input: GradeInput): Promise<GradeView>;
    updateCategory(id: CategoryId, name: string, semester: Semester): Promise<void>;
    updateClass(id: ClassId, name: string): Promise<void>;
    updateStudent(id: StudentId, input: StudentInput): Promise<void>;
    updateSubject(id: SubjectId, name: string): Promise<void>;
}
