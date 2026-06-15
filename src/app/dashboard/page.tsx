export default function Dashboard() {
  const kpis = [
    { title: 'Total Employees', value: '8,421', trend: '+12% from last month' },
    { title: 'Active Sites', value: '412', trend: '+3 new sites' },
    { title: 'Expiring Contracts', value: '45', trend: 'Requires attention' },
    { title: 'Pending Payroll', value: 'Rp 2.4B', trend: 'Due in 3 days' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, Super Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{kpi.title}</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[300px] flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Headcount Chart Placeholder</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">New Employee Hired</p>
                <p className="text-slate-500 dark:text-slate-400">Jane Smith joined Engineering</p>
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Contract Expiring</p>
                <p className="text-slate-500 dark:text-slate-400">5 contracts expiring this week</p>
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium">Payroll Approved</p>
                <p className="text-slate-500 dark:text-slate-400">May 2026 payroll approved by Director</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
