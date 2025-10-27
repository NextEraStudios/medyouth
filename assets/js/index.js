gsap.registerPlugin(ScrollTrigger);

let scroll;

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const transitionOffset = 375;

initPageTransitions();

// Animation - Page Loader Short
function initLoaderShort() { 

   var tl = gsap.timeline();

   tl.set("html", { 
      cursor: "wait"
   });

   tl.set(".loading-screen", {
      opacity: 0
   });

   tl.set("html", { 
      cursor: "auto",
   });

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      pageTransitionOut();
      scroll.start();
   }, null, 0.1);

}

// Animation - Page Loader
function initLoader() { 

   var tl = gsap.timeline();

   tl.set("html", { 
      cursor: "wait"
   });

   tl.set(".loading-screen", {
      opacity: 0
   });

   tl.set("html", { 
      cursor: "auto",
   });

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      scroll.start();
   }, null, 0);

   tl.call(function() {
      ScrollTrigger.refresh();
   }, null, 0.1);

   tl.call(function() {
      ScrollTrigger.refresh();
   }, null, 0.5);

}

// Animation - Page Leave
function pageTransitionIn() {
	var tl = gsap.timeline();

   tl.call(function() {
      scroll.start();
   });

   tl.to(".main", { 
      autoAlpha: 0,
      duration: 0.3,
      ease: Power1.easeIn,
   });
  
}

// Animation - Page Enter
function pageTransitionOut() {
	var tl = gsap.timeline();
  
   tl.call(function() {
      scroll.start();
   });

   tl.set(".main", { 
      autoAlpha: 0,
   });

   tl.set(".main-wrap", { 
      y: "3em"
   });

   tl.set(".animate-pop-in", { 
      scale: 0.5
   });

   tl.to(".main", { 
      autoAlpha: 1,
      duration: 0.3,
      ease: Power1.easeOut,
      clearProps: "true"
   });

   tl.to(".main-wrap", { 
      y: 0,
      duration: 0.8,
      ease: Elastic.easeOut.config(1, 0.7),
      clearProps: "true"
   }, "<");

   tl.to(".animate-pop-in", { 
      scale: 1,
      duration: 0.8,
      ease: Elastic.easeOut.config(1, 0.7),
      clearProps: "true",
      stagger: 0.05
   }, "< 0.1");

   tl.call(function() {
      ScrollTrigger.refresh();
   }, null, 0.1);

   tl.call(function() {
      ScrollTrigger.refresh();
   }, null, 0.8);


}

function initPageTransitions() {

   barba.hooks.after(() => {
      scroll.init();
      scroll.stop();
   });

   barba.hooks.enter(() => {
      scroll.destroy();
   });

   barba.hooks.afterEnter(() => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      scroll.update();
   });

   barba.hooks.leave(() => {
      initBasicFunctions();
   });

   function initResetDataBefore() {
      $('[data-nav-desktop-dropdown-status]').attr('data-nav-desktop-dropdown-status', 'not-active');
      $('[data-nav-dropdown-status]').attr('data-nav-dropdown-status', 'not-active');
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      $('.navigation').css('pointer-events', 'none');
   }

   function initResetDataAfter() {
      $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
      $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
      $('.navigation').removeAttr('style');
   }


   barba.init({
      sync: true,
      debug: true,
      timeout:7000,
      transitions: [{
         name: 'self',
         async leave(data) {
            pageTransitionIn(data.current);
            initBarbaNavUpdate(data);
            initResetDataBefore();
            await delay(transitionOffset);
            initBarbaNavUpdate(data);
            initResetDataAfter();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            scroll.destroy();
            initSmoothScroll(data.next.container);
            initScript(); 
         },
      },
      {
         name: 'default',
         once(data) {
            initSmoothScroll(data.next.container);
            initScript();
            initLoader();
         },
         async leave(data) {
            pageTransitionIn(data.current);
            initBarbaNavUpdate(data);
            initResetDataBefore();
            await delay(transitionOffset);
            initBarbaNavUpdate(data);
            initResetDataAfter();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            scroll.destroy();
            initSmoothScroll(data.next.container);
            initScript(); 
         },
      }]
   });

   function initSmoothScroll(container) {

      // https://github.com/quentinhocde/loconative-scroll
      scroll = new LoconativeScroll({
         el: container.querySelector('[data-scroll-container]'),
         scrollToEasing: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
         smooth: true
      });

      ScrollTrigger.refresh();
   }  
}  

// Don't touch
function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}

/**
 * Refresh Nav Fixed
 */
function initBarbaNavUpdate(data) {

   const updateItems = $(data.next.html).find('[data-barba-update]');

   $('[data-barba-update]').each(function(index) {
      if($(updateItems[index]).get(0)) {
         // const newClasses = $(updateItems[index]).get(0).classList.value;
         // $(this).attr('class', newClasses);
         const newLinkStatus = $(updateItems[index]).get(0).getAttribute('data-link-status');
         $(this).attr('data-link-status', newLinkStatus);
      }
   });
}

