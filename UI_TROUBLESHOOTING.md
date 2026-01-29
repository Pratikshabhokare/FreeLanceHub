# UI Not Visible - Troubleshooting Guide

## Problem
The frontend UI is not visible in the browser when accessing `http://localhost:5173`

## Quick Checks

### 1. Verify Servers are Running
```powershell
# Check if ports are open
Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 5173 -or $_.LocalPort -eq 8082}
```

Expected output: Should show `LISTEN` state for both ports

### 2. Check Browser Console
1. Open browser to `http://localhost:5173`
2. Press `F12` to open DevTools
3. Click the **Console** tab
4. Look for red error messages
5. Take a screenshot and share

### 3. Check Browser Network Tab
1. In DevTools, click the **Network** tab
2. Refresh the page (`Ctrl+R`)
3. Look at the first request (probably `/` or `/index.html`)
4. What is the status code? (Should be 200)

### 4. View Page Source
1. In browser, press `Ctrl+U`
2. You should see HTML with:
   ```html
   <div id="root"></div>
   <script type="module" src="/src/main.jsx"></script>
   ```
3. If you see this, React should load

### 5. Check for White Screen of Death
Sometimes the page loads but appears blank. In browser console, type:
```javascript
document.getElementById('root').innerHTML
```

If it returns a long string, React is working but CSS might be hiding content.

### 6. Test with Minimal Component
Replace `App.jsx` content temporarily with:
```javascript
export default function App() {
  return <div style={{color: 'red', fontSize: '48px', padding: '50px'}}>HELLO WORLD TEST</div>
}
```

If you see "HELLO WORLD TEST" in red, the issue is with your components, not React itself.

## Common Causes

### Cause 1: CSS Hiding Everything
**Symptom**: Page loads, but nothing visible  
**Check**: 
```css
/* Look in index.css or App.css for: */
body { display: none; }  /* BAD */
#root { opacity: 0; }    /* BAD */
* { visibility: hidden; } /* BAD */
```

### Cause 2: JavaScript Error During Mount
**Symptom**: Blank white page  
**Check**: Browser console for errors like:
- `Cannot read property 'map' of undefined`
- `X is not a function`
- Import/export errors

### Cause 3: Missing Font Awesome Icons
**Symptom**: Console shows 404 errors for FontAwesome  
**Fix**: Add to `index.html` `<head>`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

### Cause 4: Router Issue
**Symptom**: `/` route not matching any component  
**Check**: `App.jsx` should have:
```javascript
<Route path="/" element={<LandingPage />} />
```

### Cause 5: Build Cache Issue
**Fix**: Stop frontend (Ctrl+C) and run:
```powershell
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

## Step-by-Step Diagnosis

1. **Open DevTools** (F12)
2. **Go to Elements tab**
3. **Find** `<div id="root">`
4. **Expand** it
5. **What do you see?**
   - Empty `<div id="root"></div>` → React not mounting
   - Lots of HTML → React is mounted, CSS issue
   - Error message → Component crash

## If React is NOT Mounting

Check `src/main.jsx`:
```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

## If React IS Mounted but Nothing Visible

### Check 1: Body Background
In browser console:
```javascript
document.body.style.background = 'yellow';
```
Can you see yellow? If yes, content might be white on white.

### Check 2: Force Visibility
```javascript
document.querySelectorAll('*').forEach(el => {
  el.style.visibility = 'visible';
  el.style.display = 'block';
  el.style.opacity = '1';
});
```

## Emergency Fix: Revert Everything

If nothing works, revert recent changes:

```powershell
# Stop servers
taskkill /F /IM node.exe
taskkill /F /IM java.exe

# Git status
cd d:\movie\project\FreeLanceHub\FreeLanceHub_Frontend
git status

# See what changed
git diff

# Revert if needed (CAREFUL - this discards changes)
# git restore .
```

## Files Recently Modified (Potential Culprits)

1. `MyJobsPage.jsx` - NEW file, might have syntax error
2. `StatusBadge.jsx` - Just modified
3. `App.jsx` - Added new route

## Next Steps

1. Send me a screenshot of:
   - Browser showing blank page
   - Browser DevTools Console tab
   - Browser DevTools Network tab

2. Tell me:
   - Can you see **anything** on the page? (navbar, footer, text?)
   - Or is it completely blank/white?
   - Any error messages in console?

3. Try the "HELLO WORLD TEST" above

---

**Last Updated**: January 29, 2026, 12:24 AM IST
