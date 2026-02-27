"use client";

import type { StudentReportRecord } from "@/features/student/types/student-report";
import type { StudentScoreBreakdown } from "@/features/student/types/student-scores";
import { withDerivedReportProgress } from "@/features/student/utils/report-progress";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";
import type { AdminScoreRecord } from "@/features/admin/types/admin-students";

const REPORT_STORAGE_KEY = "siwes360-student-report";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";
const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getStudentScores(): Promise<StudentScoreBreakdown> {
  await wait(300);

  if (typeof window === "undefined") {
    return {
      report: null,
      supervisor: null,
      logbook: null,
      presentation: null,
      total: null,
      status: "incomplete",
    };
  }

  const reportValue = window.localStorage.getItem(REPORT_STORAGE_KEY);
  const supervisorValue = window.localStorage.getItem(SUPERVISOR_STORAGE_KEY);
  const adminValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);

  const report = reportValue
    ? withDerivedReportProgress(JSON.parse(reportValue) as StudentReportRecord)
    : null;
  const supervisorScores = supervisorValue
    ? (JSON.parse(supervisorValue) as SupervisorScoreSubmission[])
    : [];
  const adminScores = adminValue ? (JSON.parse(adminValue) as AdminScoreRecord[]) : [];

  const supervisor = supervisorScores.find((item) => item.matricNumber === "CSC/2021/014")?.score ?? null;
  const admin = adminScores.find((item) => item.matricNumber === "CSC/2021/014") ?? null;
  const totalParts = [report?.reportScore ?? null, supervisor, admin?.logbookScore ?? null, admin?.presentationScore ?? null];
  const isComplete = totalParts.every((item) => item !== null);

  return {
    report: report?.reportScore ?? null,
    supervisor,
    logbook: admin?.logbookScore ?? null,
    presentation: admin?.presentationScore ?? null,
    total: isComplete ? totalParts.reduce((sum, item) => sum + (item ?? 0), 0) : null,
    status: isComplete ? "complete" : "incomplete",
  };
}
