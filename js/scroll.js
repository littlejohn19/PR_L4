const scrollEl = document.getElementsByClassName('scroll')[0];
scrollEl.addEventListener('click', () => {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
});

window.addEventListener('scroll', () => {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		scrollEl.style.display = "block";
	} else {
		scrollEl.style.display = "none";
	}
});
