# Firebase integration — prepared, not connected

This replaces the earlier Supabase draft. Configure the existing Firebase web app in `firebase-config.js`; no config was provided yet. Enable Google sign-in and authorize the deployed website domain in Firebase Authentication. Use HTTP localhost or HTTPS hosting, not file://, for login testing.

Proposed Firestore structure (adapt to the existing project before deployment):
- `katuri_members/{authUid}`: `{approved: true}` set only by administrator.
- `katuri_events/{publicEventId}`: `{title, meetingTime, meetingPlace, note}`. Private to approved members.
- `katuri_events/{publicEventId}/dances/{danceId}/comments/{commentId}`: `{authorId, authorName, text, createdAt}`. Approved members read all comments, create comments as themselves, and delete only their own. Comments cannot be edited.
- Public `schedule-data.js` contains id/date/title/time only, never meeting locations or membership lists.

Merge `firestore.rules` into EXISTING rules carefully; do not overwrite unrelated collections. Ensure there is no overlapping permissive wildcard rule: Firestore allows access if ANY matching rule allows it. Members cannot grant themselves approval. Rules protect private details even if someone bypasses disabled buttons or opens the detail URL directly.

Home shows current month plus next three months, descending (latest month top-left). Full schedule also groups newest month first. Approved members click an event to open members.html in a new tab/window, see meeting place and time first, then leave attendance comments. Google sign-in alone does not confer membership.

Before deployment test in Firebase Emulator/actual test project: anonymous and unapproved access denied; self-approval denied; approved read succeeds; forged comment author IDs denied; oversized comments/extra fields denied; deleting others’ comments denied; own valid comments persist; revoked membership denied; missing event handled; logout clears private display. Syntax checks alone do not prove rule correctness. Live login, Firestore reads/writes and rules have NOT been tested or deployed because project settings are pending.

Official references: https://firebase.google.com/docs/web/setup and https://firebase.google.com/docs/firestore/security/rules-conditions


Latest update: the structured RSVP selector is replaced by attendance comments. Existing RSVP data is not migrated, read or deleted. Rules must be deployed before enabling comments. Display names come from Google profiles and are not a verified identity field; authorization uses immutable Auth UIDs. Confirm actual Firestore rule behavior in Emulator before production.


## Per-dance attendance comments

Each private event document now needs a `dances` map, for example `{ "dance-1": "황진이춤", "dance-2": "한량무" }`. These are examples, not confirmed repertoire. Use stable IDs; changing a title keeps its comments, changing its ID starts a separate thread. There may be more or fewer than two dances. Each dance has its own form and comment list, stored under `katuri_events/{eventId}/dances/{danceId}/comments/{commentId}`. Dance parent documents are not needed; allowed IDs are checked against the event's dances map by security rules. Old event-wide comments are not migrated or deleted and are no longer displayed. Update rules before use; confirm thread isolation, invalid dance rejection, member-only reads/writes and owner-only deletion in the Firebase emulator. No live backend test has been run because config is pending.


## Direct website publishing (latest)

`manage-schedule.html` now publishes directly to Firestore via an atomic batch: `katuri_public_events/{id}` holds public id/title/date/time/tentative; `katuri_events/{id}` holds private meeting details and dances. The homepage listens to public events. Configured Firestore becomes authoritative, replacing the static sample list, even when empty. Grant administrators `approved:true, admin:true` on their membership document through the trusted Firebase Console only. Non-admin members cannot publish. Merge updated rules and inspect overlapping grants before activation. Test non-admin writes denied, admin batch success, atomic failure, public/private separation, live schedule refresh, and existing comment isolation. Actual deployment and tests remain pending config. Removing an event unpublishes only its public listing, preserving its private records/comments.


## Online video publishing

Admin editor now uses `katuri_videos/{youtubeId}`. Merge latest rules before activation. Public fields only. Existing local videos remain visible unless overridden by the same video ID. New records display first; active=false unpublishes a listing without deleting the record. Test anonymous read, non-admin writes denied, admin writes validated, duplicate IDs update, unpublish, and pagination after more than eight records. Pending actual Firebase configuration and integration tests.


## Manual video order

The admin video page supports drag/drop and accessible up/down controls. Save persists IDs to `katuri_settings/video_order`. Deploy the updated rule for this document before use. Unlisted new videos appear first; videos already in the saved order retain their position when edited. Existing local entries can also be ordered. Validate administrator-only writes and public refresh after saving when Firebase is configured.
