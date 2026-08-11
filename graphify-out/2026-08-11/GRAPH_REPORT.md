# Graph Report - .  (2026-08-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2189 nodes · 4853 edges · 282 communities (250 shown, 32 thin omitted)
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 1117 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- moment.min.js
- papaparse.min.js
- jquery.dataTables.min.js
- q
- setupTest
- d3.min.js
- mockMessage
- chartist.min.js
- sweetalert2.min.js
- NewPhishingTemplateContext
- card.tsx
- vendor/jquery.js
- devDependencies
- t
- JSONResponse
- PostGroup
- u
- MailLog
- PostCampaign
- handleError
- (dashboard)/page.tsx
- middleware_test.go
- NewServer
- compilerOptions
- AdminServer
- PostLimiter
- prisma.ts
- logger.go
- validate.py
- SMTP
- dependencies
- devDependencies
- setupTest
- GetMailLogsByCampaign
- GetUser
- PostPage
- .User
- C
- Result
- topojson.min.js
- DeleteUser
- Errorf
- setupBenchmark
- cn
- n
- Setup
- he
- datamaps.min.js
- components.json
- select2.min.js
- next
- GetCampaign
- PostSMTP
- campaign_results.js
- campaigns.ts
- Email
- scripts
- Infof
- webhook/webhook.go
- training/[token]/page.tsx
- IMAP
- GetRoleBySlug
- templates.js
- campaigns.js
- app/sending_profiles.js
- webhook_test.go
- createTestData
- .createCampaignDependencies
- landing_pages.js
- nr
- .TestAttachment
- groups.js
- passwords.js
- context.go
- context-legacy.go
- dashboard.js
- bootstrap.min.js
- TestParseCSVEmail
- app/layout.tsx
- .SendTestEmail
- extends
- mockTemplateContext
- a11yhelp.js
- jquery.ui.widget.js
- postcss.config.mjs
- (auth)/layout.tsx
- ai-builder/page.tsx
- settings/page.tsx
- middleware.ts
- run.sh
- User
- rbac_test.go
- build-config.js
- webpack.config.js
- @hookform/resolvers
- next.config.mjs
- pg
- prisma
- @prisma/adapter-pg
- @prisma/client
- @radix-ui/react-dialog
- @radix-ui/react-label
- @radix-ui/react-separator
- react
- react-hook-form
- recharts
- @supabase/supabase-js
- tailwind-merge
- tailwind.config.ts
- github.com/gophish/gophish

