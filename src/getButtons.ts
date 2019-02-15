import { make } from './make';

const OK_ID = 'ok_id';
const GITHUB_PR_COMMENT_LINK_ID = 'gh_pr_comment_link';
const CLIPPY_CHOICE_NAME = 'clippy_query';
const GITHUB_PR_COMMENT_HELP_LINK =
  'https://help.github.com/articles/commenting-on-a-pull-request/';

export function refuseSuggestion(
  noButton: HTMLElement,
  clippy: HTMLFieldSetElement
): () => any {
  return function() {
    const ok = getOk();
    const link = getHelpLink();
    clippy.disabled = true;

    if (noButton.parentElement) {
      noButton.parentElement.appendChild(ok);
    }

    setTimeout(() => {
      clippy.style.display = 'none';
      ok.remove();
      link.remove();
      clippy.disabled = false;
    }, 500);
  };
}

function getHelpLink() {
  const link = document.getElementById(GITHUB_PR_COMMENT_LINK_ID);
  if (!link) {
    return make('a', {
      id: GITHUB_PR_COMMENT_LINK_ID,
      href: GITHUB_PR_COMMENT_HELP_LINK,
      innerText: 'Help: comments and PRs',
      target: '_blank'
    });
  } else {
    return link;
  }
}

function getOk() {
  const ok = document.getElementById(OK_ID);
  if (!ok) {
    // 😭
    return make('span', {
      id: OK_ID,
      innerText: 'OK'
    });
  } else {
    return ok;
  }
}

export function getButtons(clippy: HTMLFieldSetElement) {
  const YES_BUTTON_ID = 'yes_button_id';
  const yesButtonLabel = make('label', {
    htmlFor: YES_BUTTON_ID,
    innerText: 'Yes'
  });

  const yesButton = make('input', {
    id: YES_BUTTON_ID,
    type: 'radio',
    name: CLIPPY_CHOICE_NAME
  });

  yesButton.addEventListener('click', () => {
    const link = getHelpLink();
    if (yesButton.parentElement) {
      yesButton.parentElement.appendChild(link);
    }
  });

  const NO_BUTTON_ID = 'no_button_id';
  const noButtonLabel = make('label', {
    htmlFor: NO_BUTTON_ID,
    innerText: 'No'
  });
  const noButton = make('input', {
    id: NO_BUTTON_ID,
    type: 'radio',
    name: CLIPPY_CHOICE_NAME
  });
  noButton.addEventListener('click', refuseSuggestion(noButton, clippy));

  return {
    yes: [yesButton, yesButtonLabel],
    no: [noButton, noButtonLabel]
  };
}
