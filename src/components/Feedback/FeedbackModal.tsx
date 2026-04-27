"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  feedbackService,
  FeedbackPriority,
  FeedbackType,
} from "@/lib/api/services/feedback.service";

interface FeedbackModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const TYPES: FeedbackType[] = ["Bug", "Feature", "Improvement", "Question", "Other"];
const PRIORITIES: FeedbackPriority[] = ["Low", "Medium", "High", "Critical"];
const MAX_SCREENSHOTS = 5;

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, closeModal }) => {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FeedbackType>("Bug");
  const [priority, setPriority] = useState<FeedbackPriority>("Medium");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("Bug");
    setPriority("Medium");
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (submitting) return;
    closeModal();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = MAX_SCREENSHOTS - files.length;
    if (selected.length > remaining) {
      toast.error(t("feedback.maxScreenshots", { max: MAX_SCREENSHOTS }));
    }
    const accepted = selected.slice(0, remaining).filter((f) => f.type.startsWith("image/"));
    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t("feedback.titleRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await feedbackService.create({
        Title: title.trim(),
        Description: description.trim() || undefined,
        Type: type,
        Priority: priority,
        PageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        UserAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        Screenshots: files,
      });
      toast.success(t("feedback.submitSuccess"));
      resetForm();
      closeModal();
    } catch (error: any) {
      console.error("Failed to submit feedback:", error);
      toast.error(t("feedback.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-99999 overflow-y-auto bg-dark/70 px-4 py-6 sm:py-12"
      onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="w-full max-w-[640px] rounded-xl bg-white p-6 sm:p-8 shadow-3 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-meta text-body hover:text-dark"
          >
            <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
              <path
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-dark mb-1">
            {t("feedback.title")}
          </h2>
          <p className="text-custom-sm text-dark-4 mb-6">
            {t("feedback.subtitle")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fb-title" className="block mb-2 text-custom-sm font-medium">
                {t("feedback.titleLabel")} <span className="text-red">*</span>
              </label>
              <input
                id="fb-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder={t("feedback.titlePlaceholder")}
                className="w-full rounded-md border border-gray-3 bg-gray-1 py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="fb-type" className="block mb-2 text-custom-sm font-medium">
                  {t("feedback.typeLabel")}
                </label>
                <select
                  id="fb-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as FeedbackType)}
                  className="w-full rounded-md border border-gray-3 bg-gray-1 py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                >
                  {TYPES.map((tp) => (
                    <option key={tp} value={tp}>
                      {t(`feedback.types.${tp}` as any)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fb-priority" className="block mb-2 text-custom-sm font-medium">
                  {t("feedback.priorityLabel")}
                </label>
                <select
                  id="fb-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
                  className="w-full rounded-md border border-gray-3 bg-gray-1 py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {t(`feedback.priorities.${p}` as any)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="fb-desc" className="block mb-2 text-custom-sm font-medium">
                {t("feedback.descriptionLabel")}
              </label>
              <textarea
                id="fb-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("feedback.descriptionPlaceholder")}
                className="w-full rounded-md border border-gray-3 bg-gray-1 py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-y"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-custom-sm font-medium">
                {t("feedback.screenshotsLabel")}{" "}
                <span className="text-dark-4 font-normal">
                  ({files.length}/{MAX_SCREENSHOTS})
                </span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                disabled={files.length >= MAX_SCREENSHOTS}
                className="block w-full text-custom-sm text-dark-4 file:mr-3 file:rounded-md file:border-0 file:bg-blue file:text-white file:py-2 file:px-4 file:text-custom-sm file:font-medium hover:file:bg-blue-dark disabled:opacity-50"
              />

              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {previews.map((src, i) => (
                    <div key={src} className="relative group">
                      <img
                        src={src}
                        alt={`screenshot-${i}`}
                        className="w-full h-20 object-cover rounded-md border border-gray-3"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label="Remove"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="inline-flex justify-center font-medium text-dark bg-gray-2 py-2.5 px-6 rounded-md duration-200 hover:bg-gray-3 disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center items-center gap-2 font-medium text-white bg-blue py-2.5 px-6 rounded-md duration-200 hover:bg-blue-dark disabled:opacity-50"
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {submitting ? t("feedback.submitting") : t("feedback.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
