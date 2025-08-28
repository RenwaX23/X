# Safari Address Bar Spoof via Cursor Overlap

## Summary  
Safari on macOS is vulnerable to an address bar spoofing attack caused by improper handling of custom cursor boundaries. Unlike Chrome and Firefox, Safari does not enforce a strict cursor boundary check (the so-called *Line of Death*) to prevent custom cursors from overlapping critical browser UI elements.  

By creating a large custom cursor (128x128 pixels), an attacker can overlay spoofed content directly on top of Safari’s address bar. For example, a cursor can be designed to display `icloud.com` when a user hovers over a button near the top of the page. The actual page remains under attacker control, but Safari visually misleads the user into believing they are on a trusted origin.  

This bypasses a core browser security guarantee and could be weaponized for phishing attacks.  

---

## Steps to Reproduce  (Tested on: MacBook Pro 15.4 Beta (24E5238a) and Safari Version 18.4 (20621.1.15.11.5))

1. Open Safari on macOS.  
2. Visit [https://renwax23.github.io/X/safari_cursor.html](https://renwax23.github.io/X/safari_cursor.html).  
3. Hover your mouse over the “Login to iCloud” button.  
4. Observe that the address bar appears spoofed to `icloud.com`.  

---

## Expected Behavior  
Safari should restrict custom cursors to the webpage’s rendering area, preventing overlap with browser UI elements such as the address bar.  

## Actual Behavior  
The oversized custom cursor overlaps the address bar and spoofs trusted origins like `icloud.com`.  

---

## Video Proof-of-Concept  
`IMG_1244.MOV`  

---

## Technical Details  

The vulnerability occurs because Safari fails to apply boundary checks on oversized custom cursors. By carefully positioning a cursor image, an attacker can draw arbitrary text or graphics over the browser’s UI.  

## Security Impact

- High phishing potential: attackers can spoof trusted domains like icloud.com, bank.com, or apple.com.
- Exploits user trust in Safari’s address bar as the ultimate authority of origin.

## Timeline
- Reported: 5-May-2025
- Neded more info: 19-May-2025
- Apple says this is not a vulnerability: 7-August-2025
- Public disclosue: 28-August-2025
