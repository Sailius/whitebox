<div class="desks">
    <svg viewBox="0 0 30 19" xmlns="http://www.w3.org/2000/svg">
        <rect x="9.5" y="1.25" width="15" height="12.5" fill="#ccc" />
        <rect x="7.5" y="3.25" width="15" height="12.5" fill="#eee" />
        <rect x="5.5" y="5.25" width="15" height="12.5" fill="#fff" />
    </svg>
</div>

<style>
    .desks {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.25s ease;
    }

    .desks > svg {
        height: 2rem;
    }

    .desks:hover > svg > rect:nth-of-type(1) {
        fill: #888;
    }
    .desks:hover > svg > rect:nth-of-type(2) {
        fill: #ccc;
    }
    .desks:hover > svg > rect:nth-of-type(3) {
        fill: #eee;
    }
</style>
