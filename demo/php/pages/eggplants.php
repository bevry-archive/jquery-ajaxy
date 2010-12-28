<title>jQuery Ajaxy - Eggplants</title>
<div id="eggplants">
	<? if ( !empty($_POST['yesno']) ) : ?>
		<? if ( $_POST['yesno'] === 'Yes' ) : ?>
			:-O you know eggplant is a vegetable right?
		<? else: ?>
			You sure know your stuff ;-)
		<? endif; ?>
	<? else: ?>
		<form action="?page=eggplants" method="post" class="ajaxy ajaxy-page">
			Would you say that eggplants came from eggs?<br/>
			<label><input type="radio" name="yesno" value="Yes" checked="checked" /> Yes</label><br/>
			<label><input type="radio" name="yesno" value="No" /> No</label><br/>
			<input type="submit" name="submit" />
		</form>
	<? endif; ?>
</div>