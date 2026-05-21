# Flipkart Minutes — Deep Linking POC

Proof of concept for **direct** and **deferred** deep linking on iOS, modeled after Flipkart Minutes (quick commerce) vs main Flipkart.

| App | Simulates | Screens |
|-----|-----------|---------|
| **QuickCart** | Flipkart Minutes | Home, Product, Category |
| **ShopCart** | Main Flipkart | Home, Product, Category, **QuickCart Tab** |

Both apps share Universal Link paths on one HTTPS domain. A static **web fallback** handles the “neither app installed” case; **Branch** handles deferred deep linking in QuickCart.

---

## Repository layout

```
deeplinkingmini/
├── QuickCart/          # Primary deep link target (RN + iOS native)
├── ShopCart/           # Fallback when QuickCart not installed
├── shared/             # Hardcoded data + routeResolver.js
└── web/                # GitHub Pages / Vercel fallback + AASA
```

---

## URL contract

| Path | QuickCart | ShopCart |
|------|-----------|----------|
| `/product/{id}` | Product screen | QuickCart Tab → product |
| `/category/{id}` | Category screen | Category screen |
| `/quickcart/product/{id}` | — | QuickCart Tab → product |

**Custom scheme** (in-app browsers): `quickcart://product/{id}`, `quickcart://category/{id}`

Example product link (replace host after deploy):

`https://YOUR_USER.github.io/deeplinkingmini/product/milk-1l`

---

## Local-only learning (no GitHub)

You can explore most of this POC on your Mac **without** GitHub, Vercel, or any public deploy.

