(function () {
	function selectTextFromTarget(selector) {
		try {
			var el = document.querySelector(selector);
			if (!el) return null;
			if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
				return el.value;
			}
			return (el.textContent || "").trim();
		} catch (_) {
			return null;
		}
	}

	function copyText(text) {
		if (!text) return Promise.reject(new Error("No text to copy"));
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(text);
		}
		// Fallback
		return new Promise(function (resolve, reject) {
			try {
				var textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.style.position = "fixed";
				textarea.style.opacity = "0";
				document.body.appendChild(textarea);
				textarea.focus();
				textarea.select();
				var ok = document.execCommand("copy");
				document.body.removeChild(textarea);
				ok ? resolve() : reject(new Error("execCommand failed"));
			} catch (err) {
				reject(err);
			}
		});
	}

	function setState(btn, state) {
		var iconClipboard = btn.querySelector('[data-icon="clipboard"]');
		var iconCheck = btn.querySelector('[data-icon="check"]');
		var status = btn.querySelector('[data-role="status"]');
		var labelDefault = btn.getAttribute("data-clipboard-label") || "Copy to clipboard";
		var labelSuccess = btn.getAttribute("data-clipboard-success-label") || "Copied";
		if (state === "success") {
			if (iconClipboard) iconClipboard.classList.add("hidden");
			if (iconCheck) iconCheck.classList.remove("hidden");
			btn.setAttribute("aria-label", labelSuccess);
			if (status) status.textContent = labelSuccess;
		} else {
			if (iconClipboard) iconClipboard.classList.remove("hidden");
			if (iconCheck) iconCheck.classList.add("hidden");
			btn.setAttribute("aria-label", labelDefault);
			if (status) status.textContent = "";
		}
	}

	function bounceOnce(btn) {
		btn.classList.add("animate-bounce");
		// Remove after one cycle
		setTimeout(function () {
			btn.classList.remove("animate-bounce");
		}, 700);
	}

	function handleClick(event) {
		var btn = event.currentTarget;
		if (btn.getAttribute("data-busy") === "1") return;
		btn.setAttribute("data-busy", "1");

		var text = btn.getAttribute("data-clipboard-text");
		if (!text) {
			var selector = btn.getAttribute("data-clipboard-target");
			if (selector) {
				text = selectTextFromTarget(selector) || "";
			}
		}

		copyText(text)
			.then(function () {
				bounceOnce(btn);
				setState(btn, "success");
				var dur = parseInt(btn.getAttribute("data-clipboard-success-duration") || "1200", 10);
				setTimeout(function () {
					setState(btn, "default");
					btn.removeAttribute("data-busy");
				}, isNaN(dur) ? 1200 : dur);
			})
			.catch(function () {
				// Brief visual nudge even on failure
				bounceOnce(btn);
				btn.removeAttribute("data-busy");
			});
	}

	function init() {
		var buttons = document.querySelectorAll(".clipboard-btn");
		buttons.forEach(function (btn) {
			btn.addEventListener("click", handleClick);
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();


