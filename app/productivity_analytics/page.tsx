import Link from "next/link";

export default function ProductivityAnalytics() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Productivity Analytics</h1>
          <p className="mt-3 text-slate-500">
            This page will show charts and insights for your study habits.
          </p>
        </section>
      </div>
    </main>
  );
}
