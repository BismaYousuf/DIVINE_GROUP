export type RejectedFile = { name: string; reason: string };

export const ACCEPT_DOCS = ["application/pdf", "image/png", "image/jpeg"];
export const ACCEPT_SHEET = [
  ".xls",
  ".xlsx",
  ".csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

/** Split incoming files into those that pass the size + type checks and those that don't. */
export function partitionFiles(
  incoming: FileList | File[],
  maxBytes: number,
  accept: string[],
): { accepted: File[]; rejected: RejectedFile[] } {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];
  const maxMB = (maxBytes / 1024 / 1024).toFixed(1);

  for (const file of Array.from(incoming)) {
    const okType =
      accept.length === 0 ||
      accept.some((a) =>
        a.startsWith(".")
          ? file.name.toLowerCase().endsWith(a)
          : file.type === a,
      );
    if (!okType) {
      rejected.push({ name: file.name, reason: "file type not allowed" });
    } else if (file.size > maxBytes) {
      rejected.push({ name: file.name, reason: `over ${maxMB} MB` });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}
