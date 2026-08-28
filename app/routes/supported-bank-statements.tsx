import { Link } from "react-router";
import type { Route } from "./+types/supported-bank-statements";

type StatementRow = {
  bank: string;
  accountType: string;
  exampleAccounts: string;
};

const AUSTRALIA_STATEMENTS: StatementRow[] = [
  {
    bank: "Commonwealth Bank",
    accountType: "Credit Card",
    exampleAccounts: "Low Rate MasterCard, Low Fee Mastercard",
  },
  {
    bank: "Commonwealth Bank",
    accountType: "Debit / Savings",
    exampleAccounts: "Streamline, Smart Access, GoalSaver, Everyday Offset",
  },
  {
    bank: "Commonwealth Bank",
    accountType: "Loan",
    exampleAccounts: "Complete Home Loan",
  },
  {
    bank: "National Australia Bank",
    accountType: "Debit / Savings",
    exampleAccounts: "Classic Banking",
  },
  {
    bank: "Westpac",
    accountType: "Debit / Savings",
    exampleAccounts: "Choice, Life",
  },
  {
    bank: "ING",
    accountType: "Debit / Savings",
    exampleAccounts: "Orange Everyday, Savings Maximiser",
  },
];

const US_STATEMENTS: StatementRow[] = [
  {
    bank: "American Express",
    accountType: "Credit Card",
    exampleAccounts: "Platinum Card",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transtractor - Supported Bank Statements" },
    { name: "description", content: "List of supported bank statements for Transtractor" },
  ];
}

export default function SupportedBankStatements() {
  return (
    <main className="app-page">
      <section className="app-card">
        <h1 className="app-title">Supported Statements</h1>
        <p className="app-subtitle">
          The Transtractor uses rules-based parsing to extract transaction data from bank
          statements. The following statements are recognised and parsed automatically.
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-700">
          If your bank or account type is not listed, you can create and load custom parser
          configuration files.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">Australia</h2>

        <div className="statements-table-wrap mt-3">
          <table className="statements-table">
            <thead>
              <tr>
                <th scope="col">Bank</th>
                <th scope="col">Account Type</th>
                <th scope="col">Example Accounts</th>
              </tr>
            </thead>
            <tbody>
              {AUSTRALIA_STATEMENTS.map((statement) => (
                <tr key={`${statement.bank}-${statement.accountType}-${statement.exampleAccounts}`}>
                  <td>{statement.bank}</td>
                  <td>{statement.accountType}</td>
                  <td>{statement.exampleAccounts}</td>
                </tr>
              ))}
              {US_STATEMENTS.map((statement) => (
                <tr key={`${statement.bank}-${statement.accountType}-${statement.exampleAccounts}`}>
                  <td>{statement.bank}</td>
                  <td>{statement.accountType}</td>
                  <td>{statement.exampleAccounts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">United States</h2>

        <div className="statements-table-wrap mt-3">
          <table className="statements-table">
            <thead>
              <tr>
                <th scope="col">Bank</th>
                <th scope="col">Account Type</th>
                <th scope="col">Example Accounts</th>
              </tr>
            </thead>
            <tbody>
              {US_STATEMENTS.map((statement) => (
                <tr key={`${statement.bank}-${statement.accountType}-${statement.exampleAccounts}`}>
                  <td>{statement.bank}</td>
                  <td>{statement.accountType}</td>
                  <td>{statement.exampleAccounts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link to="/" className="inline-link">
            Back to Transtractor GUI
          </Link>
        </div>
      </section>
    </main>
  );
}
