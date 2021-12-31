const blankdiv = `<div id="outdiv" style="border: 1px solid #ddd; height: 44px; border-radius: 8px;"></div>`;
const carouzelStart1 = `<section
data-carouzel
id="__carouzel_1"
aria-roledescription="carousel"
aria-label="Carouzel Implementation"
>
<div data-carouzel-trackwrapper>
  <div data-carouzel-trackmask>
    <div data-carouzel-trackouter>
      <div data-carouzel-track aria-live="polite">`;
const carouzelStart2 = `<section
data-carouzel
aria-roledescription="carousel"
aria-label="Carouzel Implementation"
class="__carouzel-2"
>
<div data-carouzel-trackwrapper>
  <div data-carouzel-trackmask>
    <div data-carouzel-trackouter>
      <div data-carouzel-track aria-live="polite">`;
const carouzelStart3 = `<section
data-carouzel
id="__carouzel_3"
aria-roledescription="carousel"
aria-label="Carouzel Implementation"
>
<div data-carouzel-trackwrapper>
  <div data-carouzel-trackmask>
    <div data-carouzel-trackouter>
      <div data-carouzel-track aria-live="polite">`;
const carouzelEnd = `</div>
</div>
<div data-carouzel-controlswrapper>
  <button
    type="button"
    data-carouzel-previousarrow
    aria-label="Previous"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"
      />
    </svg>
  </button>
  <button
    type="button"
    data-carouzel-nextarrow
    aria-label="Next"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
      />
    </svg>
  </button>
</div>
</div>
<div data-carouzel-navigationwrapper>
<div data-carouzel-navigation></div>
</div>
</section>`;
let carouzel1 = ``;
let carouzel2 = ``;
let carouzel3 = ``;

let evtStrBeforeInit = ``;
let evtStrAfterInit = ``;
let evtStrBeforeScroll = ``;
let evtStrAfterScroll = ``;

let options1 = {
  beforeInit: function () {
    evtStrBeforeInit = `beforeInit`;
  },
  afterInit: function () {
    evtStrAfterInit = `afterInit`;
  },
  beforeScroll: function () {
    evtStrBeforeScroll = `beforeScroll`;
  },
  afterScroll: function () {
    evtStrAfterScroll = `afterScroll`;
  },
};
let options2 = {
  slidesToShow: 1,
  showNav: false,
  responsive: [
    {
      breakpoint: 700,
      slidesToScroll: 2,
      slidesToShow: 2,
      showNav: true,
    },
    {
      breakpoint: 1100,
      slidesToScroll: 4,
      slidesToShow: 4,
    },
  ],
};
let options3 = {};

