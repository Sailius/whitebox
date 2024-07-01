import tippy, { type Props } from 'tippy.js';

export const createTippy = (node: HTMLElement, options: Partial<Props>) => {
    const instance = tippy(node, options);

    return instance;
};

export const standardTippy: Partial<Props> = {
    arrow: true,
    theme: 'standard',
    duration: 0,
    maxWidth: 150,
    trigger: 'manual',
    hideOnClick: false,
    allowHTML: true
};

// Generate fancy content-block with errors for tippy.
export const getErrorsBlock = (errors: string[]) => {
    let content: string = '';
    errors.forEach((problem) => {
        content += `<div><br /></div><div>${problem}!</div>`;
    });

    // Delete the first <div><br /></div>.
    return content.slice(17);
};
