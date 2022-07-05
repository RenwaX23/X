<head><meta name="charset" content="utf8"></head>
<?php
isset($_GET['source']) && highlight_file(__FILE__) && die();

$x="x"; 

if(isset($_GET['x'])){
$x=$_GET['x'];
}

$x=str_replace("=", "", $x);
$x=str_replace("\"", "", $x);
$x=preg_replace('/<script/i', "<nope>", $x);
$x=substr($x, 0,35);
echo $x;

?>

<!-- ?source -->
<script>
console.log("<?=$x?>");
</script>