describe(`Carouzel`, function () {
  let carouzelInstance;
  let evt;

  beforeAll(function () {
    carouzel1 = ``;
    carouzel2 = ``;
    carouzel3 = ``;
    for (let i = 0; i < 12; i++) {
      carouzel1 += `<div
        data-carouzel-slide
        role="group"
        aria-roledescription="slide"
        aria-label="${i + 1} of 12"
      >
        <div>${i + 1}</div>
      </div>`;
    }
    for (let j = 0; j < 12; j++) {
      carouzel2 += `<div
        data-carouzel-slide
        role="group"
        aria-roledescription="slide"
        aria-label="${j + 1} of 12"
      >
        <div>${j + 1}</div>
      </div>`;
    }
    let fixture =
      blankdiv +
      (carouzelStart1 + carouzel1 + carouzelEnd) +
      (carouzelStart2 + carouzel2 + carouzelEnd);
    // + (carouzelStart3 + carouzel3 + carouzelEnd);

    document.body.insertAdjacentHTML(`afterbegin`, fixture);
    carouzelInstance = Carouzel.Root.getInstance();
  });

  beforeEach(function () {
    jasmine.clock().install();
    // outdiv = document.querySelector(`#outdiv`);
  });
  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it(`Should validate the Carouzel Instance`, function () {
    expect(carouzelInstance).not.toBe(null);
  });

  it(`Should initialize Non-Existant Carouzel`, function () {
    carouzelInstance.init(`#__carouzel_0`);
    expect(carouzelInstance.getLength()).toBe(0);
  });

  it(`Should initialize 1st carouzel`, function () {
    carouzelInstance.init(`#__carouzel_1`);
    expect(carouzelInstance.getLength()).toBe(1);
  });

  it(`Should destroy 1st carouzel`, function () {
    carouzelInstance.destroy(`#__carouzel_1`);
    expect(carouzelInstance.getLength()).toBe(0);
  });

  it(`Should re-init 1st carouzel`, function () {
    carouzelInstance.init(`#__carouzel_1`);
    expect(carouzelInstance.getLength()).toBe(1);
  });

  it(`Should re-init 1st carouzel just to verify single instance`, function () {
    carouzelInstance.init(`#__carouzel_1`);
    expect(carouzelInstance.getLength()).toBe(1);
  });

  it(`Should destroy Non-Existant carouzel`, function () {
    carouzelInstance.destroy(`#__carouzel_0`);
    expect(carouzelInstance.getLength()).toBe(1);
  });
  it(`Should init 2nd Navigation when unique id is not present`, function () {
    carouzelInstance.init(`.__carouzel-2`);
    expect(carouzelInstance.getLength()).toBe(2);
  });

  it(`Should go to the next slide`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `next`);
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(1);
  });

  it(`Should go to the previous slide`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `previous`);
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(0);
  });

  it(`Should go to the valid slide number`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `10`);
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(9);
  });

  it(`Should go to the last slide when invalid slide number greater than number of slides is provided in count`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `15`);
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(11);
  });

  it(`Should go to the first slide when invalid slide number less than 1 is provided in count`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `-1`);
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(0);
  });

  it(`Should not navigate when non-existant slider is operated on`, function () {
    carouzelInstance.goToSlide(`#__carouzel_0`, `5`);
    const elements = document.querySelectorAll(
      `#__carouzel_0 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    expect(elements.length).toBe(0);
  });

  it(`Should trigger click on next button`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `0`);
    const nextBtn = document.querySelector(
      `#__carouzel_1 [data-carouzel-nextarrow]`
    );
    nextBtn.click();
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(1);
  });

  it(`Should trigger click on prev button`, function () {
    const prevBtn = document.querySelector(
      `#__carouzel_1 [data-carouzel-previousarrow]`
    );
    prevBtn.click();
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(0);
  });

  it(`Should trigger next arrow key down`, function () {
    carouzelInstance.goToSlide(`#__carouzel_1`, `0`);

    const parentEl = document.querySelector(`#__carouzel_1`);
    evt = new KeyboardEvent(`keydown`, {
      key: `arrowright`,
    });
    parentEl.dispatchEvent(evt);

    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(1);
  });

  it(`Should trigger previous arrow key down`, function () {
    const parentEl = document.querySelector(`#__carouzel_1`);
    evt = new KeyboardEvent(`keydown`, {
      key: `arrowleft`,
    });
    parentEl.dispatchEvent(evt);

    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(0);
  });

  it(`Should trigger up arrow key down`, function () {
    const parentEl = document.querySelector(`#__carouzel_1`);
    evt = new KeyboardEvent(`keydown`, {
      key: `arrowup`,
    });
    parentEl.dispatchEvent(evt);

    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(0);
  });

  it(`Should trigger beforeInit method`, function () {
    carouzelInstance.destroy(`#__carouzel_1`);
    carouzelInstance.init(`#__carouzel_1`, options1);
    expect(evtStrBeforeInit).toBe(`beforeInit`);
  });

  it(`Should trigger afterInit method`, function () {
    expect(evtStrAfterInit).toBe(`afterInit`);
  });

  it(`Should trigger beforeScroll method`, function () {
    expect(evtStrBeforeScroll).toBe(`beforeScroll`);
  });

  it(`Should trigger afterScroll method`, function (done) {
    const nextBtn = document.querySelector(
      `#__carouzel_1 [data-carouzel-nextarrow]`
    );
    nextBtn.click();
    setTimeout(() => {
      expect(evtStrAfterScroll).toBe(`afterScroll`);
      done();
    }, 5000);
  });

  it(`Should trigger click on nav dot`, function () {
    const navBtns = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-dot] button`
    );
    navBtns[5].click();
    const elements = document.querySelectorAll(
      `#__carouzel_1 [data-carouzel-slide]:not(.__carouzel-duplicate)`
    );
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains(`__carouzel-active`)) {
        index = i;
        break;
      }
    }
    expect(index).toBe(5);
  });

  // it(`Should try focus on 0th Level Navigation`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`focus`, true, true);
  //   l0anchor.dispatchEvent(evt);
  //   expect(l0anchor).toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try blur on 0th Level Navigation`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`blur`, true, true);
  //   l0anchor.dispatchEvent(evt);
  //   expect(l0anchor).not.toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try mouseenter on 0th Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseenter`, true, true);
  //   l0anchor.dispatchEvent(evt);
  //   expect(l0anchor).toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try mouseleave on 0th Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseleave`, true, true);
  //   l0anchor.dispatchEvent(evt);
  //   expect(l0anchor).not.toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try click on 0th Level Navigation: part 1`, function () {
  //   outdiv.click();
  //   l0anchor.click();
  //   jasmine.clock().tick(10000);
  //   expect(l0panel).toHaveClass(`__amegmen-active`);
  // });

  // it(`Should try click on 0th Level Navigation: part 2`, function () {
  //   outdiv.click();
  //   jasmine.clock().tick(10000);
  //   expect(l0panel).not.toHaveClass(`active`);
  // });

  // it(`Should try focus on 0th Level Navigation Landing`, function () {
  //   l0anchor.click();
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`focus`, true, true);
  //   l0landing.dispatchEvent(evt);
  //   expect(l0landing).toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try blur on 0th Level Navigation Landing`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`blur`, true, true);
  //   l0landing.dispatchEvent(evt);
  //   expect(l0landing).not.toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try mouseenter on 0th Level Navigation Landing`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseenter`, true, true);
  //   l0landing.dispatchEvent(evt);
  //   expect(l0landing).toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try mouseleave on 0th Level Navigation Landing`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseleave`, true, true);
  //   l0landing.dispatchEvent(evt);
  //   expect(l0landing).not.toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try focus on 1st Level Navigation`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`focus`, true, true);
  //   l1anchor.dispatchEvent(evt);
  //   expect(l1anchor).toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try blur on 1st Level Navigation`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`blur`, true, true);
  //   l1anchor.dispatchEvent(evt);
  //   expect(l1anchor).not.toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try mouseenter on 1st Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseenter`, true, true);
  //   l1anchor.dispatchEvent(evt);
  //   expect(l1anchor).toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try mouseleave on 1st Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseleave`, true, true);
  //   l1anchor.dispatchEvent(evt);
  //   expect(l1anchor).not.toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try click on 1st Level Navigation: part 1`, function () {
  //   outdiv.click();
  //   l0anchor.click();
  //   l1anchor.click();
  //   jasmine.clock().tick(1000);
  //   expect(l1panel).toHaveClass(`__amegmen-active`);
  // });

  // it(`Should try click on 1st Level Navigation: part 2`, function () {
  //   outdiv.click();
  //   jasmine.clock().tick(1000);
  //   expect(l1panel).not.toHaveClass(`__amegmen-active`);
  // });

  // it(`Should try focus on 2nd Level Navigation`, function () {
  //   l0anchor.click();
  //   l1anchor.click();
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`focus`, true, true);
  //   l2anchor.dispatchEvent(evt);
  //   expect(l2anchor).toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try blur on 2nd Level Navigation`, function () {
  //   evt = document.createEvent(`KeyboardEvent`);
  //   evt.initEvent(`blur`, true, true);
  //   l2anchor.dispatchEvent(evt);
  //   expect(l2anchor).not.toHaveClass(`__amegmen-focus`);
  // });

  // it(`Should try mouseenter on 2nd Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseenter`, true, true);
  //   l2anchor.dispatchEvent(evt);
  //   jasmine.clock().tick(1000);
  //   expect(l2anchor).toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should try mouseleave on 2nd Level Navigation`, function () {
  //   evt = document.createEvent(`MouseEvent`);
  //   evt.initEvent(`mouseleave`, true, true);
  //   l2anchor.dispatchEvent(evt);
  //   outdiv.click();
  //   expect(l2anchor).not.toHaveClass(`__amegmen-hover`);
  // });

  // it(`Should open offcanvas on mobile using main toggle`, function () {
  //   viewport.set(375, 850);
  //   toggleBtn.click();
  //   expect(offcanvas).toHaveClass(`__amegmen-active`);
  // });

  // it(`Should close offcanvas on mobile main toggle`, function () {
  //   viewport.set(375, 850);
  //   toggleBtn.click();
  //   expect(offcanvas).not.toHaveClass(`__amegmen-active`);
  // });

  // it(`Should open Level 1 on mobile`, function () {
  //   viewport.set(375, 850);
  //   toggleBtn.click();
  //   l0anchor.click();
  //   expect(l0panel).toHaveClass(`__amegmen-active`);
  // });

  // it(`Should open Level 2 on mobile`, function () {
  //   viewport.set(375, 850);
  //   l1anchor.click();
  //   expect(l1panel).toHaveClass(`__amegmen-active`);
  // });

  // it(`Should close Level 2 on mobile`, function () {
  //   viewport.set(375, 850);
  //   backBtn.click();
  //   expect(l1panel).not.toHaveClass(`__amegmen-active`);
  // });

  // it(`Should close Level 1 on mobile`, function () {
  //   viewport.set(375, 850);
  //   mainBtn.click();
  //   expect(l0panel).not.toHaveClass(`__amegmen-active`);
  // });

  // it(`Should close offcanvas on mobile`, function () {
  //   viewport.set(375, 850);
  //   closeBtn.click();
  //   expect(offcanvas).not.toHaveClass(`__amegmen-active`);
  // });
});
