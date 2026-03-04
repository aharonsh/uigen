import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("str_replace_editor with create command shows 'Created filename'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "create", path: "components/Card.tsx" },
      }}
    />
  );

  expect(screen.getByText("Created Card.tsx")).toBeDefined();
});

test("str_replace_editor with str_replace command shows 'Edited filename'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "str_replace", path: "components/Card.tsx" },
      }}
    />
  );

  expect(screen.getByText("Edited Card.tsx")).toBeDefined();
});

test("str_replace_editor with view command shows 'Viewed filename'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: { command: "view", path: "components/Card.tsx" },
      }}
    />
  );

  expect(screen.getByText("Viewed Card.tsx")).toBeDefined();
});

test("file_manager with rename command shows 'Renamed filename'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        state: "result",
        result: "Success",
        args: { command: "rename", path: "components/OldCard.tsx" },
      }}
    />
  );

  expect(screen.getByText("Renamed OldCard.tsx")).toBeDefined();
});

test("file_manager with delete command shows 'Deleted filename'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        state: "result",
        result: "Success",
        args: { command: "delete", path: "components/Card.tsx" },
      }}
    />
  );

  expect(screen.getByText("Deleted Card.tsx")).toBeDefined();
});

test("in-progress state shows spinner and present-tense label", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "partial-call",
        args: { command: "create", path: "components/Card.tsx" },
      }}
    />
  );

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
});

test("unknown tool name falls back to raw name", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "unknown_tool",
        state: "result",
        result: "Success",
        args: {},
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});
