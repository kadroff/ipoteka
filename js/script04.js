$(window).on('load',function(){
	$('#loading').fadeOut(100);
	if ($('#home_ipoteka').length>0) {
		$('#home_ipoteka').append($('<video preload="none" poster="/img/home_ipoteka_p.jpg"><source src="/img/home_ipoteka.mp4" type="video/mp4"><source src="/img/home_ipoteka.webm" type="video/webm"></video>'));
		$('#home_ipoteka > video').show()[0].play();
		$('#home_ipoteka > video').on('ended',function() {
			// $('#home_ipoteka').css('background-image','url(/img/home_ipoteka_d.jpg)');
			var img = new Image();
			img.src = '/img/home_ipoteka_d.jpg';
			img.onload = function() {
				$('#home_ipoteka').css('background-image','url(/img/home_ipoteka_d.jpg)');
				$('#home_ipoteka video').hide();
			}
			$('.timer, .dash_arrow').animate({opacity:1},'slow');
		});
	}
	home_video_resize();
});
$(window).on('resize',function() {
	home_video_resize();
})
$(document).ready(function(){
	timer();
	set_popup(); 
	submit_form();
	select_city();
	select_city_info();
	
	$('input[name^="money"]').mask('# ##0', {reverse: true});
	$('input[name="tel"]').mask('+7 (000) 000-00-00').on('focus',function(){this.value=(this.value)?this.value:'+7';}).on('blur',function(){this.value=(this.value=='+7')?'':this.value});
	$('input[type="text"]').on('input',function(){$('input[name="'+$(this).attr('name')+'"]').val($(this).val());});
	$('label._rub').on('click',function() {incr_summ($(this).attr('for'));});
	$('.slider').slider({animate:'fast',range:'min'});
	$('input[name="birthDate"]').mask('00.00.0000').on('input',function(){
		if (this.value.length==10) {
			var dt = this.value.split('.');
			dt = new Date(dt[2]*1,dt[1]*1-1,dt[0]*1);
			dt = new Date(dt.setTime(dt.getTime()-(new Date().getTimezoneOffset()*60000)));
			var tm = dt.getTime();
			var tmc = new Date().getTime();
			if ((tmc-tm)<(3600*1000*24*365.25*18)) dt = new Date(tmc-(3600*1000*24*365.25*18));
			if ((tmc-tm)>(3600*1000*24*365.25*74)) dt = new Date(tmc-(3600*1000*24*365.25*74));
			dt = dt.toJSON().split('T')[0].split('-').reverse().join('.');
			this.value = dt;
		}
	});
	
	$(window).on('beforeunload', function(){
		var url = $('form:first').attr('action')+'?user_out';
		$.ajax({
			url:url,
			cache:false
		});
	});
	
	$('a.more').on('click',function(){
		var p = $(this).prev();
		var mxh = p.css('max-height');
		if (!this.mxh) this.mxh = mxh;
		var h = p.css('max-height','none')[0].offsetHeight;
		if (mxh == 'none') {
			p.css('max-height',h+'px').animate({'max-height':this.mxh},{complete:function(){
				
			}});
		}
		else {
			p.css('max-height',mxh).animate({'max-height':h+'px'},{complete:function(){
				$(this).css('max-height','none');
			}});
		}
		var tmp = $(this).text();
		$(this).text($(this).attr('alt')).attr('alt',tmp);
	});
	
	var inp = $('input[type="text"]');
	if (inp.length>0) {
		for(var i=0;i<inp.length;i++) {
			$(inp[i]).on('input focus blur change',function(){
				setCookie('form_'+this.name,this.value,{expires:600000,path:'/'});
				if (navigator.vendor.indexOf('Apple')<0 && !!getCookie('form_'+this.name)) $('input[name="'+this.name+'"]').val(getCookie('form_'+this.name));
			});
			$(inp[i]).after($('<label class="_before">'+$(inp[i]).attr('placeholder')+'</label>'));
			if (navigator.vendor.indexOf('Apple')<0 && !!getCookie('form_'+inp[i].name)) $(inp[i]).val(getCookie('form_'+inp[i].name));
		}
	}
	var inp = $('input[type="radio"]');
	if (inp.length>0) {
		for(var i=0;i<inp.length;i++) {
			$(inp[i]).on('click',function(){setCookie('form_'+this.name,this.value,{expires:600000,path:'/'});});
			if (!!getCookie('form_'+inp[i].name)) $(inp[i]).attr('checked',$(inp[i]).val()==getCookie('form_'+inp[i].name));
		}
	}
	
	$('input[name="current_credit"]').on('change',function(){
		var id = this.id.substr(-5);
		if (id=='_cr_y') {
			$('._cr_y').slideDown('normal').find('input').attr('required',true);
			$('._cr_n').slideUp('normal').find('input').attr('required',false);
		}
		else {
			$('._cr_n').slideDown('normal').find('input').attr('required',true);
			$('._cr_y').slideUp('normal').find('input').attr('required',false);
		}
	})
	var inp = $('input[name="current_credit"]:checked');
	if (inp.length>0) $('.'+inp.attr('id').substr(-5)).show();
	
	var h1 = $('.home_ipoteka h1');
	var p = $('.home_ipoteka h1 + p')
	// if (p.length==1) {
		// if (window.navigator.userAgent.indexOf('Google')==-1) h1.html(p.html());
		// p.remove();
	// }
	$('#footer_info').html('ООО «Финансовые партнеры» занимается консультационной<br/>деятельностью по подбору ипотечных программ, не является<br/>кредитной организацией и самостоятельно не выдает ипотеку.');
	$('#loading').fadeOut(160);
});

