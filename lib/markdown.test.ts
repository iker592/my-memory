import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { buildCombinedFileTree, getAllFiles, getFileByPath } from "@/lib/markdown";

function createFile(filePath: string, contents: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

describe("markdown utilities", () => {
  let tempRoot: string;
  let contentDir: string;
  let agentsDir: string;
  let welcomePath: string;
  let scriptPath: string;
  let agentConfigPath: string;
  let overviewPath: string;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mb-md-"));
    contentDir = path.join(tempRoot, "content");
    agentsDir = path.join(tempRoot, "agents");

    welcomePath = path.join(contentDir, "notes", "welcome.md");
    scriptPath = path.join(contentDir, "snippets", "init.sh");
    overviewPath = path.join(contentDir, "overview.md");
    agentConfigPath = path.join(agentsDir, "skills", "config.json");

    createFile(welcomePath, "# Welcome\nHello world");
    createFile(scriptPath, "echo hi");
    createFile(overviewPath, "# Overview\nContent overview");
    createFile(agentConfigPath, '{"name": "memory"}');
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("builds a combined tree grouped by source directories", () => {
    const tree = buildCombinedFileTree({ contentDir, agentsDir });
    expect(tree).toHaveLength(2);

    const contentNode = tree.find((node) => node.name === "Content");
    const agentNode = tree.find((node) => node.name === "Agents");

    expect(contentNode?.children?.map((child) => child.name)).toEqual(["notes", "snippets", "overview.md"]);
    const welcomeFile = contentNode?.children?.[0].children?.[0];
    expect(welcomeFile).toMatchObject({
      name: "welcome.md",
      path: "content/notes/welcome",
      type: "file",
      source: "content",
    });

    expect(agentNode?.children).toHaveLength(1);
    expect(agentNode?.children?.[0].children?.[0]).toMatchObject({
      name: "config.json",
      path: "agents/skills/config",
      type: "file",
      source: "agents",
    });
  });

  it("returns all files sorted by modified time with derived metadata", () => {
    const base = new Date("2023-01-01T00:00:00Z").getTime();
    const filesByRecency = [
      { file: welcomePath, offset: 0 },
      { file: scriptPath, offset: 1 },
      { file: overviewPath, offset: 2 },
      { file: agentConfigPath, offset: 3 },
    ];
    filesByRecency.forEach(({ file, offset }) => {
      const time = new Date(base + offset * 1000);
      fs.utimesSync(file, time, time);
    });

    const files = getAllFiles({ contentDir, agentsDir });
    expect(files[0].path).toBe("agents/skills/config");
    expect(files[files.length - 1].path).toBe("content/notes/welcome");
    expect(files[0]).toMatchObject({ title: "config.json", source: "agents" });
    expect(files.find((file) => file.path === "content/notes/welcome")?.title).toBe("Welcome");
  });

  it("resolves files via prefixed paths or fallback to content", () => {
    const prefixed = getFileByPath("agents/skills/config", { contentDir, agentsDir });
    expect(prefixed).toMatchObject({
      slug: "skills/config",
      fileName: "config.json",
      source: "agents",
    });

    const fallback = getFileByPath("overview", { contentDir, agentsDir });
    expect(fallback).toMatchObject({
      path: "overview",
      title: "Overview",
      source: "content",
    });

    expect(getFileByPath("unknown/file", { contentDir, agentsDir })).toBeNull();
  });
});
