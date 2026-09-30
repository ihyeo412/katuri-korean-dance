# Member login connection — not activated

This is a prepared Supabase integration, not a connected or verified production service. No project has been created, no account enrolled, no private location uploaded, and no live authentication/RLS test performed.

1. Create/select a Supabase project. In Authentication, disable public signups. An administrator creates member accounts and provides/reset passwords securely; passwords must not be sent through this chat or stored in the repository.
2. Run `member-access.sql` once in that project's SQL editor. It creates two tables and server-side row-level security policies. Re-running the creation script is not a migration workflow.
3. Add approved users' Auth UUIDs to `katuri_members` with `approved = true` through the private dashboard. A signed-in account without an approved row cannot read meeting records. Browser clients have no write privileges.
4. Add private location/time information to `member_meetings` through the dashboard. Match `event_id` to the public event's stable `id` in `schedule-data.js`. Never put locations, account lists, tokens, or passwords in public files.
5. Set the project HTTPS URL and **publishable** key in `member-config.js`. Never use a secret or service_role key: those bypass security policies. The publishable key is intentionally public.
6. Deploy over HTTPS. `members.html?event=EVENT_ID` opens from a schedule item. It uses email/password authentication; the access token is retained only in memory, and logging out or navigating away clears rendered private details. There is no automatic signup, session persistence, or self-service password reset; administrators manage credentials.
7. Before real locations are entered, test with dummy data: unauthenticated request denied; authenticated unapproved user receives no rows; approved user reads a matching event; approved=false revokes access on the next request; browser attempts to insert/update membership denied; wrong password fails; logout clears the page; expiry clears it; direct private-page access requires login. The server must enforce these checks even when bypassing the UI. Verify all of these in the actual project.

If another login provider is selected, adapt this integration before publishing. The GitHub Pages site remains static; Supabase is the separate authentication/database service. Previously disclosed details cannot be retracted from a member who already viewed them.

References: https://supabase.com/docs/guides/auth and https://supabase.com/docs/guides/database/postgres/row-level-security
