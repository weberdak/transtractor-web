import type { Route } from "./+types/home";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import parsePDF from "../../src/parsePDF";
import { loadParserConfigFromJson } from "../../src/wasm/transtractorWasm";
import { TransactionsData } from "../../src/types";

const LOAD_PDFS_TOOLTIP_LINK = "https://transtractor-lib.readthedocs.io/en/latest/supported_statements.html";

const LOAD_PDFS_TOOLTIP_CONTENT = (
  <>
    PDF files are extracted inside your browser and never leave your device. See{" "}
    <a
      href={LOAD_PDFS_TOOLTIP_LINK}
      target="_blank"
      rel="noreferrer"
      className="tooltip-link"
    >
      this guide
    </a> for a list of supported banks statements.
  </>
);

const LOAD_CONFIG_TOOLTIP_LINK = "https://transtractor-lib.readthedocs.io/en/latest/configuration.html";

const LOAD_CONFIG_TOOLTIP_CONTENT = (
  <>
    If your banks statements are not supported, you may load your own extraction rules as JSON files.
    See{" "}
    <a
      href={LOAD_CONFIG_TOOLTIP_LINK}
      target="_blank"
      rel="noreferrer"
      className="tooltip-link"
    >
      this guide
    </a> for detailed instructions on how to create these files.
    .
  </>
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transtractor - GUI" },
    { name: "description", content: "Extract transaction data from your PDF bank statements" },
  ];
}

