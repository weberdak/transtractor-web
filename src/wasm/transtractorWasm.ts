type WasmTransaction = {
  date: number;
  index: number;
  description: string;
  amount: number;
  balance: number;
};

export type WasmStatementData = {
  key: string;
  account_number: string;
  start_date: number;
  opening_balance: number;
  closing_balance: number;
  transactions: WasmTransaction[];
};

type WasmParser = {
  parseBytes(pdfBytes: Uint8Array): unknown;
  loadConfigFromJson(configJson: string): void;
  debugBytes(pdfBytes: Uint8Array): string;
  layoutBytes(pdfBytes: Uint8Array): string;
  specBytes(pdfBytes: Uint8Array): string;
  debugLayoutText(layoutText: string): string;
  specLayoutText(layoutText: string): string;
  validateSpecText(specJson: string): void;
};

type WasmModule = {
  default: () => Promise<void>;
  Parser: new () => WasmParser;
};

let parserPromise: Promise<WasmParser> | null = null;
const WASM_BUNDLE_PATH = "./pkg/transtractor.js";

async function getParser(): Promise<WasmParser> {
  if (typeof window === "undefined") {
    throw new Error("Transtractor WASM parser can only run in browser context");
  }

  if (!parserPromise) {
    parserPromise = (async () => {
      try {
        const wasmModule =
          (await import("./pkg/transtractor.js")) as unknown as WasmModule;
        await wasmModule.default();
        return new wasmModule.Parser();
      } catch (error) {
        parserPromise = null;
        throw new Error(
          `Could not load Transtractor WASM bundle at ${WASM_BUNDLE_PATH}.`,
        );
      }
    })();
  }

  return parserPromise;
}

export async function parsePdfBytesWithWasm(
  pdfBytes: Uint8Array,
): Promise<WasmStatementData> {
  const parser = await getParser();
  return parser.parseBytes(pdfBytes) as WasmStatementData;
}

export async function loadParserConfigFromJson(
  configJson: string,
): Promise<void> {
  const parser = await getParser();
  parser.loadConfigFromJson(configJson);
}

// Discards the current parser instance so the next call starts from a clean state.
export function resetParser(): void {
  parserPromise = null;
}

export async function debugPdfBytesWithWasm(
  pdfBytes: Uint8Array,
): Promise<string> {
  const parser = await getParser();
  return parser.debugBytes(pdfBytes);
}

export async function layoutPdfBytesWithWasm(
  pdfBytes: Uint8Array,
): Promise<string> {
  const parser = await getParser();
  return parser.layoutBytes(pdfBytes);
}

export async function specPdfBytesWithWasm(
  pdfBytes: Uint8Array,
): Promise<string> {
  const parser = await getParser();
  return parser.specBytes(pdfBytes);
}

export async function debugLayoutTextWithWasm(
  layoutText: string,
): Promise<string> {
  const parser = await getParser();
  return parser.debugLayoutText(layoutText);
}

export async function specLayoutTextWithWasm(
  layoutText: string,
): Promise<string> {
  const parser = await getParser();
  return parser.specLayoutText(layoutText);
}

export async function validateSpecTextWithWasm(
  specJson: string,
): Promise<void> {
  const parser = await getParser();
  parser.validateSpecText(specJson);
}
