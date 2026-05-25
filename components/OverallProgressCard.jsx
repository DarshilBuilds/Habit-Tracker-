function OverallProgressCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl border p-5">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-gray-700">
          bar_chart
        </span>
        <h3 className="font-semibold text-gray-900">
          Overall Progress
        </h3>
      </div>

      {/* Habit Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="material-symbols-outlined text-gray-500">
            description
          </span>
          <span className="text-sm font-medium">
            hi
          </span>
        </div>

        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          0%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500"
          style={{ width: "0%" }}
        />
      </div>

      {/* Footer */}
      <p className="mt-2 text-xs text-gray-500">
        0 of 31 days
      </p>

    </div>
  );
}

export default OverallProgressCard;