export default function Home() {
  const [data, setData] = useState(() => new TransactionsData());
  const [logs, setLogs] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<"pdf" | "config" | null>(null);
  const [parseProgress, setParseProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const configInputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  function toSnapshot(source: TransactionsData): TransactionsData {
    const snapshot = new TransactionsData();
    snapshot.transactions = [...source.transactions];
    snapshot.accountNumbers = new Set(source.accountNumbers);
    snapshot.existing = new Set(source.existing);
    return snapshot;
  }

  async function handleLoadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setIsParsing(true);
    setParseProgress({ current: 1, total: files.length });
    for (const [index, file] of files.entries()) {
      setParseProgress({ current: index + 1, total: files.length });
      try {
        const parsedTransactions = await parsePDF(file);
        let addedCount = 0;
        for (const transaction of parsedTransactions) {
          if (data.addTransaction(transaction)) {
            addedCount += 1;
          }
        }

        setLogs((prev) => [
          ...prev,
          `Extracted ${addedCount} transaction${addedCount === 1 ? "" : "s"} from ${file.name}`,
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setLogs((prev) => [...prev, `Error parsing ${file.name}: ${message}`]);
      }

      // Trigger re-render to reflect counts as each file completes.
      setData(toSnapshot(data));
    }

    setIsParsing(false);
    setParseProgress(null);
    event.target.value = "";
  }

  async function handleLoadConfigFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setIsLoadingConfig(true);
    for (const file of files) {
      try {
        const rawConfig = await file.text();
        const parsedConfig = JSON.parse(rawConfig);
        await loadParserConfigFromJson(JSON.stringify(parsedConfig));
        setLogs((prev) => [...prev, `Loaded parser config from ${file.name}`]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setLogs((prev) => [...prev, `Error loading config ${file.name}: ${message}`]);
      }
    }

    setIsLoadingConfig(false);
    event.target.value = "";
  }

  function handleExportCSV() {
    data.sortTransactions();
    data.exportToCSV();
  }

  function handleClearData() {
    setData(new TransactionsData());
    setLogs([]);
    setParseProgress(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (configInputRef.current) {
      configInputRef.current.value = "";
    }
  }

  const canExport = data.transactions.length > 0;
  const isBusy = isParsing || isLoadingConfig;

  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">
          Transtractor GUI
        </h1>
        <p className="app-subtitle">
          Use your web browser to extract transaction data from all your PDF bank statements
          into a single CSV file.
        </p>
        <p className="mt-3 text-sm text-slate-700">
          Need to confirm whether your statement type is supported?{" "}
          <Link to="/supported-bank-statements" className="inline-link">
            View supported bank statements
          </Link>
          .
        </p>

        <div className="stats-grid">
          <article className="stat-tile">
            <p className="stat-label"># Transactions</p>
            <p className="stat-value">
              {data.transactions.length}
            </p>
          </article>
          <article className="stat-tile">
            <p className="stat-label"># Accounts</p>
            <p className="stat-value">
              {data.accountNumbers.size}
            </p>
          </article>
        </div>

        <div className="mt-6 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="pdf-upload">
              Load PDFs
            </label>
            <span className="relative inline-flex">
              <button
                type="button"
                aria-label="More information about loading PDFs"
                aria-controls="load-pdfs-tooltip"
                aria-expanded={openTooltip === "pdf"}
                onClick={() =>
                  setOpenTooltip((current) => (current === "pdf" ? null : "pdf"))
                }
                className="tooltip-trigger"
              >
                ?
              </button>
              <span
                id="load-pdfs-tooltip"
                role="tooltip"
                className={`tooltip-panel ${openTooltip === "pdf" ? "block" : "hidden"}`}
              >
                {LOAD_PDFS_TOOLTIP_CONTENT}
              </span>
            </span>
          </div>
          <input
            ref={inputRef}
            id="pdf-upload"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleLoadFiles}
            disabled={isBusy}
            className="file-input"
          />
          {isParsing && parseProgress ? (
            <p className="progress-text">
              Extracting file {parseProgress.current} of {parseProgress.total}
            </p>
          ) : null}
        </div>

        <div className="mt-4 field-card">
          <div className="field-header">
            <label className="field-label" htmlFor="config-upload">
              Load custom parser config (optional)
            </label>
            <span className="relative inline-flex">
              <button
                type="button"
                aria-label="More information about custom parser config files"
                aria-controls="load-config-tooltip"
                aria-expanded={openTooltip === "config"}
                onClick={() =>
                  setOpenTooltip((current) => (current === "config" ? null : "config"))
                }
                className="tooltip-trigger"
              >
                ?
              </button>
              <span
                id="load-config-tooltip"
                role="tooltip"
                className={`tooltip-panel ${openTooltip === "config" ? "block" : "hidden"}`}
              >
                {LOAD_CONFIG_TOOLTIP_CONTENT}
              </span>
            </span>
          </div>
          <input
            ref={configInputRef}
            id="config-upload"
            type="file"
            multiple
            accept="application/json,.json"
            onChange={handleLoadConfigFiles}
            disabled={isBusy}
            className="file-input"
          />
        </div>

        <div className="action-row">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!canExport || isBusy}
            className="btn-primary"
          >
            Export to CSV
          </button>
          <button
            type="button"
            onClick={handleClearData}
            disabled={isBusy}
            className="btn-secondary"
          >
            Clear Data
          </button>
        </div>

        <section className="console-section">
          <h2 className="console-title">
            Console
          </h2>
          <div
            ref={consoleRef}
            className="console-body"
          >
            {logs.length === 0 ? (
              <p className="console-empty">No logs yet.</p>
            ) : (
              logs.map((line, index) => {
                const isError = line.startsWith("Error ");
                return (
                  <p
                    key={`${line}-${index}`}
                    className={`console-line ${isError ? "console-line-error" : "console-line-info"}`}
                  >
                    {line}
                  </p>
                );
              })
            )}
          </div>
        </section>

        <footer className="app-footer">
          <p>
            The Transtractor is an open-source PDF bank statement parser. Follow this project on{" "}
            <a
              href="https://github.com/transtractor/transtractor-lib"
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              GitHub
            </a>
            ,{" "}
            <a
              href="https://transtractor-lib.readthedocs.io/"
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              Read the Docs
            </a>
            , and{" "}
            <a
              href="https://pypi.org/project/transtractor/"
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              PyPI
            </a>
            . Self-host this website from the{" "}
            <a
              href="https://github.com/transtractor/transtractor-web"
              target="_blank"
              rel="noreferrer"
              className="inline-link"
            >
              source code
            </a>. Copyright © 2026 Daniel Weber.
          </p>
        </footer>
      </section>
    </main>
  );
}
