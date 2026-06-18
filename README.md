# 📅 Local Habit Tracker

A privacy-first desktop habit tracking application that runs completely offline and stores all user data locally on your device. Built with **React** and **Vite** for a high-performance user interface, styled with **Tailwind CSS**, and wrapped natively using **Electron**. 

This application focuses strictly on simplicity, speed, and absolute ownership of personal productivity data—without requiring subscriptions, accounts, or cloud synchronization.

---

## 💡 Why This Project Exists

Most modern habit tracking applications rely heavily on cloud infrastructure, subscriptions, and account systems. This project was created to provide a lightweight, local-first alternative where users fully control their data. It challenges the growing dependency on subscription-based productivity tools and demonstrates how modern desktop applications can still function efficiently, quickly, and securely without cloud infrastructure.

The focus is entirely on:
*   **Privacy:** No user metrics or inputs ever leave your computer.
*   **Ownership:** Your tracking data belongs to you, not a remote server.
*   **Simplicity:** A distraction-free productivity environment.
*   **Offline Usability:** Fully functional on planes, trains, or deep in nature.

---

## ✨ Features

### 🛠️ Core Features (Available Now)
*   **Native Desktop Shell** - Runs independently on Windows, macOS, and Linux.
*   **Smart Responsive Layout** - Automatically matches your specific screen workspace resolution while respecting the system taskbar layout.
*   **Fluid Client-Side Navigation** - Employs nested React Router Hash Routing to switch pages instantly without breaking local asset loading paths.
*   **Create & Manage Habits** - Quick, intuitive interface to register your custom daily targets.
*   **Track Daily Completion** - Instantly log your progress using an interactive click setup.
*   **No Authentication Needed** - Zero login, account registration, or setup forms required.

### 🚀 Planned Features (Roadmap)
*   🔥 **Streak Tracking:** Monitor current and historical consecutive completion streaks.
*   📊 **Advanced Analytics Dashboard:** Deep-dive weekly and monthly progress graphs.
*   🔔 **Local Reminders:** System-level desktop notifications to keep you on track.
*   🔄 **Data Portability:** Seamless import and export of user data via JSON files.
*   🌙 **Customizable Themes:** Integrated Dark Mode and color profile filtering.

---

## 🛠️ Built With

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Desktop Shell:** Electron
*   **Styling Engine:** Tailwind CSS (v4)
*   **Routing Architecture:** React Router DOM (Hash Routing)
*   **Runtime Environment:** Node.js

---

## 🏗️ Data Architecture

The application cleanly decouples user interface layers from system-level file operations to ensure stability, speed, and maintainability:

```text
  React UI (Renderer Process)
             │
             ▼
 Electron Bridge (Preload Context)
             │
             ▼
Electron Main (Background Process)
             │
             ▼
Local Storage (JSON / Future SQLite)
```

---

## 📁 Project Folder Structure

The repository is structured to separate interface design from background desktop operational logic:

```text
Habit-tracker/
├── components/            # Shared structural workspace modules
│   ├── Mainlayout.jsx     # Master application navigation frame workspace
│   ├── Navigation.jsx     # App sidebar link tree structure
│   ├── Habits.jsx         # Main tracking sheet and checkmark grid panel
│   ├── Analytics.jsx      # Progress insights and charts display
│   └── setting.jsx        # App options and personalizations panel
├── src/
│   ├── main.jsx           # Root engine mounting file (Wraps HashRouter)
│   ├── App.jsx            # Master routing switch network mapping views
│   └── index.css          # Tailwind CSS layer compilation directives
├── main.cjs               # Electron native window manager script
├── vite.config.js         # Relative file pathway bundling settings
└── package.json           # Application dependencies and run automation scripts
```

---

## 💻 Getting Started (Development Setup)

Follow these directions to copy the codebase and spin up the project workspace locally on your development system.

### Prerequisites
*   [Node.js](https://nodejs.org) (v18 or higher recommended)
*   npm (installed automatically alongside Node)

### Installation
1. Clone the repository to your machine:
   ```bash
   git clone https://github.com
   ```
2. Open the newly created folder pathway:
   ```bash
   cd Habit-tracker
   ```
3. Install the unified application development packages:
   ```bash
   npm install
   ```

### Running the Workspace
To run the live application development environment with hot-reloading active, launch the scripts using **two independent terminal screens**:

*   **Terminal 1:** Boot up your local Vite front-end client server:
    ```bash
    npm run dev
    ```
*   **Terminal 2:** Launch the native interactive Electron container window:
    ```bash
    npm run electron:dev
    ```

---

## 📦 Production Bundling

To bundle your code files together into a single, highly optimized standalone desktop setup package (such as a portable `.exe` file for Windows) that you can distribute directly to users, execute:

```bash
npm run build
```

---

## 🔮 Future Scope
*   🔒 **Encrypted Local Storage:** Passphrase-protected local database files for maximum data security.
*   🤖 **AI-Powered Insights:** Purely local automated productivity hints derived from completion statistics.
*   🔄 **Cross-Device Manual Sync:** Peer-to-peer encrypted target file backup exports.

---

## 📄 Status
**Active Development.** The current milestone focus is establishing a bulletproof local-first data framework alongside seamless persistent offline data saving configurations.
