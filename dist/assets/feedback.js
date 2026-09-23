(function () {
  "use strict";

  // Builds the mailto: URL for the feedback form. Kept as a standalone named
  // function (the address is passed in, never a literal here) so it can be
  // exercised in isolation without a DOM.
  function buildFeedbackMailto(address, fields) {
    var subject = "GridTheory feedback: " + fields.category;
    var body = [
      "Category: " + fields.category,
      "Device: " + fields.device,
      "iOS version: " + fields.ios,
      "App version: " + fields.appVersion,
      "",
      "Message:",
      fields.message
    ].join("\n");

    return (
      "mailto:" + encodeURIComponent(address) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body)
    );
  }

  function fallback(value) {
    var trimmed = (value || "").trim();
    return trimmed.length ? trimmed : "(not given)";
  }

  function init() {
    var form = document.getElementById("feedback-form");
    if (!form) return;

    var address = form.getAttribute("data-support-email");
    var link = form.querySelector("[data-support-email-link]");
    if (link && address) {
      link.href = "mailto:" + encodeURIComponent(address);
      link.textContent = address;
    }

    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var category = (form.elements.category.value || "").trim();
      var message = (form.elements.message.value || "").trim();

      if (!category || !message) {
        if (status) {
          status.textContent = "Please choose a category and add a message before sending.";
        }
        return;
      }

      var url = buildFeedbackMailto(address, {
        category: category,
        device: fallback(form.elements.device.value),
        ios: fallback(form.elements.ios.value),
        appVersion: fallback(form.elements.appVersion.value),
        message: message
      });

      if (status) {
        status.textContent = "Opening your mail app…";
      }
      window.location.href = url;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildFeedbackMailto: buildFeedbackMailto };
  }
})();
