<div>
    <!-- Put content here -->
</div>
<div class="takingNotes">
    <textarea name="note" id=""></textarea>
    <button />
</div>

<style>
    .takingNotes {
        grid-row: 3;
        width: 100%;
        position: relative;
        align-self: flex-end;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .takingNotes > button {
        position: absolute;
        mask: url(/svg/sendRight.svg) no-repeat center;
        width: 2rem;
        height: 2rem;
        right: .75rem;
    }

    textarea {
        width: 100%;
        height: 125px;
        padding-right: 3.25rem;
    }
</style>