/**
 * Fire all scripts on page load
 */
function initScript() {
   initFlickitySlider();
   initCheckWindowHeight();
   initBasicFunctions();
   initLazyLoad();
   initScrollTriggerPlayVideoInview();
   initLocoCheckScrollUpDown();
   initScrollToAnchorLoco();
   initScrollTriggerDataBackground();
   initBearlyDigitalContactForm();
   initVimeoBackground();
   initVimeoLightbox();
   initMarqueeScroll();
   initCustomCursorV2();
   initScrolltriggerAnimations();
}

/**
 * Window Inner Height Check
 */
function initCheckWindowHeight() {
   // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Basic Functions
 */
function initBasicFunctions() {
   
   // Toggle Navigation
   $('[data-navigation-toggle="toggle"]').click(function(){
      if ($('[data-navigation-status]').attr('data-navigation-status') == 'not-active') {
         $('[data-navigation-status]').attr('data-navigation-status', 'active');
      } else {
         $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      }
   });
   
   // Close Navigation
   $('[data-navigation-toggle="close"]').click(function(){
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      $('[data-nav-dropdown-status]').attr('data-nav-dropdown-status', 'not-active');
   });

   // Key ESC - Close Navigation
   $(document).keydown(function(e){
      if(e.keyCode == 27) {
         if ($('[data-navigation-status]').attr('data-navigation-status') == 'active') {
            $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
         } 
      }
   });

   // Navigation Desktop Dropdown

   // $('[data-nav-desktop-dropdown-status]').on("mouseenter mouseleave", function () { 
   //    if ($(this).attr('data-nav-desktop-dropdown-status') == 'active') { 
   //       $('[data-nav-desktop-dropdown-status]').attr('data-nav-desktop-dropdown-status', 'not-active');
   //    } else {
   //       $('[data-nav-desktop-dropdown-status]').attr('data-nav-desktop-dropdown-status', 'not-active');
   //       $(this).attr('data-nav-desktop-dropdown-status', 'active');
   //    }
   // });

   $('[data-nav-desktop-dropdown-status]').on("mouseenter", function () { 
      $('[data-nav-desktop-dropdown-status]').attr('data-nav-desktop-dropdown-status', 'not-active');
      $(this).attr('data-nav-desktop-dropdown-status', 'active');
   });

   $('[data-nav-desktop-dropdown-status]').on("mouseleave", function () { 
      $('[data-nav-desktop-dropdown-status]').attr('data-nav-desktop-dropdown-status', 'not-active');
   });

   // Navigation Mobile Dropdown
   $('[data-nav-dropdown-status]').on("click", function () { 
      if ($(this).attr('data-nav-dropdown-status') == 'active') { 
         $(this).attr('data-nav-dropdown-status', 'not-active');
      } else {
         $(this).attr('data-nav-dropdown-status', 'active').parent().siblings().find('[data-nav-dropdown-status]').attr('data-nav-dropdown-status', 'not-active');
      }
   });

   // Looping Bubble
   $('.looping-bubble').each(function(){
      var slideshow = $(this);

      function nextSlideshowSlideSwitch() {

         // Check if next or if first
         if(slideshow.find('[data-looping-bubble-status="active"]').next().length > 0) {
            slideshow.find('[data-looping-bubble-status="active"]').attr('data-looping-bubble-status', 'transitioning').next().attr('data-looping-bubble-status', 'active');
            setTimeout(function() {
               slideshow.find('[data-looping-bubble-status="transitioning"]').attr('data-looping-bubble-status', 'not-active');
            }, 800);
         }
         else {
            slideshow.find('[data-looping-bubble-status]').attr('data-looping-bubble-status', 'not-active');
            slideshow.find('[data-looping-bubble-status]').last().attr('data-looping-bubble-status', 'transitioning');
            slideshow.find('[data-looping-bubble-status]').first().attr('data-looping-bubble-status', 'active');
            setTimeout(function() {
               slideshow.find('[data-looping-bubble-status="transitioning"]').attr('data-looping-bubble-status', 'not-active');
            }, 800);
         }

         // Repeat
         setTimeout(function() {
            nextSlideshowSlideSwitch();
         }, 2000);
      }

      // First Call
      nextSlideshowSlideSwitch();

   });

   // Accordion
   $('[data-accordion-toggle]').click(function(){
      if ($(this).parent().attr('data-accordion-status') == 'active') {
         $(this).parent().attr('data-accordion-status', 'not-active').siblings().attr('data-accordion-status', 'not-active');
      }
      else {
         $(this).parent().siblings().attr('data-accordion-status', 'not-active');
         $(this).parent().attr('data-accordion-status', 'active');
      }
   });

   $('.stack-foodtruck').each(function(){
      var stackFoodtruck = $(this);
      // Stacked Cards
      var stackedIndex = 2;
      var stackedDeg = '-4deg';
      var stackedDegNegative = '4deg';
      stackFoodtruck.find('[data-stacked-image-status="not-active"]').css('transform', 'rotate(' + stackedDegNegative + ')');
      stackFoodtruck.find('[data-stacked-image-status="active"]').css('z-index', stackedIndex).css('transform', 'rotate(' + stackedDeg + ')');

      function stackSwitch() { 
         stackedIndex = stackedIndex + 1;

         if(stackedDeg == '-4deg') {
            stackedDeg = '4deg';
            stackedDegNegative = '-4deg';
         } else {
            stackedDeg = '-4deg';
            stackedDegNegative = '4deg';
         }

         stackFoodtruck.find('[data-stacked-image-status="active"').css('z-index', stackedIndex);
         gsap.fromTo(stackFoodtruck.find('[data-stacked-image-status="active"'), {
            scale: 0.9,
            rotate: stackedDegNegative,
            opacity: 0,
         },{
            scale: 1,
            rotate: stackedDeg,
            opacity: 1,
            duration: 0.5,
            ease: Elastic.easeOut.config(1, 0.7),
         });
      }
      
      function nextStackSwitch() {
         // Check if next or if first
         if(stackFoodtruck.find('[data-stacked-image-status="active"]').next().length > 0) {
            stackFoodtruck.find('[data-stacked-image-status="active"]').attr('data-stacked-image-status', 'not-active').next().attr('data-stacked-image-status', 'active');
         }
         else {
            stackFoodtruck.find('[data-stacked-image-status]').attr('data-stacked-image-status', 'not-active');
            stackFoodtruck.find('[data-stacked-image-status]').first().attr('data-stacked-image-status', 'active');
         }
      }

      function prevStackSwitch() {
         // Check if prev or if last
         if(stackFoodtruck.find('[data-stacked-image-status="active"]').prev().length > 0) {
            stackFoodtruck.find('[data-stacked-image-status="active"]').attr('data-stacked-image-status', 'not-active').prev().attr('data-stacked-image-status', 'active');
         }
         else {
            stackFoodtruck.find('[data-stacked-image-status]').attr('data-stacked-image-status', 'not-active');
            stackFoodtruck.find('[data-stacked-image-status]').last().attr('data-stacked-image-status', 'active');
         }
      }

      stackFoodtruck.find('[data-stacked-control="next"]').click(function(){
         nextStackSwitch();
         stackSwitch();
      });

      stackFoodtruck.find('[data-stacked-control="prev"]').click(function(){
         prevStackSwitch();
         stackSwitch();
      });
      

     
     
   
      $('[data-nav-id]').on('mouseenter', function() {
         let dataNavID = $(this).attr('data-nav-id');
         if($('[data-stacked-image-id="' + dataNavID + '"]').attr('data-stacked-image-status') == 'not-active') {
            stackedIndex = stackedIndex + 1;
            if(stackedDeg == '-3deg') {
               stackedDeg = '3deg';
               stackedDegNegative = '-3deg';
            } else {
               stackedDeg = '-3deg';
               stackedDegNegative = '3deg';
            }
            
            $('[data-stacked-image-id="' + dataNavID + '"]').attr('data-stacked-image-status', 'active').siblings().attr('data-stacked-image-status', 'not-active');
            $('[data-stacked-image-id="' + dataNavID + '"]').css('z-index', stackedIndex);
            gsap.fromTo($('[data-stacked-image-id="' + dataNavID + '"]'), {
               scale: 0.9,
               rotate: stackedDegNegative,
               opacity: 0,
            },{
               scale: 1,
               rotate: stackedDeg,
               opacity: 1,
               duration: 0.5,
               ease: "Expo.easeOut"
            });
         }
      });
   });

}

/**
 * Lazy Load
 */
function initLazyLoad() {
   // https://github.com/locomotivemtl/locomotive-scroll/issues/225
   // https://github.com/verlok/vanilla-lazyload
   var lazyLoadInstance = new LazyLoad({ 
      container: document.querySelector('[data-scroll-container]'),
      elements_selector: ".lazy",
   });
}


/**
 * Play Video Inview
 */
function initScrollTriggerPlayVideoInview() {

   let allVideoDivs = gsap.utils.toArray('.playpauze');

   allVideoDivs.forEach((videoDiv, i) => {

      let videoElem = videoDiv.querySelector('video')

      ScrollTrigger.create({
         scroller: document.querySelector('[data-scroll-container]'),
         trigger: videoElem,
         start: '0% 120%',
         end: '100% -20%',
         onEnter: () => videoElem.play(),
         onEnterBack: () => videoElem.play(),
         onLeave: () => videoElem.pause(),
         onLeaveBack: () => videoElem.pause(),
      });
   });
}


/**
 * Locomotive - Check Scroll up or Down
 */

function initLocoCheckScrollUpDown() {

   var lastScrollTop = 0
   var threshold = 50;

   function startCheckScroll() {
      scroll.on('scroll', (instance) => {
         var nowScrollTop = instance.scroll.y;

         if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {

            // Check Scroll Direction
            if (nowScrollTop > lastScrollTop) {
               $("[data-scrolling-direction]").attr('data-scrolling-direction', 'down');
            } else {
               $("[data-scrolling-direction]").attr('data-scrolling-direction', 'up');
            }
            lastScrollTop = nowScrollTop;

            // Check if Scroll Started
            if (nowScrollTop > threshold) {
               $("[data-scrolling-started]").attr('data-scrolling-started', 'true');
            } else {
               $("[data-scrolling-started]").attr('data-scrolling-started', 'false');
            }
         }
      });
   }
   startCheckScroll();

   // Reset instance
   barba.hooks.after(() => {
      startCheckScroll();
   });
}

/**
 * Locomotive - ScrollTo Anchor Links
 */
function initScrollToAnchorLoco() {

   $("[data-anchor-target]").click(function() {

      let targetScrollToAnchorLoco = $(this).attr('data-anchor-target');
      scroll.scrollTo(targetScrollToAnchorLoco,{
         duration: 1.2
      });

   });
}

/**
 * Scrolltrigger - Check Theme of Sections
 */
 function initScrollTriggerDataBackground() {

   // Calculate offset navigation
   const navHeight = $(".main-navigation").height();

   // Check Theme (Dark/Light)
   $('[data-theme-section]').each(function(){

      var themeName = $(this).attr('data-theme-section');
      var singleSection = gsap.utils.toArray('[data-theme-section="' + themeName +  '"]');

      singleSection.forEach(singleSection => {
         ScrollTrigger.create({
            trigger: singleSection,
            start: () => "0% " + navHeight,
            end: "100% " + navHeight,
            onEnter: () => functionAddTheme(),
            onEnterBack: () => functionAddTheme(),
            markers: false,
         });
         function functionAddTheme() {
            if ($('[data-theme-nav]').attr('data-theme-nav') == themeName) {
            } else {
               $('[data-theme-nav]').attr('data-theme-nav', themeName);
            }
         };
      });
   });

   // Check Background Color
   $('[data-bg-section]').each(function(){

      var bgColorName = $(this).attr('data-bg-section');
      var singleBgColor = gsap.utils.toArray('[data-bg-section="' + bgColorName +  '"]');

      singleBgColor.forEach(singleBgColor => {
         ScrollTrigger.create({
            trigger: singleBgColor,
            start: () => "0% " + navHeight,
            end: "100% " + navHeight,
            onEnter: () => functionAddTheme(),
            onEnterBack: () => functionAddTheme(),
            markers: false,
         });
         function functionAddTheme() {
            if ($('[data-bg-nav]').attr('data-bg-nav') == bgColorName) {
            } else {
               $('[data-bg-nav]').attr('data-bg-nav', bgColorName);
            }
         };
      });
   });
}

/**
* Plugin Custom Contact Form Bearly Digital
*/
function initBearlyDigitalContactForm() {

   window.bearly.loadforms();

   var eventContactValidate = function(event) {
      console.log('failed');
      
      const targetScrollToErrorLoco = document.querySelector('.has-error');
      scroll.scrollTo(targetScrollToErrorLoco,{
         duration: 1.75,
         offset: -160
      });
   }
  
   document.querySelectorAll('form').forEach(element => {
      element.addEventListener("validation-failed", eventContactValidate);
   });

   /* Radio hidden field */


   $('[data-form-row-type="radio"]').each(function(){

      var formTarget = $(this);

      function Populate(){
         vals = formTarget.find('input[type="radio"]:checked').map(function() {
            return this.value;
         }).get().join(', ');
         // console.log(vals);
         formTarget.find('#budget').val(vals);
      }

      formTarget.find('input[type="radio"]').on('change', function() {
         Populate();
      }).change();

   });

   /* Checkboxes hidden field */

   $('[data-form-row-type="checkbox"]').each(function(){

      var formTarget = $(this);

      function Populate(){
         vals = formTarget.find('input[type="checkbox"]:checked').map(function() {
            return this.value;
         }).get().join(', ');
         // console.log(vals);
         formTarget.find('#foodtrucks').val(vals);
      }

      formTarget.find('input[type="checkbox"]').on('change', function() {
         Populate();
      }).change();

   });
}

/**
* Flickity Slider
*/
function initFlickitySlider() {

   // Source
   // https://flickity.metafizzy.co/

   // Slider type: Cards

   $('[data-flickity-slider-type="cards"]').each(function (index) {

      var sliderIndexID = 'flickity-slider-type-cards-id-' + index;
      $(this).attr('id', sliderIndexID);

      var sliderThis = $(this);

      var flickitySliderGroup = document.querySelector('#' + sliderIndexID + ' .flickity-carousel');
      var flickitySlider = sliderThis.find('.flickity-carousel').flickity({
         // options
         watchCSS: true,
         contain: true,
         wrapAround: false,
         dragThreshold: 10,
         prevNextButtons: false,
         pageDots: false,
         cellAlign: 'left',
         selectedAttraction: 0.015,
         friction: 0.25,
         percentPosition: true,
         on: {
            'dragStart': () => {
               flickitySlider.css("pointer-events", "none");
            },
            'dragEnd': () => {
               flickitySlider.css("pointer-events", "auto");
            },
            change: function () {
               updatePagination();
            }
         }
      });

      // Flickity instance
      var flkty = flickitySlider.data('flickity');

      // previous
      var prevButton = sliderThis.find('[data-flickity-control="prev"]').on('click', function () {
         flickitySlider.flickity('previous');
      });
      // next
      var nextButton = sliderThis.find('[data-flickity-control="next"]').on('click', function () {
         flickitySlider.flickity('next');
      });
      // Get the amount of columns variable and use to calc last slide
      var inviewColumns = window.getComputedStyle(flickitySliderGroup).getPropertyValue('--columns');

      function updatePagination() {
         // enable/disable previous/next buttons
         if (!flkty.cells[flkty.selectedIndex - 1]) {
            prevButton.attr('disabled', 'disabled');
            nextButton.removeAttr('disabled'); // <-- remove disabled from the next
         } else if (!flkty.cells[flkty.selectedIndex + parseInt(inviewColumns)]) {
            nextButton.attr('disabled', 'disabled');
            prevButton.removeAttr('disabled'); //<-- remove disabled from the prev
         } else {
            prevButton.removeAttr('disabled');
            nextButton.removeAttr('disabled');
         }
      }
   });

   $('[data-flickity-slider-type="foodtrucks"]').each(function (index) {

      var sliderIndexID = 'flickity-slider-type-foodtrucks-id-' + index;
      $(this).attr('id', sliderIndexID);

      var sliderThis = $(this);

      var flickitySliderGroup = document.querySelector('#' + sliderIndexID + ' .flickity-carousel');
      var flickitySlider = sliderThis.find('.flickity-carousel').flickity({
         // options
         watchCSS: true,
         contain: true,
         wrapAround: true,
         dragThreshold: 10,
         prevNextButtons: false,
         pageDots: true,
         cellAlign: 'center',
         selectedAttraction: 0.01,
         friction: 0.125,
         percentPosition: true,
         on: {
            'dragStart': () => {
               flickitySlider.css("pointer-events", "none");
            },
            'dragEnd': () => {
               flickitySlider.css("pointer-events", "auto");
            }
         }
      });

      // Flickity instance
      var flkty = flickitySlider.data('flickity');

      // previous
      var prevButton = sliderThis.find('[data-flickity-control="prev"]').on('click', function () {
         flickitySlider.flickity('previous');
      });
      
      // next
      var nextButton = sliderThis.find('[data-flickity-control="next"]').on('click', function () {
         flickitySlider.flickity('next');
      });

   });


   $('[data-flickity-slider-type="steps"]').each(function (index) {

      var sliderIndexID = 'flickity-slider-type-steps-id-' + index;
      $(this).attr('id', sliderIndexID);

      var sliderThis = $(this);

      var flickitySliderGroup = document.querySelector('#' + sliderIndexID + ' .flickity-carousel');
      var flickitySlider = sliderThis.find('.flickity-carousel').flickity({
         // options
         watchCSS: true,
         contain: true,
         wrapAround: true,
         dragThreshold: 10,
         prevNextButtons: false,
         pageDots: true,
         cellAlign: 'center',
         selectedAttraction: 0.01,
         friction: 0.125,
         percentPosition: true,
         autoPlay: false,
         on: {
            'dragStart': () => {
               flickitySlider.css("pointer-events", "none");
            },
            'dragEnd': () => {
               flickitySlider.css("pointer-events", "auto");
            }
         }
      });

      // Flickity instance
      var flkty = flickitySlider.data('flickity');

      // previous
      var prevButton = sliderThis.parent().find('[data-flickity-control="prev"]').on('click', function () {
         flickitySlider.flickity('previous');
      });
      
      // next
      var nextButton = sliderThis.parent().find('[data-flickity-control="next"]').on('click', function () {
         flickitySlider.flickity('next');
      });

      flickitySlider.on( 'change.flickity', function( event, index ) {
         sliderThis.parent().find('[data-flickity-active-slide-progress]').text(index + 1);
         gsap.fromTo(sliderThis.parent().find('.number svg'), {
            rotate: -45,
         },{
            rotate: 0,
            duration: 3,
            ease: Elastic.easeOut,
            clearProps: true
         });
      });

   });

}

/**
* Marquee on Scroll Direction
*/
function initMarqueeScroll() {

   // Scrolling Letters Both Direction
   // https://codepen.io/GreenSock/pen/rNjvgjo
   // Fixed example with resizing
   // https://codepen.io/GreenSock/pen/QWqoKBv?editors=0010

   $('.marquee-group').each(function(index){

		  var marqueeGroup =  $(this);

      var marqueeItemsCount = marqueeGroup.find(".marquee-content").length;
      var marqueeItemsWidth = marqueeGroup.find(".marquee-content").width();
      var marqueeSpeed = marqueeGroup.find("[data-marquee-speed]").attr('data-marquee-speed') * (marqueeItemsWidth / $(window).width());

			if($(window).width() <= 600){
         marqueeSpeed = marqueeSpeed * 0.5;
      }

      let direction = 1; // 1 = forward, -1 = backward scroll

      const marqueeLeft = roll(marqueeGroup.find("[data-marquee-direction='left'] .marquee-content"), {duration: marqueeSpeed}),
      marqueeRight = roll(marqueeGroup.find("[data-marquee-direction='right'] .marquee-content"), {duration: marqueeSpeed}, true),
      scroll = ScrollTrigger.create({
         trigger: document.querySelector('[data-scroll-container]'),
         onUpdate(self) {
            if (self.direction !== direction) {
               direction *= -1;
               gsap.to([marqueeLeft, marqueeRight], {timeScale: direction, overwrite: true});
            }
            self.direction === -1 ? marqueeGroup.find("[data-marquee-status]").attr('data-marquee-status', 'normal') : marqueeGroup.find("[data-marquee-status]").attr('data-marquee-status', 'inverted');
         }
      });
   
      // helper function that clones the targets
      function roll(targets, vars, reverse) {
         vars = vars || {};
         vars.ease || (vars.ease = "none");
         const tl = gsap.timeline({
            repeat: -1,
            onReverseComplete() { 
               this.totalTime(this.rawTime() + this.duration() * 10);
            }
         }), 
         elements = gsap.utils.toArray(targets),
         clones = elements.map(el => {
            let clone = el.cloneNode(true);
            el.parentNode.appendChild(clone);
            return clone;
         }),
         positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], {position: "absolute", overwrite: false, top: el.offsetTop, left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)}));
         positionClones();
         elements.forEach((el, i) => tl.to([el, clones[i]], {xPercent: reverse ? 100 : -100, ...vars}, 0));
         window.addEventListener("resize", () => {
            let time = tl.totalTime();
            tl.totalTime(0);
            positionClones();
            tl.totalTime(time);
         });
         return tl;
      }

   });
}

