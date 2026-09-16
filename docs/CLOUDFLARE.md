# Public demo deployment — blocked by DNS

Hostname: `demo.vtbnew.kz`.
Tunnel: `partner-pannel-demo` (`6ddd2c45-a91d-42aa-87a1-cb30dcaa8128`).
Created 2026-09-16. Credentials remain outside this repository in the user's
`.cloudflared` directory. Never commit them or the API key.

**Not yet published.** On 2026-09-16 the owner approved access for everyone
without Cloudflare Access. CNAME `demo.vtbnew.kz` was created successfully.
Tunnel connectivity was verified, then the connector was stopped pending DNS.
Both Google DNS and Cloudflare DNS return NXDOMAIN for `vtbnew.kz` itself;
check domain registration and registrar nameserver delegation with the owner.

Before restarting the tunnel:

1. Resolve domain registration/delegation; verify public A/AAAA resolution.
2. Do not create an Access application: the owner chose public demonstration.
3. Set `PUBLIC_ORIGIN=https://demo.vtbnew.kz` for the application process.
   Exact origin checks and Secure session cookies are prepared in the server.
   Keep the origin bound to loopback; do not expose port 3001 on the LAN.
4. Ensure the running server is the NEW build. The old node process 18484 could
   not be stopped from this tool session; public-mode runtime checks remain pending.
5. Verify public login, navigation, POS demo form and AI. The host computer,
   application and connector must remain running.

The app uses public demonstration credentials klim / klim. A public-host banner
warns against entering real banking data. POS and signing remain demo-only.
Public mode caps AI at 50 calls per rolling 24 hours across ALL users, 2 concurrent
calls and 3 calls/minute/session. The durable ledger is `.cache/public-ai-budget.json`;
do not delete it to restart. Failed provider requests count. This caps calls, not
an exact monetary amount. Run a single server process. Build and all 5 tests pass.
Public files were scanned for the configured API key (no match) and secret filenames.
Config: C:/Users/User/.cloudflared/partner-pannel-demo.yml (outside repository).
