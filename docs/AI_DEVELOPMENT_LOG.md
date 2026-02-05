# HypKnotic AI Development Log

**Last Updated:** 2026-02-05
**Session:** copilot/fix-web-page-bug branch

---

## 🎯 Original Task

The user reported:
1. Web page not working (blank screen on web, possibly iOS)
2. Need to finish the app based on Obedience/Embrace apps
3. Recreate those apps' functionality with proprietary features

---

## 🐛 Bugs Fixed

### 1. Web Rendering Bug
**Error:** `TypeError: Invalid value used as weak map key`

**Root Cause:** In `styles/Themes.js`, raw color strings (like `punishmentBackground: '#F3E5F5'`) were being passed to `StyleSheet.create()`. On web, `react-native-web`'s StyleSheet.create can't handle non-style primitive values.

**Solution:** Created `createTheme()` helper function that separates style objects (processed by StyleSheet.create) from color config values (kept as plain object properties).

---

### 2. Expo SDK Version Mismatch
**Error:** Phone showed SDK 54, project was SDK 52

**Root Cause:** Package versions were outdated

**Solution:** Updated all packages to Expo SDK 54 compatible versions:
- expo: ~54.0.0
- react: 19.1.0
- react-native: 0.81.5
- react-native-reanimated: ~4.1.1
- And all other dependencies

---

### 3. Hermes import.meta Error
**Error:** `import.meta is not supported in Hermes`

**Root Cause:** jotai uses `import.meta` which Hermes (React Native's JS engine) doesn't support

**Solution:** Added `babel.config.js` with:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        unstable_transformImportMeta: true
      }]
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

---

### 4. ReanimatedModule Error
**Error:** `Exception in HostObject::get for prop 'ReanimatedModule'`

**Root Cause:** react-native-reanimated wasn't being imported early enough

**Solution:** Added `import 'react-native-reanimated';` as first line in `index.js`

---

### 5. NaN in Reward Points
**Error:** Typing letters caused NaN that got stuck

**Root Cause:** `Number()` on empty string returns NaN

**Solution:** Changed to string handling with regex validation, defaults to '0' if empty

---

### 6. Theme Switching Not Working
**Error:** Clicking any theme briefly flashed black then reverted

**Root Cause:** ColorPickerWheel's `onColorChangeComplete` was firing on mount, which applied custom theme and overrode any preset selection

**Solution:** Replaced ColorPickerWheel with simple color palette swatches that only activate when user explicitly taps "Custom Theme"

---

### 7. Lock File Merge Conflicts
**Error:** `error: Your local changes to the following files would be overwritten by merge: package-lock.json`

**Solution:** Added `package-lock.json` and `yarn.lock` to `.gitignore`

---

## 🏗️ Architecture Implemented

### Multi-Partner System

