// Source code of my challenge https://twitter.com/RenwaX23/status/1203058022102253568?s=20
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
<?php

$slaw='https://google.com';
$jj = $slaw;
if(isset($_GET['x'])){
$slaw=$_GET['x'];
}
else{
       echo '<a href="?x=https://google.com">OK</a><br>';
}

$l=strpos($slaw,':');

if(substr($slaw,$l,13)!="://google.com" || substr($slaw,0,10)=="javascript"){
       die("NO");
}


$slaw = str_replace('%','',$slaw);
$slaw = str_replace('\'','',$slaw);
$slaw = str_replace('"','',$slaw);
$slaw = str_replace('>','',$slaw);
$slaw = str_replace('<','',$slaw);
$slaw = trim(preg_replace('/\s+/', '', $slaw));

echo '<a id=j href="'.$slaw.'">JJ</a>';

?>

<script>setTimeout(function(){j.click()},2000);</script>
</body>
</html>
