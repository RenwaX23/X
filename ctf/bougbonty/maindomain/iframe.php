<?php

isset($_GET['source']) && highlight_file(__FILE__) && die();
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

session_name('__Host-PHPSESSID');
session_set_cookie_params(180, '/; samesite=Lax', "", true, true);
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
  <meta name="charset" content="utf8">
  <title>XSS Challenge render</title>
  <script>
  if(self==top) throw new Error("not from same origin");
    const identifier = '<?= $identifier; ?>';
    onmessage = e => {
      const data = e.data;
     if (data.type == "render") {
        if (data.identifier === identifier) { container.innerHTML = data.body };
      }
    }
  </script>
</head>

<body>
  <div id="container"></div>
</body>
<!-- ?source -->
</html>