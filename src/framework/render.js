const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

function render(component, container, place = RenderPosition.BEFOREEND) {
  if (component && typeof component.getElement === 'function') {
    const element = component.getElement();
    if (element && container) {
      container.insertAdjacentElement(place, element);
    }
  }
}

export { RenderPosition, createElement, render };