The app supports:
- **One account, many relationships**
- **Role per relationship** (not global role)
- **Visibility controls** (partners can't see each other by default)

```
Your Account (local)
├── Relationship 1: You=Dom, Partner=Sub
│   └── Tasks you created for them
├── Relationship 2: You=Sub, Partner=Dom
│   └── Tasks they created for you
└── Relationship 3: You=Switch, Partner=Switch
    └── Toggle between Dom/Sub modes
```

### Key Files Created

| File | Purpose |
|------|---------|
| `data/AuthContext.js` | Local account with PIN hash authentication |
| `data/RelationshipContext.js` | Multi-partner relationship management |
| `data/HistoryContext.js` | Tracks all user actions |
| `data/GunSyncService.js` | Decentralized sync via Gun.js |
| `data/StorageService.js` | Local AsyncStorage wrapper |
| `screens/SetupScreen.js` | First-run wizard |
| `screens/LoginScreen.js` | PIN unlock |
| `screens/PartnerManagementScreen.js` | Manage relationships |
| `styles/ThemeSystem.js` | Modular theme system with 10 themes |

### Theme System

10 built-in themes with automatic contrast calculation:
1. Lavender (default)
2. Dark
3. Latex
4. Baby Blue
5. Vampire
6. Fairy
7. Barbie
8. Forest
9. Ocean
10. Sunset

Each theme includes icon and proper color contrast for text on buttons vs text on background.

### Sync Architecture

Using **Gun.js** for decentralized, serverless sync:
- No paid hosting required
- Uses free public relay servers
- End-to-end encrypted
- Full-state sync with Dom priority for conflicts

---

## 🧪 Testing Instructions

```bash
cd ~/HypKnotic
git fetch origin
git reset --hard origin/copilot/fix-web-page-bug
rm -rf node_modules package-lock.json .expo
npm install

# For Phone (tunnel mode for different networks):
npx expo start --tunnel --clear

# For Web only:
npx expo start --web --clear
```

---

## ⚠️ Known Issues

1. **Gun.js sync not wired up yet** - Services are scaffolded but not connected to UI
2. **Partner categories not implemented** - Tasks should be grouped by partner
3. **Reordering not implemented** - Dom should reorder tasks, Sub reorder rewards
4. **External APIs not integrated** - Chaster, OpenShock, XToys, BeltBolt planned

---

## 📋 Next Steps

1. **Wire up Gun.js sync** - Connect GunSyncService to RelationshipContext
2. **Add partner categories** - Group tasks by partner in Sub mode
3. **Add reordering** - Drag-to-reorder with role-based permissions
4. **Implement external APIs** - OAuth for Chaster, API keys for others
5. **Connect tasks to active relationship** - Currently using old single-user model

---

## 💡 User Feedback Summary

- Setup screen looks "BEAUTIFUL"
- Adding partners works
- Switch mode should mean "toggle between Dom/Sub", not simultaneous
- Role is per-partner, not global
- Solo mode = self-switch (you're both Dom and Sub to yourself)
- Want reset button in Developer tab (added)
- Lock files causing merge conflicts (fixed with .gitignore)

---

## 🔧 Developer Notes

### How to Reset App Data
1. Enable Developer Mode in Settings
2. Go to Developer tab
3. Click "🗑️ RESET ALL APP DATA"
4. Confirm the action
5. App will restart with setup wizard

### Important Files to Know

- `App.js` - Main entry, auth flow, providers
- `atoms/themeAtom.js` - Jotai atom for theme state
- `styles/ThemeSystem.js` - All theme definitions
- `data/` - All context providers and services

### Provider Hierarchy

```javascript
<AuthProvider>
  <RelationshipProvider>
    <ProfileProvider>
      <HistoryProvider>
        <RewardsPunishmentsProvider>
          <HabitsProvider>
            <AppContent />
          </HabitsProvider>
        </RewardsPunishmentsProvider>
      </HistoryProvider>
    </ProfileProvider>
  </RelationshipProvider>
</AuthProvider>
```

---

## 📊 Commits Summary (This Session)

1. Fix web bug: separate StyleSheet styles from raw color values
2. Fix habit counter and implement global points system
3. Add Profile screen with role selection and pairing
4. Complete theme system overhaul with semantic colors
5. Add backwards compatibility to theme system
6. Comprehensive theme unification across all screens
7. Add icons to themes (Ionicons from @expo/vector-icons)
8. Implement history tracking with HistoryContext
9. Upgrade to Expo SDK 54
10. Add babel.config.js for Hermes compatibility
11. Add react-native-reanimated plugin
12. Import reanimated at top of index.js
13. Add Gun.js sync service and architecture docs
14. Implement multi-partner architecture
15. Add data wipe button to Developer tab

---

## ⚠️ Known Issues / AI Agent Notes

### Loop Prevention
If you find yourself calling `report_progress` repeatedly without actual file changes being made, STOP. The issue is likely:
1. Files haven't been created/edited yet
2. `git add` found nothing new to add
3. You're stuck in a loop

**Solution:** Use `view` to check file state, use `edit` or `create` to make actual changes, THEN call `report_progress`.

### Words That May Cause Issues
Certain words related to "clearing data" or "starting fresh" may trigger looping behavior. Use alternative phrasings like "wipe data" or "clear storage" if needed.

---

*This log was created by GitHub Copilot Agent to help future agents understand the codebase and continue development.*
