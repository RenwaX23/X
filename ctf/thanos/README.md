Hard XSS Challenge - Thanos theme 

Summary: 

1. Power Stone: Send large string to offset the .lastIndex, then XSS to leak performance entry
2. Mind Stone: In `<svg>`, use `&quot;` to break out of the string and top.opener.postMessage(mindStone)
3. Reality Stone: Use data-method gadget in rails-ujs by clicking <a> through SOME attack
4. Space Stone: <?> turns into a comment to escape context, then quickly register postMessage listener to intercept the code
5. Soul Stone: Open ?eval= URL into same-origin tab named "http" running Object.defineProperty() to set document.domain, then receive the code
6. Time Stone: XS-Leak URL length after the redirect using large hash fragment triggering iframe onload=
7. Final Exploit: Running only soul first to get XSS, then let delayed 2nd tab load and send everything to it. Recover reference through postMessage .source

Writeup and walkthrough by the amazing Jorian [https://jorianwoltjer.com/blog/p/ctf/intigriti-xss-challenge/1225](https://jorianwoltjer.com/blog/p/ctf/intigriti-xss-challenge/1225)
