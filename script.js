var tmlog={};
var map;
var branchType;
var param={};
var lat=50.45466;
var long=30.5238;
var mapPlaceFindCoord=false;
var markers=[];
var marker=[];
var branchinfowindow =[];
var branchImg = '/img/markers/icon-old.png';
var newBranchImg = '/img/markers/icon-new.png';
var newBranchImg24 = '/img/markers/icon-new-zone-24.png';
var atmImg = '/img/markers/icon-cash.png';
var smartAtmImg24 = '/img/markers/icon-zone-24.png';
var defpos = {lat: 50.45466, lng: 30.5238};
var clusterStyles = [
	  {
		textColor: 'white',
		url: '/img/markers/icon-claster1.png',
		height: 53,
		width: 53
	  },
	 {
		textColor: 'white',
		url: '/img/markers/icon-claster1.png',
		height: 53,
		width: 53
	  },
	 {
		textColor: 'white',
		url: '/img/markers/icon-claster1.png',
		height: 53,
		width: 53
	  }
	];

$(document).ready(function(){
	localStorage.colorSetting='0';
	$('.alert-trigger').click(function(){localStorage.colorSetting='1';});
	$(document).on('mousedown','.detail-marker',function(){
		id=$(this).data('id');
		if($('.open-hours-trigger a[data-id="'+id+'"]').length>0){
			$('.btn-group a:last-child').click();
			console.log($('a[data-id="'+id+'"]'));
			console.log($('a[data-id="'+id+'"]').offset().top);
			$('html, body').animate({ scrollTop: $('.open-hours-trigger a[data-id=\"'+id+'\"]').offset().top }, 500);
			$('.open-hours-trigger a[data-id=\"'+id+'\"]').click();
		}
		else{
		type=$(this).data('type');
			param['detail']='1';
			param['id']={};
			param['id'][type+'']='';
			param['id'][type+'']=id+',';
			loadBranchList(param);
			$('.btn-group a:last-child').click();
			setTimeout("$('.list-departments li:first-child').click();",200);
		}
	});

	$('body').on('click', '.open-hours-trigger', function(){
		$('li.active').removeClass('active');
		$('.department-opening-hours-table.is-visible').removeClass('is-visible');
		$('.department-days-table:hidden').show();
		$(this).toggleClass('active').find('.department-days-table').hide();
		$(this).toggleClass('active').find('.department-opening-hours-table').toggleClass('is-visible');
	});

	$('#autocomplete').keyup(function(){
		$('.pac-container').css('width',$('#autocomplete').outerWidth());
	});
	$('#autocomplete').click(function(){
		$('.pac-container').css('width',$('#autocomplete').outerWidth());
	});

$.ajax({
	url:thisUrl+'/ajax.php',
	type:'POST',
	data: 'data=all',
	contentType: "application/x-www-form-urlencoded",
	success:function(data){
		var dataEncode = JSON.parse(data);
		//console.log(dataEncode);
		var i=0;
		var contentString;
		var Ndey=((new Date()).getDay()==0)?6:(new Date()).getDay()-1;
		var Ntimeout=(Ndey<5)?8:9;

		for(var el in dataEncode["ATM"]){
			atm=dataEncode["ATM"][el];
			//console.log(atm);
			var timeout=(typeof atm["work_time"]!=null && typeof atm["work_time"].split('|')[Ntimeout]!='undefined')?atm["work_time"].split('|')[Ntimeout]:'';
			var worktime=(typeof atm["work_time"]!=null && typeof atm["work_time"].split('|')[Ndey] != 'undefined' )?atm["work_time"].split('|')[Ndey].split('-')[1]:'';
			var  is24=(atm["is_24h"]>0)?'працює 24/7':'';
			lat=parseFloat(atm["latitude"]);
			lng=parseFloat(atm["longitude"])-0.00005;
			markers[i] = {
				"type":"ATM",
				"is_24h":atm["is_24h"],
				"typeTitle":'Банкомат<span>'+is24+'</span>',
				"typeClass":'atm',
				"title": atm["address"],
				"lat":lat,
				"lng":lng,
				"worktime":worktime,
				"timeout":timeout,
				"icon":'/img/markers/icon-cash.png',
				"element":atm
			};

		  i++;
		}

		for(var el in dataEncode["BRANCH"]){
			branch=dataEncode["BRANCH"][el];
			var timeout=(typeof branch["work_time"]!=null && typeof branch["work_time"].split('|')[Ntimeout]!='undefined')?branch["work_time"].split('|')[Ntimeout]:'';
			var worktime=(typeof branch["work_time"]!=null && typeof branch["work_time"].split('|')[Ndey] != 'undefined' )?branch["work_time"].split('|')[Ndey].split('-')[1]:'';
			var  is24=(branch["is_24h"]>0)?'працює 24/7':'';
			lat=parseFloat(branch["latitude"]);
			lng=parseFloat(branch["longitude"])+0.00005;
			markers[i] = {
				"type":"branch",
				"typeClass":(parseInt(branch["is_new_format"])>0)?'newbranch':'branch',
				"typeTitle":(parseInt(branch["is_new_format"])>0)?'Відділення<br>нового типу':'<span style="margin-top:-3px">Відділення</span>',
				"title": branch["NAME"],
				"lat": lat,
				"lng":lng,
				"worktime":worktime,
				"timeout":timeout,
				"icon":branchImg,
				"element":branch
			};

		  i++;
		}


		for(var el in dataEncode["KIOSK"]){
			kiosk=dataEncode["KIOSK"][el];
			var timeout=(typeof kiosk["work_time"]!=null && typeof kiosk["work_time"].split('|')[Ntimeout]!='undefined')?kiosk["work_time"].split('|')[Ntimeout]:'';
			var worktime=(typeof kiosk["work_time"]!=null && typeof kiosk["work_time"].split('|')[Ndey] != 'undefined' )?kiosk["work_time"].split('|')[Ndey].split('-')[1]:'';
			var  is24=(kiosk["is_24h"]>0)?'працює 24/7':'';
			lat=parseFloat(kiosk["latitude"])+0.00003;
			lng=parseFloat(kiosk["longitude"]);
			markers[i] = {
				"type":"kiosk",
				"typeClass":'kiosk',
				"typeTitle":'Кіоск<br>працює 24/7',
				"title": kiosk["NAME"],
				"lat": lat,
				"lng":lng,
				"worktime":worktime,
				"timeout":timeout,
				"icon":smartAtmImg24,
				"element":kiosk
			};

		  i++;
		}

		for(var el in dataEncode["ZONE24"]){
			zone24=dataEncode["ZONE24"][el];
			var timeout=(typeof zone24["work_time"]!=null && typeof zone24["work_time"].split('|')[Ntimeout]!='undefined')?zone24["work_time"].split('|')[Ntimeout]:'';
			var worktime=(typeof zone24["work_time"]!=null && typeof zone24["work_time"].split('|')[Ndey] != 'undefined' )?zone24["work_time"].split('|')[Ndey].split('-')[1]:'';
			var  is24=(zone24["is_24h"]>0)?'працює 24/7':'';

			markers[i] = {
				"type":"zone24",
				"typeClass":'zone24',
				"typeTitle":'Цілодобова зона<br>працює 24/7',
				"title": zone24["NAME"],
				"lat": parseFloat(zone24["latitude"]),
				"lng":parseFloat(zone24["longitude"]),
				"worktime":worktime,
				"timeout":timeout,
				"icon":newBranchImg24,
				"element":zone24
			};

		  i++;
		}

		$('.section-content').addClass('preload');
		setTimeout("setMarker(markers,'');",50);
	}
});

$('#f_service_type , #f_dep_type , .check-workdey input , #time_start , #time_end').change(function(){
	if(this.id=='f_dep_type'){
		if(this.value=='branch'||this.value=='newbranch'){
			$('#f_service_type').parents(".form-group").show();
		}else{
			$('#f_service_type').parents(".form-group").hide();
		}
	}
	$('.section-content').addClass('preload');
	setTimeout(function(){

		setMarker(markers);
	},100);
});


$('.label-range').click(function(){
	if($(this).next().not(':visible')){
		$(this).next().show();
		$(this).removeClass('label-range-down');
		$(this).addClass('label-range-top');
	}
});
$('.check-workdey label').mousedown(function(){
		$('.check-workdey input').removeAttr('checked');
});

$('.check-workdey input').change(function(){
	/*if($(this).is(':checked'))
		status=true;
	else
		status=false;
		//setTimeout("$('.check-workdey input').attr('disabled',true);",100);
		$('.check-workdey input').removeAttr('checked');
		$(this).attr('checked',status);
		*/
});

$('.btn-group a:first-child').click(function(){
	$('ul.list-departments.list-unstyled').hide();
	$('.dep-map-container').show();
	$('.btn-group a:last-child').removeClass('selected');
	$(this).addClass('selected');
});
$('.btn-group a:last-child').click(function(){
	//loadBranchList(param);
	$('ul.list-departments.list-unstyled').show();
	$('.dep-map-container').hide();
	$('.btn-group a:first-child').removeClass('selected');
	$(this).addClass('selected');
});

//$('#autocomplete').mouseup(function(){$('.item-num').remove();});
$('body').on('keyup , mouseup','#autocomplete',function(){
	//findnum
	if($(this).val().length>3){
		$.ajax({
			url:thisUrl+'/ajax.php',
			type:'POST',
			data: 'findnum='+$(this).val(),
			success:function(data){
				$('.item-num').remove();
				data=JSON.parse(data);
				if(typeof data["BRANCH"]!='undefined' && data["BRANCH"].length>0){
					data["BRANCH"].forEach(function(el){
						type=(el.is_new_format==1)?'new':'old';
						thid=el.typ+''+el.id;
						listElement='<div class="pac-item item-num" data-lat="'+el.latitude+'"  data-long="'+el.longitude+'" data-num="'+el.num+'" data-id="'+thid+'" ><span class="pac-item-query"><img src="/img/markers/icon-'+type+'.png"></span><span><span class="pac-matched"> '+el.num+'</span>, '+el.address+'</span></div>';
						$('.pac-container').prepend(listElement);
					});
				}

				if($('.item-num').length>0)
					$('.pac-container').show();
			}
		});
	}
});

});



