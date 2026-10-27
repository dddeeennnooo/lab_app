# Insomnia

## Import this file (JSON)

**`insomnia-labshare-cmds.json`** — uuLabShare **app** CMDs only (location, equipment, reservation).

1. Insomnia → **Application** → **Import/Export** → **Import Data** → **From File**.
2. Choose **`insomnia-labshare-cmds.json`** (must be the `.json` file, not `.js`).
3. Select environment **localhost** and set **`token`** (OIDC Bearer).

### Environment (localhost)

| Variable | Example |
|----------|---------|
| `host` | `http://localhost:8080` |
| `contextPath` | `uu-labshare-studentg01` |
| `asid` | `11111111111111111111111111111111` |
| `awid` | your workspace AWID |
| `token` | Bearer access token |
| `locationId` | from `location/create` |
| `equipmentId` | from `equipment/create` |
| `reservationId` | from `reservation/create` |

Platform CMDs (subApp init, workspace create/init, permissions) stay in the template **`insomnia-workspace.json`** from create-uuapp — import that separately if you need it.

### Regenerate app CMD export

```text
node build-labshare-requests.js
```

Creates/overwrites **`insomnia-labshare-cmds.json`** only.
