export function getScroll(element: HTMLElement | null) {
  if (element === null) {
    return NaN;
  }
  // returns the position of the top scroll thumb in relation to the scrollbar
  return element.scrollTop;
}

export function getScrollBottom(element: HTMLElement | null) {
  if (element === null) {
    return NaN;
  }
  // returns the position of the bottom scroll thumb in relation to the scrollbar
  return element.scrollTop + element.offsetHeight;
}

export function setScrollPercentage(
  element: HTMLElement | null,
  scroll: number
) {
  if (element === null) {
    return;
  }
  element.scrollTop = scroll;
}

export function setScrolBottom(element: HTMLElement | null, scroll: number) {
  if (element === null) {
    return;
  }
  element.scrollTop = scroll - element.offsetHeight;
}
