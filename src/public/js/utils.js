const panelAnimation = {
  scaleName: "animation__scale",
  positionName: "animation__position",
  scale: {
    open: "property: scale; dur: 500; from: 0.1 0.1 0; to: 1 1 1; loop: false",
    close: "property: scale; dur: 500; to: 0.1 0.1 0; from: 1 1 1; loop: false",
  },
  left: {
    position: {
      open: "property: position; dur: 500; from: -2.2 0 -0.1; to: -4.7 0 -0.1; loop: false",
      close: "property: position; dur: 500;to: -2.2 0 -0.1; from: -4.7 0 -0.1; loop: false",
    },
  },
  right: {
    position: {
      open: "property: position; dur: 500; from: 2.2 0 -0.1; to: 4.7 0 -0.1; loop: false",
      close: "property: position; dur: 500;to: 2.2 0 -0.1; from: 4.7 0 -0.1; loop: false",
    },
  },
};

const setOpenPanel = (type, open) => {
  const panel = document.getElementById(`${type}-panel`);

  if (open === undefined) {
    open = panel.getAttribute("open") === "true";
  }

  const content = document.getElementById(`${type}-panel-content`);
  const els = panel.querySelectorAll(`.${type}-click`);
  for (const el of els) {
    el.classList.toggle("clickable");
  }
  const videoEl = document.querySelector(`#${type}-video-1`);

  if (open) {
    pauseVideo(videoEl);
    animatePanel(panel, type, "close");
  } else {
    const currPage = Number(content.getAttribute("page"));
    const nextPage = 1;
    setPanelPage(type, content, currPage, nextPage);
    animatePanel(panel, type, "open");
  }
  panel.setAttribute("open", !open);
};

const setPanelPage = (type, content, currPage, nextPage) => {
  const isLeft = type === "left";
  const limit = isLeft ? 18 : 8;
  const prevButton = document.querySelector(`#${type}-panel-prev-button`);
  const nextButton = document.querySelector(`#${type}-panel-next-button`);

  if (nextPage > currPage) {
    if (nextPage === limit) {
      return;
    } else if (nextPage === limit - 1) {
      nextButton.setAttribute("src", isLeft ? "#left-button-disabled" : "#right-button-disabled");
    } else {
      prevButton.setAttribute("src", isLeft ? "#right-button" : "#left-button");
      nextButton.setAttribute("src", isLeft ? "#left-button" : "#right-button");
    }
  } else {
    if (nextPage === 0) {
      return;
    } else if (nextPage === 1) {
      prevButton.setAttribute("src", isLeft ? "#right-button-disabled" : "#left-button-disabled");
    } else {
      prevButton.setAttribute("src", isLeft ? "#right-button" : "#left-button");
      nextButton.setAttribute("src", isLeft ? "#left-button" : "#right-button");
    }
  }

  const currVideo = document.querySelector(`#${type}-video-${currPage}`);
  pauseVideo(currVideo);

  const nextVideo = document.querySelector(`#${type}-video-${nextPage}`);
  playVideo(nextVideo);

  const currPageContent = document.querySelector(`#${type}-page-${currPage}`);
  currPageContent.setAttribute("visible", "false");
  const currEls = currPageContent.querySelectorAll(`.${type}-click`);
  for (const el of currEls) {
    el.classList.remove("clickable");
  }
  const nextPageContent = document.querySelector(`#${type}-page-${nextPage}`);
  nextPageContent.setAttribute("visible", "true");
  const nextEls = nextPageContent.querySelectorAll(`.${type}-click`);
  for (const el of nextEls) {
    el.classList.add("clickable");
  }
  content.setAttribute("page", nextPage);
};

const animatePanel = (panel, type, animate) => {
  panel.setAttribute(panelAnimation.positionName, panelAnimation[type].position[animate]);
  panel.setAttribute(panelAnimation.scaleName, panelAnimation.scale[animate]);
};

const playVideo = (videoEl) => {
  if (videoEl && videoEl.paused) {
    videoEl.play();
  }
};

const pauseVideo = (videoEl) => {
  if (videoEl && !videoEl.paused) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }
};

const setHitTest = (flag) => {
  const sceneEl = document.querySelector("a-scene");
  const reticle = document.querySelector("#reticle");
  const reticleImg = document.querySelector("#reticle-img");
  // const target = document.querySelector("#poster-target");
  const target = document.querySelector("#ar-content");
  target.setAttribute("visible", !flag);
  reticle.setAttribute("visible", !flag);

  sceneEl.setAttribute(
    "ar-hit-test",
    `target:#reticle;src:${reticleImg.src};type:map;mapSize:0.5 0.5;enabled:${flag}`
  );
};

const setARCursor = (flag) => {
  const arCursor = document.querySelector("#ar-cursor");
  arCursor.setAttribute(
    "raycaster",
    `objects: .clickable; far:1000; near:0; showLine: true; lineColor: red; lineOpacity: 1;enabled: ${flag}`
  );
  arCursor.setAttribute("visible", flag);
};

const setMessage = (flag, text) => {
  const message = document.querySelector("#dom-overlay-message");
  message.setAttribute("style", flag ? "display: block" : "display: none");
  if (!!text) {
    message.innerHTML = text;
  }
};
