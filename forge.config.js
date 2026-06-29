const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path'); 

module.exports = {
  packagerConfig: {
    asar: true,
    // 🛠️ FIX: Removed the extension as recommended by Electron Forge for general packaging
    icon: path.resolve(__dirname, './src/assets/habit-icon'), 
  },
  rebuildConfig: {},
  makers: [
    // 🚀 WIN32 ZIP MAKER (Bypasses all file locks instantly)
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'], 
    },
    // 🖥️ SQUIRREL WINDOWS MAKER (Fixed configurations & names)
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Your Name', // Required parameter
        description: 'Habit tracker application.', // Required parameter
        name: 'habit_tracker', 
        exe: 'habit_tracker.exe', // 🛠️ FIX: Fixed the space typo ('habit-t racker.exe')
        setupIcon: path.resolve(__dirname, './src/assets/habit-icon.ico'), 
      },
    },  
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
