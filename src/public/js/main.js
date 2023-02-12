function setupSceneListener() {
  const sceneEl = document.querySelector("a-scene");
  const message = document.getElementById("dom-overlay-message");

  const loadingScreen = document.querySelector("#loading-screen");
  const instructions = document.querySelector("#instructions-container");
  const domNav = document.querySelector("#dom-nav");

  message.addEventListener("beforexrselect", (e) => {
    e.preventDefault();
  });

  sceneEl.addEventListener("enter-vr", function () {
    if (this.is("ar-mode")) {
      loadingScreen.setAttribute("style", "display:none");
      // instructions.setAttribute("style", "display:flex");
      domNav.setAttribute("style", "display:flex");
      message.setAttribute("style", "display:block");
      message.textContent = "";
      const self = this;
      this.addEventListener(
        "ar-hit-test-start",
        function () {
          message.innerHTML = `Scanning environment, finding surface.`;
        },
        { once: true }
      );

      this.addEventListener(
        "ar-hit-test-achieved",
        function () {
          message.innerHTML = `Select the location to place the object<br />by tapping on the screen.`;
        },
        { once: true }
      );
      this.addEventListener("ar-hit-test-select", function () {
        message.innerHTML = `Done hit testing!`;
        self.setAttribute(
          "ar-hit-test",
          "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:false"
        );
      });
    }

    sceneEl.addEventListener("exit-vr", function () {
      loadingScreen.setAttribute("style", "display:flex");
      instructions.setAttribute("style", "display:none");
      domNav.setAttribute("style", "display:none");
      message.setAttribute("style", "display:none");
      self.setAttribute(
        "ar-hit-test",
        "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:true"
      );
    });
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

function setupFindUsListeners() {
  const link = document.querySelector("#find-us-link");
  const els = document.querySelectorAll(".contact-button");
  for (let el of els) {
    el.addEventListener("click", function () {
      link.click();
    });
  }
}
function setupDownloadListener() {
  const link = document.querySelector("#download-link");
  const els = document.querySelectorAll(".download-pdf");
  for (let el of els) {
    el.addEventListener("click", function () {
      link.click();
    });
  }
}

function setupVideoPlayerListeners() {
  const player = document.querySelector("#video-player");
  const els = document.querySelectorAll(".video-element");
  for (let el of els) {
    el.addEventListener("click", function (event) {
      try {
        if (!player.paused) {
          player.pause();
        }
        const videoEl = document.querySelector(el.getAttribute("src"));
        player.setAttribute("src", videoEl.src);
        player.load();
        player.play();
        openFullscreen(player);
      } catch (error) {
        console.log(error);
      }
    });
  }
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
  const limit = isLeft ? 19 : 7;

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
  const leftButtonInstructionActive = document.querySelector("#left-button-instruction-active")
  const leftButtonInstructionInactive = document.querySelector("#left-button-instruction-inactive")
  const rightButtonInstructionActive = document.querySelector("#right-button-instruction-active")
  const rightButtonInstructionInactive = document.querySelector("#right-button-instruction-inactive")
  const instructions = document.querySelector("#instructions-container");
  const closeInstructions = document.querySelector("#close-instructions");
  const openInstructions = document.querySelector("#open-instructions");
  const reloadHitTest = document.querySelector("#reload-button");
  let page = 0
  rightButtonInstructionActive.addEventListener("click", function () {
    if(page === 0){
      page++
      rightButtonInstructionActive.style.display = "none"
      rightButtonInstructionInactive.style.display = "block"
      // .src = "../images/panel/right-button-disabled.webp";
      // instructions.style.backgroundImage = "url(../images/KDAR_Instruction2.webp')";
      leftButtonInstructionActive.style.display = "block"
      leftButtonInstructionInactive.style.display = "none"
      // .src = "../images/panel/left-button.webp";
    }
  })
  
  leftButtonInstructionActive.addEventListener("click", function () {
    if(page === 1){
      page--
      leftButtonInstructionActive.style.display = "none"
      leftButtonInstructionInactive.style.display = "block"
      // .src = "../images/panel/left-button-disabled.webp";
      // instructions.style.backgroundImage = "url('../images/KDAR_Instruction1.webp')" ;
      rightButtonInstructionActive.style.display = "block"
      rightButtonInstructionInactive.style.display = "none"
      // .src = "../images/panel/right-button.webp";
    }
  })

  arButton.addEventListener("click", function () {
    const sceneEl = document.querySelector("a-scene");
    sceneEl.enterAR();
  });
  closeInstructions.addEventListener("click", function () {
    // const sceneEl = document.querySelector("a-scene");
    // sceneEl.setAttribute(
    //   "ar-hit-test",
    //   "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:true"
    // );
    instructions.setAttribute("style", "display:none");
  });
  openInstructions.addEventListener("click", function () {
    // const sceneEl = document.querySelector("a-scene");
    // sceneEl.setAttribute(
    //   "ar-hit-test",
    //   "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:false"
    // );
    instructions.setAttribute("style", "display:flex");
  });
  reloadHitTest.addEventListener("click", function () {
    const check = instructions.getAttribute("style");
    if (check === "display:none") {
      const sceneEl = document.querySelector("a-scene");
      sceneEl.setAttribute(
        "ar-hit-test",
        "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:false"
      );
      sceneEl.setAttribute(
        "ar-hit-test",
        "target:#poster-target;type:map;mapSize:0.5 0.5;enabled:true"
      );
    }
  });
}

async function init() {
  setupFindUsListeners();
  setupDownloadListener();
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
    spinner.setAttribute("style", "display:none");
    arButton.setAttribute(
      "style",
      `position: absolute; bottom: 33%; display: block; background-color: transparent; color: #00b050; border: 2px solid #00b050; padding-left: 20px; padding-top: 10px; padding-right: 20px; padding-bottom: 10px; font-size: 18px;`
    );
  }, 3000);
}

const debug = true;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await init();
    console.log("Initialized");
  } catch (error) {
    if (debug) {
      const logger = document.querySelector("#logger");
      logger.setAttribute("style", "display:block");
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
