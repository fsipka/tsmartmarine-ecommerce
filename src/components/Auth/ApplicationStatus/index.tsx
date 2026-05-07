"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { authService } from "@/lib/api/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const STATUS = { Pending: 1, Approved: 2, Rejected: 3 } as const;

const STATUS_LABELS: Record<number, string> = {
  [STATUS.Pending]: "Pending",
  [STATUS.Approved]: "Approved",
  [STATUS.Rejected]: "Rejected",
};

const STATUS_COLOR: Record<number, string> = {
  [STATUS.Pending]: "bg-yellow-100 text-yellow-800 border-yellow-300",
  [STATUS.Approved]: "bg-green-100 text-green-800 border-green-300",
  [STATUS.Rejected]: "bg-red-100 text-red-800 border-red-300",
};

const formatDate = (d?: string | null) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
};

interface ApplicationData {
  companyId: number | null;
  approvalStatus: number | null;
  rejectionReason: string | null;
  rejectionCount: number;
  logs: Array<{
    id?: number;
    Id?: number;
    status?: number;
    Status?: number;
    rejectionReason?: string | null;
    RejectionReason?: string | null;
    createdDate?: string;
    CreatedDate?: string;
    decidedAt?: string | null;
    DecidedAt?: string | null;
  }>;
}

const ApplicationStatus = () => {
  const t = useTranslations("applicationStatus");
  const router = useRouter();
  const { user, logout } = useAuth();

  const [data, setData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [reapplying, setReapplying] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getMyApplication();
      setData(res || null);
      // If approved, route back to home automatically.
      if (res?.approvalStatus === STATUS.Approved) {
        router.replace("/");
      }
    } catch (err: any) {
      toast.error(err?.message || t("loadFailed") || "Failed to load application status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReApply = async () => {
    setReapplying(true);
    try {
      await authService.reApply();
      toast.success(t("reapplySubmitted") || "Application re-submitted.");
      await load();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.ErrorMessage?.[0] ||
        err?.message ||
        t("reapplyFailed") ||
        "Re-apply failed";
      toast.error(msg);
    } finally {
      setReapplying(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const status = data?.approvalStatus;
  const isPending = status === STATUS.Pending;
  const isRejected = status === STATUS.Rejected;
  const logs = Array.isArray(data?.logs) ? data!.logs : [];

  return (
    <>
      <Breadcrumb title={t("title") || "Application Status"} pages={[t("title") || "Application Status"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="rounded-xl bg-white shadow-1 p-6 sm:p-9">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-semibold text-2xl text-dark mb-1">
                  {t("title") || "Application Status"}
                </h2>
                <p className="text-dark-5">
                  {t("subtitle") || "Your registration is being reviewed by the platform team."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-dark-5 hover:text-dark border border-gray-3 rounded-md px-3 py-1.5"
              >
                {t("logout") || "Logout"}
              </button>
            </div>

            {loading && !data ? (
              <div className="text-center py-8 text-dark-5">{t("loading") || "Loading..."}</div>
            ) : (
              <>
                <div
                  className={`p-5 rounded-lg border ${
                    STATUS_COLOR[status ?? 0] || "bg-gray-1 text-dark border-gray-3"
                  } mb-6`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/60">
                      {STATUS_LABELS[status ?? 0] || "Unknown"}
                    </span>
                    <p className="font-semibold text-base">
                      {isPending && (t("pendingHeadline") || "Your application is pending approval.")}
                      {isRejected && (t("rejectedHeadline") || "Your application was rejected.")}
                    </p>
                  </div>
                  <p className="text-sm mt-2 opacity-80">
                    {isPending && (t("pendingHint") || "We will notify you once a decision is made.")}
                    {isRejected &&
                      (t("rejectedHint") || "You can update your information and re-apply below.")}
                  </p>
                  {isRejected && data?.rejectionReason && (
                    <div className="mt-3 text-sm border-t border-current/20 pt-2">
                      <span className="font-bold">{t("rejectionReasonLabel") || "Reason"}:</span>{" "}
                      {data.rejectionReason}
                    </div>
                  )}
                </div>

                {isRejected && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleReApply}
                      disabled={reapplying}
                      className="font-medium text-white bg-dark py-3 px-6 rounded-lg duration-200 hover:bg-blue disabled:opacity-60"
                    >
                      {reapplying
                        ? t("loading") || "Submitting..."
                        : t("reapplyButton") || "Re-apply"}
                    </button>
                    {(data?.rejectionCount ?? 0) > 0 && (
                      <p className="text-xs text-dark-5 mt-2">
                        {(t("rejectionCountLabel") || "Previous rejections")}: {data?.rejectionCount}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-dark mb-3">
                    {t("historyTitle") || "Application History"}
                  </h3>
                  {logs.length === 0 ? (
                    <p className="text-sm text-dark-5">{t("historyEmpty") || "No history."}</p>
                  ) : (
                    <ul className="space-y-2">
                      {logs.map((log) => {
                        const s = log.status ?? log.Status ?? 0;
                        return (
                          <li
                            key={log.id ?? log.Id}
                            className={`p-3 rounded-md border-l-4 ${
                              STATUS_COLOR[s] || "bg-gray-1 border-gray-3 text-dark"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-bold">
                                {STATUS_LABELS[s] || s}
                              </span>
                              <span className="opacity-70 text-xs">
                                {formatDate(
                                  log.decidedAt ?? log.DecidedAt ?? log.createdDate ?? log.CreatedDate
                                )}
                              </span>
                            </div>
                            {(log.rejectionReason || log.RejectionReason) && (
                              <p className="text-sm mt-1">
                                {log.rejectionReason || log.RejectionReason}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplicationStatus;
