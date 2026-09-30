# Katuri Korean Dance

A responsive, dependency-free static website for **KaturiKoreanDance.com**. Open `index.html` in a browser to preview. No installation, build step, account, external fonts, or image service is needed. All paths are relative, so the site also works under a GitHub repository path.

## Files

- `index.html`: all page content and accessible section navigation.
- `styles.css`: desktop/mobile layouts and theme variables at the top.
- `script.js`: mobile menu, Escape-to-close behavior, and copyright year.
- `assets/`: generated dancing-pheasant hero illustration, original abstract placeholder, and favicon.
- `.nojekyll`: serves these files without Jekyll processing.
- `CNAME`: the intended custom domain; this file does not register or configure DNS.

## Replace the placeholders

Search `index.html` for `REPLACE`, `PLACEHOLDER`, `coming soon`, and `to be added`. The copy is a starter draft, not an assertion of the group's history, credentials, location, or schedule.

1. **Opening section:** The About section opens directly below navigation, with a compact name, small ivory emblem, short introduction, and three editorial columns. The earlier oversized hero is removed.
2. **About:** replace the introductory draft and `.editor-note` paragraph with the approved biography, mission, location, and artist information.
3. **Dance descriptions:** replace the draft paragraphs with approved notes for the actual Hwang Jin Yi Dance and Hallyangmu interpretations. Verify choreography and music credits before publishing.
4. **Dance photographs:** replace a `.dance-visual` block with an image, e.g. `<img class="dance-photo" src="assets/hallyangmu.jpg" alt="Describe the actual photograph" width="1200" height="800" loading="lazy">`. Add `.dance-photo { display:block; width:100%; aspect-ratio:3/2; object-fit:cover; }` to the stylesheet.
5. **Performances:** replace `.performance-empty` with confirmed event titles, venues, dates, and actual ticket links. Use `<time datetime="YYYY-MM-DD">Readable date</time>`. No sample event dates or ticket purchases are active.
6. **Videos:** replace a gallery placeholder with a real image linked to the video, e.g. `<a href="YOUR_VIDEO_URL" aria-label="Watch Hallyangmu"><img src="assets/hallyangmu-video.jpg" alt="Hallyangmu performance" width="800" height="500" loading="lazy" style="display:block;width:100%;height:auto"></a>`. Update the caption. Prefer a direct YouTube/Vimeo link until an embedded player and its privacy implications are wanted. There are no fake play controls.
7. **Gallery photos:** replace `.media-placeholder` with actual images as above; include permissions and credits where needed.
8. **Contact:** replace `.contact-notice` with `<a class="text-link" href="mailto:YOUR_REAL_EMAIL">YOUR_REAL_EMAIL</a>`. Add only verified social links. This site has no contact form or message backend; do not claim messages can be submitted until one exists.
9. Review the page title, description, and footer. For a different domain, update `CNAME` as well.

Keep images reasonably compressed (ideally under 500 KB each); use WebP or JPEG for photographs. Retain meaningful alt text and heading order. The page remains readable with JavaScript disabled and honors reduced-motion settings.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `katuri-korean-dance`. A public repository is the simplest option with GitHub Free.
2. Put **the contents of this folder** at the repository root, with `index.html` directly in that root. Include `assets/`, `.nojekyll`, and the other files; do not upload the ZIP itself.
3. To test at the default GitHub URL before connecting the domain, omit `CNAME` initially. Otherwise keep it for the custom-domain setup below.
4. Commit to `main`. In the repository, open **Settings → Pages**, select **Deploy from a branch**, then **main** and **/(root)**, and save.
5. Wait for the Pages deployment to finish. GitHub shows the published URL in Pages settings. Without a custom domain, a project site normally uses `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`.
6. Future commits to this branch update the site. No Actions workflow or npm build is required.

## Connect KaturiKoreanDance.com

Verify the domain in your GitHub account's Pages settings using GitHub's supplied TXT record. Then set the repository's Pages **Custom domain** to `katurikoreandance.com` before changing DNS. Keep the root `CNAME` file consistent.

At your domain's DNS provider, configure:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR_USERNAME.github.io |

Use your GitHub user or organization name, without a repository path. Replace conflicting web-host records; preserve email and verification records. Avoid wildcard records. Allow up to 24 hours for DNS, then enable **Enforce HTTPS** in Pages when available. Test both the apex and `www` addresses.

