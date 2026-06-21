import Link from "next/link";

export default function Home() {
  const menuItems = [
    { label: "Dashboard", href: "/" },
    { label: "Smart Scheduler", href: "/smart_scheduler" },
    { label: "Assignments & Exams", href: "/assignments" },
    { label: "Productivity Analytics", href: "/productivity_analytics" },
  ];

  const summaryCards = [
    { title: "Study Hours", value: "6.5", label: "Today" },
    { title: "Tasks Completed", value: "85%", label: "Progress" },
    { title: "Major Exams", value: "2", label: "Upcoming" },
  ];

  const priorityTasks = [
    {
      title: "Research Methodology Draft",
      dueTime: "Tomorrow, 4 PM",
      priority: "High Priority",
    },
    {
      title: "Data Structures Review",
      dueTime: "Oct 24, 11 AM",
      priority: "Medium",
    },
    {
      title: "Machine Learning Assignment",
      dueTime: "Completed",
      priority: "Completed",
    },
  ];

  const focusTrend = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5 },
    { day: "Fri", hours: 2 },
  ];

  const maxHours = Math.max(...focusTrend.map((item) => item.hours));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                StudyFlow
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                Learning Hub
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Access your dashboard, schedule, and analytics from one place.
              </p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            <header className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Hello, Alex!</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    Your study dashboard
                  </h1>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                    Resume session
                  </button>
                  <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    Add note
                  </button>
                </div>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((card) => (
                <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.label}</p>
                </article>
              ))}
              <article className="rounded-3xl bg-linear-to-br from-blue-600 to-sky-600 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-sky-100/80">
                      Next study session
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">Advanced Calculus</h3>
                    <p className="mt-2 text-sm text-sky-100/80">
                      Stay focused with a 25-minute session.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl bg-white/10 p-5">
                  <div className="text-sm text-sky-100/80">Starts in</div>
                  <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                    <span>24</span>
                    <span className="text-base text-sky-100/80">min</span>
                    <span>56</span>
                    <span className="text-base text-sky-100/80">sec</span>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-100">
                  Start Now
                </button>
              </article>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Priority Tasks</h2>
                    <p className="mt-1 text-sm text-slate-500">Today’s most important work.</p>
                  </div>
                  <Link href="/assignments" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                    View all
                  </Link>
                </div>

                <ul className="mt-6 space-y-4">
                  {priorityTasks.map((task) => (
                    <li key={task.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{task.dueTime}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          {task.priority}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Focus Trend</h2>
                  <p className="mt-1 text-sm text-slate-500">Hours of study progress this week.</p>
                </div>

                <div className="grid gap-4 rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-end justify-between gap-3 h-32">
                    {focusTrend.map((item) => (
                      <div key={item.day} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                        <div className="flex h-full w-full items-end">
                          <div
                            className="w-full rounded-t-3xl bg-slate-900"
                            style={{ height: `${(item.hours / maxHours) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{item.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Insight</p>
                    <p className="mt-2 text-sm text-slate-900">
                      Your focus peak is between 9 AM and 11 AM. Plan hard topics then.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
