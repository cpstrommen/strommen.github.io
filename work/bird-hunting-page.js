(function () {
    "use strict";

    var canvas = document.getElementById("bird-hunting-canvas");
    var shotgunButton = document.getElementById("select-shotgun");
    var rifleButton = document.getElementById("select-rifle");
    var reloadButton = document.getElementById("reload-weapon");
    var gameNote = document.getElementById("game-note");

    function showGameError(error) {
        gameNote.textContent = "The game could not start: " + error.message;
        gameNote.classList.add("is-error");
    }

    document.addEventListener("khan-canvas-error", function (event) {
        showGameError(event.detail);
    });

    if (window.gameLoadError) {
        showGameError(window.gameLoadError);
        return;
    }

    if (!window.KhanCanvasRuntime || typeof window.draw !== "function") {
        showGameError(new Error("the browser runtime did not load"));
        return;
    }

    var game = window.KhanCanvasRuntime.start(canvas);

    function syncWeaponControls() {
        shotgunButton.classList.toggle("is-active", window.shotgun === true);
        shotgunButton.setAttribute("aria-pressed", String(window.shotgun === true));
        rifleButton.classList.toggle("is-active", window.rifle === true);
        rifleButton.setAttribute("aria-pressed", String(window.rifle === true));
    }

    shotgunButton.addEventListener("click", function () {
        if (window.shotgun !== true) {
            game.pressKey("e");
        }
        syncWeaponControls();
        canvas.focus({ preventScroll: true });
    });

    rifleButton.addEventListener("click", function () {
        if (window.rifle !== true) {
            game.pressKey("e");
        }
        syncWeaponControls();
        canvas.focus({ preventScroll: true });
    });

    reloadButton.addEventListener("click", function () {
        game.pressKey("r");
        canvas.focus({ preventScroll: true });
    });

    window.addEventListener("keydown", function (event) {
        if (event.key === "e" || event.key === "E") {
            window.requestAnimationFrame(syncWeaponControls);
        }
    });

    syncWeaponControls();
}());