function timer() {
	var ds = 60*60*24;
	var cur_time = Math.round(new Date().getTime()/1000)-(new Date().getTimezoneOffset()*60);
	var off_time = Math.round((Math.floor(cur_time/ds)+1)*ds);
	var timer = off_time-cur_time;
	var s_1 = timer%10;
	var s_0 = 255&(timer/10)%6;
	var m_1 = 255&(timer/60)%10;
	var m_0 = 255&(timer/600)%6;
	var h_1 = 255&(timer/3600)%10;
	var h_0 = 255&(timer/36000)%10;
	$('#s_1').text(s_1);
	$('#s_0').text(s_0);
	$('#m_1').text(m_1);
	$('#m_0').text(m_0);
	$('#h_1').text(h_1);
	$('#h_0').text(h_0);
	setTimeout('timer()',1000);
}


function set_popup() {
	var button = $('[id$="_form"]');
	if (button.length>0) {
		for(var i=0;i<button.length;i++) {
			var id = button[i].id.split('_form')[0];
			bg = $('#'+id+'_bg');
			bg.click(function(event){
				if (event.target==this || event.target.className == '_close') $(this).fadeOut();
			});
			$(button[i]).click(function(){
				var id = this.id.split('_form')[0];
				popup_show(id);
				return false;
			});
			$(window).on('scroll',function(event) {
				if (typeof this.sy == 'undefined') {
					this.sy = window.scrollY;
					return;
				}
				// var p_b = $('#'+id+'_blank');
				var p_b = $('[id$="_bg"] [id$="_blank"]');
				for(var i=0;i<p_b.length;i++) {
					if (!p_b[i].offsetHeight) continue;
					if ($(window).height()<p_b[i].offsetHeight) {
						var dy = this.sy - window.scrollY;
						var top = p_b[i].offsetTop+dy;
						if (top>0) var top = 0;
						if (top<($(window).height()-p_b[i].offsetHeight)) top = $(window).height()-p_b[i].offsetHeight;
						$(p_b[i]).css({top:top+'px'});
					}
					else {
						var top = ($(window).height()/2)-(p_b[i].offsetHeight/2);
						$(p_b[i]).css({top:top+'px'});
					}
				}
				this.sy = window.scrollY;
				
			});
		}
	}
}

function popup_show(id) {
	$('#'+id+'_bg').show();
	
	var c_h = document.documentElement.clientHeight;
	var p_h = $('#'+id+'_blank')[0].offsetHeight;
	$('#'+id+'_bg').hide().fadeIn();
	var top = (c_h/2)-(p_h/2);
	top = (top<0)?0:top;
	$('#'+id+'_blank').css({top:top+'px'});
	setTimeout(function(){$('#'+id+' input[type="text"]:first')[0].focus();},1000);
}

function submit_form() {
	var forms = $('form');
	if (forms.length>0) {
		for(var i = 0; i<forms.length;i++) {
			$(forms[i]).submit(function(event){
				event.preventDefault();
				var id = $(this).attr('id');
				if ($('#'+id+' input:not([type="hidden"]):not(:valid)').length==0) {
					var data = $(this).serialize();
					$(this).find('input').attr('disabled',true);
					$('#loading').fadeIn();
					$.ajax({
						url:$(this).attr('action'),
						method:'post',
						data:data,
						cache:false,
						success:function(res){
							eval(res);
							return false;
						}
					});
				}
				return false;
			});
		}
	}
}

function select_city() {
	var label = $('._selector');
	for(var i=0;i<label.length;i++) {
		var lab = $(label[i]);
		var id = lab.attr('for');
		var inp = $('#'+id);
		inp.on('focus',function(){
			bind_selector(this.id);
			$('#list_city').stop(true).slideDown();
		});
		inp.on('blur',function(event){
			$('#list_city').slideUp();
		});
		inp.on('input',function(){
			if (this.value.length > 0) this.value = this.value[0].toUpperCase()+this.value.substr(1);
			var q = $('#list_city > li:contains("'+this.value+'")');
			if (q.length > 0) {
				$('#list_city')[0].scrollTop = q[0].offsetTop;
			}
			// lse $('#list_city > li').show();

		});
		lab.on('click',function() {
			inp = $('#'+$(this).attr('for'));
			if ($('#list_city').css('display')!='none') {$('#list_city').stop(true).slideUp(); return false;}
			else {
				$('#list_city').stop(true).slideDown();
				var q = $('#list_city > li:contains("'+inp.val()+'")');
				if (q.length > 0) {
					$('#list_city')[0].scrollTop = q[0].offsetTop;
				}
				//else $('#list_city > li').show(); */
			}
		});
		
		$('#open_map').on('click',function() {
			open_map();
		});
		$('.bg_map').on('click',function(){if(this==event.target) $('.bg_map').fadeOut();});
		$('.close_map').on('click',function(){$('.bg_map').fadeOut();});
		
	}
}

