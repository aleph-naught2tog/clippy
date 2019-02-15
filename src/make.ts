type htmlAttributes<T extends HTMLElement> = Partial<
  { [key in keyof T]: T[key] }
>;

export function make<K extends keyof HTMLElementTagNameMap>(
  elementType: K,
  attributesObject: htmlAttributes<HTMLElementTagNameMap[K]>
): HTMLElementTagNameMap[K] {
  const element = document.createElement(elementType);

  for (const attributeKey in attributesObject) {
    // @ts-ignore
    element[attributeKey] = attributesObject[attributeKey];
  }

  return element;
}

export function wrap<K extends keyof HTMLElementTagNameMap>(
  elementType: K,
  attributesObject: htmlAttributes<HTMLElementTagNameMap[K]>
) {
  return (...whatToWrap: HTMLElement[]) => {
    const element = make(elementType, attributesObject);
    element.append(...whatToWrap);
    return element;
  };
}
