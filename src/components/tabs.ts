export function initTabs(): void {
  const tabContainers = document.querySelectorAll<HTMLElement>("[data-tabs]");

  tabContainers.forEach((container) => {
    const tabList = container.querySelector<HTMLElement>('[role="tablist"]');
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    if (!tabList || tabs.length === 0) return;

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (e: KeyboardEvent) => {
        let targetIndex: number | null = null;

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          targetIndex = 0;
        } else if (e.key === "End") {
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          const targetTab = tabs[targetIndex];
          activateTab(targetTab);
          targetTab.focus();
        }
      });
    });

    function activateTab(selectedTab: HTMLButtonElement): void {
      tabs.forEach((tab) => {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
        tab.classList.remove("tabs__btn--active");
      });

      panels.forEach((panel) => {
        panel.hidden = true;
      });

      selectedTab.setAttribute("aria-selected", "true");
      selectedTab.setAttribute("tabindex", "0");
      selectedTab.classList.add("tabs__btn--active");

      const panelId = selectedTab.getAttribute("aria-controls");
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
          panel.hidden = false;
        }
      }
    }
  });
}