These instructions were checked against [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Also see [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) and [Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Before launch

Replace or approve placeholder content, check mobile navigation and keyboard focus, verify photo permissions, and test every real email/video/ticket link. Publishing files does not configure an email inbox. Repository creation, deployment, domain verification, and DNS changes have not been performed as part of this deliverable.

## Performance video collection (updated)

The former “02 / THE REPERTOIRE” section has been removed. The performance video collection displays at most eight items initially. “영상 더 보기” reveals the next eight, until all videos are visible. There are no fabricated sample performances; the collection starts empty.

Add entries to `videos.js`, newest first. For a hosted video:

```js
window.KATURI_VIDEOS = [
  { kind: "link", title: "황진이춤", url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID", poster: "assets/performance.jpg", description: "공연명 · 공연 날짜" }
];
```

For an actual video file added to the repository (or hosted at an HTTPS address):

```js
window.KATURI_VIDEOS = [
  { kind: "file", title: "공연 제목", url: "assets/performance.mp4", poster: "assets/performance.jpg" }
];
```

`poster` and `description` are optional. Commit the actual media files and `videos.js` to publish changes. Linked videos open in a new tab; file videos have native playback controls and do not autoplay. This is a static publishing workflow, not a browser upload service. Visitor uploads, an owner login, cloud video storage, and server-side management are not yet implemented. The owner selected YouTube links. Use the editor below.


## 유튜브 영상 추가하기 (권장)

1. `manage-videos.html`을 브라우저로 엽니다. 현재 `videos.js`에 등록된 목록이 표시됩니다.
2. 공연 제목과 유튜브 공유 링크를 입력하고 **목록에 추가**를 누릅니다. 설명은 선택 사항입니다. 여러 개를 추가할 수 있으며 새 영상이 맨 앞에 들어갑니다.
3. **videos.js 다운로드**를 누릅니다. 이 파일을 GitHub 저장소 최상위의 기존 `videos.js`와 교체하고 커밋합니다. 다운로드 파일명에 `(1)` 등이 붙었다면 `videos.js`로 바꿉니다.
4. GitHub Pages 배포가 끝나면 홈페이지에 반영됩니다. 처음 8개가 보이고, 더 보기를 누를 때마다 다음 8개가 나타납니다.

유튜브 썸네일은 자동으로 표시되며 클릭하면 새 탭에서 유튜브가 열립니다. 실제 공개 또는 일부 공개 영상을 사용하고 로그인하지 않은 상태에서도 재생되는지 확인하세요. 채널/재생목록 링크는 지원하지 않습니다. 이 도구는 비밀번호나 서버 저장 기능이 없으며 파일 다운로드 전 편집 내용은 브라우저 메모리에만 있습니다. 방문자가 도구를 열어도 실제 사이트 파일을 변경할 수 없습니다. 게시에는 GitHub 저장소 쓰기 권한이 필요합니다.


## 무용단 소개 업데이트

맨 위 About 영역은 사용자가 제공한 북가주 까투리 무용단 소개문으로 채웠습니다. 창단 배경, 김옥자 단장 소개, 연습과 지역사회 활동 및 기사 링크를 포함합니다. 변동 가능한 단원 수·평균 연령·누적 공연 횟수는 생략했습니다. 기사 원문은 이번 편집 환경에서 열리지 않아 사실관계를 별도로 검증하지 못했으며, 제공받은 내용을 사용했습니다. 공개 전 소개 내용과 정기 연습 일정의 최신성을 확인하세요. 제공받은 BayNet TV 유튜브 링크는 첫 영상으로 등록했으며 영상의 재생 가능 여부는 별도로 확인하지 못했습니다.


## 디자인 정리

메뉴와 안내 문구를 한국어로 정리했습니다. 상단 소개는 작은 로고와 간결한 문구, 시작·사람·열정의 세 부분으로 나누었습니다. 휴대폰에서는 소개가 세로로 배열됩니다. 유튜브 영상은 처음 8개, 더 보기 클릭 시 다음 8개를 보여주는 방식을 유지합니다.


## 소개 카드 이미지 교체

시작·사람·열정은 이미지 위 흰 제목과 어두운 그라데이션이 있는 세로형 카드입니다. 카드를 누르거나 키보드 Enter/Space로 설명을 펼칩니다. 실제 공연 사진 원본을 현재 사용할 수 없어 기존 로고와 까투리 일러스트를 사용했습니다. 인물 사진으로 소개한 것이 아닙니다. `index.html`의 `.story-card` 안 이미지 `src`를 사진 경로로 바꾸세요. 첫 카드에 사진을 넣으면 `.story-card:first-child summary img`의 `object-fit:contain`과 `padding`을 제거하면 다른 카드와 같은 채움 방식이 됩니다.


## 카드별 페이지

홈의 4개 카드는 같은 탭에서 각각 `about.html`, `introduction-video.html`, `press.html`, `performances.html`로 이동합니다. 각 페이지에는 공통 메뉴와 홈으로 돌아가기 링크가 있습니다. 펼침형 설명은 별도 페이지로 대체했습니다. 공연 페이지도 같은 `videos.js` 목록을 사용합니다. 배포할 때 새 HTML 파일 4개도 함께 업로드하세요.


## 공연 일정과 멤버 모임 안내

홈페이지의 공연 소식 박스는 위 4개 카드 전체 너비에 맞춰집니다. `schedule-data.js`의 `events`에 확정된 공연의 `date`(YYYY-MM-DD), `title`, `time`, `place`를 추가하면 월 선택에 따라 표시됩니다. 기본값은 방문자 기기의 현재 월이며 다른 월도 선택할 수 있습니다. `meeting`의 `time`, `place`, `note`로 멤버 모임 안내를 수정합니다. 공개해도 되는 장소와 시간만 넣으세요. 실제 일정·장소가 제공되지 않아 현재는 추후 안내로 표시합니다. 정기 연습 요일은 앞서 제공된 화요일·목요일입니다.


## 일정 표시 변경 및 비공개 안내 상태

홈에는 현재 월과 다음 월만 표시합니다. 공연 소식 제목/전체 일정 링크는 `schedule.html`을 새 탭으로 엽니다. 멤버 모임 안내 영역을 제거했으며 `schedule-data.js`에는 공개 공연 날짜·제목·시간만 저장하세요. 이전 문서의 meeting/place 설정은 더 이상 사용하지 않습니다. 일정 클릭은 공개 시간을 펼칩니다. 멤버 장소는 로그인/비공개 문서 방식이 결정되지 않아 아직 제공하지 않습니다. 화면 숨김이나 프런트엔드 암호만으로 보호하지 않습니다.


## 멤버 로그인 준비 상태

이메일·비밀번호 로그인과 승인된 멤버만 읽는 서버 권한 설정을 준비했습니다. Supabase 프로젝트 연결 전이므로 실제 로그인은 아직 작동하지 않습니다. `setup/MEMBERS.md`를 따라 연결 및 실제 권한 테스트를 완료해야 합니다. 사이트 공개 파일에는 멤버 장소를 저장하지 마세요.


## 최신 회원 일정 구성

홈은 현재 월부터 4개월을 역순으로 표시합니다(9월 기준 12·11·10·9월). 승인된 Google 로그인 회원만 일정 버튼을 눌러 새 창/탭에서 본인 참가 여부와 만남 장소를 확인하도록 준비했습니다. Firebase 설정이 없어 현재 버튼은 잠깁니다. 실제 연결, 규칙 병합과 권한 테스트는 `setup/FIREBASE.md`를 따르세요. 이전 Supabase 설명은 사용하지 않습니다.


## 잠정 공연 예시

2026년 9~12월에 매월 10일·24일, 두 개씩 총 8개 잠정 예시를 추가했습니다. 실제 확정 공연이 아니며 모두 잠정 표시됩니다. 10월 10일 한인회 축하 공연 형식은 사용자 예시를 따랐습니다. 날짜는 `Oct. 10 2026 : 공연명` 형식입니다. 홈은 최신 달부터 2열로 표시하고 작은 휴대폰에서는 1열로 표시합니다. 공개 전 실제 일정으로 교체하고 확정된 항목만 `tentative: false`로 변경하세요. 새 창의 장소/참가 기능에는 같은 이벤트 ID의 Firestore 문서가 필요합니다.


## 일정 클릭 안내

일정 버튼은 로그인 전에도 새 창을 열어 공개 공연명과 날짜를 보여줍니다. 비회원은 참가 여부 및 만남 장소·시간을 볼 수 없으며 승인된 회원에게만 Firestore에서 불러옵니다. Firebase 설정이 아직 없어 현재는 연결 준비 안내가 나옵니다. 실제 장소·시간도 관리자 등록이 필요합니다.


## 참석 댓글로 변경

회원 안내 새 창은 만나는 장소·시간을 먼저 보여주고, 그 아래에 참석 댓글을 표시합니다. 승인된 회원끼리 댓글을 읽고 작성하며 본인 댓글만 삭제할 수 있습니다. 이전 참가 선택 메뉴는 제거했습니다. Firebase 설정 및 갱신된 Firestore 규칙 배포 전에는 실제 저장이 작동하지 않습니다.


## 춤별 참석 댓글

공연의 만남 장소·시간 아래에 춤별 댓글 입력란과 목록을 분리했습니다. Firebase 공연 문서의 `dances`에 춤 ID와 이름을 등록합니다(예: dance-1: 황진이춤, dance-2: 한량무). 두 춤에 각각 참석/불참 댓글을 남길 수 있습니다. 아직 Firebase 연결 전이며 화면은 잠겨 있습니다.


## 공연 소식 작성

`manage-schedule.html`에서 공연명·날짜·공개 시간·잠정 여부를 작성하거나 기존 항목을 수정/삭제합니다. 공개 일정 파일을 다운로드한 뒤 GitHub 저장소의 `schedule-data.js`를 교체하세요. 공연 ID는 수정해도 유지되므로 기존 춤 댓글과 연결할 수 있습니다. 회원 전용 장소와 춤 입력란은 Firebase 관리자 연결 전까지 잠겨 있습니다. 실제 온라인 저장 기능은 아직 연결되지 않았습니다.


## 웹사이트에서 직접 공연 소식 작성 (최신)

홈 공연 소식의 ‘공연 소식 작성 · 관리자’로 이동합니다. Firebase 관리자 Google 로그인 후 공연명·날짜·시간, 회원 전용 만남 장소·시간, 춤 두 가지와 추가 안내를 입력하고 ‘웹사이트에 게시’를 누릅니다. 파일 다운로드는 필요하지 않습니다. Firebase 설정과 관리자 승인 및 Firestore 규칙 연결 전에는 입력이 잠깁니다. 기존 파일 다운로드 방식 설명은 더 이상 사용하지 않습니다.


## 월별 일정 개수와 정렬

한 달의 공연 수에는 표시 제한이 없습니다. 모든 등록 일정을 보여주며, 두 달씩 묶인 각 행의 높이는 일정이 많은 쪽에 맞춰집니다. 다음 행의 연도·월 제목도 같은 높이에서 시작합니다. 2개씩 넣어 둔 초기 일정은 예시일 뿐 제한이 아닙니다.


## 영상 페이지 번호

영상은 페이지당 8개씩 표시됩니다. 9개 이상이면 목록 아래 이전·페이지 번호·다음 버튼이 나타납니다. 기존 더 보기 방식은 페이지 전환 방식으로 교체했습니다. 8개 이하에서는 페이지 버튼을 숨깁니다.


## 공연 영상 직접 추가 (최신)

홈 공연 영상 아래 ‘공연 영상 추가 · 관리자’ 링크를 누릅니다. 관리자 Google 로그인 후 제목·유튜브 링크·설명을 입력하고 게시합니다. 같은 링크는 수정되며 새 영상은 앞쪽에 표시됩니다. 기존 파일 다운로드 방식은 대체되었습니다. Firebase 설정과 최신 보안 규칙 연결 전에는 입력이 잠겨 있습니다.


## 영상 순서와 둥근 모서리

관리 화면에서 영상을 끌거나 위·아래 버튼으로 이동하고 ‘순서 저장’을 누르면 순서가 저장됩니다. Firebase 연결과 최신 규칙 적용 후 사용 가능합니다. 새 영상은 맨 앞에 표시되며 저장된 순서에 있는 영상은 제목을 수정해도 위치를 유지합니다. 썸네일 모서리는 둥글게 처리했습니다.


## Korean and English

Public homepage, navigation, introduction, card titles, press pages, schedule headings and sample event names now include English alongside Korean. Video controls also include English. New schedules have an optional English title field. Merge the updated Firestore rules to allow titleEn. News articles and YouTube audio remain in their original language. Administrator and member comment workflows remain primarily Korean; no automatic translation is applied to user comments.


## 공연 일정 표시

일정 목록의 잠정 배지를 숨기고 영어 공연명은 한국어 옆에 표시합니다. 기존 샘플 일정의 tentative 값은 유지하며, 표시 변경이 실제 공연 확정을 뜻하지는 않습니다.
