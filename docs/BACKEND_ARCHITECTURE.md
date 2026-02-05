# HypKnotic Backend Architecture

## Overview

HypKnotic uses a **local-first, optional-sync** architecture that prioritizes privacy and works without requiring paid server hosting.

## Design Principles

1. **Local-First**: All data stored on-device by default
2. **Privacy-Focused**: End-to-end encrypted sync
3. **FOSS Compatible**: No proprietary dependencies
4. **Self-Hostable**: Optional relay server is open source
5. **Offline Capable**: Full functionality without internet

---

## Architecture Layers

### Layer 1: Local Storage (Implemented ✅)

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

### Layer 2: P2P Direct Sync (Planned)

**Location**: `data/P2PService.js`

Uses WebRTC for direct peer-to-peer connection:

```
┌──────────┐     WebRTC Data Channel     ┌──────────┐
│   DOM    │◄───────────────────────────►│   SUB    │
│  Device  │     (Encrypted E2E)         │  Device  │
└──────────┘                              └──────────┘
```

**How Pairing Works**:
1. Dom generates a 6-digit pairing code
2. Sub enters the code
3. Devices exchange signaling info (can use QR code for local pairing)
4. WebRTC connection established
5. Real-time sync begins

**Benefits**:
- No server required when both online
- True end-to-end encryption
- Zero latency for real-time features
- Completely free

### Layer 3: Relay Server (Optional, Planned)

For when both users aren't online simultaneously.

**Design**:
- Small Node.js server (~500 lines)
- Stores encrypted sync packages
- Acts as "mailbox" for offline messages
- Open source, self-hostable

**Options**:
1. **Self-Host**: Run on any VPS, Raspberry Pi, or home server
2. **Community Relays**: Volunteer-run public relays
3. **No Relay**: Direct P2P only (both must be online)

**Protocol**:
```
1. Dom makes change → Encrypt → Store locally
2. If Sub offline → Queue to relay (encrypted)
3. Sub comes online → Pull from relay → Decrypt → Apply
4. Sub confirms receipt → Relay deletes data
```

### Layer 4: Account Portability

**Export/Import**:
- Export all data as encrypted JSON file
- Password-protected backup
- Import on new device
- QR code for quick device transfer

**Cloud Backup (Optional)**:
- Users can backup to their own cloud storage
- Google Drive, Dropbox, iCloud (user's own account)
- We never see the data

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
