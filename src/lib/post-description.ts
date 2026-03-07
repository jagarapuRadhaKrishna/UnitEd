export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 2000;

const HAS_HTML_TAGS = /<\/?[a-z][\s\S]*>/i;
const MEANINGFUL_TEXT_PATTERN = /[\p{L}\p{N}]/u;

const createDocument = () => document.implementation.createHTMLDocument('post-description');

const appendChildren = (source: Node, target: Node, doc: Document) => {
  Array.from(source.childNodes).forEach((child) => {
    sanitizeNode(child, doc).forEach((sanitized) => target.appendChild(sanitized));
  });
};

const wrapInlineChildrenInParagraph = (source: Element, doc: Document) => {
  const paragraph = doc.createElement('p');
  appendChildren(source, paragraph, doc);
  if (!paragraph.childNodes.length) {
    paragraph.appendChild(doc.createElement('br'));
  }
  return paragraph;
};

const sanitizeNode = (node: Node, doc: Document): Node[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent || '')];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === 'br') {
    return [doc.createElement('br')];
  }

  if (tag === 'strong' || tag === 'b') {
    const strong = doc.createElement('strong');
    appendChildren(element, strong, doc);
    return [strong];
  }

  if (tag === 'u') {
    const underline = doc.createElement('u');
    appendChildren(element, underline, doc);
    return [underline];
  }

  if (tag === 's' || tag === 'strike' || tag === 'del') {
    const strike = doc.createElement('s');
    appendChildren(element, strike, doc);
    return [strike];
  }

  if (tag === 'a') {
    const href = normalizeDescriptionUrl(element.getAttribute('href') || '');
    if (!href) {
      return sanitizeChildren(element, doc);
    }

    const anchor = doc.createElement('a');
    anchor.setAttribute('href', href);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
    appendChildren(element, anchor, doc);

    if (!anchor.textContent?.trim()) {
      anchor.textContent = href;
    }

    return [anchor];
  }

  if (tag === 'ul') {
    const list = doc.createElement('ul');
    Array.from(element.childNodes).forEach((child) => {
      const sanitizedChildren = sanitizeNode(child, doc);
      sanitizedChildren.forEach((sanitized) => {
        if (sanitized.nodeType === Node.ELEMENT_NODE && (sanitized as Element).tagName.toLowerCase() === 'li') {
          list.appendChild(sanitized);
          return;
        }

        if ((sanitized.textContent || '').trim()) {
          const li = doc.createElement('li');
          li.appendChild(sanitized);
          list.appendChild(li);
        }
      });
    });

    return list.childNodes.length ? [list] : [];
  }

  if (tag === 'li') {
    const item = doc.createElement('li');
    appendChildren(element, item, doc);
    if (!item.childNodes.length) {
      item.appendChild(doc.createElement('br'));
    }
    return [item];
  }

  if (tag === 'p' || tag === 'div') {
    return [wrapInlineChildrenInParagraph(element, doc)];
  }

  return sanitizeChildren(element, doc);
};

const sanitizeChildren = (element: Element, doc: Document) => {
  const fragment = doc.createDocumentFragment();
  appendChildren(element, fragment, doc);
  return Array.from(fragment.childNodes);
};

const ensureTopLevelBlocks = (container: HTMLElement, doc: Document) => {
  const normalizedRoot = doc.createElement('div');
  let looseParagraph: HTMLParagraphElement | null = null;

  Array.from(container.childNodes).forEach((child) => {
    const element = child.nodeType === Node.ELEMENT_NODE ? (child as HTMLElement) : null;
    const isBlock =
      element &&
      ['p', 'ul'].includes(element.tagName.toLowerCase());

    if (isBlock) {
      looseParagraph = null;
      normalizedRoot.appendChild(child.cloneNode(true));
      return;
    }

    if (!looseParagraph) {
      looseParagraph = doc.createElement('p');
      normalizedRoot.appendChild(looseParagraph);
    }

    looseParagraph.appendChild(child.cloneNode(true));
  });

  Array.from(normalizedRoot.querySelectorAll('p')).forEach((paragraph) => {
    if (!paragraph.childNodes.length) {
      paragraph.appendChild(doc.createElement('br'));
    }
  });

  return normalizedRoot.innerHTML;
};

const normalizeLineBreaks = (value: string) => value.replace(/\r\n?/g, '\n');

export const normalizeDescriptionUrl = (value: string) => {
  const raw = value.trim();
  if (!raw) return null;

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
};

export const sanitizeDescriptionHtml = (value: string | null | undefined) => {
  if (!value) return '';

  const source = createDocument();
  const container = source.createElement('div');
  container.innerHTML = value;

  const sanitized = source.createElement('div');
  Array.from(container.childNodes).forEach((child) => {
    sanitizeNode(child, source).forEach((node) => sanitized.appendChild(node));
  });

  return ensureTopLevelBlocks(sanitized, source);
};

export const convertPlainTextToDescriptionHtml = (value: string | null | undefined) => {
  const raw = normalizeLineBreaks(value || '');
  if (!raw.trim()) return '';

  const doc = createDocument();
  const container = doc.createElement('div');

  raw.split('\n').forEach((line) => {
    const paragraph = doc.createElement('p');
    if (line) {
      paragraph.textContent = line;
    } else {
      paragraph.appendChild(doc.createElement('br'));
    }
    container.appendChild(paragraph);
  });

  return container.innerHTML;
};

export const toDescriptionEditorHtml = (value: string | null | undefined) => {
  const raw = value || '';
  if (!raw.trim()) return '';
  return HAS_HTML_TAGS.test(raw) ? sanitizeDescriptionHtml(raw) : convertPlainTextToDescriptionHtml(raw);
};

export const getDescriptionPlainText = (value: string | null | undefined) => {
  if (!value) return '';

  const doc = createDocument();
  const container = doc.createElement('div');
  container.innerHTML = toDescriptionEditorHtml(value);

  const parts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent || '');
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const tag = (node as HTMLElement).tagName.toLowerCase();
    if (tag === 'br') {
      parts.push('\n');
      return;
    }

    Array.from(node.childNodes).forEach(walk);

    if (['p', 'li'].includes(tag)) {
      parts.push('\n');
    }
  };

  Array.from(container.childNodes).forEach(walk);
  return parts.join('').replace(/\u00a0/g, ' ');
};

export const getDescriptionCharacterCount = (value: string | null | undefined) =>
  getDescriptionPlainText(value).replace(/\s+/g, ' ').trim().length;

export const getDescriptionPreviewText = (value: string | null | undefined) =>
  getDescriptionPlainText(value).replace(/\s+/g, ' ').trim();

export const validateDescriptionHtml = (value: string | null | undefined) => {
  const plainText = getDescriptionPlainText(value).replace(/\s+/g, ' ').trim();

  if (!plainText) {
    return 'Description is required';
  }

  if (!MEANINGFUL_TEXT_PATTERN.test(plainText)) {
    return 'Please enter a meaningful description';
  }

  if (plainText.length < DESCRIPTION_MIN_LENGTH) {
    return `Please enter at least ${DESCRIPTION_MIN_LENGTH} characters`;
  }

  if (plainText.length > DESCRIPTION_MAX_LENGTH) {
    return `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`;
  }

  return null;
};

export const getDescriptionHtmlForDisplay = (value: string | null | undefined) =>
  toDescriptionEditorHtml(value);
