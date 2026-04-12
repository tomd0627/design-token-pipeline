export function initDownloadButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-download-target]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-download-target");
      const filename = btn.getAttribute("data-download-filename");
      if (!targetId || !filename) return;

      const source = document.getElementById(targetId);
      if (!source) return;

      const content = source.textContent ?? "";
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);

      showDownloadedState(btn);
    });
  });
}

function showDownloadedState(btn: HTMLButtonElement): void {
  const label = btn.querySelector<HTMLElement>(".download-btn__label");
  const originalLabel = label?.textContent ?? "Download";
  const originalAriaLabel = btn.getAttribute("aria-label") ?? "";

  btn.classList.add("download-btn--done");
  btn.setAttribute("aria-label", "File downloaded");
  if (label) label.textContent = "Downloaded!";

  setTimeout(() => {
    btn.classList.remove("download-btn--done");
    btn.setAttribute("aria-label", originalAriaLabel);
    if (label) label.textContent = originalLabel;
  }, 2000);
}
