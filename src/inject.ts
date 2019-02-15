import { make, wrap } from './make';
import { getButtons } from './getButtons';

const COMMENT_FIELD_ID = 'new_comment_field';
const CLIPPY_ID = 'clippy_id';
const CLIPPY_IMAGE_PATH = 'images/clippy.png';

const getClippy = (): HTMLFieldSetElement => {
  return document.getElementById(CLIPPY_ID)! as HTMLFieldSetElement;
};

const getTextarea = () => {
  return document.getElementById(COMMENT_FIELD_ID) as HTMLTextAreaElement;
};

const showClippy = () => {
  const clippy = getClippy();
  clippy.style.display = 'inline-block';
};

function getDontShow() {
  const DONT_SHOW_ID = 'dont_show_id';
  const dontShow = make('input', {
    type: 'checkbox',
    id: DONT_SHOW_ID
  });

  const dontShowLabel = make('label', {
    htmlFor: DONT_SHOW_ID,
    innerText: "Don't show me this tip again."
  });

  dontShow.addEventListener('click', () => {
    getTextarea().removeEventListener('focus', showClippy);
  });

  return [dontShow, dontShowLabel];
}

function initClippy() {
  const clippy = make('fieldset', {
    id: CLIPPY_ID,
    className: 'clippy-wrapper'
  });
  clippy.style.display = 'none';

  const query = "It looks like you're trying to comment on a pull request.";
  const queryElement = make('p', { innerText: query });

  const { yes: yesButtonItems, no: noButtonItems } = getButtons(clippy);
  const dontShowButtonItems = getDontShow();

  // @ts-ignore
  const img = make('img', { src: chrome.runtime.getURL(CLIPPY_IMAGE_PATH) });

  clippy.append(
    queryElement,
    make('p', { innerText: 'Would you like help?' }),
    wrap('div', { className: 'input-wrapper' })(...yesButtonItems),
    wrap('div', { className: 'input-wrapper' })(...noButtonItems),
    wrap('div', { className: 'input-wrapper' })(...dontShowButtonItems),
    wrap('div', { className: 'clippy_img' })(img)
  );

  return clippy;
}

function addClippy() {
  const clippy = initClippy();
  const textarea = getTextarea();

  if (textarea && textarea.form) {
    textarea.form.style.position = 'relative';
    textarea.form.append(clippy);
    textarea.addEventListener('focus', showClippy);
  }

  textarea.parentElement!.style.backgroundColor ='plum';
}

document.addEventListener('DOMContentLoaded', addClippy);