/**
* Vimeo Background Embed
*/
function initVimeoBackground() {
   
   $('[data-vimeo-background-target]').each(function(index){
 
      var playerID = $(this);

      var videoIndexID = 'vimeo-background-index-' + index;
      $(this).attr('id', videoIndexID);

      var iframe = $(this).attr('id');
      var player = new Vimeo.Player(iframe);

      player.setVolume(0);

      // Loaded
      player.on('bufferend', function() {
         playerID.attr('data-vimeo-status-loaded', 'true');
         playerID.attr('data-vimeo-status-activated', 'true');
      });

      // Script to adjust scale if container is bigger as video
      function adjustVideoSizing() {

         var vimeoContainerAspectRatio = (playerID.innerHeight() / playerID.innerWidth()) * 100;
         var vimeoVideoAspectRatio = parseFloat(playerID.attr('data-vimeo-aspect-ratio'));
         console.log(vimeoVideoAspectRatio);

         if(vimeoContainerAspectRatio > vimeoVideoAspectRatio) {
            playerID.find('.vimeo-iframe-wrapper').css('width', (vimeoContainerAspectRatio / vimeoVideoAspectRatio) * 100 + "%");
         } else {
            playerID.find('.vimeo-iframe-wrapper').css('width', '');
         }
      }
      adjustVideoSizing();

      // Adjust on resize
      $(window).resize(adjustVideoSizing);
      
   });
}

