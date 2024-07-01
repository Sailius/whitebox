<div class="messages">
    <svg viewBox="0 0 30 19" xmlns="http://www.w3.org/2000/svg">
        <g>
            <circle cx="21.25" cy="7" r="2" fill="#888" />
            <line x1="21.25" y1="7" x2="21.25" y2="9.5" stroke="#888" stroke-width="2" />
            <rect x="18" y="9" rx="1" ry="1" width="6.5" height="6" fill="#888" />
            <line x1="18" y1="14" x2="24.5" y2="14" stroke="#888" stroke-width="2" />
        </g>
        <g>
            <rect x="5.5" y="6.25" rx="2" ry="2" width="9" height="6" fill="#eee" />
            <path
                d="M 12.5 11.25 v 1.5 Q 10 11.75, 12 11.25"
                stroke="#eee"
                fill="#eee"
                stroke-width="1"
            />
        </g>
    </svg>
</div>

<style>
    .messages {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
    }

    .messages > svg:hover > g:nth-of-type(1) {
        transform: translateX(-2px);
    }

    .messages > svg:hover > g:nth-of-type(2) {
        transform: translate(2px, -6.25px);
    }
</style>
