/**
 * habitStorage.js
 * Utility functions for month-scoped habit tracking data storage and streak calculation.
 */

export function getYearMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function loadAllHabitDays() {
  const savedata = localStorage.getItem('habit_tracker_days');
  if (!savedata) return {};

  try {
    const parsed = JSON.parse(savedata);
    if (!parsed || typeof parsed !== 'object') return {};

    // Check if format is legacy flat format: { habitId: { dayNumber: boolean } }
    // Legacy format keys are habit IDs (numeric strings), while month-scoped keys match "YYYY-MM" (e.g., "2026-08")
    const isLegacyFormat = Object.keys(parsed).some((key) => !/^\d{4}-\d{2}$/.test(key));

    if (isLegacyFormat) {
      // Migrate legacy flat structure into current month key
      const currentKey = getYearMonthKey(new Date());
      const migrated = {
        [currentKey]: { ...parsed }
      };
      localStorage.setItem('habit_tracker_days', JSON.stringify(migrated));
      return migrated;
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing habit_tracker_days:', error);
    return {};
  }
}

export function saveHabitDays(data) {
  try {
    localStorage.setItem('habit_tracker_days', JSON.stringify(data));
    // Dispatch custom event so sibling components update immediately without full page reloads
    window.dispatchEvent(new CustomEvent('habitDataChanged'));
  } catch (error) {
    console.error('Error saving habit_tracker_days:', error);
  }
}

export function getHabitDaysForMonth(allData, yearMonthKey) {
  return allData[yearMonthKey] || {};
}

/**
 * Calculates continuous day streak for a habit by traversing backwards day by day across month boundaries.
 * Preserves active streak if today is not checked off yet but yesterday was completed.
 */
export function calculateHabitStreak(habitId, allData, startDate = new Date()) {
  if (!allData || typeof allData !== 'object') return 0;

  const stringId = String(habitId);
  let streak = 0;
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  // Check if today is completed
  const todayYearMonth = getYearMonthKey(cursor);
  const todayDayNumber = cursor.getDate();
  const isTodayDone = allData[todayYearMonth]?.[stringId]?.[todayDayNumber];

  if (!isTodayDone) {
    // If today is not checked yet, test if yesterday was completed.
    // If yesterday was NOT completed either, the streak is broken (0).
    const yesterday = new Date(cursor);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayYearMonth = getYearMonthKey(yesterday);
    const yesterdayDayNumber = yesterday.getDate();
    const isYesterdayDone = allData[yesterdayYearMonth]?.[stringId]?.[yesterdayDayNumber];

    if (!isYesterdayDone) {
      return 0;
    }
    // Yesterday was completed! Move cursor to yesterday and count backwards from there
    cursor.setDate(cursor.getDate() - 1);
  }

  // Count consecutive completed days going backwards
  while (true) {
    const yearMonth = getYearMonthKey(cursor);
    const dayNumber = cursor.getDate();

    const monthData = allData[yearMonth];
    const isDone = monthData?.[stringId]?.[dayNumber];

    if (isDone) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

