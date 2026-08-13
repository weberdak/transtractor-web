import { Link } from "react-router";

export function meta() {
  return [
    { title: "Transtractor - Terms of Use" },
    { name: "description", content: "Terms of use for the Transtractor web application" },
  ];
}

export default function TermsOfUse() {
  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">Terms of Use</h1>

        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            This website is provided on an "as is" and "as available" basis, without
            warranties or conditions of any kind, whether expressed or implied.
          </p>
          <p>
            No warranty is given that the site will be available at all times, free from
            defects, or suitable for any particular purpose.
          </p>
          <p>
            You are responsible for reviewing any extracted data before relying on it for
            financial, accounting, tax, legal, or operational use.
          </p>
          <p>
            To the maximum extent permitted by applicable law, the authors, contributors, and
            operators of this site are not liable for any direct, indirect, incidental,
            special, consequential, or other damages arising from the use of, or inability to
            use, this website or its output.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link to="/" className="inline-link">
            Back to Transtractor GUI
          </Link>
          <Link to="/privacy-policy" className="inline-link">
            Privacy Policy
          </Link>
        </div>
      </section>
    </main>
  );
}
