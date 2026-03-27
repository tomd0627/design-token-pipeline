export function initCopyButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-copy-target]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      if (!targetId) return;

      const source = document.getElementById(targetId);
      if (!source) return;

      const text = source.textContent ?? "";

      try {
        await navigator.clipboard.writeText(text);
        showCopiedState(btn);
      } catch {
        // Clipboard API failed — silently ignore in portfolio context
      }
    });
  });
}

function showCopiedState(btn: HTMLButtonElement): void {
  const label = btn.querySelector<HTMLElement>(".copy-btn__label");
  const originalLabel = label?.textContent ?? "Copy";
  const originalAriaLabel = btn.getAttribute("aria-label") ?? "";

  btn.classList.add("copy-btn--copied");
  btn.setAttribute("aria-label", "Copied to clipboard");
  if (label) label.textContent = "Copied!";

  setTimeout(() => {
    btn.classList.remove("copy-btn--copied");
    btn.setAttribute("aria-label", originalAriaLabel);
    if (label) label.textContent = originalLabel;
  }, 2000);
}
