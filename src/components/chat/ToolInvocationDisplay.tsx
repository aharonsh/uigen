"use client";

import { Loader2, FilePlus, FilePen, FileSearch, FileX, FileOutput } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  result?: unknown;
  args?: Record<string, unknown>;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

function getFileName(path: unknown): string {
  if (typeof path !== "string") return "";
  const segments = path.split("/");
  return segments[segments.length - 1] || path;
}

function getToolDisplay(toolInvocation: ToolInvocation): {
  icon: React.ElementType;
  label: string;
} {
  const { toolName, args } = toolInvocation;
  const command = args?.command as string | undefined;
  const path = args?.path;
  const fileName = getFileName(path);

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return { icon: FilePlus, label: `Created ${fileName}` };
      case "str_replace":
        return { icon: FilePen, label: `Edited ${fileName}` };
      case "insert":
        return { icon: FilePen, label: `Edited ${fileName}` };
      case "view":
        return { icon: FileSearch, label: `Viewed ${fileName}` };
      default:
        return { icon: FilePen, label: fileName ? `Modified ${fileName}` : "Modified file" };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return { icon: FileOutput, label: `Renamed ${fileName}` };
      case "delete":
        return { icon: FileX, label: `Deleted ${fileName}` };
      default:
        return { icon: FilePen, label: fileName ? `Modified ${fileName}` : "Modified file" };
    }
  }

  return { icon: FilePen, label: toolName };
}

function getInProgressLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const command = args?.command as string | undefined;
  const path = args?.path;
  const fileName = getFileName(path);

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${fileName}`;
      case "str_replace":
      case "insert":
        return `Editing ${fileName}`;
      case "view":
        return `Reading ${fileName}`;
      default:
        return fileName ? `Modifying ${fileName}` : "Modifying file";
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return `Renaming ${fileName}`;
      case "delete":
        return `Deleting ${fileName}`;
      default:
        return fileName ? `Modifying ${fileName}` : "Modifying file";
    }
  }

  return toolName;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;
  const { icon: Icon, label } = getToolDisplay(toolInvocation);
  const inProgressLabel = getInProgressLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <Icon className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{inProgressLabel}</span>
        </>
      )}
    </div>
  );
}
