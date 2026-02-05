# HypKnotic Backend Architecture

## Overview

HypKnotic uses a **local-first, "just works" sync** architecture that:
- Works immediately without any server setup
- Prioritizes privacy with encrypted sync
- Uses free, decentralized infrastructure (Gun.js)
- Allows self-hosting for advanced users

## Design Principles

1. **Just Works**: No setup required for basic users
2. **Local-First**: All data stored on-device
3. **Full-State Sync**: Complete snapshots, not deltas
4. **Dom Priority**: Conflicts resolve in Dom's favor
5. **FOSS Compatible**: All components open source
6. **Offline Capable**: Queue changes when offline

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Gun.js Relay Network                     │
│         (Free public relays - no hosting needed!)           │
│     gun-manhattan.herokuapp.com, gun-eu.herokuapp.com       │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │     Encrypted Data          │
         │     Full-State Sync         │
         │                             │
    ┌────▼────┐                   ┌────▼────┐
    │   DOM   │◄─────────────────►│   SUB   │
    │ Device  │   Real-time sync  │ Device  │
    │         │   when both on    │         │
    └─────────┘                   └─────────┘
         │                             │
    ┌────▼────┐                   ┌────▼────┐
    │ Local   │                   │ Local   │
    │ Storage │                   │ Storage │
    └─────────┘                   └─────────┘
```

---

## Layer 1: Local Storage (✅ Implemented)

**Location**: `data/StorageService.js`

All user data is stored locally using:
- `@react-native-async-storage/async-storage` (mobile)
- `localStorage` (web, with fallback)

**Data Categories**:
- Profile & Settings
- Rewards, Punishments, Habits
- Notes, Journals, Rules
- History & Activity Logs
- Partner Pairing Data

---

## Layer 2: Gun.js Sync (✅ Implemented)

**Location**: `data/GunSyncService.js`

Gun.js is a decentralized database that uses free public relay servers.

### How Pairing Works

```
1. Dom opens Profile → "Generate Pairing Code"
   └── Shows: 847291

2. Sub opens Profile → enters: 847291
   └── Both connected via Gun.js!

3. Auto-sync begins
   └── Any change syncs to partner
```

### Why Gun.js?

| Feature | Gun.js | Custom P2P | Own Server |
|---------|--------|------------|------------|
| No setup needed | ✅ | ❌ | ❌ |
| Works offline | ✅ | ✅ | ❌ |
| Free | ✅ | ✅ | ❌ |
| Real-time | ✅ | ✅ | ✅ |
| Self-hostable | ✅ | N/A | ✅ |
| FOSS | ✅ MIT | ✅ | ✅ |

### Sync Protocol: Full-State

Every sync transfers the complete state:

```javascript
{
  version: 47,
  timestamp: "2024-02-05T12:00:00Z",
  senderRole: "dom",
  data: {
    tasks: [...],      // All tasks
    rewards: [...],    // All rewards
    punishments: [...],// All punishments
    history: [...],    // All history
    totalPoints: 150,
    settings: {...}
  }
}
```

**Why Full-State (not deltas)?**
- Simpler conflict resolution
- Both devices always in sync
- No "missing operation" bugs
- Easier debugging

---

## Conflict Resolution: Dom Priority

### Rules

| Scenario | Resolution |
|----------|------------|
| Same item modified | Dom's version wins |
| Sub completes task, Dom changed it | Dom's change applies, Sub notified |
| Both offline, both edit | On sync: Dom priority |
| New items | Both added (no conflict) |
| Delete vs edit | Delete wins |

### Example: Task Conflict

```
Timeline:
10:00 - Dom creates: "Do 10 pushups"
10:05 - Sub starts working on it (goes offline)
10:07 - Dom changes to: "Do 20 pushups"
10:10 - Sub marks "10 pushups" complete (still offline)
10:15 - Both come online, sync happens

Resolution:
- Dom's change (10:07) has priority
- Sub's completion (10:10) is REJECTED
- Sub sees notification: "Task was updated, please review"
- Sub must complete the new 20 pushup requirement
```

### Implementation

```javascript
mergeStates(localState, remotePacket) {
  const domPriority = remotePacket.senderRole === 'dom' 
                      && this.currentMode === 'sub';
  
  if (domPriority) {
    // Remote is Dom, we're Sub - use their version
    return { ...localState, ...remotePacket.data };
  } else {
    // We're Dom or remote is Sub - use our version
    // Only add new items from remote
    return mergeOnlyNewItems(localState, remotePacket.data);
  }
}
```

---

## Layer 3: Account Portability

### Export/Import
- Export all data as encrypted JSON file
- Password-protected backup
- Import on new device
- QR code for quick device transfer

### Cloud Backup (Optional)
- Users can backup to their own cloud storage
- Google Drive, Dropbox, iCloud (user's own account)
- We never see the data

---

## Advanced: Self-Hosting a Relay

For users who want maximum privacy, they can run their own Gun.js relay:

```bash
# Install Gun relay
npm install gun

# Create relay.js
const Gun = require('gun');
const server = require('http').createServer().listen(8765);
const gun = Gun({ web: server });
console.log('Gun relay running on port 8765');

