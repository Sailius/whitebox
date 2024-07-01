<div class="public">
    <svg viewBox="0 0 36 19" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#ccc" fill="#00000000" stroke-width="1.5">
            <circle cx="18" cy="9.5" r="8" stroke-dasharray="4 1 2" />
        </g>
        <g stroke="#eee" fill="#00000000" stroke-width="1.5">
            <circle cx="18" cy="9.5" r="5" />
        </g>
    </svg>
</div>

<style>
    .public {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
    }

    .public > svg:hover > g:nth-child(1) {
        transform: rotateY(45deg);
    }

    .public > svg:hover > g:nth-child(2) {
        transform: rotateY(45deg) translateX(17.75px);
    }
</style>
