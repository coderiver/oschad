var $ = jQuery.noConflict();
localStorage['FSize']=10;

(function($) {
	//"use strict";
	
	/* ============================================================
								FUNCTIONS
	============================================================ */
	
	/* check for the existence of elements */
	$.fn.exists = function(){return this.length>0;}
	
	
	/*mobile definition*/
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	
	
	
	//check mobile or desktop
    function checkWindowWidth() {
        var mq = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
        return ( mq == 'mobile' ) ? false : true;
    }
	
	
	
	
	//dropdown menu
	function custom_nav_menu() {
	
		//open/close mega-navigation
		$('.dropdown-trigger').on('click', function(event){
			event.preventDefault();
			toggleNav();
		});
	
		//close meganavigation
		$('.dropdown-nav .nav-close').on('click', function(event){
			event.preventDefault();
			toggleNav();
		});
	
		//on mobile - open submenu
		$('.has-children').children('a').on('click', function(event){
			//prevent default clicking on direct children of .has-children 
			if (Modernizr.touch) {
				event.preventDefault();
			}
			var selected = $(this);
			selected.next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('move-out');
		});
	
		//on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
		var submenuDirection = ( !$('.dropdown-wrapper').hasClass('open-to-left') ) ? 'right' : 'left';
		$('.dropdown-nav-content').menuAim({
			activate: function(row) {
				$(row).children().addClass('is-active').removeClass('fade-out');
				if( $('.dropdown-nav-content .fade-in').length == 0 ) $(row).children('ul').addClass('fade-in');
			},
			deactivate: function(row) {
				$(row).children().removeClass('is-active');
				if( $('li.has-children:hover').length == 0 || $('li.has-children:hover').is($(row)) ) {
					$('.dropdown-nav-content').find('.fade-in').removeClass('fade-in');
					$(row).children('ul').addClass('fade-out')
				}
			},
			exitMenu: function() {
				$('.dropdown-nav-content').find('.is-active').removeClass('is-active');
				return true;
			},
			submenuDirection: submenuDirection,
		});
	
		//submenu items - go back link
		$('.go-back').on('click', function(){
			var selected = $(this),
				visibleNav = $(this).parent('ul').parent('.has-children').parent('ul');
			selected.parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('move-out');
		}); 
	
		function toggleNav(){
			var navIsVisible = ( !$('.dropdown-nav').hasClass('dropdown-is-active') ) ? true : false;
			$('body').toggleClass('nav-is-open', navIsVisible);
			$('.dropdown-nav').toggleClass('dropdown-is-active', navIsVisible);
			$('.dropdown-trigger').toggleClass('dropdown-is-active', navIsVisible);
			if( !navIsVisible ) {
				$('.dropdown-nav').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
					$('.has-children ul').addClass('is-hidden');
					$('.move-out').removeClass('move-out');
					$('.is-active').removeClass('is-active');
				});	
			}
		}
		
		
		
		
		
		
		//change this breakpoint in the master.css file (body::before)
        var $search_nav = $('#site-navigation .has-form'),
			$site_navigation = $('#site-navigation'),
			$menu_title = $site_navigation.find('.menu-title')
			$main_menu = $('#main-menu');
			
			var $container = $('.dropdown-all').masonry({ itemSelector: 'li.has-children' });
		
        //move .search-nav inside header on laptop
		//change nav class
        move_elements();
		change_classes();
		masonry_menu();
       $( window).resize( function(){
            //move_elements();
			(!window.requestAnimationFrame) ? setTimeout(move_elements, 300) : window.requestAnimationFrame(move_elements);
			change_classes();
			masonry_menu();
        });
		
		//change class for nav desktop/mobile
		function change_classes() {
			var desktop = checkWindowWidth();
			
			if( desktop /*&& $main_menu.hasClass('dropdown-nav-content')*/) {
				$main_menu.removeClass('dropdown-nav-content').addClass('inline-nav-content');
				$site_navigation.removeClass('dropdown-nav').addClass('inline-nav');
				//$('body').removeClass('overflow-hidden');
			} else {
				$main_menu.removeClass('inline-nav-content').addClass('dropdown-nav-content');
				$site_navigation.removeClass('inline-nav').addClass('dropdown-nav');
				//$('body').removeClass('overflow-hidden');
			}
		}
		
		
		//move search nav in DOM
		function move_elements() {
			var screenSize = checkWindowWidth();
		   
			if ( screenSize ) {
				$search_nav.detach();
				$search_nav.insertBefore('#main-menu .dropdown-all');
			   
			} else {
				$search_nav.detach();
				$search_nav.insertBefore('#main-menu > li:first-child');				
			}
		}
		
		
		
		function masonry_menu() {
			
			var screenSize = checkWindowWidth();
			
			
			if(screenSize) {
				$container.masonry({ itemSelector: 'li.has-children' });
				//console.log(screenSize);
			} else {					
				$container.masonry('destroy');
			}
				//isActive = !isActive;
			
		}
		
	}
	
	
	
	
	/*tabs*/
	function custom_tabs() {
		if ($('.tabs-container').exists()) {
			var tabs = $('.tabs-container');
	
			tabs.each(function(){
				var tab = $(this),
					tabItems = tab.find('ul.tabs-navigation'),
					tabContentWrapper = tab.children('div.panes'),
					tabNavigation = tab.find('nav');
		
				tabItems.on('click', 'a', function(event){
					event.preventDefault();
					var selectedItem = $(this);
					if( !selectedItem.hasClass('selected') ) {
						var selectedTab = selectedItem.data('content'),
							selectedContent = tabContentWrapper.find('div.pane[data-content="'+selectedTab+'"]'),
							slectedContentHeight = selectedContent.innerHeight();
						
						tabItems.find('a.selected').removeClass('selected');
						selectedItem.addClass('selected');
						selectedContent.addClass('selected').siblings('div.pane').removeClass('selected');
						//animate tabContentWrapper height when content changes 
						tabContentWrapper.animate({
							'height': slectedContentHeight
						}, 200);
					}
				});
				
			});
			
			$(window).on('resize', function(){
				tabs.each(function(){
					var tab = $(this);
					tab.find('div.panes').css('height', 'auto');
				});
			});
		}
	}
	
	
	
	/*tabs select*/
	function custom_tabs_select() {
		if ($('.tabs-container-select').exists()) {
			var tabs = $('.tabs-container-select');
	
			tabs.each(function(){
				var tab = $(this),
					tabItems = tab.find('ul.tabs-nav'),
					tabContentWrapper = tab.children('div.panes'),
					tabNavigation = tab.find('nav'),
					tabTriggerBtn = tab.find('nav').find('.placeholder a'),
					currentTrigger = tabItems.find('a.selected'),
					currentTriggerText = currentTrigger.html();
		
				tabTriggerBtn.html(currentTriggerText);
				
				tabTriggerBtn.on('click', function(event){
					event.preventDefault();
					var selectedItem = $(this);
					selectedItem.parents('nav').toggleClass('is-active');
					hideTabNav();
				});
				
				function hideTabNav() {
					$(document).on('click', function(event){
						if( !$(event.target).is(tabTriggerBtn)) {
							tabTriggerBtn.parents('nav').removeClass('is-active');
						}
					});
				}
		
				tabItems.on('click', 'a', function(event){
					event.preventDefault();
					var selectedItem = $(this);
					if( !selectedItem.hasClass('selected') ) {
						var selectedTab = selectedItem.data('content'),
							selectedContent = tabContentWrapper.find('div.pane[data-content="'+selectedTab+'"]'),
							slectedContentHeight = selectedContent.outerHeight();
							console.log(slectedContentHeight+'-'+$('.currency-rate-section>.content').innerHeight());
						
						tabItems.find('a.selected').removeClass('selected');
						selectedItem.addClass('selected');
						selectedContent.addClass('selected').siblings('div.pane').removeClass('selected');
						
						//change text in placeholder
						tabTriggerBtn.html(selectedItem.html());						
						
						if($('.currency-rate-section>.content').innerHeight() < slectedContentHeight+20)
							bottPadding='; padding-bottom: 20px;';
						//animate tabContentWrapper height when content changes 
						tabContentWrapper.animate({
							'height': slectedContentHeight+bottPadding
						}, 200);
					}
				});
				
			});
			
			$(window).on('resize', function(){
				tabs.each(function(){
					var tab = $(this);
					tab.find('div.panes').css('height', 'auto');
				});
			});
		}
	}
	
	
	
	
	
	
	
	
	//move currency nav in DOM
	/*function currency_nav() {
		if ($('.currency-rate-section').exists()) {
			var $currencyNav = $('.currency-rate-section .tabs-container-select').find('nav');
			$(window).on('load', function(){
				$currencyNav.detach();
				$currencyNav.insertBefore('.currency-rate-section div.panes');
			});
		}
	}*/
	
	
	
	
	
	//accordion
	function custom_accordion() {
		if ($('.accordion').exists()) {
			
			function close_accordion_item() {
				$('.accordion .accordion-item-title').removeClass('is-active');
				$('.accordion .accordion-item-content').slideUp(300);
			}
			
			$('.accordion-item-title').click(function(e) {
				// Grab current anchor value
				e.preventDefault();
		
				if($(e.target).is('.is-active')) {
					close_accordion_item();
				} else {
					close_accordion_item();			
					// Add active class to section title
					$(this).addClass('is-active');
					// Open up the hidden content panel
					$(this).next('.accordion-item-content').slideDown(300);
				}
			});
			
		} //end if
	}
	
	
	
	
	
	
	
	//font size change
	function change_fontSize() {
		var smaller = $('.font-switcher').find('a.smaller-trigger'),
			bigger = $('.font-switcher').find('a.bigger-trigger'),
			$body = $('body');
		
		/*
		
		function change_size(element, size) {
			var current = parseInt(element.css('font-size'));
			if(size = 'smaller') {
				var new_size = current - 2;
			} else if(size = 'bigger') {
				var new_size = current + 2;
			}
			element.css('font-size', new_size + 'px');
		}
		*/
		
		smaller.click( function(event) {
			if(parseInt($('html').css('font-size'))>10){
				event.preventDefault();
				//change_size($body, 'smaller')
				$('html').css('font-size', '-=2');
				localStorage['FSizePX']=$('html').css('font-size');
			}
		});
		bigger.click( function(event) {
			if(parseInt($('html').css('font-size'))<22){
				event.preventDefault();
				//change_size($body, 'smaller')
				$('html').css('font-size', '+=2');
				localStorage['FSizePX']=$('html').css('font-size');
			}
		});		
		
	}
		
	
	
	
	
	
	//custom popup
	function custom_popup() {
		//open popup
		$('.popup-trigger').on('click', function(event){
			var triggerBtn = $(this),
				siteContainer = $('.site-container');
				selectedTrigger = triggerBtn.data('content'),
				selectedPopup = siteContainer.find('div.popup[data-content="'+selectedTrigger+'"]');				
			event.preventDefault();
			selectedPopup.addClass('is-visible');
			$('html').addClass('overflow-hidden');
		});
		
		//close popup
		$('.popup').on('click', function(event){
			if( $(event.target).is('.popup-close, .btn-reset') || $(event.target).is('.popup') ) {
				//event.preventDefault();
				$(this).removeClass('is-visible');
				$('html').removeClass('overflow-hidden');
			}
		});
		
		//close popup when clicking the esc keyboard button
		$(document).keyup(function(event){
			if(event.which=='27'){
				$('.popup').removeClass('is-visible');
				$('html').removeClass('overflow-hidden');
			}
		});
	}
	
	
	
	
	
	
	
	/*SLIDE CAPTIONS*/		
	function slideBoxes() {
		if($('.deposit-label-container').exists()) {
			if (Modernizr.touch) {
				$('.deposit-label-container .deposit-label').on('click', function(event){
					event.preventDefault();
					$(this).toggleClass('is-open');
				});
			} else {
				$('.deposit-label').hover(
					function() {
						$(this).find('.slide-box').slideDown(150);
					}, function() {
						$(this).find('.slide-box').slideUp(200);
					}
				);
				
				/*
				$('.deposit-label-container').on({
					mouseenter : function() {
						$(this).find('.slide-box').slideDown(150);               
					},
					mouseleave : function() {
						$(this).find('.slide-box').slideUp(200);            
					}
				},'.deposit-label');
				*/
			}
		}
	}
	
	
	
	
	
	/*sliders*/
	function custom_sliders() {
		
		if($('.main-slider').exists()) {
			$('.main-slider').slick({
				//lazyLoad: 'progressive',
				//adaptiveHeight: true,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 5000,
				speed: 500,
				arrows: false,
				dots: true,
				fade: true,
				cssEase: 'linear',		
				slidesToShow: 1,
				slidesToScroll: 1,
				//mobileFirst: true,	
				responsive: [
					{
						breakpoint: 1100,
						settings: {							
							dots: false,
							fade: false,
						}
					},					
					// You can unslick at a given breakpoint now by adding:
					// settings: "unslick"
					// instead of a settings object
				]			
			});						
		}
		
		
		
		if($('.sync-slider-for').exists()) {
			$('.sync-slider-for').slick({
				//lazyLoad: 'progressive',
		  		slidesToShow: 1,
		  		slidesToScroll: 1,
		  		arrows: false,
		  		fade: true,
		  		asNavFor: '.sync-slider-nav',
				responsive: [
					{
						breakpoint: 1099,
						settings: {							
							dots: false,
							fade: false,
						}
					},					
					// You can unslick at a given breakpoint now by adding:
					// settings: "unslick"
					// instead of a settings object
				]
			});
			$('.sync-slider-nav').slick({
				//lazyLoad: 'progressive',
		  		slidesToShow: 5,
		  		slidesToScroll: 1,
				//infinite: false,
		  		asNavFor: '.sync-slider-for',
		  		//dots: true,
		  		//centerMode: true,
				//centerPadding: '20px',
		  		focusOnSelect: true
			});
		}
		
		if($('.arrow-slider').exists()) {
			$('.arrow-slider').slick({
				dots: false,
				arrows: false,
				infinite: true,
				speed: 300,
				slidesToShow: 1,
				adaptiveHeight: true
			});			
			
			$('.slide-next').click(function(){
				$(".vip-select-slider").slick('slickNext');
			});
			
			$('.slide-prev').click(function(){
				$(".vip-select-slider").slick('slickPrev');
			});
		}
	}
	
	
	

	/*media*/
	/*Video Preload - YouTube*/
	/*
	//function video_preload() {
		if($('.video-content').exists()) {
			$(".video-content").each(function() {
				// Based on the YouTube ID, we can easily find the thumbnail image
				$(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');
				// Overlay the Play icon to make it look like a video player
				$(this).append($('<div/>', {'class': 'play'}));
				$(document).delegate('#'+this.id, 'click', function() {
					// Create an iFrame with autoplay set to true
					var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
					if (Modernizr.touch) {
						window.location.href = iframe_url;
						return false;
					}
					if ($(this).data('params')) iframe_url+='&'+$(this).data('params');
					// The height and width of the iFrame should be the same as parent
					var iframe = $('<iframe/>', {'frameborder': '0','allowfullscreen':'', 'enablejsapi':'1', 'version':'3', 'src': iframe_url })
					// Replace the YouTube thumbnail with YouTube HTML5 Player
					$(this).replaceWith(iframe);
				});			
			});
		}*/
	//}
	
	//fixed credit form
	function custom_credit_form() {
		if($('.credit-form-container').exists()) {
		
			//update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
			var MqM= 768,
				MqL = 1099;
				
			var creditFormContainer = $('.credit-form-container'),
				creditInfoContainer = $('.credit-fixed-container > .inner-content');
				
				
				//update category sidebar while scrolling
			$(window).on('scroll', function(){
				if ( $(window).width() > MqL ) {
					(!window.requestAnimationFrame) ? updateFormPosition() : window.requestAnimationFrame(updateFormPosition); 
				}
			});
		
			$(window).on('resize', function(){
				if($(window).width() <= MqL) {
					creditFormContainer.removeClass('is-fixed').css({
						'-moz-transform': 'translateY(0)',
						'-webkit-transform': 'translateY(0)',
						'-ms-transform': 'translateY(0)',
						'-o-transform': 'translateY(0)',
						'transform': 'translateY(0)',
					});
				}	
				if( creditFormContainer.hasClass('is-fixed') ) {
					//var $pad = $('.container').css('padding-right').split('px'),
						//$pos = Number($pad[0])+($('#flag').offset().left + 1) - $('.credit-form-container').width(),
						//$m = ($('.credit-entry-content').width() - $('.container').outerWidth())/2;
					creditFormContainer.css({
						//'left': Number($pos) - Number($m),
						//'left': $(window).width() - (creditInfoContainer.offset().left + creditInfoContainer.width()),
					});
					
					
					

				}
			});
			
			
			function updateFormPosition() {
				var $negativeMargin = 330,
					top = $('.credit-fixed-container').offset().top - $negativeMargin,
					height = $('.credit-fixed-container').height() - $('.credit-form-container').height(),
					margin = 20;
					//$pad = $('.container').css('padding-right').split('px'),
					//$pos = Number($pad[0])+($('#flag').offset().left + 1)-$('.credit-form-container').width();
				    height += $negativeMargin;
				if( top - margin <= $(window).scrollTop() && top - margin + height > $(window).scrollTop() ) {
					
					var leftValue = creditFormContainer.offset().left,
						widthValue = creditFormContainer.width();
					creditFormContainer.addClass('is-fixed').css({
						//'left': $pos,
					  	'top': margin /*+ 64*/,
					  	'-moz-transform': 'translateZ(0)',
					  	'-webkit-transform': 'translateZ(0)',
					  	'-ms-transform': 'translateZ(0)',
					 	'-o-transform': 'translateZ(0)',
					 	'transform': 'translateZ(0)',
					});
				} else if( top - margin + height <= $(window).scrollTop()) {					
					var delta = top - margin + height - $(window).scrollTop();
					creditFormContainer.css({
						//'top': margin + 84,
						'-moz-transform': 'translateZ(0) translateY('+delta+'px)',
						'-webkit-transform': 'translateZ(0) translateY('+delta+'px)',
						'-ms-transform': 'translateZ(0) translateY('+delta+'px)',
						'-o-transform': 'translateZ(0) translateY('+delta+'px)',
						'transform': 'translateZ(0) translateY('+delta+'px)',
					});
				} else { 
    				//var $pad = $('.container').css('padding-right').split('px'),
						//$pos = Number($pad[0])+($('#flag').offset().left + 1)-$('.credit-form-container').width(),
						//$m = ($('.credit-entry-content').width() - $('.container').outerWidth())/2;
					
					creditFormContainer.removeClass('is-fixed').css({
						//'left': Number($pos) - Number($m),
						'right': 20,
						'top': -330,
					});
				}
			}
		}
	}
	
	
	
	//slick page nav
	function custom_page_nav() {
		if ($('.page-nav').exists()) {
		
			var contentSections = $('.page-section'),
				navigationItems = $('.page-nav a');
			
			function updateNavigation() {
				contentSections.each(function(){
					$this = $(this);
					var activeSection = $('.page-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
					if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
						navigationItems.eq(activeSection).addClass('is-selected');
					}else {
						navigationItems.eq(activeSection).removeClass('is-selected');
					}
				});
			}
			
			updateNavigation();
			$(window).on('scroll', function(){
				updateNavigation();
			});
		
			//smooth scroll to the section
			navigationItems.on('click', function(event){
				event.preventDefault();
				smoothScroll($(this.hash));
			});
		
		
			function smoothScroll(target) {
				$('body,html').animate(
					{'scrollTop':target.offset().top},
					600
				);
			}
		
		}
	}
	
	
	
	
	
	
	
	//SIDEBAR SETTINGS
	function custom_sidebar() {	
		//cache DOM elements
		var siteBody = $('body'),
			sidebar = $('.side-nav');		

		if (Modernizr.touch) {
			$(sidebar).on('click', function(event){
				event.preventDefault();
				$(siteBody).toggleClass('side-nav-is-open');
			});
		
			$('.site-overlay').on('click', function(){
				$(siteBody).removeClass('side-nav-is-open');
			});
			
		} else {
			sidebar.hover(function(){
				$(siteBody).toggleClass('side-nav-is-open');
			});
		}	
						
		//change Class		
		function positionSideNavBottom() {
		
			var sideNavBottom = $('.side-nav .bottom'),
			sideNavBottomHeight = sideNavBottom.outerHeight(),
			sideNavPrimaryHeight = $('.side-nav .primary').outerHeight(),
			sideNavSecondaryHeight = $('.side-nav .secondary').outerHeight(),
			sideNavSearchHeight = $('.side-nav .site-search').outerHeight(),
			sumHeight = sideNavBottomHeight + sideNavPrimaryHeight + sideNavSecondaryHeight + sideNavSearchHeight,
			windowHeight = $(window).height() + 100;
			
			if (sumHeight > windowHeight) {
				sideNavBottom.removeClass('is-absolute');
			} else {
				sideNavBottom.addClass('is-absolute');
				
			}
			
		
		}
		positionSideNavBottom();
		$(window)
			.scroll(positionSideNavBottom)
			.resize(positionSideNavBottom)
			
	}
	
	
	
	
	
	//FLOATING LABELS
	function custom_form_labels() {
		if ($('.floating-labels').exists()) {	
			var inputFields = $('.floating-labels .form-control-label').next();		
			
			inputFields.each(function(){
				var singleInput = $(this);
				
				inputFields.focus(function() {
					$("label[for='" + this.id + "']").addClass("float");
				}).blur(function() {
					checkVal(singleInput);
					singleInput.on('change blur', function(){
						checkVal(singleInput);
					});
				});
				
			});			
			
			function checkVal(inputField) {
				( inputField.val() == '' ) ? inputField.prev('.form-control-label').removeClass('float') : inputField.prev('.form-control-label').addClass('float');
			}			
			
			$('.btn-reset').on('click', function(event){
				inputFields.prev('.form-control-label').removeClass('float');
			});		
		}
	}
		
	
	
	
	//custom open card nav
	function custom_card_nav() {
		var triggerBtn = $('a.current-tp');
		//open nav
		triggerBtn.on('click', function(event){	
			var selectedItem = $(this);
			event.preventDefault();
			selectedItem.parent('.card-tp').toggleClass('is-open');
			hideCardNav();			
		});
		
		function hideCardNav() {
			$(document).on('click', function(event){
				if( !$(event.target).is(triggerBtn)) {
					triggerBtn.parent('.card-tp').removeClass('is-open');
				}
			});
		}
	}
	
	
	
	
	//custom topNav settings
	function custom_top_nav() {	
		var topTriggerBtn = $('.top-navigation span.placeholder'),
			currentItem = $('.top-navigation li.current-menu-item'),
			currentItemText = currentItem.find('a').text();
		
		topTriggerBtn.html(currentItemText);
		//currentItem.hide();
		//open nav
		topTriggerBtn.on('click', function(event){	
			var selectedItem = $(this);
			event.preventDefault();
			selectedItem.parents('.top-navigation').toggleClass('is-open');
			hideTopNav();			
		});
		
		function hideTopNav() {
			$(document).on('click', function(event){
				if( !$(event.target).is(topTriggerBtn)) {
					topTriggerBtn.parents('.top-navigation').removeClass('is-open');
				}
			});
		}
	}
	
	
	
	//custom language switcher settings
	function custom_lang_switch() {	
		var topTriggerBtn = $('.lang-switcher span.placeholder'),
			currentItem = $('.lang-switcher li.current-lang'),
			currentItemText = currentItem.find('a').text();
		
		topTriggerBtn.html(currentItemText);
		//currentItem.hide();
		//open nav
		if (Modernizr.touch) {
			topTriggerBtn.on('click', function(event){	
				var selectedItem = $(this);
				event.preventDefault();
				selectedItem.parents('.lang-switcher').toggleClass('is-open');
				hideTopNav();			
			});
			
			function hideTopNav() {
				$(document).on('click', function(event){
					if( !$(event.target).is(topTriggerBtn)) {
						topTriggerBtn.parents('.lang-switcher').removeClass('is-open');
					}
				});
			}
		} // end if touch
	}
	
	
	/*NEW FUNCTIONS*/
	
	function calculateCredit(){
		if($('.credit-form-container').length > 0){
			$(document).on('click','#calculate',function(){
				var $_time = $('#timeCount').attr('data-time');
				var $_timeCount = $('#timeCount').val();
				var $_creditSum = $('#creditSum').val();
				
				$.ajax({
					type: 'GET',
					url: "/include/uamaster/credit_calculator_new.php",
					data: {creditSum:$_creditSum, creditPercent:$_creditPercent, timeCount: $_timeCount,creditType:$_creditType, time: $_time},
					dataType: "HTML",
					success: function(res){
						$('#section2 .section-content').html(res);
						$('html, body').animate({
							scrollTop: $('#section4 .container').offset().top
						}, 1000);
					}
				});
			})
		}
	}
	
	function calculateCreditOnLoad(){
		if($('.credit-form-container').length > 0){
			if($_creditType == "A" || $_creditType == "C" || $_creditType == "AC"){
				var $_minSum = $('#timeCount').data('minvalue');
				if($_minSum <= 0){
					$_minSum = 10000;
				}
				
				var $_creditSum = $_minSum;
				//var $_timeCount = $_startTime;
				var $_timeCount = 6;
				var $_time = 'M';
				
				$.ajax({
					type: 'GET',
					url: "/include/uamaster/credit_calculator_new.php",
					data: {creditSum:$_creditSum, creditPercent:$_creditPercent, timeCount: $_timeCount,creditType:$_creditType, time: $_time},
					dataType: "HTML",
					success: function(res){
						$('#section2 .section-content').html(res);
					}
				});
			}
		}
	}
	
	function resizeTitle(){
		
		if($('.page-title').text().length>22 && screen.width>=768){
			pemSize=$('.page-title').text().length/20;
			pemSize=(7-pemSize>=2)?7-pemSize:2;
			$('.page-title').animate({'font-size':pemSize+'rem'},500);
		}
	}
	
	/*media*/
	/*Video Preload - YouTube*/
	var players = {};
	var $playing = new Array;
	if($('.video-content').exists()) {	
		$(".video-content").each(function() {
			// Based on the YouTube ID, we can easily find the thumbnail image
			$(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');
			// Overlay the Play icon to make it look like a video player
			$(this).append($('<div/>', {'class': 'play'}));
		});
	}

	$(document).delegate('.video-content', 'click', function() {
		/*for touch devices*/
		if (Modernizr.touch) {
			var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
			//window.location.href = iframe_url;
			window.open(iframe_url);
			return false;
		}
		
		var player = new YT.Player(this.id, {
		  videoId: this.id,
		  playerVars: { 'autoplay': 1, 'frameborder': 0, 'allowfullscreen':''},
		});
		players[this.id] = player;
		$playing.push(this.id);
	});

	$(document).on('click','.slide-item',function(){
		for(var i=0; i<$playing.length; i++){
			players[$playing[i]].stopVideo();
		}
	});

	// destroy dropDown Select
	// $('select').destroyDropDown();
	(function( $ ){
	  $.fn.destroyDropDown = function() {
		this.each(function() {
			var thisPar = $(this).parent();
			$(thisPar).before(this);
			$(thisPar).remove();
			$(this).dropDown();
		});
	  };
	})( jQuery );
	
	/*END NEW FUNCTIONS*/
	
	
	
	/* ===================== END FUNCTIONS ===================== */
	
	
	/* ============================================================
								DOCUMENT READY Fns
	============================================================ */	
	
	$(document).ready(function() {
		// remember font size
		$('html').css('font-size',localStorage['FSizePX']);
				
		// hide selector
		$(document).on('mousedown','.bt-dropdown-toggle',function(){
			if($(this).parent().hasClass('open')){
				setTimeout(function(){
					$('.open').addClass('closed');
					$('.open').addClass('closedddd');					
					$('.open').removeClass('open');
				},300);
			}
		});
		// auto select value
		$("input").focus(function(){
			if(this.value != ''){
				this.select();
			}
		});
		// mask
		$("#contact-phone , input[name='custom[PHONE]']").mask("+38099 999 99 99");	
		$("#feedback-phone").mask("+38(999)999-99-99");	

		/*============================================================
						MOBILE BUGS REMOVE SETTINGS
		=============================================================*/
		//Internet Explorer 10 in Windows 8 and Windows Phone 8
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement('style')
			msViewportStyle.appendChild(
				document.createTextNode(
					'@-ms-viewport{width:auto!important}'
				)
			)
			document.querySelector('head').appendChild(msViewportStyle)
		}
		
		//Android stock browser
		$(function () {
			var nua = navigator.userAgent
			var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
			if (isAndroid) {
				$('select.form-control').removeClass('form-control').css('width', '100%')
			}
		})
		
		
		
		//IE9 placeholder fallback
		//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
		if(!Modernizr.input.placeholder){
			$('[placeholder]').focus(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
				}
			}).blur(function() {
				var input = $(this);
				if (input.val() == '' || input.val() == input.attr('placeholder')) {
					input.val(input.attr('placeholder'));
				}
			}).blur();
			$('[placeholder]').parents('form').submit(function() {
				$(this).find('[placeholder]').each(function() {
					var input = $(this);
					if (input.val() == input.attr('placeholder')) {
						input.val('');
					}
				})
			});
		}
		
		
		
		/*equal height*/
		equalHeight();
		function equalHeight() {
			if ($('.equal').exists() && $.fn.matchHeight) {
				$('.equal').matchHeight();
			}
		}
		
		
		if ($('.lazy-img').exists() && $.fn.lazyload) {
			$("img.lazy-img").lazyload({
				effect : "fadeIn"
			});
		}
		
		
		
		/*parallax*/
		if ($('.parallax').exists() && $.fn.parallax) {
			$('.parallax').parallax();
		}
		
		
		// departments list / trigger to show openning hours
		if ($('.open-hours-trigger').exists()) {
			$('.open-hours-trigger').on('click', function(event){
				event.preventDefault();
				$(this).toggleClass('active').parents().parent('.department-item-info').siblings('.department-opening-hours-table').toggleClass('is-visible');
			});
		}
		
		
		/*
		if ($.fn.checkBox) {
			$('.checkbox').checkBox();
		}
		if ($.fn.radio) {
			$('.radio').radio();
		}
		*/	
		if ($.fn.dropDown && $('.select-dropdown').exists()) {
			$('.select-dropdown').dropDown({useNativeMobile: true});
		}
		
		
		/*
		if (!Modernizr.touch) {
			$("#main-menu > li").hover( function () {
				$(this).toggleClass("li-hover");
			});
		}
		*/
		
		
		
		
		/*
		$(document).ready(function () {
			if ($.fn.keepTheRhythm ) {
				$('iframe').keepTheRhythm({
					verticalAlignment: "top"
				});
				$('p').keepTheRhythm({
					//verticalAlignment: "top"
				});
			}
        });

        $(window).load(function () {
			if ($.fn.keepTheRhythm ) {
            	//$('img').keepTheRhythm();
			}
        });
		*/
		
		
				
		/*
		
		*/
		
		
		// departments list / trigger to close alert
		if ($('.alert-trigger').exists()) {
			$('.alert-trigger').on('click', function(event){
				var alertBox = $(this).parent('.form-alert');
				event.preventDefault();
				alertBox.fadeOut(500);
			});
		}
		
		
		//dropdown menu
		custom_nav_menu();
		
		//masonry_menu();
		
		//font size change
		change_fontSize();
		
		/*tabs*/
		custom_tabs();
		
		/*tabs select*/
		custom_tabs_select();
		
		//accordion
		custom_accordion();
		
		//move currency nav in DOM
		//currency_nav();
		
		//deposit slide box
		slideBoxes();
		
		//custom popup
		custom_popup();		
		
		//custom slider
		custom_sliders();
		
		// youtube video
		//video_preload();
		
		//slick page nav
		custom_page_nav();
		
		//sidebar
		custom_sidebar();
		
		//FLOATING LABELS
		custom_form_labels();
		
		//custom open card nav
		custom_card_nav();
		
		//custom topNav settings
		custom_top_nav();
		
		//custom language switcher settings
		custom_lang_switch();
		
		//fixed credit form
		custom_credit_form();
				
		
		var dropdown = $('.dropdown-all').parent();
		dropdown.hover( function(){custom_nav_menu(); });
		
		
		/*NEW FUNCTIONS*/
		calculateCredit();
		calculateCreditOnLoad();
		
		//resizeTitle();
		/*NEW FUNCTION END*/
		
		
		
		
		
	});
	
	/* ===================== END Doc.Ready ===================== */
			


})(jQuery); // EOF