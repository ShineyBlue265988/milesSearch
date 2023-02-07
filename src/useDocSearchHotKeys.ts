import { Accessor, onCleanup, onMount } from "solid-js";

export function useDocSearchHotKeys({
  isOpen,
  onOpen,
  onClose,
  onInput,
}: {
  isOpen: Accessor<boolean>;
  onOpen: () => void;
  onClose: () => void;
  onInput: (query: string) => void;
}) {
  function isEditingContent(event: KeyboardEvent): boolean {
    const element = event.target as HTMLElement;
    const tagName = element.tagName;

    return (
      element.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "SELECT" ||
      tagName === "TEXTAREA"
    );
  }

  function onKeyDown(e: KeyboardEvent) {
    if (
      (e.key === "Escape" && isOpen()) ||
      // The `Cmd+K` shortcut both opens and closes the modal.
      (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) ||
      // The `/` or `s` shortcut opens but doesn't close the modal because it's
      // a character.
      (!isEditingContent(e) && (e.key === "/" || e.key === "s") && !isOpen())
    ) {
      e.preventDefault();
      if (isOpen()) {
        onClose();
      } else {
        const selectedText = window.getSelection();
        if (selectedText) onInput(selectedText.toString());
        onOpen();
      }
    }
  }

  onMount(() => window.addEventListener("keydown", onKeyDown));
  onCleanup(() => window.removeEventListener("keydown", onKeyDown));
}
