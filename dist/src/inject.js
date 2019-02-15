function make(elementType, attributesObject) {
    const element = document.createElement(elementType);
    for (const attributeKey in attributesObject) {
        element[attributeKey] = attributesObject[attributeKey];
    }
    return element;
}
function wrap(elementType, attributesObject) {
    return (...whatToWrap) => {
        const element = make(elementType, attributesObject);
        element.append(...whatToWrap);
        return element;
    };
}

const OK_ID = 'ok_id';
const GITHUB_PR_COMMENT_LINK_ID = 'gh_pr_comment_link';
const CLIPPY_CHOICE_NAME = 'clippy_query';
const GITHUB_PR_COMMENT_HELP_LINK = 'https://help.github.com/articles/commenting-on-a-pull-request/';
function refuseSuggestion(noButton, clippy) {
    return function () {
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
    }
    else {
        return link;
    }
}
function getOk() {
    const ok = document.getElementById(OK_ID);
    if (!ok) {
        return make('span', {
            id: OK_ID,
            innerText: 'OK'
        });
    }
    else {
        return ok;
    }
}
function getButtons(clippy) {
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

const COMMENT_FIELD_ID = 'new_comment_field';
const CLIPPY_ID = 'clippy_id';
const CLIPPY_IMAGE_PATH = 'images/clippy.png';
const getClippy = () => {
    return document.getElementById(CLIPPY_ID);
};
const getTextarea = () => {
    return document.getElementById(COMMENT_FIELD_ID);
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
    const img = make('img', { src: chrome.runtime.getURL(CLIPPY_IMAGE_PATH) });
    clippy.append(queryElement, make('p', { innerText: 'Would you like help?' }), wrap('div', { className: 'input-wrapper' })(...yesButtonItems), wrap('div', { className: 'input-wrapper' })(...noButtonItems), wrap('div', { className: 'input-wrapper' })(...dontShowButtonItems), wrap('div', { className: 'clippy_img' })(img));
    return clippy;
}
function addClippy() {
    console.log('hi');
    const clippy = initClippy();
    const textarea = getTextarea();
    if (textarea && textarea.form) {
        textarea.form.style.position = 'relative';
        textarea.form.append(clippy);
        textarea.addEventListener('focus', showClippy);
    }
    textarea.parentElement.style.backgroundColor = 'plum';
}
document.addEventListener('DOMContentLoaded', addClippy);