function initMap() {
	/* map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: defpos,
	});*/
}

function setMarker(markers){
		$('.section-content').addClass('preload');
		tmlog={};
		var view;
		if($('.btn-group a:last-child').hasClass('selected'))
			view='list';
		$('.btn-group a:first-child').click();
		param['id']={};
		type=$('#f_dep_type').val();
		service=$('#f_service_type').val();
		tstart=$('.range-start').val().split(':');
		tstart=tstart[0]+'.'+tstart[1];
		tend=$('.range-end').val().split(':');
		tend=tend[0]+'.'+tend[1];
		var mapOptions = {
			center:defpos,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [
			{
			   "featureType": "all",
			   "stylers": [
			   { "visibility": "off" }
				]
			},
			{
			   "featureType": "road,poi.government",
			   "elementType": "geometry,labels.icon",
			   "stylers": [
			   { "visibility": "on" }
				]
			},
			]

		};

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Create and open InfoWindow.
        var infoWindow = new google.maps.InfoWindow();

        for (var i = 0; i < markers.length; i++) {
			var data = markers[i];

			if((typeof data.element!='undefined' && typeof data["element"]["is_new_format"]!='undefined' && parseInt(data["element"]["is_new_format"])>0) && data.type !='zone24'){
				data.icon=newBranchImg;
			}

			if(type.length>2 && type!='all'){
				if(type=="newbranch"){
					//console.log(parseInt(data.element["is_new_format"]));
					 if(parseInt(data.element["is_new_format"])!=1 || data.type!= 'branch'){
						data=[];
					 }
				}
				else{
					if(data["type"]!=type){data=[];}
				}
			}
			if(service>1 ){
				if((typeof data.element=='undefined') || (typeof data.element["branch_type"]=='undefined') || ($('#f_service_type option:selected').data('brtype').indexOf(data.element["branch_type"])<0 )){
						data=[];
				}
				else{
					if(data.element["branch_type"]=='ТВБВ IV'){

					}
				}
			}

			if($('.check-workdey input:checked').length>0 && (typeof data["type"] != 'undefined')){
				$('.check-workdey input:checked').each(function(e){
					if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined') && this.id=='f_visit_day_st'){
						if(parseInt(data.element["work_days_sat"])!=1 )
						data=[];
					}

					if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined') && this.id=='f_visit_day_su'){
						if(parseInt(data.element["work_days_sun"])!=1 ){
							data=[];;
						}
					}

					if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined') && this.id=='f_visit_day_today'){
						var d = new Date();
						day=d.getDay();
						if(day<6 && parseInt(data.element["work_days_work"])!=1 )
							data=[];
						else if((day==6 && parseInt(data.element["work_days_sat"])!=1 ))
							data=[];
						else if((day==7 && parseInt(data.element["work_days_sun"])!=1 ))
							data=[];
						else
							data;
					}

					if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined') && this.id=='f_visit_day_tomorrow'){
						var d = new Date();
						day=d.getDay()+1;
						if(day<6 && parseInt(data.element["work_days_work"])!=1 )
							data=[];
						else if((day==6 && parseInt(data.element["work_days_sat"])!=1 ))
							data=[];
						else if((day==7 && parseInt(data.element["work_days_sun"])!=1 ))
							data=[];
						else
							data;
					}

					if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined') && this.id=='f_visit_day_weekdays'){
						if(parseInt(data.element["work_days_work"])!=1 )
							data=[];
					}


				});
			}

			if((typeof data.element!='undefined') && (typeof data.element["work_days_work"]!='undefined')){
				if(typeof data.element["work_hours_begin_work"]=='string' && data.element["work_hours_begin_work"].length>0){
					brTStart=data.element["work_hours_begin_work"].split(':');
					brTEnd=data.element["work_hours_end_work"].split(':');
					brTStart=brTStart[0]+'.'+brTStart[1];
					brTEnd=brTEnd[0]+'.'+brTEnd[1];
					if(tstart<=brTStart || tend>=brTEnd)
						data=[];
				}
				else{
					data=[];
				}
			}

			if(type =='zone24'){
				data.icon=newBranchImg24;
			}

            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                marker[i] = new google.maps.Marker({
                position: myLatlng,
                map: map,
				icon:data.icon
            });
			marker[i].tooltipContent = '';
			tm=marker[i];
			if((typeof data.element!='undefined')&&(typeof data.element.id!='undefined')){
				tmlog[data["type"]+data["element"]["id"]]=tm;
				if(parseInt(data.element.id)>0){
					if(typeof param['id'][data["type"]] == 'undefined')
						param['id'][data["type"]]='';
					param['id'][data["type"]]+=parseInt(data.element.id)+',';
				}
			}
			//Attach click event to the marker.
            (function (tm, data) {
                google.maps.event.addListener(tm, "click", function (e) {
					$('.tultip').hide();
					$('.map-department').prev().click()
						data["element"]["branch_type"]=(typeof data["element"]["branch_type"]=='undefined')?'':data["element"]["branch_type"];
					var branchNum=(data["element"]["num"]!=null)?' відділення № '+data["element"]["num"]:'';
					var branchPhone= (data["element"]["phone"]!=null)?'+38 '+data["element"]["phone"]:'';
					var adresArr = data["element"]["address"].split(',');
					var adresCity = data["element"]["region"]+', '+adresArr[0];
					delete adresArr[0];
					var adresAddr = adresArr.join(' ');
					var workTime= (data["element"]["is_24h"]==1)?"Працює цілодобово":"Сьогодні працює до "+data["worktime"];
					var access= (data["element"]["access"]=='обмежений')?"Обмежений доступ":"";
					var infobox1 = new InfoBox({
						 content: '<div class="map-department" id="elm_'+data["element"]["id"]+'"><div class="map-department-header '+data.typeClass+'"><p>'+data.typeTitle+'</p><a class="map-department-close" ref="#0" onclick="$(\'.gm-style-iw\').next().click();"></a></div> <div class="map-department-info"><h3 class="department-address">'+adresAddr+' '+data["element"]["branch_type"]+'</h3><div class="department-location"><span class="department-city">'+adresCity+'</span><span class="department-number">'+branchNum+'</span></div><div class="department-tel">'+branchPhone+'</div>	<div class="map-department-opening-hours">	 <span class="today-open">'+workTime+'</span><span class="today-break">Обідня перерва: '+data["timeout"]+'</span><span class="today-break">'+access+'</span></div>	<br><a id="btn-deposit-compare"  class="detail-marker btn btn-sky-blue" data-id="'+data["element"]["id"]+'" data-type="'+data["type"]+'">деталі про відділення</a></div></div><p class="mapWindowBot"></p>',
						 disableAutoPan: true,
						 maxWidth: 150,
						 enableEventPropagation: true,
						 pixelOffset: new google.maps.Size(-148, 0),
						 zIndex: null,
						 boxStyle: {
							background: "none",
							opacity: 1,
							'z-index': 9999,
							width: "280px"
						},
						closeBoxMargin: "12px 4px 2px 2px",
						//closeBoxURL: "x",
						infoBoxClearance: new google.maps.Size(1, 1)
					});
					infobox1.open(map, tm);


					google.maps.event.addListener(infobox1, 'domready', function() {
						//console.log($('.map-department').outerHeight());
						$('.map-department').parent().css('margin-top','-'+($('.map-department').outerHeight()+15)+'px');
						$('.map-department-info').mousemove(function(){if(!$(this).hasClass('detail-marker'))return false;});
						/*$('.map-department-info').mousedown(function(){
							return false;
						});*/
					});

					$('body').on('click','.map-department-close',function(){
						$('.map-department').prev().click()
					});

					if (map.zoom>19){ var mapmove=0.0001;}
					else if (map.zoom==19){ var mapmove=0.0002;}
					else if (map.zoom==18){ var mapmove=0.0005;}
					else if (map.zoom==16){ var mapmove=0.002;}
					else if (map.zoom==17){ var mapmove=0.0009;}
					else if (map.zoom>14 && map.zoom<=15){ var mapmove=0.004;}
					else if (map.zoom>=13 && map.zoom<=14){ var mapmove=0.007;}
					else if (map.zoom==12){ var mapmove=0.020;}
					else if (map.zoom>9 && map.zoom<12){ var mapmove=0.055;}
					else if (map.zoom>4 && map.zoom<=9){ var mapmove=0.175;}
					else { var mapmove=0.300;}
						//console.log(map.zoom);
						//console.log(mapmove);
					var originalMapCenter = new google.maps.LatLng(data.lat+mapmove, data.lng);
					map.setCenter(originalMapCenter);

                });

				google.maps.event.addDomListener(map,'zoom_changed', function() {$('.map-department-close').click();});
				google.maps.event.addListener(infoWindow, 'domready', function() {
					$('.tultip').hide();
				});
				google.maps.event.addListener(tm, "mouseover", function (e) {
					//console.log($(this));
					var infobox = new InfoBox({
						 content: '<div class="map-department-header tultip '+data.typeClass+'"><p>'+data.typeTitle+'</p></div>',
						 disableAutoPan: false,
						 maxWidth: 70,
						 maxHeight: 70,
						 pixelOffset: new google.maps.Size(20, -54),
						 zIndex: null,
						closeBoxMargin: "0px 0px 0px 0px",
						closeBoxURL: "",
						infoBoxClearance: new google.maps.Size(1, 1)
					});
					infobox.open(map, tm);
                });
				google.maps.event.addListener(tm, "mouseout", function (e) {
					$('.tultip').hide();
                });

            })(tm, data);
        }


		var mcOptions = {gridSize: 50, maxZoom: 15,styles: clusterStyles,};

			var markerCluster = new MarkerClusterer(map, marker, mcOptions);

		  // Try HTML5 geolocation.
		    if(!mapPlaceFindCoord){
			  if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					lat=position.coords.latitude;
					long=position.coords.longitude;
				  var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				  };
				  map.setCenter(pos);
				  thisPos = new google.maps.Marker({
					position: pos,
					map: map,
					icon:'/img/location.png',
					description: 'Вы здесь'
				  });

				  $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+pos.lat+","+pos.lng, function(data){
						var geoRes=data;
						//console.log(geoRes.results[0]);
						for(var i=0; i in geoRes.results[0]['address_components'];i++){
							if(geoRes.results[0]['address_components'][i]['types'][0]=='locality')
								var cityname=geoRes.results[0]['address_components'][i]['long_name'];
						}

						$('#autocomplete').prev().addClass('float');
						$('#cityname').text(cityname);
						$('#autocomplete').val(cityname);
						if(localStorage.colorSetting=='0')
							$('.thisgeoloc').show();
					});

					loadBranchList(param);

				});
			  }
		  }else{
			   map.setCenter(mapPlaceFindCoord);
		  }

	initAutocomplete(map);
	loadBranchList(param);

	$('body').on('mousedown', '.on-map , .item-num', function(){
		thid=this.id;
		if($(this).hasClass('item-num')){
			$('#autocomplete').val($(this).data('num'));
			thid=$(this).data('id');
		}
		//console.log(thid);
		toitem = {lat: parseFloat($(this).data('lat')), lng: parseFloat($(this).data('long'))};
		map.panTo(toitem);
		map.setZoom(16);
		//console.log(tmlog);
		google.maps.event.trigger(tmlog[thid], 'click', {
		  latLng: new google.maps.LatLng(toitem.lat, toitem.lng)
		});
		$('.btn-group a:first-child').click();
		$('html, body').animate({ scrollTop: $('#map').offset().top }, 1000);

	});


	if(view=='list')
		$('.btn-group a:last-child').click();

	//If window width <= 1000px - load list
	if($(window).width() < '1100'){
		$('.btn-group a:last-child').click();

		$('.btn-group a:first-child').click(function(){
			$('ul.list-departments.list-unstyled').hide();
			$('.dep-map-container').show();
			$('.btn-group a:last-child').removeClass('selected');
			$(this).addClass('selected');
			//костыли для того, чтоб убрать с экрана все лишнее
			$('.dropdown-trigger span').addClass('js-bgc-white');
			$('.top-bar').addClass('js-bgc-blue');
			$('.page-header').addClass('js-padding-none');
			$('.site-header').addClass('js-height-none');
			$('.dep-map-container').addClass('js-pb');
			$('.top-navigation').hide();
			$('.site-logo').hide();
			$('.section-departments .page-title').hide();
			$('.filter-location-type').hide();
			$('.filter-time-switcher').hide();
			$('.filter-btn').show();
			//================================================//
		});
		$('.btn-group a:last-child').click(function(){
			//loadBranchList(param);
			$('ul.list-departments.list-unstyled').show();
			$('.dep-map-container').hide();
			$('.btn-group a:first-child').removeClass('selected');
			$(this).addClass('selected');
			//костыли для того, чтоб убрать с экрана все лишнее
			$('.dropdown-trigger span').removeClass('js-bgc-white');
			$('.top-bar').removeClass('js-bgc-blue');
			$('.page-header').removeClass('js-padding-none');
			$('.site-header').removeClass('js-height-none');
			$('.dep-map-container').removeClass('js-pb');
			$('.top-navigation').show();
			$('.site-logo').show();
			$('.section-departments .page-title').show();
			$('.filter-location-type').show();
			$('.filter-time-switcher').show();
			$('.filter-btn').hide();
			//================================================//

		});

		$('.filter-btn').click(function() {
			$('.filter-location-type').fadeToggle();
			$('.filter-time-switcher').fadeToggle();
		});
	}

	setTimeout("$('.section-content').removeClass('preload');",200);
}


var placeSearch, autocomplete;
function initAutocomplete(map) {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode'],componentRestrictions: {'country': 'ua'}});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', function() {
	//console.log('place');
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
	//console.log(place);
	mapPlaceFindCoord=place.geometry.location;
	lat=mapPlaceFindCoord.lat();
	long=mapPlaceFindCoord.lng();
	//map.setCenter(place.geometry.location);
	$('.section-content').addClass('preload');
	setMarker(markers);

});
}

// load list-departments
function loadBranchList(param){
	param['bussinesType']=bussinesType;
	param['lat']=lat;
	param['long']=long;
	param['city']=$('#cityname').text();
	$.ajax({
		url:thisUrl+'/ajax.php',
		type:'POST',
		data: 'list="y"&param='+JSON.stringify(param)+'',
		success:function(data){
			if(typeof param['detail']!='undefined')
				$('.list-departments').prepend(data);
			else
				$('.list-departments').html(data);
		}
	});
}
