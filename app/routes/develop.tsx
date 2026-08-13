import type { Route } from "./+types/develop";
import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import fileSaver from "file-saver";
import {
  debugLayoutTextWithWasm,
  debugPdfBytesWithWasm,
  layoutPdfBytesWithWasm,
  loadParserConfigFromJson,
  resetParser,
  specLayoutTextWithWasm,
  specPdfBytesWithWasm,
  validateSpecTextWithWasm,
} from "../../src/wasm/transtractorWasm";

const { saveAs } = fileSaver;

const LOAD_CONFIG_TOOLTIP_LINK = "https://transtractor-lib.readthedocs.io/en/latest/configuration.html";

type OutputKind = "content" | "status";

type Output = {
  kind: OutputKind;
  fileName: string;
  text: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transtractor - Develop" },
    {
      name: "description",
      content: "Tools for developers to create and validate Transtractor parsing config files",
    },
  ];
}

export default function Develop() {
  const [configFileName, setConfigFileName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [layoutFile, setLayoutFile] = useState<{ name: string; text: string } | null>(null);
  const [specFile, setSpecFile] = useState<{ name: string; text: string } | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const configInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const layoutInputRef = useRef<HTMLInputElement>(null);
  const specInputRef = useRef<HTMLInputElement>(null);

  function logStatus(fileName: string, text: string) {
    setOutput({ kind: "status", fileName, text });
  }

  function logContent(fileName: string, text: string) {
    setOutput({ kind: "content", fileName, text });
  }

  function logError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    setOutput({ kind: "status", fileName: "error.txt", text: `Error: ${message}` });
  }

  async function handleLoadConfigFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setIsBusy(true);
    try {
      const rawConfig = await file.text();
      await loadParserConfigFromJson(rawConfig);
      setConfigFileName(file.name);
      logStatus("config-loaded.txt", `Loaded parser config from ${file.name}`);
    } catch (error) {
      logError(error);
    }
    setIsBusy(false);
  }

  function handleClearConfig() {
    resetParser();
    setConfigFileName(null);
    setOutput(null);
    if (configInputRef.current) {
      configInputRef.current.value = "";
    }
  }

  function clearOtherBuffers(keep: "pdf" | "layout" | "spec") {
    if (keep !== "pdf") {
      setPdfFile(null);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = "";
      }
    }
    if (keep !== "layout") {
      setLayoutFile(null);
      if (layoutInputRef.current) {
        layoutInputRef.current.value = "";
      }
    }
    if (keep !== "spec") {
      setSpecFile(null);
      if (specInputRef.current) {
        specInputRef.current.value = "";
      }
    }
  }

  function handleLoadPdfFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }
    clearOtherBuffers("pdf");
    setPdfFile(file);
    setOutput(null);
  }

  async function handleLoadLayoutFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    clearOtherBuffers("layout");
    setLayoutFile({ name: file.name, text });
    setOutput(null);
  }

  async function handleLoadSpecFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    clearOtherBuffers("spec");
    setSpecFile({ name: file.name, text });
    setOutput(null);
  }

  async function runAction(fileName: string, action: () => Promise<string>) {
    setIsBusy(true);
    try {
      const text = await action();
      logContent(fileName, text);
    } catch (error) {
      logError(error);
    }
    setIsBusy(false);
  }

  async function handleDebugPdf() {
    if (!pdfFile) return;
    const bytes = new Uint8Array(await pdfFile.arrayBuffer());
    await runAction("debug.txt", () => debugPdfBytesWithWasm(bytes));
  }

  async function handleLayoutPdf() {
    if (!pdfFile) return;
    const bytes = new Uint8Array(await pdfFile.arrayBuffer());
    await runAction("layout.txt", () => layoutPdfBytesWithWasm(bytes));
  }

  async function handleSpecPdf() {
    if (!pdfFile) return;
    const bytes = new Uint8Array(await pdfFile.arrayBuffer());
    await runAction("spec.json", () => specPdfBytesWithWasm(bytes));
  }

  async function handleDebugLayoutText() {
    if (!layoutFile) return;
    await runAction("debug.txt", () => debugLayoutTextWithWasm(layoutFile.text));
  }

  async function handleSpecLayoutText() {
    if (!layoutFile) return;
    await runAction("spec.json", () => specLayoutTextWithWasm(layoutFile.text));
  }

  async function handleValidateSpec() {
    if (!specFile) return;
    setIsBusy(true);
    try {
      await validateSpecTextWithWasm(specFile.text);
      logStatus("valid.txt", "True - spec file is valid");
    } catch (error) {
      logError(error);
    }
    setIsBusy(false);
  }

  function handleSaveOutput() {
    if (!output || output.kind !== "content") {
      return;
    }
    const blob = new Blob([output.text], { type: "text/plain;charset=utf-8;" });
    saveAs(blob, output.fileName);
  }

  const canSave = output?.kind === "content";

  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">Developer Tools</h1>
        <p className="app-subtitle">
          Tools to help developers create and validate custom Transtractor parsing config
          files.
        </p>

        <div className="mt-6 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="develop-config-upload">
              Load custom parser config (optional)
            </label>
          </div>
          <input
            ref={configInputRef}
            id="develop-config-upload"
            type="file"
            accept="application/json,.json"
            onChange={handleLoadConfigFile}
            disabled={isBusy}
            className="file-input"
          />
          <p className="mt-3 text-xs leading-5 text-slate-500">
            See{" "}
            <a
              href={LOAD_CONFIG_TOOLTIP_LINK}
              target="_blank"
              rel="noreferrer"
              className="tooltip-link"
            >
              this page
            </a>{" "}
            for details on how to create these.
          </p>
          {configFileName ? (
            <p className="progress-text">Loaded: {configFileName}</p>
          ) : null}
          <div className="action-row">
            <button
              type="button"
              onClick={handleClearConfig}
              disabled={isBusy}
              className="btn-secondary"
            >
              Clear Config
            </button>
          </div>
        </div>

        <div className="mt-4 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="develop-pdf-upload">
              Load PDF
            </label>
          </div>
          <input
            ref={pdfInputRef}
            id="develop-pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleLoadPdfFile}
            disabled={isBusy}
            className="file-input"
          />
          {pdfFile ? (
            <div className="action-row">
              <button type="button" onClick={handleDebugPdf} disabled={isBusy} className="btn-primary">
                Debug
              </button>
              <button type="button" onClick={handleLayoutPdf} disabled={isBusy} className="btn-primary">
                Layout
              </button>
              <button type="button" onClick={handleSpecPdf} disabled={isBusy} className="btn-primary">
                Spec
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="develop-layout-upload">
              Load Layout (text) File
            </label>
          </div>
          <input
            ref={layoutInputRef}
            id="develop-layout-upload"
            type="file"
            accept="text/plain,.txt"
            onChange={handleLoadLayoutFile}
            disabled={isBusy}
            className="file-input"
          />
          {layoutFile ? (
            <div className="action-row">
              <button
                type="button"
                onClick={handleDebugLayoutText}
                disabled={isBusy}
                className="btn-primary"
              >
                Debug
              </button>
              <button
                type="button"
                onClick={handleSpecLayoutText}
                disabled={isBusy}
                className="btn-primary"
              >
                Spec
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="develop-spec-upload">
              Load Spec File (optional)
            </label>
          </div>
          <input
            ref={specInputRef}
            id="develop-spec-upload"
            type="file"
            accept="application/json,.json"
            onChange={handleLoadSpecFile}
            disabled={isBusy}
            className="file-input"
          />
          {specFile ? (
            <div className="action-row">
              <button
                type="button"
                onClick={handleValidateSpec}
                disabled={isBusy}
                className="btn-primary"
              >
                Validate
              </button>
            </div>
          ) : null}
        </div>

        <section className="console-section">
          <h2 className="console-title">Output</h2>
          <div className="console-body">
            {output ? (
              <pre className="output-text">{output.text}</pre>
            ) : (
              <p className="console-empty">No output yet.</p>
            )}
          </div>
          <div className="action-row">
            <button
              type="button"
              onClick={handleSaveOutput}
              disabled={!canSave || isBusy}
              className="btn-secondary"
            >
              Save to File
            </button>
          </div>
        </section>

        <footer className="app-footer">
          <p>
            Back to the{" "}
            <Link to="/" className="inline-link">
              Transtractor GUI
            </Link>
            .
          </p>
        </footer>
      </section>
    </main>
  );
}