| What you want to learn | GitHub needed? | How to test locally |
|------------------------|----------------|---------------------|
| Screens, navigation, `routeResolver` | No | Run apps in Xcode; tap around in the UI |
| Custom scheme `quickcart://` | No | Simulator/device: see commands below |
| Cold-start URL buffer + RN routing | No | Trigger scheme from terminal or Safari |
| Universal Links (`https://…`) | No GitHub, but **needs public HTTPS** | Use [ngrok](https://ngrok.com) or similar tunnel to serve `web/` (see below) |
| Web fallback page UI | No | `npx serve web` and open in browser |
| Branch deferred install flow | Optional | Needs Branch keys + a reachable HTTPS link (tunnel is enough) |

**Apple limitation:** Universal Links are validated against a real `https` domain on the internet. `localhost` and `file://` do not work for UL on a phone. For UL-only demos without GitHub, tunnel `web/` once; for everything else, custom scheme is enough.

### Custom scheme only (simplest)

```bash
# iOS Simulator — QuickCart
xcrun simctl openurl booted "quickcart://product/milk-1l"

# Category
xcrun simctl openurl booted "quickcart://category/dairy"
```

On a **physical device**, type `quickcart://product/milk-1l` in Safari’s address bar (or use a Notes link).

### Optional: Universal Links via ngrok (still no GitHub)

```bash
cd web && npx serve -s . -l 3333
# In another terminal:
ngrok http 3333
```

1. Copy the `https://xxxx.ngrok-free.app` host.
2. Put that host in `QuickCart.entitlements` / `ShopCart.entitlements` as `applinks:xxxx.ngrok-free.app`.
3. Serve AASA at `https://xxxx.ngrok-free.app/.well-known/apple-app-site-association` (already in `web/.well-known/`).
4. Update path rules in AASA if you drop the `/deeplinkingmini` prefix (use `/product/*` only).
5. Rebuild and install on a **physical iPhone** (UL is flaky in Simulator).

---

## One-time setup

### 1. Apple Developer

1. Note your **Team ID** (10 characters).
2. Create App IDs: `com.flipkartpoc.quickcart`, `com.flipkartpoc.shopcart`.
3. Enable **Associated Domains** on both.
4. Signing: open each `.xcworkspace` in Xcode, select your team, enable **Automatically manage signing**.

### 2. Replace placeholders

| File | Replace |
|------|---------|
| `web/.well-known/apple-app-site-association` | `YOUR_APPLE_TEAM_ID` |
| `QuickCart/ios/QuickCart/QuickCart.entitlements` | `YOUR_USER.github.io` (and custom domain if any) |
| `ShopCart/ios/ShopCart/ShopCart.entitlements` | same |
| `QuickCart/ios/QuickCart/Info.plist` | Branch `key_live_*` / `key_test_*` |
| `QuickCart/branch.json` | Branch keys |
| `web/index.html` + `404.html` | `POC_BASE_PATH` if repo name ≠ `deeplinkingmini` |

### 3. Branch (deferred deep linking — Scenario C)

1. Create a free app at [branch.io](https://branch.io).
2. Add iOS bundle ID `com.flipkartpoc.quickcart`.
3. Paste live/test keys into `branch.json` and `Info.plist`.
4. In Branch dashboard, set default link domain / test links to your deployed HTTPS URLs.

### 4. Host web + AASA

**GitHub Pages (recommended for POC)**

1. Push this repo to GitHub.
2. Settings → Pages → Source: **Deploy from branch**, folder **`/web`** (or copy `web/` contents to `docs/`).
3. Site URL: `https://YOUR_USER.github.io/deeplinkingmini/`

**Important — AASA location**

Apple loads AASA from the **domain root**:

`https://YOUR_USER.github.io/.well-known/apple-app-site-association`

For a **project** site (`user.github.io/repo`), you must either:

- Use a **custom domain** pointing at the project, or  
- Host `.well-known` in a separate **`YOUR_USER.github.io`** repo at the account root (copy the file from `web/.well-known/`), with paths prefixed `/deeplinkingmini/...` as in the bundled AASA.

Validate with [Branch AASA Validator](https://branch.io/resources/aasa-validator/).

**Vercel**

Deploy the `web/` folder; set a custom domain (e.g. `quickcart.demo`); place AASA at `/.well-known/apple-app-site-association` with `Content-Type: application/json`.

### 5. Install iOS dependencies

Requires **full Xcode** (not Command Line Tools only):

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

cd QuickCart/ios && pod install && cd ../..
cd ShopCart/ios && pod install && cd ../..
```

### 6. Run on a physical iPhone

Universal Links do not work reliably in Simulator.

```bash
cd QuickCart && npm start
# Xcode: open ios/QuickCart.xcworkspace → Run on device

cd ShopCart && npm start
# Xcode: open ios/ShopCart.xcworkspace → Run on device
```

---

## Architecture highlights

### Route resolver (`shared/routeResolver.js`)

Single function turns any URL string into `{ screen, params }`. Used by both apps and covered by:

```bash
node shared/routeResolver.test.js
```

### Cold-start buffer (native)

`DeepLinkManager` stores the incoming URL in `pendingDeepLink` until React Native calls `DeepLinkModule.notifyNavigationReady()` from `NavigationContainer` `onReady`. Then the URL is emitted to JS — fixes the 1–3s race on cold start.

### In-app browser interstitial (`web/assets/router.js`)

Detects Instagram/Facebook UA and shows **Open in QuickCart** (`quickcart://`) plus Safari instructions (Scenario E).

---

## Demo script (~10 min)

| Scenario | Setup | Action | Expected |
|----------|-------|--------|----------|
| **A** | QuickCart installed | Tap `.../product/milk-1l` in iMessage | QuickCart → Amul Milk |
| **B** | Only ShopCart installed | Same link | ShopCart → QuickCart Tab → product |
| **C** | Neither app | Link → web → install QuickCart → open | Branch → product screen |
| **D** | Both installed | Same link | QuickCart opens* |
| **E** | Web in IG/FB in-app browser | Open fallback URL | Yellow banner → **Open in QuickCart** |

\*When both apps claim the same path, iOS may show a chooser; last-used app often wins. For a clean D demo, open QuickCart once from the link, or temporarily uninstall ShopCart.

---

## Build order (how this repo was structured)

1. QuickCart UI + navigation  
2. `routeResolver` + tests  
3. `web/` fallback  
4. AASA  
5. Associated Domains + entitlements  
6. AppDelegate + `DeepLinkManager` + RN bridge  
7. ShopCart + QuickCart Tab  
8. Dual-app priority testing  
9. In-app browser interstitial  
10. Branch in QuickCart  

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Link opens Safari only | AASA reachable, no redirect, correct Team ID, Associated Domains capability |
| App opens to Home | `notifyNavigationReady` called? Watch Xcode logs for `DeepLinkManager` |
| Branch not routing | Keys in plist + `branch.json`, first launch after install, dashboard link config |
| Custom scheme ignored | `CFBundleURLTypes` in Info.plist, tap button on web interstitial |

---

## Bundle IDs

- QuickCart: `com.flipkartpoc.quickcart`
- ShopCart: `com.flipkartpoc.shopcart`

Built for learning and live demo — not production Flipkart Minutes code.
