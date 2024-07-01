import { writable, type Writable } from "svelte/store";

export const transparency = writable(75);

export const changeWithTransition = (
    value: Writable<number>,
    changeTo: Writable<number> | number,
    timeForOneChange: number
) => {
    if (typeof changeTo !== 'number') {
        changeTo.subscribe((cT) => {
            value.subscribe((v) => {
                if (v < cT) {
                    value.update((n) => n+1);
                    setTimeout(changeWithTransition, timeForOneChange);
                } else if (v > cT) {
                    value.update((n) => n-1);
                    setTimeout(changeWithTransition, timeForOneChange);
                }
            })
        })
    } else {
        value.subscribe((v) => {
            if (v < changeTo) {
                value.update((n) => n+1);
                setTimeout(changeWithTransition, timeForOneChange);
            } else if (v > changeTo) {
                value.update((n) => n-1);
                setTimeout(changeWithTransition, timeForOneChange);
            }
        })
    }
}