/**
* Vimeo Lightbox Embed
*/
function initVimeoLightbox() {

   $('[data-vimeo-lightbox-target]').each(function(index){

      var vimeoLightbox = $(this);
      var vimeoLightboxOpenButton = $('[data-vimeo-lightbox-control="open"]');
      var vimeoLightboxCloseButton = $('[data-vimeo-lightbox-control="close"]');

      var videoIndexID = 'vimeo-lightbox-index-' + index;
      $(this).attr('id', videoIndexID);

      var iframe = $(this).attr('id');

      // New Lightbox
      vimeoLightboxOpenButton.click(function(){

         var vimeoLightboxVideoID = $(this).data('vimeo-lightbox-id');
         var vimeoLightboxPlaceholder = $(this).data('vimeo-lightbox-placeholder');
         var vimeoLightboxRatio = $(this).data('vimeo-lightbox-ratio');
         var vimeoLightboxContent = '<div class="overlay vimeo-append-content"><iframe src="https://player.vimeo.com/video/' + vimeoLightboxVideoID + '?api=1&background=1&autoplay=0&loop=0&muted=1&playsinline=1" width="640" height="360" frameborder="0" webkit-playsinline playsinline allow="autoplay;"></iframe><img class="overlay vimeo-overlay-placeholder" src="' + vimeoLightboxPlaceholder + '" /></div>';

         // Add or Replace Lightbox (Check if is new or current video)
         if(vimeoLightbox.attr('data-vimeo-lightbox-current-id') == vimeoLightboxVideoID) {
            // Nothing
         } else {
            vimeoLightbox.find('.vimeo-append-content').remove();
            vimeoLightbox.find('.single-vimeo-lightbox').append(vimeoLightboxContent);
         }

         vimeoLightbox.find('.single-vimeo-lightbox').css('--aspect-ratio',' ' + vimeoLightboxRatio);
         vimeoLightbox.attr('data-vimeo-status-activated', 'true');
         scroll.stop();

         // Check Landscape vs Portrait
         if(parseFloat(vimeoLightboxRatio) > 100) {
            vimeoLightbox.attr('data-vimeo-lightbox-orientation', 'portrait');
         } else {
            vimeoLightbox.attr('data-vimeo-lightbox-orientation', 'landscape');
         }

         // Calculate Max. Height
         var vimeoLightboxHeight = vimeoLightbox.find('.single-vimeo-calculate').innerHeight();
         var vimeoLightboxWidth = vimeoLightbox.find('.single-vimeo-calculate').innerWidth();
         var vimeoLightboxRatioNoPercent = parseInt(vimeoLightboxRatio) / 100;
         vimeoLightbox.find('.single-vimeo-calculate-wrap').css('width',' ' + (100 / ((vimeoLightboxWidth * vimeoLightboxRatioNoPercent) / vimeoLightboxHeight)) + '%');

         $(window).resize(function() {
            if(vimeoLightbox.attr('data-vimeo-status-activated') == 'true') {
               vimeoLightboxHeight = vimeoLightbox.find('.single-vimeo-calculate').innerHeight();
               vimeoLightboxWidth = vimeoLightbox.find('.single-vimeo-calculate').innerWidth();
               vimeoLightbox.find('.single-vimeo-calculate-wrap').css('width',' ' + (100 / ((vimeoLightboxWidth * vimeoLightboxRatioNoPercent) / vimeoLightboxHeight)) + '%');
            }
         });

         // New Vimeo Player
         var player = new Vimeo.Player(iframe);

         // Play Function
         function vimeoLightboxPlay() {
            vimeoLightbox.attr('data-vimeo-status-play', 'true');
            player.play();
            player.setVolume(1);
         }

         // Close Function
         function vimeoLightboxClose() {

            // Update Current Video ID
            vimeoLightbox.attr('data-vimeo-lightbox-current-id', vimeoLightboxVideoID);

            player.setVolume(0);
            scroll.start();
            vimeoLightbox.attr('data-vimeo-status-activated', 'remove');
            setTimeout(function(){
               vimeoLightbox.attr('data-vimeo-status-activated', 'false');
               vimeoLightbox.attr('data-vimeo-status-loaded', 'false');
               vimeoLightbox.attr('data-vimeo-status-play', 'false');
               player.unload();
            }, 600);
         }

         // Check Touchscreen
         function isTouchScreendevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints;      
         };
         if(isTouchScreendevice()){
            // No autoplay on touch screen devices
         } else {
            vimeoLightboxPlay();
         }

         // Play
         vimeoLightbox.find('[data-vimeo-control="play"]').click(function(){
            vimeoLightboxPlay();
         });

         // Pause
         vimeoLightbox.find('[data-vimeo-control="pause"]').click(function(){
            vimeoLightbox.attr('data-vimeo-status-play', 'false');
            player.pause();
         });

         // Loaded
         player.on('play', function() {
            vimeoLightbox.attr('data-vimeo-status-loaded', 'true');
         });

         // Close Mouse Click
         vimeoLightboxCloseButton.click(function(){
            vimeoLightboxClose();
         });

         // Close Esc Key
         $(document).keydown(function(e){
            if(e.keyCode == 27) {
               vimeoLightboxClose();
            }
         });

         // Mute
         vimeoLightbox.find('[data-vimeo-control="mute"]').click(function(){
            if (vimeoLightbox.attr('data-vimeo-status-muted') == 'false') {
               player.setVolume(0);
               vimeoLightbox.attr('data-vimeo-status-muted', 'true');
            } else {
               player.setVolume(1);
               vimeoLightbox.attr('data-vimeo-status-muted', 'false');
            }
         });

         // Convert number into seconds & hrs
         // https://stackoverflow.com/questions/11792726/turn-seconds-into-hms-format-using-jquery
         function secondsTimeSpanToHMS(s) {
            var h = Math.floor(s / 3600); //Get whole hours
            s -= h * 3600;
            var m = Math.floor(s / 60); //Get remaining minutes
            s -= m * 60;
            return (m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
         }

         // Duration
         var vimeoDuration = vimeoLightbox.find('.vimeo-duration .duration');
         player.getDuration().then(function(duration) {
            vimeoDuration.text(secondsTimeSpanToHMS(duration));
            vimeoLightbox.find('[data-vimeo-control="timeline"], progress').attr('max', duration);
         });

         // Timeline
         vimeoLightbox.find('[data-vimeo-control="timeline"]').on("input change", function() {
            player.getDuration().then(function(duration) {
               var timeVal = vimeoLightbox.find('[data-vimeo-control="timeline"]').val();
               player.setCurrentTime(timeVal);
               vimeoLightbox.find('progress').attr('value', timeVal);
            });
         });

         // Progress Time & Timeline
         var vimeoTime = vimeoLightbox.find('.vimeo-duration .time');
         player.on('timeupdate', function(data) {
            vimeoLightbox.find('[data-vimeo-control="timeline"], progress').val(data.seconds);
            vimeoTime.text(secondsTimeSpanToHMS(Math.trunc(data.seconds)));
         });

         // Remove Controls after hover
         var vimeoHoverTimer;
         $(document).on("mousemove", function() {
            if (vimeoLightbox.attr('data-vimeo-status-hover') == 'false') {
               //Show the element
               vimeoLightbox.attr('data-vimeo-status-hover', 'true');
            } else {
               //Reset the timer to X amount of ms
               clearTimeout(vimeoHoverTimer);
               vimeoHoverTimer = setTimeout(vimeoHoverTrue, 2000);
            }
         });
         function vimeoHoverTrue() {
            vimeoLightbox.attr('data-vimeo-status-hover', 'false');
         }

         // Ended
         var onEnd = function(data) {
            vimeoLightboxClose();
         };

         player.on('ended', onEnd);
      });
   });
}

