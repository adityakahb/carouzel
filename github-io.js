var loadIO = function () {
  var __carouzel_instance = Carouzel.Root.getInstance();

  __carouzel_instance.init('#__carouzel_1');
  __carouzel_instance.init('#__carouzel_2', {
    slidesToShow: 3,
    slidesToScroll: 3
  });
  __carouzel_instance.init('#__carouzel_3', {
    slidesToShow: 1,
    slidesToScroll: 1,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_4', {
    centerBetween: 1,
    breakpoints: [
      {
        minWidth: 700,
        centerBetween: 3
      },
      {
        minWidth: 1100,
        centerBetween: 5
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_5', {
    slidesToShow: 1,
    slideGutter: 20,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNavigation: true,
        slideGutter: 30
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        slideGutter: 40
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_6', {
    useTitlesAsDots: true
  });

  __carouzel_instance.init('#__carouzel_7', {
    slidesToShow: 1,
    autoplay: true,
    pauseOnHover: true,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2
      },
      {
        minWidth: 1100,
        slidesToScroll: 3,
        slidesToShow: 3
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_8', {
    slidesToShow: 1,
    isInfinite: false,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2
      },
      {
        minWidth: 1100,
        slidesToScroll: 3,
        slidesToShow: 3
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_9', {
    slidesToShow: 1,
    slidesToScroll: 1,
    isVertical: true,
    autoplay: true,
    verticalHeight: 360,
    threshold: 100,
    slideGutter: 20,
    pauseOnHover: true,
    breakpoints: [
      {
        minWidth: 700,
        slidesToShow: 2,
        slidesToScroll: 2,
        verticalHeight: 400,
        slideGutter: 40
      },
      {
        minWidth: 1100,
        slidesToShow: 3,
        slidesToScroll: 3,
        verticalHeight: 450,
        slideGutter: 50
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_10', {
    slidesToShow: 1,
    isInfinite: false,
    isRtl: true,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNavigation: true
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_11', {
    animationEffect: 'fade',
    breakpoints: [
      {
        minWidth: 700,
        slidesToShow: 3,
        slidesToScroll: 3
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_12', {
    animationEffect: 'slide',
    breakpoints: [
      {
        minWidth: 700,
        slidesToShow: 2,
        slidesToScroll: 2
      },
      {
        minWidth: 1100,
        slidesToShow: 3,
        slidesToScroll: 3
      }
    ]
  });

  __carouzel_instance.init('#__carouzel_13', {
    animationEffect: 'fade',
    syncWith: '__carouzel_14',
    isInfinite: false
  });
  __carouzel_instance.init('#__carouzel_14', {
    slidesToShow: 1,
    centerBetween: 1,
    syncWith: '__carouzel_13',
    isInfinite: false,
    breakpoints: [
      {
        minWidth: 700,
        centerBetween: 3
      },
      {
        minWidth: 1100,
        centerBetween: 5
      }
    ]
  });

  var __carouzel_15form = document.getElementById('__carouzel_15form');
  var easingfnselect = document.getElementById('easingfnselect');
  var effectfnselect = document.getElementById('effectfnselect');
  var easingNumText = document.getElementById('easingNumText');
  var carouzel_15settings = {
    slidesToShow: 1,
    slideGutter: 8,
    easingFunction: 'linear',
    animationSpeed: 400,
    animationEffect: 'scroll',
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNavigation: true,
        slideGutter: 16
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        slideGutter: 24
      }
    ]
  };
  __carouzel_instance.init('#__carouzel_15', carouzel_15settings);
  __carouzel_15form.addEventListener('submit', function (event) {
    event.preventDefault();
    carouzel_15settings.easingFunction = easingfnselect.value;
    carouzel_15settings.animationEffect = effectfnselect.value;
    carouzel_15settings.animationSpeed = easingNumText.value;
    __carouzel_instance.destroy('#__carouzel_15');
    __carouzel_instance.init('#__carouzel_15', carouzel_15settings);
  });

  var btnbeforeinit = document.getElementById('btnbeforeinit');
  var btnafterinit = document.getElementById('btnafterinit');
  var btnbeforescroll = document.getElementById('btnbeforescroll');
  var btnafterscroll = document.getElementById('btnafterscroll');

  var beforeInitElem = document.getElementById('beforeinit');
  var afterInitElem = document.getElementById('afterinit');
  var beforeScrollElem = document.getElementById('beforescroll');
  var afterScrollElem = document.getElementById('afterscroll');

  var toastBeforeInit = new bootstrap.Toast(beforeInitElem);
  var toastAfterInit = new bootstrap.Toast(afterInitElem);
  var toastBeforeScroll = new bootstrap.Toast(beforeScrollElem);
  var toastAfterScroll = new bootstrap.Toast(afterScrollElem);

  btnbeforeinit.addEventListener('click', function (event) {
    event.preventDefault();
    toastBeforeInit.show();
  });
  btnafterinit.addEventListener('click', function (event) {
    event.preventDefault();
    toastAfterInit.show();
  });
  btnbeforescroll.addEventListener('click', function (event) {
    event.preventDefault();
    toastBeforeScroll.show();
  });
  btnafterscroll.addEventListener('click', function (event) {
    event.preventDefault();
    toastAfterScroll.show();
  });
  var gotoslideinput = document.getElementById('gotoslideinput');
  var gotonextbtn = document.getElementById('gotonextbtn');
  var gotoprevbtn = document.getElementById('gotoprevbtn');
  var destroybtn = document.getElementById('destroybtn');
  var initbtn = document.getElementById('initbtn');

  var carouzel8Settings = {
    beforeInitFn: function () {
      toastBeforeInit.show();
    },
    afterInitFn: function () {
      toastAfterInit.show();
    },
    beforeScrollFn: function () {
      toastBeforeScroll.show();
    },
    afterScrollFn: function () {
      toastAfterScroll.show();
    }
  };

  __carouzel_instance.init('#__carouzel_16', carouzel8Settings);
  destroybtn.addEventListener('click', function () {
    destroybtn.setAttribute('hidden', 'true');
    initbtn.removeAttribute('hidden');
    gotoslideinput.setAttribute('disabled', true);
    gotonextbtn.setAttribute('disabled', true);
    gotoprevbtn.setAttribute('disabled', true);
    btnbeforeinit.setAttribute('disabled', true);
    btnafterinit.setAttribute('disabled', true);
    btnbeforescroll.setAttribute('disabled', true);
    btnafterscroll.setAttribute('disabled', true);
    __carouzel_instance.destroy('#__carouzel_16');
  });
  initbtn.addEventListener('click', function () {
    destroybtn.removeAttribute('hidden');
    initbtn.setAttribute('hidden', 'true');
    gotoslideinput.removeAttribute('disabled');
    gotonextbtn.removeAttribute('disabled');
    gotoprevbtn.removeAttribute('disabled');
    btnbeforeinit.removeAttribute('disabled');
    btnafterinit.removeAttribute('disabled');
    btnbeforescroll.removeAttribute('disabled');
    btnafterscroll.removeAttribute('disabled');
    __carouzel_instance.init('#__carouzel_16', carouzel8Settings);
  });
  gotonextbtn.addEventListener('click', function () {
    __carouzel_instance.goToSlide('#__carouzel_16', 'next');
  });
  gotoprevbtn.addEventListener('click', function () {
    __carouzel_instance.goToSlide('#__carouzel_16', 'previous');
  });
  gotoslideinput.addEventListener('change', function () {
    __carouzel_instance.goToSlide('#__carouzel_16', gotoslideinput.value);
  });

  var __carouzel_17_btn = document.getElementById('__carouzel_17_btn');
  var __carouzel_17_btnrem = document.getElementById('__carouzel_17_btnrem');
  __carouzel_17_btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.hash = '__carouzel_17_id_4';
    window.location.reload();
  });
  __carouzel_17_btnrem.addEventListener('click', function (e) {
    e.preventDefault();
    history.replaceState(null, null, ' ');
    window.location.reload();
  });
  __carouzel_instance.init('#__carouzel_17', {
    trackUrlHash: true,
    appendUrlHash: true
  });
  if (document.querySelectorAll('#__carouzel_19').length > 0) {
    __carouzel_instance.init('#__carouzel_19');
  }

  var navlinks = document.querySelectorAll('#topnav li a');
  for (var k = 0; k < navlinks.length; k++) {
    navlinks[k].addEventListener('click', function (event) {
      event.preventDefault();
      setTimeout(function () {
        window.location.hash = event.target.getAttribute('href');
      }, 500);
    });
  }
  var clipcopied = new bootstrap.Toast(document.getElementById('clipcopied'));
  var clipbrd_click = document.getElementById('clipbrd_click');
  clipbrd_click.addEventListener('click', function (event) {
    navigator.clipboard.writeText(event.target.getAttribute('data-clipboard'));
    clipcopied.show();
  });

  // if (document.getElementById('__carouzel_16')) {
  //   __carouzel_instance.init('#__carouzel_16', {
  //     slidesToShow: 1,
  //     isInfinite: false,
  //     enableScrollbar: true,
  //     breakpoints: [
  //       {
  //         minWidth: 700,
  //         slidesToScroll: 2,
  //         slidesToShow: 2
  //       },
  //       {
  //         minWidth: 1100,
  //         slidesToScroll: 4,
  //         slidesToShow: 4
  //       }
  //     ]
  //   });
  // }
};
document.addEventListener('DOMContentLoaded', function () {
  loadIO();
  window.addEventListener('scroll', function () {
    if (window.scrollY > document.getElementById('top_intro').clientHeight) {
      document.getElementById('btnGoToTop').removeAttribute('hidden');
    } else {
      document.getElementById('btnGoToTop').setAttribute('hidden', 'true');
    }
  });
});
