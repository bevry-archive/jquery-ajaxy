<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jQuery Ajaxy - Eggplants</title>
	<base href="../" />
</head>
<body>
	<div id="eggplants">
		<? if ( !empty($_POST['yesno']) ) : ?>
			<? if ( $_POST['yesno'] === 'Yes' ) : ?>
				:-O you know eggplant is a vegetable right?
			<? else: ?>
				You sure know your stuff ;-)
			<? endif; ?>
		<? else: ?>
			<form action="./pages/eggplants.php" method="post" class="ajaxy ajaxy-page">
				Would you say that eggplants came from eggs?<br/>
				<label><input type="radio" name="yesno" value="Yes" checked="checked" /> Yes</label><br/>
				<label><input type="radio" name="yesno" value="No" /> No</label><br/>
				<input type="submit" name="submit" />
			</form>
		<? endif; ?>
		If this form does not submit properly, it is because the server this is hosted on does not support AJAX POST requests.
	</div>
</body>
</html>