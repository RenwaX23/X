<?php
isset($_GET['source']) && highlight_file(__FILE__) && die();

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

session_name('__Host-PHPSESSID');
session_set_cookie_params(120, '/; samesite=Lax', "", true, true);
session_start();

if (!isset($_SESSION['id'])) {
    $identifier = bin2hex(random_bytes(12));
    $_SESSION['id'] = $identifier;
} else {
    $identifier = $_SESSION['id'];
}

?>
<html>

<head>
    <title>XSS Challenge</title>
    <meta name="charset" content="utf8">
    <script>
        const identifier = '<?= $identifier; ?>';
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.8/purify.min.js" referrerpolicy="no-referrer"></script>
</head>

<body>
   
                <h2>Rendered Text</h2>
                <iframe onload=render() id="iframe" src="/iframe.php"></iframe>
        <iframe style="opacity: 0; width: 20px; height: 20px" src="{{SUBDOMAIN}}"></iframe>

    <script>
        
function render(){
            const dirty = new URL(location).searchParams.get('html') || '<h1>hello world</h1>'
            const clean = DOMPurify.sanitize(dirty);
            iframe.contentWindow.postMessage({
                identifier,
                type: 'render',
                body: clean,
            }, '*');
        }

    </script>
</body>
<!-- ?source -->
</html>