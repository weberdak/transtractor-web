import { Link } from "react-router";

export function meta() {
  return [
    { title: "Transtractor - Privacy Policy" },
    { name: "description", content: "Privacy policy for the Transtractor web application" },
  ];
}

export default function PrivacyPolicy() {
  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">Privacy Policy</h1>

        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            This website is a static application. It does not require you to create an
            account, and it does not ask you to submit personal information to use the main
            PDF parsing features.
          </p>
          <p>
            PDF statements and custom parser configuration files are processed in your browser.
            They are not uploaded to a Transtractor-managed application server for parsing.
          </p>
          <p>
            This site does not collect the contents of your bank statements or exported CSV
            files as part of its normal operation.
          </p>
          <p>
            Page visits are tracked using Vercel Analytics. That means basic usage information
            about visits to this site may be collected through that service.
          </p>
          <p>
            If this privacy model is important to you, you should still review the behavior of
            any hosting platform, browser extensions, or third-party services involved in your
            own environment.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link to="/" className="inline-link">
            Back to Transtractor GUI
          </Link>
          <Link to="/about" className="inline-link">
            About Transtractor
          </Link>
        </div>
      </section>
    </main>
  );
}
