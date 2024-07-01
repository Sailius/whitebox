export const setOpacity = (hex: string, alpha: number) =>
    `${hex}${Math.round((255 / 100) * alpha)
        .toString(16)
        .padStart(2, '0')}`;

export const getOpacity = (color: string) => Math.round(parseInt(color.slice(-2), 16) / 255 * 100);