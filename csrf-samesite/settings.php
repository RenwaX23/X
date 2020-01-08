<?php
if (!isset($_COOKIE['session'])) {
	die('<h1>CSRF error or not logged in</h1>');
}
?>

<?php 
if (isset($_POST['new_name'])) {
	$username=$_POST['new_name'];
	$safe_username=htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
     echo('<script>document.cookie="session='.$safe_username.'";alert("Username Changed")</script>');
	 
}
?>
<!DOCTYPE html>
<html>
<head>
<script>
window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
</script>
<style>
div{ border-style: dashed; border-width: 5px; margin: 70px; padding: 20px; } h1{ font-family:"Comic Sans MS"; color:blue; display: inline; } #user{ color:magenta; } 
</style>
</head>

<body>

<center><br><br><br><br>
<div>
<h1>Change Your username</h1></h1><br>
<br>

<form method=post>
<input id=useri name=new_name>&nbsp;
<input type=submit value=Change>
</form>

<h3>
<a href="index.html">Home</a>
</h3>
</div>
</center>

</body>
<script>
if(!getCookie('session')){
document.body.innerHTML='<h1>Please login first</h1>';
}
else{
var username=getCookie('session');
document.getElementById('useri').value=username;}
</script>
</html>