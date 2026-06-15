export default function EmployeeDirectory() {
  const employees = [
    { id: 'EMP-001', name: 'John Doe', department: 'Engineering', site: 'HQ', status: 'Active' },
    { id: 'EMP-002', name: 'Jane Smith', department: 'HR', site: 'Branch A', status: 'Active' },
    { id: 'EMP-003', name: 'Michael Johnson', department: 'Finance', site: 'HQ', status: 'Inactive' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your workforce effectively.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors">
          + Add Employee
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Site</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">{emp.id}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{emp.name}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{emp.department}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{emp.site}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