## God Nodes (most connected - your core abstractions)
1. `t()` - 59 edges
2. `n()` - 57 edges
3. `e()` - 53 edges
4. `u()` - 46 edges
5. `i()` - 45 edges
6. `o()` - 36 edges
7. `r()` - 34 edges
8. `JSONResponse()` - 32 edges
9. `PostCampaign()` - 31 edges
10. `q()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --indirect_call--> `error()`  [INFERRED]
  src/app/api/ai/generate-email/route.ts → gophish-master/static/js/src/vendor/papaparse.min.js
- `POST()` --indirect_call--> `error()`  [INFERRED]
  src/app/api/ai/save-template/route.ts → gophish-master/static/js/src/vendor/papaparse.min.js
- `POST()` --indirect_call--> `error()`  [INFERRED]
  src/app/api/campaigns/route.ts → gophish-master/static/js/src/vendor/papaparse.min.js
- `POST()` --indirect_call--> `error()`  [INFERRED]
  src/app/api/campaigns/send/route.ts → gophish-master/static/js/src/vendor/papaparse.min.js
- `GET()` --indirect_call--> `error()`  [INFERRED]
  src/app/api/settings/status/route.ts → gophish-master/static/js/src/vendor/papaparse.min.js

## Import Cycles
- None detected.

## Communities (282 total, 32 thin omitted)

### Community 0 - "moment.min.js"
Cohesion: 0.05
Nodes (84): qt(), a(), aa(), ac(), b(), ba(), bb(), bc() (+76 more)

### Community 1 - "papaparse.min.js"
Cohesion: 0.06
Nodes (35): deleteUser(), dismiss(), edit(), load(), save(), users, deleteWebhook(), dismiss() (+27 more)

### Community 2 - "jquery.dataTables.min.js"
Cohesion: 0.07
Nodes (67): aa(), Ab(), B(), Bb(), C(), ca(), Cb(), da() (+59 more)

### Community 3 - "q"
Cohesion: 0.13
Nodes (40): a(), b(), c(), d(), e(), f(), g(), h() (+32 more)

### Community 4 - "setupTest"
Cohesion: 0.09
Nodes (44): testContext, createTestData(), Config, Server, T, setupTest(), tearDown(), clickLink() (+36 more)

### Community 5 - "d3.min.js"
Cohesion: 0.04
Nodes (29): bi(), di(), fi(), fr(), ft(), gt(), hr(), iu() (+21 more)

### Community 6 - "mockMessage"
Cohesion: 0.07
Nodes (32): Dialer(), dialHost(), errorMail(), Context, NewMailWorker(), sendMail(), generateMessages(), T (+24 more)

### Community 7 - "chartist.min.js"
Cohesion: 0.08
Nodes (33): a(), b(), c(), d(), e(), f(), g(), h() (+25 more)

### Community 8 - "sweetalert2.min.js"
Cohesion: 0.08
Nodes (47): jt(), _t(), a(), b(), Bt(), c(), ce(), d() (+39 more)

### Community 9 - "NewPhishingTemplateContext"
Cohesion: 0.07
Nodes (34): AdminServer, Config, PhishServer, PhishingServer, PhishingServerOption, TransparencyResponse, File, LoadConfig() (+26 more)

### Community 10 - "card.tsx"
Cohesion: 0.11
Nodes (31): LoginPage(), RegisterPage(), CampaignWithRelations, dynamic, runtime, dynamic, dynamic, GenerateResponse (+23 more)

### Community 11 - "vendor/jquery.js"
Cohesion: 0.06
Nodes (32): an(), at(), bt(), ct(), er(), F(), Hn(), ht() (+24 more)

### Community 12 - "devDependencies"
Cohesion: 0.04
Nodes (48): @babel/core, babel-loader, @babel/preset-env, clean-css, author, bugs, url, dependencies (+40 more)

### Community 13 - "t"
Cohesion: 0.08
Nodes (47): ae(), ar(), at(), bo(), bt(), ct(), dr(), dt() (+39 more)

### Community 14 - "JSONResponse"
Cohesion: 0.09
Nodes (25): cloneRequest, cloneResponse, emailResponse, Server, Request, ResponseWriter, Server, Request (+17 more)

### Community 15 - "PostGroup"
Cohesion: 0.13
Nodes (23): Server, Request, ResponseWriter, DeleteGroup(), GetGroup(), GetGroupByName(), GetGroups(), GetGroupSummaries() (+15 more)

### Community 16 - "u"
Cohesion: 0.24
Nodes (35): a(), b(), c(), d(), Do(), du(), f(), fu() (+27 more)

### Community 17 - "MailLog"
Cohesion: 0.11
Nodes (14): Warn(), GetCampaignMailContext(), addAttachment(), GenerateMailLog(), GetQueuedMailLogs(), Message, Time, LockMailLogs() (+6 more)

### Community 18 - "PostCampaign"
Cohesion: 0.13
Nodes (17): GetCampaignResults(), GetCampaigns(), getCampaignStats(), GetCampaignSummaries(), GetCampaignSummary(), GetQueuedCampaigns(), Time, PostCampaign() (+9 more)

### Community 19 - "handleError"
Cohesion: 0.09
Nodes (33): POST(), POST(), checkDatabase(), checkGroq(), checkOllama(), checkResend(), GET(), hasRealValue() (+25 more)

### Community 20 - "(dashboard)/page.tsx"
Cohesion: 0.13
Nodes (24): POST(), ResendEmailResponse, sendCampaignSchema, sendWithResend(), DashboardPage(), dynamic, percent(), TargetManager() (+16 more)

### Community 21 - "middleware_test.go"
Cohesion: 0.18
Nodes (24): ApplySecurityHeaders(), CSRFExceptions(), EnforceViewOnly(), GetContext(), Handler, HandlerFunc, ResponseWriter, JSONError() (+16 more)

### Community 22 - "NewServer"
Cohesion: 0.12
Nodes (21): ServerOption, AdminServerOption, templateParams, T, testContext, makeImportRequest(), TestCustomDeniedImport(), TestDefaultAllowedImport() (+13 more)

### Community 23 - "compilerOptions"
Cohesion: 0.08
Nodes (25): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+17 more)

### Community 24 - "AdminServer"
Cohesion: 0.28
Nodes (8): AdminServer, Flash(), getTemplate(), Request, ResponseWriter, Server, newTemplateParams(), New()

### Community 25 - "PostLimiter"
Cohesion: 0.15
Nodes (18): Duration, Handler, HandlerFunc, Time, NewPostLimiter(), Handler, T, reachLimit() (+10 more)

### Community 26 - "prisma.ts"
Cohesion: 0.16
Nodes (16): GET(), GET(), transparentPixel, GET(), POST(), submitTrainingSchema, dynamic, adapter (+8 more)

### Community 27 - "logger.go"
Cohesion: 0.13
Nodes (16): main(), checkForNewEmails(), Context, monitor(), NewMonitor(), Debug(), Debugf(), Info() (+8 more)

### Community 28 - "validate.py"
Cohesion: 0.21
Nodes (21): Path, check_agents_headings(), check_citation_cff(), check_handoff_context(), check_no_legacy_hooks_file(), check_out_of_scope_sections(), check_part3_no_fabricated_config(), check_part3_project_structure() (+13 more)

### Community 29 - "SMTP"
Cohesion: 0.16
Nodes (14): Server, Request, ResponseWriter, DeleteSMTP(), GetSMTP(), GetSMTPByName(), GetSMTPs(), Sender (+6 more)

### Community 30 - "dependencies"
Cohesion: 0.10
Nodes (21): class-variance-authority, clsx, graphify, lucide-react, dependencies, class-variance-authority, clsx, graphify (+13 more)

### Community 31 - "devDependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, postcss, tailwindcss, tsx (+13 more)

### Community 32 - "setupTest"
Cohesion: 0.22
Nodes (18): testContext, createTestData(), Config, Server, T, User, setupTest(), TestSiteImportBaseHref() (+10 more)

### Community 33 - "GetMailLogsByCampaign"
Cohesion: 0.18
Nodes (13): Entry, Fields, WithFields(), CompleteCampaign(), DeleteCampaign(), C, ModelsSuite, GetMailLogsByCampaign() (+5 more)

### Community 34 - "GetUser"
Cohesion: 0.24
Nodes (9): GetUser(), GetUserByAPIKey(), GetUserByUsername(), GetUsers(), User, Time, PutUser(), C (+1 more)

### Community 35 - "PostPage"
Cohesion: 0.20
Nodes (12): Server, Request, ResponseWriter, GetPage(), GetPageByName(), GetPages(), Time, PostPage() (+4 more)

### Community 36 - ".User"
Cohesion: 0.19
Nodes (12): userRequest, CheckPasswordPolicy(), GeneratePasswordHash(), T, TestPasswordPolicy(), TestValidatePasswordChange(), ValidatePassword(), ValidatePasswordChange() (+4 more)

### Community 37 - "C"
Cohesion: 0.25
Nodes (3): C, ModelsSuite, GetResult()

### Community 38 - "Result"
Cohesion: 0.20
Nodes (8): generateResultId(), DB, Time, EventDetails, mmCity, mmGeoPoint, Result, Values

### Community 39 - "topojson.min.js"
Cohesion: 0.32
Nodes (15): a(), c(), e(), f(), g(), i(), l(), m() (+7 more)

### Community 40 - "DeleteUser"
Cohesion: 0.23
Nodes (13): Server, Request, ResponseWriter, DeletePage(), DeleteTemplate(), GetTemplate(), GetTemplateByName(), GetTemplates() (+5 more)

### Community 41 - "Errorf"
Cohesion: 0.22
Nodes (12): dialControl, RestrictedDialer, restrictedControl(), SetAllowedHosts(), T, TestCustomAllow(), TestCustomDeny(), TestDefaultAllow() (+4 more)

### Community 42 - "setupBenchmark"
Cohesion: 0.35
Nodes (15): benchmarkPostGroup(), BenchmarkPostGroup100(), BenchmarkPostGroup1000(), BenchmarkPostGroup10000(), benchmarkPutGroup(), BenchmarkPutGroup100(), BenchmarkPutGroup1000(), BenchmarkPutGroup10000() (+7 more)

### Community 43 - "cn"
Cohesion: 0.21
Nodes (10): MobileNav(), navItems, navItems, Sidebar(), Avatar, AvatarFallback, AvatarImage, CardFooter (+2 more)

### Community 44 - "n"
Cohesion: 0.14
Nodes (16): br(), bu(), ee(), fo(), gi(), hi(), j(), k() (+8 more)

### Community 45 - "Setup"
Cohesion: 0.16
Nodes (12): DBDriver, GenerateSecureKey(), Server, Request, ResponseWriter, chooseDBDriver(), createTemporaryPassword(), Config (+4 more)

### Community 46 - "he"
Cohesion: 0.21
Nodes (14): be(), ce(), de(), fe(), gr(), he(), me(), nt() (+6 more)

### Community 47 - "datamaps.min.js"
Cohesion: 0.37
Nodes (13): a(), b(), c(), d(), e(), f(), g(), h() (+5 more)

### Community 48 - "components.json"
Cohesion: 0.15
Nodes (12): aliases, components, utils, rsc, $schema, style, tailwind, baseColor (+4 more)

### Community 49 - "select2.min.js"
Cohesion: 0.44
Nodes (12): a(), b(), c(), d(), e(), f(), g(), h() (+4 more)

### Community 51 - "GetCampaign"
Cohesion: 0.45
Nodes (11): GetCampaign(), BenchmarkCampaign100(), BenchmarkCampaign1000(), BenchmarkCampaign10000(), BenchmarkGetCampaign100(), BenchmarkGetCampaign1000(), BenchmarkGetCampaign10000(), BenchmarkGetCampaign5000() (+3 more)

### Community 52 - "PostSMTP"
Cohesion: 0.36
Nodes (3): PostSMTP(), C, ModelsSuite

### Community 53 - "campaign_results.js"
Cohesion: 0.24
Nodes (6): createStatusLabel(), load(), poll(), refresh(), renderTimeline(), report_mail()

### Community 54 - "campaigns.ts"
Cohesion: 0.26
Nodes (9): adapter, main(), prisma, POST(), createCampaign(), CreateCampaignInput, createCampaignSchema, getOrCreateDemoAdmin() (+1 more)

### Community 55 - "Email"
Cohesion: 0.31
Nodes (6): Validate(), checkRIDs(), matchEmail(), Client, Email, Mailbox

### Community 56 - "scripts"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, db:seed, dev, lint, start (+2 more)

### Community 57 - "Infof"
Cohesion: 0.29
Nodes (6): Fatal(), Infof(), CheckAndCreateSSL(), Request, ParseCSV(), ParseMail()

### Community 59 - "webhook/webhook.go"
Cohesion: 0.33
Nodes (8): Send(), SendAll(), SetTransport(), sign(), Transport, defaultSender, EndPoint, Sender

### Community 60 - "training/[token]/page.tsx"
Cohesion: 0.24
Nodes (7): dynamic, TrainingPageProps, QuizForm(), QuizQuestion, Badge(), BadgeProps, badgeVariants

### Community 61 - "IMAP"
Cohesion: 0.36
Nodes (6): DeleteIMAP(), GetIMAP(), Time, PostIMAP(), SuccessfulLogin(), IMAP

### Community 62 - "GetRoleBySlug"
Cohesion: 0.33
Nodes (6): GetRoleBySlug(), C, ModelsSuite, EnsureEnoughAdmins(), Permission, Role

### Community 64 - "templates.js"
Cohesion: 0.36
Nodes (6): copy(), deleteTemplate(), dismiss(), edit(), load(), save()

### Community 65 - "campaigns.js"
Cohesion: 0.32
Nodes (3): copy(), edit(), setupOptions()

### Community 66 - "app/sending_profiles.js"
Cohesion: 0.43
Nodes (6): addCustomHeader(), copy(), dismiss(), edit(), load(), save()

### Community 67 - "webhook_test.go"
Cohesion: 0.46
Nodes (6): T, newMockSender(), TestSendMocked(), TestSendReal(), TestSignature(), mockSender

### Community 68 - "createTestData"
Cohesion: 0.50
Nodes (7): createTestData(), Config, T, setupCampaign(), setupTest(), TestMailLogGrouping(), testContext

### Community 69 - ".createCampaignDependencies"
Cohesion: 0.48
Nodes (3): C, Config, ModelsSuite

### Community 70 - "landing_pages.js"
Cohesion: 0.48
Nodes (5): copy(), dismiss(), edit(), load(), save()

### Community 71 - "nr"
Cohesion: 0.33
Nodes (7): nr(), or(), rr(), tr(), tu(), xr(), zr()

### Community 72 - ".TestAttachment"
Cohesion: 0.40
Nodes (4): Fatalf(), C, ModelsSuite, readFile()

### Community 73 - "groups.js"
Cohesion: 0.60
Nodes (5): addTarget(), dismiss(), edit(), load(), save()

### Community 74 - "passwords.js"
Cohesion: 0.33
Nodes (4): Progress, ProgressBar, StrengthDescription, StrengthMapping

### Community 75 - "context.go"
Cohesion: 0.60
Nodes (4): Clear(), Get(), Request, Set()

### Community 76 - "context-legacy.go"
Cohesion: 0.60
Nodes (4): Clear(), Get(), Request, Set()

### Community 79 - "TestParseCSVEmail"
Cohesion: 0.50
Nodes (4): buildCSVRequest(), Request, T, TestParseCSVEmail()

### Community 80 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 81 - ".SendTestEmail"
Cohesion: 0.50
Nodes (3): Server, Request, ResponseWriter

### Community 82 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

## Knowledge Gaps
- **176 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `$schema`, `style`, `rsc` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `B()` connect `jquery.dataTables.min.js` to `q`, `chartist.min.js`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `k()` connect `chartist.min.js` to `jquery.dataTables.min.js`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `JSONResponse()` connect `JSONResponse` to `PostPage`, `.User`, `DeleteUser`, `NewPhishingTemplateContext`, `Setup`, `PostGroup`, `.SendTestEmail`, `AdminServer`, `SMTP`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `t()` (e.g. with `ar()` and `at()`) actually correct?**
  _`t()` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 24 inferred relationships involving `n()` (e.g. with `f()` and `j()`) actually correct?**
  _`n()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `e()` (e.g. with `ae()` and `at()`) actually correct?**
  _`e()` has 37 INFERRED edges - model-reasoned connections that need verification._
- **Are the 22 inferred relationships involving `u()` (e.g. with `bt()` and `du()`) actually correct?**
  _`u()` has 22 INFERRED edges - model-reasoned connections that need verification._