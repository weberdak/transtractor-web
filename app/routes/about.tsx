import { Link } from "react-router";

export function meta() {
  return [
    { title: "Transtractor - About" },
    { name: "description", content: "About the Transtractor project" },
  ];
}

export default function About() {
  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">About Transtractor</h1>

        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Transtractor is an open source bank statement parser that extracts transaction
            data using rule-based algorithms.
          </p>
          <p>
            The core library is built in Rust and provides Python and WASM APIs. This
            website uses the WASM bindings.
          </p>
          <p>
            Transtractor does not use LLMs or AI. The main benefit of this approach is that
            extraction is accurate and predictable for supported formats.
          </p>
          <p>
            The codebase is small enough to run directly in a browser page, which means your
            sensitive personal data does not need to be uploaded to a remote server for
            processing.
          </p>
          <p>
            The trade-off is that each bank statement format needs specific configuration
            parameters. Supported statement formats will increase over time.
          </p>
        </div>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Related Resources</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>
              <a
                href="https://github.com/weberdak/transtractor-lib"
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                GitHub Library Repository
              </a>{" "}
              - Compile the project from source or contribute to development.
            </li>
            <li>
              <a
                href="https://pypi.org/project/transtractor/"
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                PyPI
              </a>{" "}
              - Install the precompiled Python package for your own data workflows.
            </li>
            <li>
              <a
                href="https://transtractor-lib.readthedocs.io/"
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                Read the Docs
              </a>{" "}
              - Usage guidance for the Python API.
            </li>
          </ul>
        </section>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link to="/" className="inline-link">
            Back to Transtractor GUI
          </Link>
          <Link to="/supported-bank-statements" className="inline-link">
            View Supported Statements
          </Link>
        </div>
      </section>
    </main>
  );
}
