function setupSceneListener() {
  const sceneEl = document.querySelector("a-scene");

  const loadingScreen = document.querySelector("#loading-screen");
  const instructions = document.querySelector("#instructions-container");
  const domNav = document.querySelector("#dom-nav");
  const target = document.querySelector("#poster-target");
  const videoContainer = document.querySelector("#video-container");
  setHitTest(true);

  sceneEl.addEventListener("enter-vr", function () {
    if (this.is("ar-mode")) {
      videoContainer.setAttribute("style", "display: none");
      loadingScreen.setAttribute("style", "display: none");
      // instructions.setAttribute("style", "display: flex");
      domNav.setAttribute("style", "display: flex");
      this.addEventListener(
        "ar-hit-test-start",
        function () {
          setMessage(true, `Scanning environment, finding surface.`);
        },
        { once: true }
      );

      this.addEventListener(
        "ar-hit-test-achieved",
        function () {
          setMessage(
            true,
            `Select the location to place the poster<br />by tapping on the screen.`
          );
        },
        { once: true }
      );
      this.addEventListener("ar-hit-test-select", function (e) {
        try {
          setMessage(false, "");

          target.object3D.position.copy(e.detail.position);
          target.object3D.position.y += 1;
          target.object3D.rotation.setFromQuaternion(e.detail.orientation);

          setARCursor(true);
          setHitTest(false);
        } catch (error) {
          console.log(error);
        }
      });
    }
  });
  sceneEl.addEventListener("exit-vr", function () {
    loadingScreen.setAttribute("style", "display: flex");
    instructions.setAttribute("style", "display: none");
    domNav.setAttribute("style", "display: none");
    setMessage(false);
    videoContainer.setAttribute("style", "display: none");
    setHitTest(true);
    setARCursor(false);
  });
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function setupLinkListeners() {
  const lphsLink = document.querySelector("#lphs-link");
  const lphsEls = document.querySelectorAll(".lphs-button");
  for (let el of lphsEls) {
    el.addEventListener("click", function () {
      lphsLink.click();
    });
  }
  const contactLink = document.querySelector("#contact-link");
  const contactEls = document.querySelectorAll(".contact-button");
  for (let el of contactEls) {
    el.addEventListener("click", function () {
      contactLink.click();
    });
  }
  const downloadLink = document.querySelector("#download-link");
  const downloadEls = document.querySelectorAll(".download-pdf");
  for (let el of downloadEls) {
    el.addEventListener("click", function () {
      downloadLink.click();
    });
  }
}

function setupVideoPlayerListeners() {
  const container = document.querySelector("#video-container");
  const videoClose = document.querySelector("#video-close-button");
  const domNav = document.querySelector("#dom-nav");

  const player = document.querySelector("#video-player");
  const els = document.querySelectorAll(".video-element");
  for (let el of els) {
    el.addEventListener("click", function () {
      try {
        if (!player.paused) {
          player.pause();
        }
        const videoEl = document.querySelector(el.getAttribute("src"));
        player.setAttribute("src", videoEl.src);
        player.load();
        player.play();
        container.setAttribute("style", "display: flex");
        setARCursor(false);
        domNav.setAttribute("style", "display: none");
      } catch (error) {
        console.log(error);
      }
    });
  }

  videoClose.addEventListener("click", function () {
    if (!player.paused) {
      player.pause();
    }
    container.setAttribute("style", "display: none");
    domNav.setAttribute("style", "display: flex");
    setARCursor(true);
  });
}

function setupGalleryNavListeners() {
  const prevButton = document.querySelector(`#gallery-prev-button`);
  const nextButton = document.querySelector(`#gallery-next-button`);
  const limit = 7;

  prevButton.addEventListener("click", function () {
    const content = document.querySelector(`#gallery-nav`);
    const prevButton = document.querySelector(`#gallery-prev-button`);
    const nextButton = document.querySelector(`#gallery-next-button`);
    const currPage = Number(content.getAttribute("page"));
    const offset = Number(content.getAttribute("selected")) - 1;
    const prevPage = currPage - 1;
    if (prevPage === 0) {
      return;
    } else if (prevPage === 1) {
      prevButton.setAttribute("src", "#left-button-disabled");
    } else {
      prevButton.setAttribute("src", "#left-button");
      nextButton.setAttribute("src", "#right-button");
    }

    const currPageContent = document.querySelector(`#gallery-main`);
    currPageContent.setAttribute("src", `#gallery-${prevPage + offset}`);

    const galleryButtons = document.querySelectorAll(`.gallery-button`);
    for (const galleryButton of galleryButtons) {
      const currNum = Number(galleryButton.getAttribute("num"));
      galleryButton.setAttribute("src", `#gallery-${prevPage + currNum - 1}-small`);
    }

    content.setAttribute("page", prevPage);
  });

  nextButton.addEventListener("click", function () {
    const content = document.querySelector(`#gallery-nav`);
    const prevButton = document.querySelector(`#gallery-prev-button`);
    const nextButton = document.querySelector(`#gallery-next-button`);
    const currPage = Number(content.getAttribute("page"));
    const offset = Number(content.getAttribute("selected")) - 1;
    const nextPage = currPage + 1;

    if (nextPage === limit) {
      return;
    } else if (nextPage === limit - 1) {
      nextButton.setAttribute("src", "#right-button-disabled");
    } else {
      prevButton.setAttribute("src", "#left-button");
      nextButton.setAttribute("src", "#right-button");
    }

    const currPageContent = document.querySelector(`#gallery-main`);
    currPageContent.setAttribute("src", `#gallery-${nextPage + offset}`);

    const galleryButtons = document.querySelectorAll(`.gallery-button`);
    for (const galleryButton of galleryButtons) {
      const currNum = Number(galleryButton.getAttribute("num"));
      galleryButton.setAttribute("src", `#gallery-${nextPage + currNum - 1}-small`);
    }

    content.setAttribute("page", nextPage);
  });

  const galleryButtons = document.querySelectorAll(`.gallery-button`);
  for (const galleryButton of galleryButtons) {
    galleryButton.addEventListener("click", function () {
      const content = document.querySelector(`#gallery-nav`);
      const border = document.querySelector(`#gallery-button-border`);
      const currPage = Number(content.getAttribute("page"));
      const num = Number(this.getAttribute("num"));
      border.setAttribute("position", `${(num - 1) * 0.8 - 1} 0 -0.01`);
      const currPageContent = document.querySelector(`#gallery-main`);
      currPageContent.setAttribute("src", `#gallery-${currPage + num - 1}`);

      content.setAttribute("selected", num);
    });
  }
}

async function setupPageNavListeners(type) {
  const prevButton = document.querySelector(`#${type}-panel-prev-button`);
  const nextButton = document.querySelector(`#${type}-panel-next-button`);
  const lastButton = document.querySelector(`#${type}-panel-last-button`);
  const closeButton = document.querySelector(`#${type}-panel-close-button`);
  const isLeft = type === "left";
  const limit = isLeft ? 18 : 8;

  lastButton.addEventListener("click", function () {
    const content = document.querySelector(`#${type}-panel-content`);
    const currPage = Number(content.getAttribute("page"));
    const lastPage = isLeft ? limit - 1 : 1;
    setPanelPage(type, content, currPage, lastPage);
  });

  prevButton.addEventListener("click", function () {
    const content = document.querySelector(`#${type}-panel-content`);
    const currPage = Number(content.getAttribute("page"));
    const nextPage = currPage - 1;
    setPanelPage(type, content, currPage, nextPage);
  });
  nextButton.addEventListener("click", function () {
    const content = document.querySelector(`#${type}-panel-content`);
    const currPage = Number(content.getAttribute("page"));
    const nextPage = currPage + 1;
    setPanelPage(type, content, currPage, nextPage);
  });

  closeButton.addEventListener("click", function () {
    setOpenPanel(type, true);
  });
}

function setupNavListeners() {
  const leftCircleButton = document.querySelector("#left-circle-button-entity");
  const rightCircleButton = document.querySelector("#right-circle-button-entity");

  leftCircleButton.addEventListener("click", function () {
    setOpenPanel("left");
  });

  rightCircleButton.addEventListener("click", function () {
    setOpenPanel("right");
  });
}

function overlayListeners() {
  const arButton = document.querySelector("#ar-button");
  const leftButtonInstructionActive = document.querySelector("#left-button-instruction-active");
  const leftButtonInstructionInactive = document.querySelector("#left-button-instruction-inactive");
  const rightButtonInstructionActive = document.querySelector("#right-button-instruction-active");
  const rightButtonInstructionInactive = document.querySelector(
    "#right-button-instruction-inactive"
  );
  const positionGif = document.querySelector("#position-gif");
  const dragGif = document.querySelector("#drag-gif");
  const instructionsDot1 = document.querySelector("#instruction-dot1");
  const instructionsDot2 = document.querySelector("#instruction-dot2");
  const instructions = document.querySelector("#instructions-container");
  const closeInstructions = document.querySelector("#close-instructions");
  const openInstructions = document.querySelector("#open-instructions");
  const reloadHitTest = document.querySelector("#reload-button");
  const poster = document.querySelector("#poster-target");

  rightButtonInstructionActive.addEventListener("click", function () {
    rightButtonInstructionActive.style.display = "none";
    rightButtonInstructionInactive.style.display = "block";
    leftButtonInstructionActive.style.display = "block";
    leftButtonInstructionInactive.style.display = "none";
    instructionsDot1.style.display = "none";
    instructionsDot2.style.display = "block";
    positionGif.style.display = "none";
    dragGif.style.display = "block";
  });

  leftButtonInstructionActive.addEventListener("click", function () {
    leftButtonInstructionActive.style.display = "none";
    leftButtonInstructionInactive.style.display = "block";
    rightButtonInstructionActive.style.display = "block";
    rightButtonInstructionInactive.style.display = "none";
    instructionsDot1.style.display = "block";
    instructionsDot2.style.display = "none";
    positionGif.style.display = "block";
    dragGif.style.display = "none";
  });

  arButton.addEventListener("click", function () {
    console.log('enter ar')
    const sceneEl = document.querySelector("a-scene");
    sceneEl.setAttribute('xrweb', `disableWorldTracking: ${this.data.disableWorldTracking}`)
    // sceneEl.enterVR(true);
  });
  closeInstructions.addEventListener("click", function () {
    instructions.setAttribute("style", "display: none");
    setARCursor(true);
  });
  openInstructions.addEventListener("click", function () {
    instructions.setAttribute("style", "display: flex");
    setARCursor(false);
  });
  reloadHitTest.addEventListener("click", function () {
    instructions.setAttribute("style", "display: none");
    poster.setAttribute("visible", false);
    setHitTest(false);
    setARCursor(false);
    setHitTest(true);
    setMessage(true, `Select the location to place the poster<br />by tapping on the screen.`);
  });
}

async function init() {
  console.log('async function init')
  setupLinkListeners();
  setupVideoPlayerListeners();
  setupNavListeners();
  setupPageNavListeners("left");
  setupPageNavListeners("right");
  setupGalleryNavListeners();
  setupSceneListener();
  overlayListeners();

  const spinner = document.querySelector(".lds-ring");
  const arButton = document.querySelector("#ar-button");
  setTimeout(() => {
    spinner.setAttribute("style", "display: none");
    arButton.setAttribute(
      "style",
      `position: absolute; bottom: 33%; display: block; background-color: transparent; color: #00b050; border: 2px solid #00b050; padding-left: 20px; padding-top: 10px; padding-right: 20px; padding-bottom: 10px; font-size: 18px;`
    );
  }, 3000);
}

const debug = false;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await init();
    console.log("Initialized");
  } catch (error) {
    if (debug) {
      const logger = document.querySelector("#logger");
      logger.setAttribute("style", "display: block");
      const text = document.createElement("p");
      if (typeof error === "object") {
        text.innerHTML = error.message;
        text.innerHTML += "<br />";
        text.innerHTML += error.stack;
      } else {
        text.innerHTML = error;
      }
      logger.appendChild(text);
    }
    console.log(error);
    console.log("Failed to initialize");
  }
});
