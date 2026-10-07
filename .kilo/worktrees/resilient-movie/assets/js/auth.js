/* ============================================================
   CRAFTWORK ATELIER - AUTHENTICATION (login.html + register.html)
   Frontend-only validation + flows. No backend. No fake OAuth.
   Requires: main.js (Toast) loaded before this file.
   ============================================================ */
(function () {
  "use strict";

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRe = /^[+\d][\d\s().-]{6,}$/;

  function toast(msg, type) {
    if (window.Toast) window.Toast.show(msg, type || "info");
  }

  function setErr(input, msg) {
    input.classList.add("error");
    var wrap = input.closest(".form-group");
    var err = wrap ? wrap.querySelector(".form-error") : null;
    if (err) { err.textContent = msg; err.classList.add("show"); }
  }

  function clearForm(form) {
    form.querySelectorAll(".error").forEach(function (el) { el.classList.remove("error"); });
    form.querySelectorAll(".form-error.show").forEach(function (el) { el.classList.remove("show"); });
  }

  function checkRequired(input) {
    if (!input.value.trim()) { setErr(input, "This field is required."); return false; }
    return true;
  }

  function checkEmail(input) {
    if (!checkRequired(input)) return false;
    if (!emailRe.test(input.value.trim())) { setErr(input, "Please enter a valid email address."); return false; }
    return true;
  }

  function setLoading(btn, loading, label) {
    if (loading) {
      btn.dataset.label = btn.textContent;
      btn.textContent = label;
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.label || btn.textContent;
      btn.disabled = false;
    }
  }

  /* ── Password visibility toggles ─────────────────────────── */
  var eyeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var eyeOffSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  document.querySelectorAll("[data-pw-toggle]").forEach(function (btn) {
    btn.innerHTML = eyeSvg;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("data-pw-toggle"));
      if (!input) return;
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? eyeOffSvg : eyeSvg;
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus();
    });
  });

  /* ── Login ───────────────────────────────────────────────── */
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    var loginEmail = document.getElementById("login-email");
    var loginRemember = document.getElementById("login-remember");
    try {
      var saved = localStorage.getItem("ca_remember_email");
      if (saved && loginEmail) { loginEmail.value = saved; if (loginRemember) loginRemember.checked = true; }
    } catch (e) { /* storage unavailable */ }
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearForm(loginForm);
      var ok = checkEmail(loginEmail);
      var pw = document.getElementById("login-password");
      if (!checkRequired(pw)) ok = false;
      if (!ok) return;
      try {
        if (loginRemember && loginRemember.checked) localStorage.setItem("ca_remember_email", loginEmail.value.trim());
        else localStorage.removeItem("ca_remember_email");
      } catch (err) { /* storage unavailable */ }
      var btn = loginForm.querySelector('[type="submit"]');
      setLoading(btn, true, "Signing In...");
      setTimeout(function () {
        setLoading(btn, false);
        toast("Welcome back! Signing you in...", "success");
        setTimeout(function () { window.location.href = "index.html"; }, 900);
      }, 900);
    });

    var forgot = document.getElementById("forgot-password");
    if (forgot && loginEmail) {
      forgot.addEventListener("click", function () {
        if (loginEmail.value.trim() && emailRe.test(loginEmail.value.trim())) {
          toast("If an account exists for " + loginEmail.value.trim() + ", a reset link is on its way.", "success");
        } else {
          toast("Enter your email address first, then try again.", "error");
          loginEmail.focus();
        }
      });
    }
  }

  /* ── Signup ──────────────────────────────────────────────── */
  var regForm = document.getElementById("register-form");
  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearForm(regForm);
      var ok = true;
      if (!checkRequired(document.getElementById("reg-name"))) ok = false;
      if (!checkEmail(document.getElementById("reg-email"))) ok = false;
      var phone = document.getElementById("reg-phone");
      if (phone && phone.value.trim() && !phoneRe.test(phone.value.trim())) {
        setErr(phone, "Please enter a valid phone number."); ok = false;
      }
      var pw = document.getElementById("reg-password");
      if (!checkRequired(pw)) ok = false;
      else if (pw.value.length < 8) { setErr(pw, "Password must be at least 8 characters."); ok = false; }
      var pw2 = document.getElementById("reg-confirm");
      if (!checkRequired(pw2)) ok = false;
      else if (pw.value && pw2.value !== pw.value) { setErr(pw2, "Passwords do not match."); ok = false; }
      var terms = document.getElementById("reg-terms");
      if (terms && !terms.checked) {
        terms.classList.add("error");
        var wrap = terms.closest(".form-group") || terms.parentElement;
        var err = wrap ? wrap.querySelector(".form-error") : null;
        if (err) { err.textContent = "Please accept the Terms & Privacy Policy to continue."; err.classList.add("show"); }
        ok = false;
      }
      if (!ok) return;
      var btn = regForm.querySelector('[type="submit"]');
      setLoading(btn, true, "Creating Account...");
      setTimeout(function () {
        setLoading(btn, false);
        toast("Account created! Please sign in to continue.", "success");
        setTimeout(function () { window.location.href = "login.html"; }, 1100);
      }, 1100);
    });
  }

})();