# Run it
node relay.js
```

Then configure the app to use your relay:
```javascript
GunSyncService.initialize({
  peers: ['http://your-server.com:8765/gun']
});
```

---

## Role System

### Roles

| Role | Description |
|------|-------------|
| **Dom** | Creates and manages tasks, rewards, punishments |
| **Sub** | Completes tasks, spends points, sets limits |
| **Switch** | Can toggle between Dom and Sub modes |
| **Solo** | Single user, has all capabilities |

### Permissions by Role

#### Dom Mode
- ✅ Create/Edit/Delete Tasks
- ✅ Create/Edit/Delete Rewards
- ✅ Create/Edit/Delete Punishments
- ✅ Write Rules
- ✅ Assign Tasks to Sub
- ✅ Award/Deduct Points
- ✅ View Sub's Activity
- ✅ Approve/Deny Requests

#### Sub Mode
- ✅ View Assigned Tasks
- ✅ Mark Tasks Complete
- ✅ Use/Spend Rewards (with points)
- ✅ Set Personal Limits
- ✅ Write Notes/Ideas
- ✅ Request Tasks/Rewards
- ✅ View Own History
- ❌ Cannot edit Dom-created content
- ❌ Cannot arbitrarily award points

#### Switch Mode
- Toggle between Dom and Sub views
- When in Dom mode → Dom permissions
- When in Sub mode → Sub permissions
- Can be paired with any role

### Data Ownership

```
Shared Data (synced between partners):
├── Tasks (Dom creates, Sub completes)
├── Rewards (Dom creates, Sub redeems)
├── Punishments (Dom assigns, Sub completes)
├── Rules (Dom writes)
└── Points Balance

Private Data (not synced):
├── Personal Notes
├── Private Journals
├── App Settings
└── Theme Preferences
```

---

## External API Integrations

### Planned Integrations

| Service | Purpose | Auth | Priority |
|---------|---------|------|----------|
| **Chaster** | Chastity device lock management | OAuth2 | High |
| **OpenShock** | Shock collar control | API Key | High |
| **XToys** | Connected toy control | WebSocket | Medium |
| **BeltBolt** | Chastity belt management | OAuth2 | Medium |
| **Lovense** | Toy control | API Key | Medium |

### Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│                    HypKnotic App                     │
├─────────────────────────────────────────────────────┤
│                Integration Manager                   │
├───────────┬───────────┬───────────┬────────────────┤
│  Chaster  │ OpenShock │   XToys   │   BeltBolt     │
│  Adapter  │  Adapter  │  Adapter  │    Adapter     │
└─────┬─────┴─────┬─────┴─────┬─────┴───────┬────────┘
      │           │           │             │
      ▼           ▼           ▼             ▼
  [Chaster]  [OpenShock]   [XToys]     [BeltBolt]
    API          API         API          API
```

### Authentication Flow

1. User clicks "Connect [Service]"
2. Open OAuth2/API Key dialog
3. User authenticates with service
4. Token stored locally (encrypted)
5. Integration activated

### Task Triggers

Tasks can trigger external actions:
- **On Complete**: Unlock chastity device
- **On Fail**: Send shock command
- **On Reward Use**: Activate toy pattern
- **Timer-Based**: Lock until task complete

---

## Security Considerations

### Encryption

- **At Rest**: AES-256 for local storage
- **In Transit**: TLS 1.3 + E2E encryption
- **P2P**: DTLS (WebRTC built-in)

### Key Management

```
Master Key (derived from password)
    │
    ├── Local Storage Key
    │
    ├── Sync Encryption Key
    │
    └── Backup Encryption Key
```

### Privacy Features

- No analytics or tracking
- No account required for basic use
- All sync data is encrypted
- Relay server cannot read content
- Delete account = delete everything

---

## Implementation Roadmap

### Phase 1: Local-Only (Done ✅)
- [x] Local storage service
- [x] All data persists on device
- [x] Export/Import backup

### Phase 2: P2P Pairing (In Progress)
- [ ] WebRTC connection setup
- [ ] Pairing code generation
- [ ] Real-time sync when online
- [ ] Conflict resolution

### Phase 3: Relay Server
- [ ] Design relay protocol
- [ ] Build minimal Node.js server
- [ ] Publish as separate FOSS repo
- [ ] Document self-hosting

### Phase 4: External APIs
- [ ] Chaster integration
- [ ] OpenShock integration
- [ ] XToys integration
- [ ] Generic webhook support

---

## Self-Hosting Guide

### Relay Server Requirements

- Node.js 18+
- 512MB RAM minimum
- Any Linux/Windows/Mac server
- Domain with SSL (Let's Encrypt)

### Quick Start

```bash
git clone https://github.com/girlyguppy/hypknotic-relay
cd hypknotic-relay
npm install
npm start
```

### Docker

```bash
docker run -d -p 3000:3000 hypknotic/relay
```

### Configuration

```env
PORT=3000
MAX_STORAGE_MB=100
MESSAGE_TTL_HOURS=168
REQUIRE_AUTH=false
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to help with:
- P2P implementation
- Relay server development
- External API integrations
- Documentation