/**
* Custom Cursor
*/
function initCustomCursorV2() {

   const cursorObject = document.querySelector(".custom-cursor");
   const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
   const mousePos = { x: cursorPos.x, y: cursorPos.y};

   var cursorMoveSpeed = 0.2;
   var cursorSpeed = cursorMoveSpeed;
   var cursorActive = false;

   const xCursorSet = gsap.quickSetter(cursorObject, "x", "px");
   const yCursorSet = gsap.quickSetter(cursorObject, "y", "px");

   window.addEventListener("mousemove", e => {    
      mousePos.x = e.x;
      mousePos.y = e.y;  
   });
   
   gsap.ticker.add(customCursor);
   
   function customCursor(){
      if(!cursorActive){
         const dt = 1.0 - Math.pow(1.0 - cursorSpeed, gsap.ticker.deltaRatio()); 
         cursorPos.x += (mousePos.x - cursorPos.x) * dt;
         cursorPos.y += (mousePos.y - cursorPos.y) * dt;
         xCursorSet(cursorPos.x);
         yCursorSet(cursorPos.y);
      }
   }

   // Mouse Init
   $(document).on('mousemove', function() {
      if ($('[data-cursor-init]').attr('data-cursor-init') == 'false') {
         $('[data-cursor-init]').attr('data-cursor-init', 'true');
      }
   });

   // GIF Hover
   $('[data-cursor-gif-target]').on('mouseenter', function() {
      let dataCursorGIF = $(this).attr('data-cursor-gif-target');
      $('[data-cursor-gif]').attr('data-cursor-gif', 'active');
      $('[data-cursor-gif-id="' + dataCursorGIF + '"]').addClass('active').siblings().removeClass('active');
      $('[data-cursor-gif-id="' + dataCursorGIF + '"]').find('video').trigger('load').trigger('play');
   });
   $('[data-cursor-gif-target]').on('mouseleave', function() {
      $('[data-cursor-gif]').attr('data-cursor-gif', 'not-active');
   });   

   // Reset Cursor on page leave
   barba.hooks.leave(() => {
      setTimeout(function() {
         $('[data-cursor-init]').attr('data-cursor-init', 'false');
         $('[data-cursor-gif]').attr('data-cursor-gif', 'not-active');
      }, 500);
   });
}

