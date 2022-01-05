var loadIO = function () {
  var isInit = '';
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

  var __carouzel_instance = Carouzel.Root.getInstance();
  __carouzel_instance.init('#__carouzel_1');
  __carouzel_instance.init('#__carouzel_2', {
    slidesToShow: 3,
    slidesToScroll: 3,
  });
  __carouzel_instance.init('#__carouzel_3', {
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
  });
  __carouzel_instance.init('#__carouzel_4', {
    slidesToShow: 1,
    animationEffect: 'fade',
    speed: 500,
    responsive: [
      {
        breakpoint: 700,
        slidesToScroll: 3,
        slidesToShow: 3,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_6', {
    slidesToShow: 1,
    autoplay: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
      },
      {
        breakpoint: 1100,
        slidesToScroll: 3,
        slidesToShow: 3,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_7', {
    slidesToShow: 1,
    isInfinite: false,
    responsive: [
      {
        breakpoint: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
      },
      {
        breakpoint: 1100,
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
    showNav: false,
    spaceBetween: 20,
    responsive: [
      {
        breakpoint: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNav: true,
        spaceBetween: 30,
      },
      {
        breakpoint: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        spaceBetween: 40,
      },
    ],
  });
  __carouzel_instance.init('#__carouzel_12', {
    slidesToShow: 1,
    showNav: false,
    isInfinite: false,
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
  });
  var gotoslideinput = document.getElementById('gotoslideinput');
  var gotonextbtn = document.getElementById('gotonextbtn');
  var gotoprevbtn = document.getElementById('gotoprevbtn');
  var destroybtn = document.getElementById('destroybtn');
  var initbtn = document.getElementById('initbtn');

  var carouzel8Settings = {
    showNav: false,
    beforeInit: function () {
      toastBeforeInit.show();
    },
    afterInit: function () {
      toastAfterInit.show();
    },
    beforeScroll: function () {
      toastBeforeScroll.show();
    },
    afterScroll: function () {
      toastAfterScroll.show();
    },
    responsive: [
      {
        breakpoint: 700,
        showNav: true,
      },
    ],
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
  gotoslideinput.addEventListener('change', function (event) {
    __carouzel_instance.goToSlide('#__carouzel_8', gotoslideinput.value);
  });
  var __carouzel_13form = document.getElementById('__carouzel_13form');
  var easingfnselect = document.getElementById('easingfnselect');
  var effectfnselect = document.getElementById('effectfnselect');
  var easingNumText = document.getElementById('easingNumText');
  var carouzel_13settings = {
    slidesToShow: 1,
    showNav: false,
    spaceBetween: 8,
    timingFunction: 'linear',
    animationSpeed: 400,
    animationEffect: 'scroll',
    responsive: [
      {
        breakpoint: 700,
        slidesToScroll: 2,
        slidesToShow: 2,
        showNav: true,
        spaceBetween: 16,
      },
      {
        breakpoint: 1100,
        slidesToScroll: 4,
        slidesToShow: 4,
        spaceBetween: 24,
      },
    ],
  };
  __carouzel_instance.init('#__carouzel_13', carouzel_13settings);
  __carouzel_13form.addEventListener('submit', function (event) {
    event.preventDefault();
    carouzel_13settings.timingFunction = easingfnselect.value;
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
  // __carouzel_instance.init('#__carouzel_15');
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
