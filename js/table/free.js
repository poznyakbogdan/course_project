$("button[href='#slack-for-enterprise']").click(function () {
	$("#slack-for-teams").css("display", "none");
	$("#slack-for-enterprise").css("display", "block");
});

$("button[href='#slack-for-teams']").click(function () {
	$("#slack-for-teams").css("display", "block");
	$("#slack-for-enterprise").css("display", "none");
});