function select_city_info() {
	var a = $('#info_city');
	a.on('click',function() {
		bind_adr('info_city');
		$('#list_city').stop(true).slideToggle();
	});
	$(window).on('click',function(event){
		if (event.target!=$('#info_city')[0] && event.target!=$('#list_city')[0] && $(event.target).parent()[0]!=$('#list_city')[0] && event.target.tagName!='LABEL' && event.target.tagName!='INPUT') 	$('#list_city').stop(true).slideUp();
	});
}

function bind_selector(id) {
	var li = $('#list_city > li');
	for(var i=0;i<li.length;i++) {
		li[i].onclick = function(){
			var tc = this.title;
			$('input[name="city"]').val(tc);
			$('.info_adr').html(CITY[tc].adr.replace(/_/g,'&nbsp;'));
			$('.info_tel').html(CITY[tc].tels[1]);
			$('#info_city').html(CITY[tc].v_gorode);
			if (typeof Map.maps['city'] == 'undefined') Map.init('#city_map','city',tc+', '+CITY[tc].adr.replace('_',' '));
			else Map.setPos(Map.maps['city'],tc+', '+$('.info_adr').text());
			$(this).parent().slideUp();
		}
		
	}
	var ul = $('#list_city');
	var inp = $('#'+id);
	ul.css({top:(inp[0].offsetHeight+inp[0].offsetTop)+'px',left:inp[0].offsetLeft+'px'});
	inp.parent().append(ul);
}

function bind_adr(id) {
	var li = $('#list_city > li').show();
	for(var i=0;i<li.length;i++) {
		
		li[i].onclick = function(){
			var tc = this.title;
			$('.info_adr').html(CITY[tc].adr.replace(/_/g,'&nbsp;'));
			$('.info_tel').html(CITY[tc].tels[1]);
			$('#info_city').html(CITY[tc].v_gorode);
			$('input[name="city"]').val(tc);
			if (typeof Map.maps['city'] == 'undefined') Map.init('#city_map','city',tc+', '+$('.info_adr').text());
			else Map.setPos(Map.maps['city'],tc+', '+$('.info_adr').text());
			$(this).parent().slideUp();
			setCookie('form_city',tc,{expires:600000,path:'/'});
		}
	}
	var ul = $('#list_city');
	var inp = $('#'+id);
	var top = (inp[0].offsetHeight+inp[0].offsetTop)
	var left = Math.max(inp[0].offsetLeft - ul.width() + inp.width(),0);
	ul.css({top:top+'px',left:left+'px'});
	inp.parent().append(ul);
}

function incr_summ(id) {
	var inp = $('#'+id);
	var summ = parseInt(inp.val().replace(/\s+/g,''))*1;
	if (!summ) summ = 0;
	var res = [];
/* 	if (summ>=900000 && !this.mil) {
		var div = $('<div style="display:none; color: red;clear: both;">Вы точно хотите взять такую сумму?</div>');
		inp.after(div);
		div.slideDown();
		this.mil = true;
	}
 */
	summ += 100000;
	summ = (summ+'').split('').reverse();
	for(var i=0;i<summ.length;i++) {
		res[res.length] = summ[i];
		if(i!=0 && !((i+1)%3)) res[res.length] = ' ';
	}
	inp.val(res.reverse().join(''));
}

function open_map() {
	if (Map.points.length==0) for(var tc in CITY) Map.points[Map.points.length] = tc+', '+CITY[tc].adr.replace(/_/g,' ');
	var tc = $('input[name="city"]').val();
	var bm = $('.bg_map');
	var m = $('#city_map');
	var c = $('.close_map');
	if (typeof Map.maps['city'] == 'undefined') Map.init('#city_map','city',tc+', '+CITY[tc].adr.replace(/_/g,' '));
	bm.show();
	var top = Math.max((document.documentElement.clientHeight/2)-(m.height()/2),0);
	m.css({top:top+'px'});
	c.css({top:top+'px'});
	bm.hide();
	bm.fadeIn();
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function home_video_resize() {
	var el = $('.home_ipoteka');
	var elv = $('#home_ipoteka');
	if (el.length>0 && elv.length>0) {
		var h = el[0].offsetHeight;
		elv.css({'margin-bottom':(-h+5)+'px','height':h-5+'px'});
	}
}
