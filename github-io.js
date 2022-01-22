var loadIO = function () {
  var __carouzel_instance = Carouzel.Root.getInstance();

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

  __carouzel_instance.init('#__carouzel_1');
  __carouzel_instance.init('#__carouzel_2', {
    slidesToShow: 3,
    slidesToScroll: 3,
  });
  __carouzel_instance.init('#__carouzel_3', {
    slidesToShow: 1,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNav: true,
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_4', {
    slidesToShow: 1,
    animationEffect: 'fade',
    speed: 500,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 3,
        slidesToShow: 3,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_6', {
    slidesToShow: 1,
    autoplay: true,
    pauseOnHover: true,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
      },
      {
        minWidth: 1100,
        slidesToScroll: 3,
        slidesToShow: 3,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_7', {
    slidesToShow: 1,
    isInfinite: false,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
      },
      {
        minWidth: 1100,
        slidesToScroll: 3,
        slidesToShow: 3,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_9', {
    centerBetween: 1,
  });
  __carouzel_instance.init('#__carouzel_10', {
    useTitlesAsDots: true,
  });
  __carouzel_instance.init('#__carouzel_11', {
    slidesToShow: 1,
    slideGutter: 20,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNav: true,
        slideGutter: 30,
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        slideGutter: 40,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_12', {
    slidesToShow: 1,
    isInfinite: false,
    isRtl: true,
    breakpoints: [
      {
        minWidth: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNav: true,
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
      },
    ],
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
    },
  };

  __carouzel_instance.init('#__carouzel_8', carouzel8Settings);
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
    __carouzel_instance.destroy('#__carouzel_8');
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
    __carouzel_instance.init('#__carouzel_8', carouzel8Settings);
  });
  gotonextbtn.addEventListener('click', function () {
    __carouzel_instance.goToSlide('#__carouzel_8', 'next');
  });
  gotoprevbtn.addEventListener('click', function () {
    __carouzel_instance.goToSlide('#__carouzel_8', 'previous');
  });
  gotoslideinput.addEventListener('change', function () {
    __carouzel_instance.goToSlide('#__carouzel_8', gotoslideinput.value);
  });
  var __carouzel_13form = document.getElementById('__carouzel_13form');
  var easingfnselect = document.getElementById('easingfnselect');
  var effectfnselect = document.getElementById('effectfnselect');
  var easingNumText = document.getElementById('easingNumText');
  var carouzel_13settings = {
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
        showNav: true,
        slideGutter: 16,
      },
      {
        minWidth: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        slideGutter: 24,
      },
    ],
  };
  __carouzel_instance.init('#__carouzel_13', carouzel_13settings);
  __carouzel_13form.addEventListener('submit', function (event) {
    event.preventDefault();
    carouzel_13settings.easingFunction = easingfnselect.value;
    carouzel_13settings.animationEffect = effectfnselect.value;
    carouzel_13settings.animationSpeed = easingNumText.value;
    __carouzel_instance.destroy('#__carouzel_13');
    __carouzel_instance.init('#__carouzel_13', carouzel_13settings);
  });
  var __carouzel_14_btn = document.getElementById('__carouzel_14_btn');
  var __carouzel_14_btnrem = document.getElementById('__carouzel_14_btnrem');
  __carouzel_14_btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.hash = '__carouzel_14_id_4';
    window.location.reload();
  });
  __carouzel_14_btnrem.addEventListener('click', function (e) {
    e.preventDefault();
    history.replaceState(null, null, ' ');
    window.location.reload();
  });
  __carouzel_instance.init('#__carouzel_14', {
    trackUrlHash: true,
    appendUrlHash: true,
  });
  if (document.querySelectorAll('#__carouzel_15').length > 0) {
    __carouzel_instance.init('#__carouzel_15');
  }
  var navlinks = document.querySelectorAll('#topnav li a');
  for (var k = 0; k < navlinks.length; k++) {
    navlinks[k].addEventListener('click', function (event) {
      event.preventDefault();
      setTimeout(function () {
        window.location.hash = event.target.getAttribute('href');
      }, 0);
    });
  }
  var clipcopied = new bootstrap.Toast(document.getElementById('clipcopied'));
  var clipbrd_click = document.getElementById('clipbrd_click');
  clipbrd_click.addEventListener('click', function (event) {
    navigator.clipboard.writeText(event.target.getAttribute('data-clipboard'));
    clipcopied.show();
  });
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
