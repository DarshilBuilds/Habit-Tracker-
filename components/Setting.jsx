import React, { useState } from 'react'
import { useTheme } from './ThemeContext'

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteData = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) localStorage.setItem("theme", theme);
    setShowConfirm(false);
    window.location.reload();
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-10 transition-colors shadow-lg rounded-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Manage your appearance and data preferences.
          </p>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex items-center justify-between p-5">
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Switch between light and dark mode.
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                role="switch"
                aria-checked={darkMode}
                aria-label="Toggle dark mode"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  darkMode ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-5">
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Delete all data</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Permanently remove all habits and tracked data stored on this device.
                </p>
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                Delete data
              </button>
            </div>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Delete all data?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This will permanently erase all habits, logs, and settings stored
                locally. This can't be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteData}
                  className="text-sm font-medium text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Delete everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Settings;