/**
* Scrolltrigger Animations Desktop + Mobile
*/
function initScrolltriggerAnimations() {
    
   if(document.querySelector('.section-intro-home .sticker')) {
     // Scrolltrigger Animation : Example
     $('.section-intro-home .sticker').each(function (index) {
       let triggerElement = $(this);
       let targetElement = $(this).find('img');
     
       let tl = gsap.timeline({
         scrollTrigger: {
           trigger: triggerElement,
           start: "0% 100%",
           end: "100% 0%",
           scrub: 0
         }
       });
       
       tl.to(targetElement, {
         rotate: 30,
         ease: "none"
       });
     });
   }

   if(document.querySelector(".section-stats")) {
      $(".section-stats").each(function (index) {
        let triggerElement = $(this);
        let targetElement = $(this).find(".count-up");
      
         let tl = gsap.timeline({
            scrollTrigger: {
               trigger: triggerElement,
               start: "0% 70%",
               end: "100% 0%"
            }
         });
         tl.from(targetElement, {
            duration: 1.5,
            ease: Expo.easeOut,
            innerText: 0,
            roundProps: "innerText",
            stagger: 0.1,
            onUpdate: function() {
               this.targets().forEach(target => {
                  const val = gsap.getProperty(target, "innerText");
                  target.innerText = numberWithCommas(val);
               });
            },
         }, "<");

         function numberWithCommas(n) {
            var parts=n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
         }
      });
   }
}