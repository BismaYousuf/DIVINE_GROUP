"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { partitionFiles, type RejectedFile } from "@/lib/files";

export function FileUploadRow({
  label,
  accept,
  multiple = true,
  note,
  onChange,
}: {
  label: string;
  accept: string[];
  multiple?: boolean;
  note?: string;
  onChange: (files: File[]) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);

  useEffect(() => {
    onChange(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  function ingest(list: FileList | null) {
    if (!list || list.length === 0) return;
    const { accepted, rejected } = partitionFiles(list, Infinity, accept);
    setRejected(rejected);
    setFiles((cur) => (multiple ? [...cur, ...accepted] : accepted.slice(0, 1)));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="border-t border-hairline pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="mono-label text-graphite">{label}</span>
        {note ? (
          <span className="text-[0.75rem] text-graphite/70">{note}</span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center gap-2 rounded-[3px] border border-ink/25 px-4 text-[0.875rem] text-ink transition-colors hover:border-ink hover:bg-ink/[0.04]"
        >
          <Paperclip className="size-4" strokeWidth={1.5} />
          Choose file{multiple ? "s" : ""}
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => ingest(e.target.files)}
        />
        <span className="text-[0.8125rem] text-graphite">
          PDF / JPG / PNG{accept.some((a) => a.includes("sheet") || a === ".xlsx") ? " / XLSX" : ""}
        </span>
      </div>

      {files.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 text-[0.8125rem] text-ink"
            >
              <span className="truncate">{f.name}</span>
              <span className="tnum shrink-0 text-graphite">
                {formatBytes(f.size)}
              </span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() =>
                  setFiles((cur) => cur.filter((_, idx) => idx !== i))
                }
                className="grid size-6 shrink-0 place-items-center text-graphite hover:text-accent"
              >
                <X className="size-3.5" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {rejected.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1">
          {rejected.map((r, i) => (
            <li key={i} className="mono-label text-accent normal-case tracking-normal">
              {r.name} — {r.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
