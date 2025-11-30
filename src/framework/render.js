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
  if (!component || !container) {
    console.error('❌ Render error: component or container is null', { component, container });
    return;
  }

  if (typeof component.getElement !== 'function') {
    console.error('❌ Render error: component.getElement is not a function', component);
    return;
  }

  const element = component.getElement();
  if (!element) {
    console.error('❌ Render error: component.getElement() returned null', component);
    return;
  }

  if (place && container) {
    container.insertAdjacentElement(place, element);
  } else {
    container.appendChild(element);
  }
}

export { RenderPosition, createElement, render };