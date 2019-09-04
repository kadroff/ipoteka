$(document).ready(function(){if ($('.calc_ipoteka').length>0) {
	$('.calc_ipoteka').tabs();
	calc_nedv_tab();
	calc_cred_tab();
	calc_earn_tab();
	calc_cred_init();
	calc_earn_init();
	calc_nedv_init();
	switch_result(location.hash.substr(1));
	
	switch (location.hash.substr(1)) {
		case 'calc_cred':
			calc_cred_result();
			break;
		case 'calc_earn':
			calc_earn_result();
			break;
		default:
			calc_nedv_result();
	}
	
	$('.slider').on('mouseover',function(){$(this).find('.ui-slider-pip').on('mousedown',function(event){event.preventDefault();return false;});});
	$('.calc_ipoteka .tabs a').on('click',function(){switch_result(this.href.split('#')[1]);});
	
	$('.bank_list .bank input[type="button"]').on('click',function(){
		$('input[name="comment"]').val('Банк: '+$(this).parent().parent().parent().find('.value span.dn').text());
	});
}});

function switch_result(v) {
	switch (v) {
		case 'calc_cred':
			calc_cred_result();
			break;
		case 'calc_earn':
			calc_earn_result();
			break;
		default:
			calc_nedv_result();
	}
}


function slice_money(s) {
	s = (s+'').split('').reverse();
	var res = [];
	for(var i=0;i<s.length;i++) {
		res[res.length] = s[i];
		if(i!=0 && !((i+1)%3)) res[res.length] = ' ';
	}
	return res.reverse().join('');
}

function join_money(s) {
	return (!!s)?(s.split(' ').join(''))*1:s;
}

function minmax(v,min,max) {
	return Math.min(Math.max(v,min),max);
}
function round(v,r) {
	var res = Math.round(v/r)*r;
	var fix = (r.toString().split('.').length>1)?r.toString().split('.')[1].length:0;
	return res.toFixed(fix)*1;
}
function label_money(v) {
	var c = Math.floor(((v.toString().length)-1)/3);
	var res = '';
	switch (c) {
		case 0:	res = v+' руб';
		break;
		case 1:	res = round(v/1000,0.1)+' тыс';
		break;
		case 2:	res = round(v/1000000,0.1)+' млн';
		break;
		case 3:	res =round(v/1000000000,0.1)+' млрд';
		break;
	}
	return res;
}

function sort_bank(pr,vp,sr) {
	// window.__pr = pr;
	// window.__vp = vp;
	// window.__sr = sr;
	// if (typeof this.timeout != 'undefined') clearTimeout(this.timeout);
	// this.timeout = setTimeout(function(pr,vp,sr){
		
		// var pr = window.__pr;
		// var vp = window.__vp;
		// var sr = window.__sr;
		// console.log(pr);
		var bl = $('#bank_list');
		var bs = $('#bank_list > .bank:not(.bank_cur)');
		var s = [];
		for (var i=0;i<bs.length;i++) {
			var proc = $(bs[i]).attr('data-proc')*1;
			var vzns = $(bs[i]).attr('data-vznos')*1;
			var srok = $(bs[i]).attr('data-srok')*12;
			var bk = $(bs[i]).find('.dn').text();
			var data = Math.abs(proc-pr)/proc*Math.abs(vzns-vp)/vzns*Math.abs(srok-sr)/srok+i*0.001;
			data = round(data,0.001);
			s[s.length] = {id:i,v:data};
		}
		for(var i=0;i<s.length;i++) {
			for(var j=0;j<s.length;j++) {
				if (s[i].v<s[j].v) {
					var st = s[j].id;
					s[j].id = s[i].id;
					s[i].id = st;
					var st = s[j].v;
					s[j].v = s[i].v;
					s[i].v = st;
				}
			}
		}
		for(var i=0;i<s.length;i++) bl.append($(bs[s[i].id]));
	// },400);
}

function label_srok(v,m) {
	if (!m) {
		var c = Math.floor(v);
		v = round(v,0.1);
		if (c%10>4 || c%10<1 || (c%100>4 && c%100<21)) {
			return v+' лет';
		}
		else {
			if (c%10==1) return v+' год';
			else return v+' года';
		}
	}
	else {
		var c = Math.floor(v);
		v = round(v,1);
		if (c%10>4 || c%10<1 || (c%100>4 && c%100<21)) {
			return v+' месяцев';
		}
		else {
			if (c%10==1) return v+' месяц';
			else return v+' месяца';
		}
	}
}




//---------------cacl nedv object----------------

CN = {
	mn : function(){
		var res = join_money($('#calc_nedv_money_nedv').val());
		return minmax(res,CN.mn_min,CN.mn_max);
	},
	mn_min : 500000,
	mn_max : 50000000,
	mn_step : 100000,
	mn_step_p : function() {
		return Math.ceil((CN.mn_max-CN.mn_min)/(CN.mn_step*4));
	},
	mn_label : function () {
		var res = [];
		var s_max = Math.ceil((CN.mn_max-CN.mn_min)/(CN.mn_step));
		for(var i = CN.mn_min, s = 0; i<CN.mn_max;i+=CN.mn_step*CN.mn_step_p(), s+=CN.mn_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CN.mn_max);
		return res;
	},
	cr : function() {
		return CN.mn()-CN.vm();
	},
	cr_min : 300000,
	cr_max : 20000000,
	pr : function () {
		res = $('#calc_nedv_proc').val()*1;
		return round(minmax(res,CN.pr_min,CN.pr_max),0.1);
	},
	pr_min : 9,
	pr_max : 25,
	pr_step : 0.1,
	pr_step_p : function() {
		return Math.ceil((CN.pr_max-CN.pr_min)/(CN.pr_step*8));
	},
	pr_label : function () {
		var res = [];
		var s_max = Math.ceil((CN.pr_max-CN.pr_min)/(CN.pr_step));
		for(var i = CN.pr_min, s = 0; i<CN.pr_max;i+=CN.pr_step*CN.pr_step_p(), s+=CN.pr_step_p()) res[s] = round(i,0.1);
		res[s_max] = CN.pr_max;
		return res;
	},
	st : function() {
		return $('#calc_nedv_srok_type :checked').val()*1;
	},
	sr : function() {
		res = (CN.st())?
			$('#calc_nedv_srok_m').val()*1:
			$('#calc_nedv_srok_y').val()*12;
		
		return minmax(res,CN.sr_min,CN.sr_max);
	},
	sr_min : 12,
	sr_max : 360,
	sr_step : 1,
	sr_step_p : function() {
		return 12;//Math.ceil((CN.sr_max-CN.sr_min)/(CN.sr_step*6));
	},
	sr_label : function () {
		var res = [];
		var s_max = Math.ceil((CN.sr_max-CN.sr_min)/(CN.sr_step));
		for(var i = CN.sr_min, s = 0; i<CN.sr_max;i+=CN.sr_step*CN.sr_step_p(), s+=CN.sr_step_p()) res[s] = (i==CN.sr_min || i==CN.sr_max || !((i/12)%5))?label_srok(i/12):'';
		res[s_max] = label_srok(CN.sr_max/12);
		return res;
	},
	sy : function() {
		res = (CN.st())?
			round($('#calc_nedv_srok_m').val()*1/12,1):
			$('#calc_nedv_srok_y').val()*1;
		return round(minmax(res,CN.sy_min,CN.sy_max),1);
	},
	sy_min : 1,
	sy_max : 30,
	sy_step : 1,
	sy_step_p : function() {
		return 1;//Math.ceil((CN.sy_max-CN.sy_min)/(CN.sy_step*6));
	},
	sy_label : function () {
		var res = [];
		var s_max = Math.ceil((CN.sy_max-CN.sy_min)/(CN.sy_step));
		for(var i = CN.sy_min, s = 0; i<CN.sy_max;i+=CN.sy_step*CN.sy_step_p(), s+=CN.sy_step_p()) res[s] = (i==CN.sy_min || i==CN.sy_max || !(i%5))?label_srok(i):'';
		res[s_max] = label_srok(CN.sy_max);
		return res;
	},
	vt : function() {
		return $('#calc_nedv_vznos_type :checked').val()*1;
	},
	vm : function() {
		var res = (CN.vt())?
			join_money($('#calc_nedv_money_vznos').val()):
			round(CN.vp()*CN.mn()/100,1);
		return minmax(res,CN.vm_min(),CN.vm_max());
	},
	vm_min : function(){
		return round(minmax(CN.mn()-CN.cr_max,0,CN.mn()-CN.cr_min),CN.vm_step);
	},
	vm_max : function() {
		return round(minmax(CN.mn()*0.8,CN.mn_min-CN.cr_min,CN.mn()-CN.cr_min),CN.vm_step);
	},
	vm_step : 10000,
	vm_step_p : function() {
		return Math.ceil((CN.vm_max()-CN.vm_min())/(CN.vm_step*4));
	},
	vm_label : function () {
		var res = [];
		var s_max = Math.ceil((CN.vm_max()-CN.vm_min())/(CN.vm_step));
		for(var i = CN.vm_min(), s = 0; i<CN.vm_max();i+=CN.vm_step*CN.vm_step_p(), s+=CN.vm_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CN.vm_max());
		return res;
	},
	vp : function() {
		var res = (CN.vt())?
			round(100*CN.mn()/CN.vm(),1):
			$('#calc_nedv_proc_vznos').val()*1;
			console.log(minmax(res,CN.vp_min(),CN.vp_max()))
		return minmax(res,CN.vp_min(),CN.vp_max());
	},
	vp_min : function(){
		return round(100*CN.vm_min()/CN.mn(),CN.vp_step);
	},
	vp_max : function() {
		console.log(Math.ceil(100*CN.vm_max()/CN.mn()));
		return Math.ceil(100*CN.vm_max()/CN.mn());
	},
	vp_step : 1,
	vp_step_p : function() {
		return Math.ceil((CN.vp_max()-CN.vp_min())/(CN.vp_step*4));
	},
	mn_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_money_nedv').val(slice_money(v));
		$('#calc_nedv_money_nedv').val(slice_money(CN.mn()));
	},
	mn_set_s : function() {
		$('#calc_nedv_money_nedv_for').slider({
			value : CN.mn(),
			min : CN.mn_min,
			max : CN.mn_max,
			step : CN.mn_step,
		}).slider('pips',{
			step: CN.mn_step_p(),
			labels : CN.mn_label(),
		});
	},
	vm_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_money_vznos').val(slice_money(v));
		$('#calc_nedv_money_vznos').val(slice_money(CN.vm()));
	},
	vm_set_s : function() {
		$('#calc_nedv_money_vznos_for').slider({
			value : CN.vm(),
			min : CN.vm_min(),
			max : CN.vm_max(),
			step : CN.vm_step,
		}).slider('pips',{
			step: CN.vm_step_p(),
			labels : CN.vm_label(),
		});
	},
	vp_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_proc_vznos').val(round(v,CN.vp_step));
		$('#calc_nedv_proc_vznos').val(CN.vp());
	},
	vp_set_s : function() {
		$('#calc_nedv_proc_vznos_for').slider({
			value : CN.vp(),
			min : CN.vp_min(),
			max : CN.vp_max(),
			step : CN.vp_step
		}).slider('pips',{
			step: CN.vp_step_p(),
			suffix : '%',
		});
	},
	pr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_proc').val(round(v,CN.pr_step));
		$('#calc_nedv_proc').val(CN.pr());
	},
	pr_set_s : function() {
		$('#calc_nedv_proc_for').slider({
			value : CN.pr(),
			min : CN.pr_min,
			max : CN.pr_max,
			step : CN.pr_step
		}).slider('pips',{
			step: CN.pr_step_p(),
			labels : CN.pr_label(),
			suffix : '%',
		});
	},
	sr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_srok_m').val(round(v,CN.sr_step));
		$('#calc_nedv_srok_m').val(CN.sr());
	},
	sr_set_s : function() {
		$('#calc_nedv_srok_m_for').slider({
			value : CN.sr(),
			min : CN.sr_min,
			max : CN.sr_max,
			step : CN.sr_step
		}).slider('pips',{
			step: CN.sr_step_p(),
			labels : CN.sr_label(),
		});
	},
	sy_set : function(v) {
		if (typeof v != 'undefined') $('#calc_nedv_srok_y').val(round(v,CN.sy_step));
		$('#calc_nedv_srok_y').val(CN.sy());
	},
	sy_set_s : function() {
		$('#calc_nedv_srok_y_for').slider({
			value : CN.sy(),
			min : CN.sy_min,
			max : CN.sy_max,
			step : CN.sy_step
		}).slider('pips',{
			step: CN.sy_step_p(),
			labels : CN.sy_label(),
		});
	},
		
}



function calc_nedv_init() {
	$('#calc_nedv_proc_vznos').mask('#0');
	$('#calc_nedv_srok_y').mask('#0');
	$('#calc_nedv_srok_m').mask('#00');
	$('#calc_nedv_proc').mask('#0.0',{reverse:true});
	CN.mn_set();
	CN.mn_set_s();
	CN.vm_set();
	CN.vm_set_s();
	CN.vp_set();
	CN.vp_set_s();
	CN.pr_set();
	CN.pr_set_s();
	CN.sr_set();
	CN.sr_set_s();
	CN.sy_set();
	CN.sy_set_s();
	calc_nedv_link();
	calc_nedv_result();
}

function calc_nedv_link() {
	$('#calc_nedv_vznos_type input').on('click',function(){calc_nedv_tab()});
	$('#calc_nedv_srok_type input').on('click',function(){calc_nedv_tab()});
	$('#calc_nedv_money_nedv').on('input',function() {
		CN.mn_set_s();
		CN.vm_set();
		CN.vm_set_s();
		CN.vp_set();
		CN.vp_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.mn_set();
	});
	$('#calc_nedv_money_nedv_for').on('slide',function(e,u) {
		CN.mn_set(u.value);
		CN.vm_set();
		CN.vm_set_s();
		CN.vp_set();
		CN.vp_set_s();
		setCookie('form_money_nedv',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});
	$('#calc_nedv_money_vznos').on('input',function() {
		CN.vm_set_s();
		CN.vp_set();
		CN.vp_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.vm_set();
	});
	$('#calc_nedv_money_vznos_for').on('slide',function(e,u) {
		CN.vm_set(u.value);
		CN.vm_set_s();
		CN.vp_set();
		CN.vp_set_s();
		setCookie('form_money_vznos_nedv',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});
	$('#calc_nedv_proc_vznos').on('input',function() {
		CN.vp_set_s();
		CN.vm_set();
		CN.vm_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.vp_set();
	});
	$('#calc_nedv_proc_vznos_for').on('slide',function(e,u) {
		CN.vp_set(u.value);
		CN.vp_set_s();
		CN.vm_set();
		CN.vm_set_s();
		setCookie('form_proc_vznos',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});
	$('#calc_nedv_proc').on('input',function() {
		CN.pr_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.pr_set();
	});
	$('#calc_nedv_proc_for').on('slide',function(e,u) {
		CN.pr_set(u.value);
		CN.pr_set_s();
		setCookie('form_proc',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});
	$('#calc_nedv_srok_m').on('input',function() {
		CN.sr_set_s();
		CN.sy_set();
		CN.sy_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.sr_set();
	});
	$('#calc_nedv_srok_m_for').on('slide',function(e,u) {
		CN.sr_set(u.value);
		CN.sr_set_s();
		CN.sy_set();
		CN.sy_set_s();
		setCookie('form_srok_m',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});
	$('#calc_nedv_srok_y').on('input',function() {
		CN.sy_set_s();
		CN.sr_set();
		CN.sr_set_s();
		calc_nedv_result_pre();
	}).on('blur',function(){
		CN.sy_set();
	});
	$('#calc_nedv_srok_y_for').on('slide',function(e,u) {
		CN.sy_set(u.value);
		CN.sy_set_s();
		CN.sr_set();
		CN.sr_set_s();
		setCookie('form_srok_y',u.value,{expires:600000,path:'/'});
		calc_nedv_result_pre();
	});	
}

function calc_nedv_tab() {
	var type = $('#calc_nedv_vznos_type :checked').val()*1;
	if (type) {
		$('.calc_nedv_vznos_proc').hide();
		$('.calc_nedv_vznos_money').show();
		CN.vp_set();
	}
	else {
		$('.calc_nedv_vznos_proc').show();
		$('.calc_nedv_vznos_money').hide();
		CN.vm_set();
	}
	var type = $('#calc_nedv_srok_type :checked').val()*1;
	if (type) {
		$('.calc_nedv_srok_y').hide();
		$('.calc_nedv_srok_m').show();
		CN.sy_set();
	}
	else {
		$('.calc_nedv_srok_y').show();
		$('.calc_nedv_srok_m').hide();
		CN.sr_set();
	}
}

function calc_nedv_result_pre() {
	if (typeof this.tm != 'undefined') clearTimeout(this.tm);
	this.tm = setTimeout('calc_nedv_result()',100);
}
function calc_nedv_result() {
	var summ = CN.cr();

	var nedv = CN.mn();

	var srok = CN.sr();

	var pr_m = CN.pr()/1200;

	var paym = round(summ*(pr_m+(pr_m/(Math.pow(1+pr_m,srok)-1))),1);
	var smpr = paym*srok;

	var earn = round(paym*2,1);

	var vzns = CN.vm();
	
	sort_bank(CN.pr(),CN.vp(),CN.sr());
	
	summ = slice_money(summ);
	nedv = slice_money(nedv);
	paym = slice_money(paym);
	smpr = slice_money(smpr);
	earn = slice_money(earn);
	vzns = slice_money(vzns);
	srok = label_srok(Math.floor(srok/12))+((srok%12)?' '+label_srok(srok%12,true):'');
	
	setCookie('form_money',summ,{expires:600000,path:'/'});
	setCookie('form_money_vznos',vzns,{expires:600000,path:'/'});
	$('input[name="money"]').val(summ);
	$('input[name="money_vznos"]').val(vzns);
	var res = '';
	
	res += '<div class="label">Ежемесячный платеж</div>';
	res += '<div class="value">'+paym+' руб.</div>';
	res += '<div class="label">Размер кредита</div>';
	res += '<div class="value">'+summ+' руб.</div>';
	res += '<div class="label">Сумма выплат по кредиту</div>';
	res += '<div class="value">'+smpr+' руб.</div>';
	res += '<div class="label">Стоимость недвижимости</div>';
	res += '<div class="value">'+nedv+' руб.</div>';
	res += '<div class="label">Срок выплат</div>';
	res += '<div class="value">'+srok+'</div>';
	res += '<div class="label">Необходимый ежемесячный доход</div>';
	res += '<div class="value">'+earn+' руб.</div>';
	
	$('#calc_result').html(res);
}















//-------------------- calc credit -------------------------

CK = {
	cr : function(){
		var res = join_money($('#calc_cred_money_cred').val());
		return minmax(res,CK.cr_min,CK.cr_max);
	},
	cr_min : CN.cr_min,
	cr_max : CN.cr_max,
	cr_step : 50000,
	cr_step_p : function() {
		return Math.ceil((CK.cr_max-CK.cr_min)/(CK.cr_step*4));
	},
	cr_label : function () {
		var res = [];
		var s_max = Math.ceil((CK.cr_max-CK.cr_min)/(CK.cr_step));
		for(var i = CK.cr_min, s = 0; i<CK.cr_max;i+=CK.cr_step*CK.cr_step_p(), s+=CK.cr_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CK.cr_max);
		return res;
	},
	pr : function () {
		res = $('#calc_cred_proc').val()*1;
		return round(minmax(res,CK.pr_min,CK.pr_max),0.1);
	},
	pr_min : CN.pr_min,
	pr_max : CN.pr_max,
	pr_step : CN.pr_step,
	pr_step_p : function() {
		return Math.ceil((CK.pr_max-CK.pr_min)/(CK.pr_step*7));
	},
	pr_label : function () {
		var res = [];
		var s_max = Math.ceil((CK.pr_max-CK.pr_min)/(CK.pr_step));
		for(var i = CK.pr_min, s = 0; i<CK.pr_max;i+=CK.pr_step*CK.pr_step_p(), s+=CK.pr_step_p()) res[s] = round(i,0.1);
		res[s_max] = CK.pr_max;
		return res;
	},
	st : function() {
		return $('#calc_cred_srok_type :checked').val()*1;
	},
	sr : function() {
		res = (CK.st())?
			$('#calc_cred_srok_m').val()*1:
			$('#calc_cred_srok_y').val()*12;
		
		return minmax(res,CK.sr_min,CK.sr_max);
	},
	sr_min : CN.sr_min,
	sr_max : CN.sr_max,
	sr_step : CN.sr_step,
	sr_step_p : function() {
		return 12;//Math.ceil((CK.sr_max-CK.sr_min)/(CK.sr_step*5));
	},
	sr_label : function () {
		var res = [];
		var s_max = Math.ceil((CK.sr_max-CK.sr_min)/(CK.sr_step));
		for(var i = CK.sr_min, s = 0; i<CK.sr_max;i+=CK.sr_step*CK.sr_step_p(), s+=CK.sr_step_p()) res[s] = (i==CK.sr_min || i==CK.sr_max || !(i%5))?label_srok(i/12):'';
		res[s_max] = label_srok(CK.sr_max/12);
		return res;
	},
	sy : function() {
		res = (CK.st())?
			round($('#calc_cred_srok_m').val()*1/12,1):
			$('#calc_cred_srok_y').val()*1;
		return round(minmax(res,CK.sy_min,CK.sy_max),1);
	},
	sy_min : CN.sy_min,
	sy_max : CN.sy_max,
	sy_step : CN.sy_step,
	sy_step_p : function() {
		return 1;//Math.ceil((CK.sy_max-CK.sy_min)/(CK.sy_step*5));
	},
	sy_label : function () {
		var res = [];
		var s_max = Math.ceil((CK.sy_max-CK.sy_min)/(CK.sy_step));
		for(var i = CK.sy_min, s = 0; i<CK.sy_max;i+=CK.sy_step*CK.sy_step_p(), s+=CK.sy_step_p()) res[s] = (i==CK.sy_min || i==CK.sy_max || !(i%5))?label_srok(i):'';
		res[s_max] = label_srok(CK.sy_max);
		return res;
	},
	vt : function() {
		return $('#calc_cred_vznos_type :checked').val()*1;
	},
	vm : function() {
		var res = (CK.vt())?
			join_money($('#calc_cred_money_vznos').val()):
			round((CK.vp()*CK.cr())/(100-CK.vp()),1);
		return minmax(res,CK.vm_min(),CK.vm_max());
	},
	vm_min : function(){
		return 0;
	},
	vm_max : function() {
		return round(Math.min(CK.cr()/0.2,CN.mn_max-CK.cr()),CK.vm_step);
	},
	vm_step : CN.vm_step,
	vm_step_p : function() {
		return Math.ceil((CK.vm_max()-CK.vm_min())/(CK.vm_step*4));
	},
	vm_label : function () {
		var res = [];
		var s_max = Math.ceil((CK.vm_max()-CK.vm_min())/(CK.vm_step));

		for(var i = CK.vm_min(), s = 0; i<CK.vm_max();i+=CK.vm_step*CK.vm_step_p(), s+=CK.vm_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CK.vm_max());
		return res;
	},
	//-------------------
	vp : function() {
		var res = (CK.vt())?
			round(100*CK.vm()/(CK.cr()+CK.vm()),1):
			$('#calc_cred_proc_vznos').val()*1;
			// percent
			// console.log(minmax(res,CK.vp_min(),CK.vp_max()))
		return minmax(res,CK.vp_min(),CK.vp_max());
	},
	vp_min : function(){
		return 0;
	},
	vp_max : function() {
		return round(100*CK.vm_max()/(CK.cr()+CK.vm_max()),1);
	},
	vp_step : CN.vp_step,
	vp_step_p : function() {
		return Math.ceil((CK.vp_max()-CK.vp_min())/(CK.vp_step*4));
	},
	//------------
	cr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_money_cred').val(slice_money(v));
		$('#calc_cred_money_cred').val(slice_money(CK.cr()));
	},
	cr_set_s : function() {
		$('#calc_cred_money_cred_for').slider({
			value : CK.cr(),
			min : CK.cr_min,
			max : CK.cr_max,
			step : CK.cr_step,
		}).slider('pips',{
			step: CK.cr_step_p(),
			labels : CK.cr_label(),
		});
	},
	vm_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_money_vznos').val(slice_money(v));
		$('#calc_cred_money_vznos').val(slice_money(CK.vm()));
	},
	vm_set_s : function() {
		$('#calc_cred_money_vznos_for').slider({
			value : CK.vm(),
			min : CK.vm_min(),
			max : CK.vm_max(),
			step : CK.vm_step,
		}).slider('pips',{
			step: CK.vm_step_p(),
			labels : CK.vm_label(),
		});
	},
	vp_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_proc_vznos').val(round(v,CK.vp_step));
		$('#calc_cred_proc_vznos').val(CK.vp());
	},
	vp_set_s : function() {
		$('#calc_cred_proc_vznos_for').slider({
			value : CK.vp(),
			min : CK.vp_min(),
			max : CK.vp_max(),
			step : CK.vp_step
		}).slider('pips',{
			step: CK.vp_step_p(),
			suffix : '%',
		});
	},
	pr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_proc').val(round(v,CK.pr_step));
		$('#calc_cred_proc').val(CK.pr());
	},
	pr_set_s : function() {
		$('#calc_cred_proc_for').slider({
			value : CK.pr(),
			min : CK.pr_min,
			max : CK.pr_max,
			step : CK.pr_step
		}).slider('pips',{
			step: CK.pr_step_p(),
			labels : CK.pr_label(),
			suffix : '%',
		});
	},
	sr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_srok_m').val(round(v,CK.sr_step));
		$('#calc_cred_srok_m').val(CK.sr());
	},
	sr_set_s : function() {
		$('#calc_cred_srok_m_for').slider({
			value : CK.sr(),
			min : CK.sr_min,
			max : CK.sr_max,
			step : CK.sr_step
		}).slider('pips',{
			step: CK.sr_step_p(),
			labels : CK.sr_label(),
		});
	},
	sy_set : function(v) {
		if (typeof v != 'undefined') $('#calc_cred_srok_y').val(round(v,CK.sy_step));
		$('#calc_cred_srok_y').val(CK.sy());
	},
	sy_set_s : function() {
		$('#calc_cred_srok_y_for').slider({
			value : CK.sy(),
			min : CK.sy_min,
			max : CK.sy_max,
			step : CK.sy_step
		}).slider('pips',{
			step: CK.sy_step_p(),
			labels : CK.sy_label(),
		});
	},
		
}



function calc_cred_init() {
	$('#calc_cred_srok_y').mask('#0');
	$('#calc_cred_srok_m').mask('#00');
	$('#calc_cred_proc').mask('#0.0',{reverse:true});
	CK.cr_set();
	CK.cr_set_s();
	CK.pr_set();
	CK.pr_set_s();
	CK.vm_set();
	CK.vm_set_s();
	CK.vp_set();
	CK.vp_set_s();
	CK.sr_set();
	CK.sr_set_s();
	CK.sy_set();
	CK.sy_set_s();
	calc_cred_link();
	calc_cred_result();
}

function calc_cred_link() {
	$('#calc_cred_vznos_type input').on('click',function(){calc_cred_tab()});
	$('#calc_cred_srok_type input').on('click',function(){calc_cred_tab()});
	$('#calc_cred_money_cred').on('input',function() {
		CK.cr_set_s();
		CK.vm_set();
		CK.vm_set_s();
		CK.vp_set();
		CK.vp_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.cr_set();
	});
	$('#calc_cred_money_cred_for').on('slide',function(e,u) {
		CK.cr_set(u.value);
		CK.vm_set();
		CK.vm_set_s();
		CK.vp_set();
		CK.vp_set_s();
		setCookie('form_money_cred',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});
	$('#calc_cred_proc').on('input',function() {
		CK.pr_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.pr_set();
	});
	$('#calc_cred_money_vznos').on('input',function() {
		CK.vm_set_s();
		CK.vp_set();
		CK.vp_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.vm_set();
	});
	$('#calc_cred_money_vznos_for').on('slide',function(e,u) {
		CK.vm_set(u.value);
		CK.vm_set_s();
		CK.vp_set();
		CK.vp_set_s();
		setCookie('form_money_vznos_cred',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});
	$('#calc_cred_proc_vznos').on('input',function() {
		CK.vp_set_s();
		CK.vm_set();
		CK.vm_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.vp_set();
	});
	$('#calc_cred_proc_vznos_for').on('slide',function(e,u) {
		CK.vp_set(u.value);
		CK.vp_set_s();
		CK.vm_set();
		CK.vm_set_s();
		setCookie('form_proc_vznos',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});
	$('#calc_cred_proc_for').on('slide',function(e,u) {
		CK.pr_set(u.value);
		CK.pr_set_s();
		setCookie('form_proc',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});
	$('#calc_cred_srok_m').on('input',function() {
		CK.sr_set_s();
		CK.sy_set();
		CK.sy_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.sr_set();
	});
	$('#calc_cred_srok_m_for').on('slide',function(e,u) {
		CK.sr_set(u.value);
		CK.sr_set_s();
		CK.sy_set();
		CK.sy_set_s();
		setCookie('form_srok_m',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});
	$('#calc_cred_srok_y').on('input',function() {
		CK.sy_set_s();
		CK.sr_set();
		CK.sr_set_s();
		calc_cred_result_pre();
	}).on('blur',function(){
		CK.sy_set();
	});
	$('#calc_cred_srok_y_for').on('slide',function(e,u) {
		CK.sy_set(u.value);
		CK.sy_set_s();
		CK.sr_set();
		CK.sr_set_s();
		setCookie('form_srok_y',u.value,{expires:600000,path:'/'});
		calc_cred_result_pre();
	});	
}

function calc_cred_tab() {
	var type = $('#calc_cred_vznos_type :checked').val()*1;
	if (type) {
		$('.calc_cred_vznos_proc').hide();
		$('.calc_cred_vznos_money').show();
		CK.vp_set();
	}
	else {
		$('.calc_cred_vznos_proc').show();
		$('.calc_cred_vznos_money').hide();
		CK.vm_set();
	}
	var type = $('#calc_cred_srok_type :checked').val()*1;
	if (type) {
		$('.calc_cred_srok_y').hide();
		$('.calc_cred_srok_m').show();
		CK.sy_set();
	}
	else {
		$('.calc_cred_srok_y').show();
		$('.calc_cred_srok_m').hide();
		CK.sr_set();
	}
}

function calc_cred_result_pre() {
	if (typeof this.tm != 'undefined') clearTimeout(this.tm);
	this.tm = setTimeout('calc_cred_result()',100);
}
function calc_cred_result() {
	var summ = CK.cr();
		var nedv = CK.cr()+CK.vm();
	
	var srok = CK.sr();
	
	var pr_m = CK.pr()/1200;
	var paym = round(summ*(pr_m+(pr_m/(Math.pow(1+pr_m,srok)-1))),1);
	
	var smpr = paym*srok;
	var earn = round(paym*2,1);
	var vzns = CK.vm();

	
	sort_bank(CK.pr(),CK.vp(),CK.sr());
	
	summ = slice_money(summ);
	nedv = slice_money(nedv);
	paym = slice_money(paym);
	smpr = slice_money(smpr);
	earn = slice_money(earn);
	vzns = slice_money(vzns);
	srok = label_srok(Math.floor(srok/12))+((srok%12)?' '+label_srok(srok%12,true):'');
	
	setCookie('form_money',summ,{expires:600000,path:'/'});
	setCookie('form_money_vznos',vzns,{expires:600000,path:'/'});
	$('input[name="money"]').val(summ);
	$('input[name="money_vznos"]').val(vzns);
	var res = '';
	res += '<div class="label">Ежемесячный платеж</div>';
	res += '<div class="value">'+paym+' руб.</div>';
	res += '<div class="label">Стоимость недвижимости</div>';
	res += '<div class="value">'+nedv+' руб.</div>';
	res += '<div class="label">Размер кредита</div>';
	res += '<div class="value">'+summ+' руб.</div>';
	res += '<div class="label">Срок выплат</div>';
	res += '<div class="value">'+srok+'</div>';
	res += '<div class="label">Сумма выплат по кредиту</div>';
	res += '<div class="value">'+smpr+' руб.</div>';
	res += '<div class="label">Необходимый ежемесячный доход</div>';
	res += '<div class="value">'+earn+' руб.</div>';
	
	$('#calc_result').html(res);
}












//-------------------- calc earn -------------------------

CD = {
	er : function(){
		var res = join_money($('#calc_earn_money_earn').val());
		return minmax(res,CD.er_min,CD.er_max);
	},
	er_min : 20000,
	er_max : 500000,
	er_step : 1000,
	er_step_p : function() {
		return Math.ceil((CD.er_max-CD.er_min)/(CD.er_step*4));
	},
	er_label : function () {
		var res = [];
		var s_max = Math.ceil((CD.er_max-CD.er_min)/(CD.er_step));
		for(var i = CD.er_min, s = 0; i<CD.er_max;i+=CD.er_step*CD.er_step_p(), s+=CD.er_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CD.er_max);
		return res;
	},
	cr : function() {
		var pr_m = CD.pr()/1200;
		
		return round(minmax(CD.er()/((pr_m+(pr_m/(Math.pow(1+pr_m,CD.sr())-1)))*2),CN.cr_min,CN.cr_max),1);
		
	},
	pr : function () {
		res = $('#calc_earn_proc').val()*1;
		return round(minmax(res,CD.pr_min,CD.pr_max),CN.pr_step);
	},
	pr_min : CN.pr_min,
	pr_max : CN.pr_max,
	pr_step : CN.pr_step,
	pr_step_p : function() {
		return Math.ceil((CD.pr_max-CD.pr_min)/(CD.pr_step*8));
	},
	pr_label : function () {
		var res = [];
		var s_max = Math.ceil((CD.pr_max-CD.pr_min)/(CD.pr_step));
		for(var i = CD.pr_min, s = 0; i<CD.pr_max;i+=CD.pr_step*CD.pr_step_p(), s+=CD.pr_step_p()) res[s] = round(i,0.1);
		res[s_max] = CD.pr_max;
		return res;
	},
	st : function() {
		return $('#calc_earn_srok_type :checked').val()*1;
	},
	sr : function() {
		res = (CD.st())?
			$('#calc_earn_srok_m').val()*1:
			$('#calc_earn_srok_y').val()*12;
		
		return minmax(res,CD.sr_min(),CD.sr_max());
	},
	sr_min : function() {
		var p = CD.pr()/1200;
		var e = CD.er()/2;
		var c = CN.cr_min;
		var sr_min = Math.log(e/(e-c*p))/Math.log(p+1);
		return (isNaN(sr_min))?CN.sr_min:Math.ceil(Math.max(CN.sr_min,sr_min));
	},
	sr_max : function() {
		var p = CD.pr()/1200;
		var e = CD.er()/2;
		var c = CN.cr_max;
		var sr_max = Math.log(e/(e-c*p))/Math.log(p+1);
		return (isNaN(sr_max))?CN.sr_max:Math.floor(Math.min(CN.sr_max,sr_max));
	},
	sr_step : CN.sr_step,
	sr_step_p : function() {
		return 1;//Math.ceil((CD.sr_max()-CD.sr_min())/(CD.sr_step*4));
	},
	sr_label : function () {
		var res = [];
		var s_max = Math.ceil((CD.sr_max()-CD.sr_min())/(CD.sr_step));
		for(var i = CD.sr_min(), s = 0; i<CD.sr_max();i+=CD.sr_step*CD.sr_step_p(), s+=CD.sr_step_p()) res[s] = (i==CD.sr_min() || i==CD.sr_max() || (!((i/12)%5) && (i-CD.sr_min())>30 && (CD.sr_max()-i))>30)?label_srok(i/12):'';
		res[s_max] = label_srok(CD.sr_max()/12);
		return res;
	},
	sy : function() {
		res = (CD.st())?
			round($('#calc_earn_srok_m').val()*1/12,1):
			$('#calc_earn_srok_y').val()*1;
		return round(minmax(res,CD.sy_min(),CD.sy_max()),1);
	},
	sy_min : function() {
		return Math.ceil(CD.sr_min()/12);
	},
	sy_max : function() {
		return Math.floor(CD.sr_max()/12);
	},
	sy_step : CN.sy_step,
	sy_step_p : function() {
		return 1;//Math.ceil((CD.sy_max()-CD.sy_min())/(CD.sy_step*4));
	},
	sy_label : function () {
		var res = [];
		var s_max = Math.ceil((CD.sy_max()-CD.sy_min())/(CD.sy_step));
		// for(var i = CD.sy_min(), s = 0; i<CD.sy_max();i+=CD.sy_step*CD.sy_step_p(), s+=CD.sy_step_p()) res[s] = label_srok(i);
		for(var i = CD.sy_min(), s = 0; i<CD.sy_max();i+=CD.sy_step*CD.sy_step_p(), s+=CD.sy_step_p()) res[s] = (i==CD.sy_min() || i==CD.sy_max() || (!(i%5) && (i-CD.sy_min())>2 && (CD.sy_max()-i))>2)?label_srok(i):'';
		res[s_max] = label_srok(CD.sy_max());
		return res;
	},
	vt : function() {
		return $('#calc_earn_vznos_type :checked').val()*1;
	},
	vm : function() {
		var res = (CD.vt())?
			join_money($('#calc_earn_money_vznos').val()):
			round((CD.vp()*CD.cr())/(100-CD.vp()),1);
		return minmax(res,CD.vm_min(),CD.vm_max());
	},
	vm_min : function(){
		return 0;
	},
	vm_max : function() {
	
		return round(Math.min(CD.cr()/0.2,CN.mn_max-CD.cr()),CD.vm_step);
	},
	vm_step : CN.vm_step,
	vm_step_p : function() {
		return Math.ceil((CD.vm_max()-CD.vm_min())/(CD.vm_step*4));
	},
	vm_label : function () {
		var res = [];
		var s_max = Math.ceil((CD.vm_max()-CD.vm_min())/(CD.vm_step));
		for(var i = CD.vm_min(), s = 0; i<CD.vm_max();i+=CD.vm_step*CD.vm_step_p(), s+=CD.vm_step_p()) res[s] = label_money(i);
		res[s_max] = label_money(CD.vm_max());
	
		return res;
	},
	//-------------------
	vp : function() {
		var res = (CD.vt())?
			round(100*CD.vm()/(CD.cr()+CD.vm()),1):
			$('#calc_earn_proc_vznos').val()*1;
		return minmax(res,CD.vp_min(),CD.vp_max());
	},
	vp_min : function(){
		return 0;
	},
	vp_max : function() {
		return round(100*CD.vm_max()/(CD.cr()+CD.vm_max()),1);
	},
	vp_step : CN.vp_step,
	vp_step_p : function() {
		return Math.ceil((CD.vp_max()-CD.vp_min())/(CD.vp_step*4));
	},
	//------------
	er_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_money_earn').val(slice_money(v));
		$('#calc_earn_money_earn').val(slice_money(CD.er()));
	},
	er_set_s : function() {
		$('#calc_earn_money_earn_for').slider({
			value : CD.er(),
			min : CD.er_min,
			max : CD.er_max,
			step : CD.er_step,
		}).slider('pips',{
			step: CD.er_step_p(),
			labels : CD.er_label(),
		});
	},
	vm_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_money_vznos').val(slice_money(v));
		$('#calc_earn_money_vznos').val(slice_money(CD.vm()));
	},
	vm_set_s : function() {
		$('#calc_earn_money_vznos_for').slider({
			value : CD.vm(),
			min : CD.vm_min(),
			max : CD.vm_max(),
			step : CD.vm_step,
		}).slider('pips',{
			step: CD.vm_step_p(),
			labels : CD.vm_label(),
		});
	},
	vp_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_proc_vznos').val(round(v,CD.vp_step));
		$('#calc_earn_proc_vznos').val(CD.vp());
	},
	vp_set_s : function() {
		$('#calc_earn_proc_vznos_for').slider({
			value : CD.vp(),
			min : CD.vp_min(),
			max : CD.vp_max(),
			step : CD.vp_step
		}).slider('pips',{
			step: CD.vp_step_p(),
			suffix : '%',
		});
	},
	pr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_proc').val(round(v,CD.pr_step));
		$('#calc_earn_proc').val(CD.pr());
	},
	pr_set_s : function() {
		$('#calc_earn_proc_for').slider({
			value : CD.pr(),
			min : CD.pr_min,
			max : CD.pr_max,
			step : CD.pr_step
		}).slider('pips',{
			step: CD.pr_step_p(),
			labels : CD.pr_label(),
			suffix : '%',
		});
	},
	sr_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_srok_m').val(round(v,CD.sr_step));
		$('#calc_earn_srok_m').val(CD.sr());
	},
	sr_set_s : function() {
		$('#calc_earn_srok_m_for').slider({
			value : CD.sr(),
			min : CD.sr_min(),
			max : CD.sr_max(),
			step : CD.sr_step
		}).slider('pips',{
			step: CD.sr_step_p(),
			labels : CD.sr_label(),
		});
	},
	sy_set : function(v) {
		if (typeof v != 'undefined') $('#calc_earn_srok_y').val(round(v,CD.sy_step));
		$('#calc_earn_srok_y').val(CD.sy());
	},
	sy_set_s : function() {
		$('#calc_earn_srok_y_for').slider({
			value : CD.sy(),
			min : CD.sy_min(),
			max : CD.sy_max(),
			step : CD.sy_step
		}).slider('pips',{
			step: CD.sy_step_p(),
			labels : CD.sy_label(),
		});
	},
		
}



function calc_earn_init() {
	$('#calc_earn_srok_y').mask('#0');
	$('#calc_earn_srok_m').mask('#00');
	$('#calc_earn_proc').mask('#0.0',{reverse:true});
	CD.er_set();
	CD.er_set_s();
	CD.pr_set();
	CD.pr_set_s();
	CD.vm_set();
	CD.vm_set_s();
	CD.vp_set();
	CD.vp_set_s();
	CD.sr_set();
	CD.sr_set_s();
	CD.sy_set();
	CD.sy_set_s();
	calc_earn_link();
	calc_earn_result();
}

function calc_earn_link() {
	$('#calc_earn_vznos_type input').on('click',function(){calc_earn_tab()});
	$('#calc_earn_srok_type input').on('click',function(){calc_earn_tab()});
	$('#calc_earn_money_earn').on('input',function() {
		CD.er_set_s();
		CD.vm_set();
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		CD.sr_set();
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.er_set();
	});
	$('#calc_earn_proc').on('input',function() {
		CD.pr_set_s();
		CD.vp_set_s();
		CD.vm_set();
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		CD.sr_set();
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.pr_set();
	});
	$('#calc_earn_money_earn_for').on('slide',function(e,u) {
		CD.er_set(u.value);
		CD.vm_set();
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		CD.sr_set();
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		setCookie('form_money_cred',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});
	$('#calc_earn_money_vznos').on('input',function() {
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.vm_set();
	});
	$('#calc_earn_money_vznos_for').on('slide',function(e,u) {
		CD.vm_set(u.value);
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		setCookie('form_money_vznos_cred',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});
	$('#calc_earn_proc_vznos').on('input',function() {
		CD.vp_set_s();
		CD.vm_set();
		CD.vm_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.vp_set();
	});
	$('#calc_earn_proc_vznos_for').on('slide',function(e,u) {
		CD.vp_set(u.value);
		CD.vp_set_s();
		CD.vm_set();
		CD.vm_set_s();
		setCookie('form_proc_vznos',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});
	$('#calc_earn_proc_for').on('slide',function(e,u) {
		CD.pr_set(u.value);
		CD.pr_set_s();
		CD.vm_set();
		CD.vm_set_s();
		CD.vp_set();
		CD.vp_set_s();
		CD.sr_set();
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		setCookie('form_proc',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});
	$('#calc_earn_srok_m').on('input',function() {
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.sr_set();
	});
	$('#calc_earn_srok_m_for').on('slide',function(e,u) {
		CD.sr_set(u.value);
		CD.sr_set_s();
		CD.sy_set();
		CD.sy_set_s();
		setCookie('form_srok_m',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});
	$('#calc_earn_srok_y').on('input',function() {
		CD.sy_set_s();
		CD.sr_set();
		CD.sr_set_s();
		calc_earn_result_pre();
	}).on('blur',function(){
		CD.sy_set();
	});
	$('#calc_earn_srok_y_for').on('slide',function(e,u) {
		CD.sy_set(u.value);
		CD.sy_set_s();
		CD.sr_set();
		CD.sr_set_s();
		setCookie('form_srok_y',u.value,{expires:600000,path:'/'});
		calc_earn_result_pre();
	});	
}

function calc_earn_tab() {
	var type = $('#calc_earn_vznos_type :checked').val()*1;
	if (type) {
		$('.calc_earn_vznos_proc').hide();
		$('.calc_earn_vznos_money').show();
		CD.vp_set();
	}
	else {
		$('.calc_earn_vznos_proc').show();
		$('.calc_earn_vznos_money').hide();
		CD.vm_set();
	}
	var type = $('#calc_earn_srok_type :checked').val()*1;
	if (type) {
		$('.calc_earn_srok_y').hide();
		$('.calc_earn_srok_m').show();
		CD.sy_set();
	}
	else {
		$('.calc_earn_srok_y').show();
		$('.calc_earn_srok_m').hide();
		CD.sr_set();
	}
}

function calc_earn_result_pre() {
	if (typeof this.tm != 'undefined') clearTimeout(this.tm);
	this.tm = setTimeout('calc_earn_result()',100);
}
function calc_earn_result() {
	var summ = CD.cr();

	var nedv = CD.cr()+CD.vm();
	
	var srok = CD.sr();

	var pr_m = CD.pr()/1200;
	var paym = round(summ*(pr_m+(pr_m/(Math.pow(1+pr_m,srok)-1))),1);
	var smpr = paym*srok;
	var earn = CD.er();

	var vzns = CD.vm();
	
	sort_bank(CD.pr(),CD.vp(),CD.sr());
	
	summ = slice_money(summ);

	nedv = slice_money(nedv);
	paym = slice_money(paym);
	smpr = slice_money(smpr);
	earn = slice_money(earn);
	vzns = slice_money(vzns);
	srok = label_srok(Math.floor(srok/12))+((srok%12)?' '+label_srok(srok%12,true):'');
	
	setCookie('form_money',summ,{expires:600000,path:'/'});
	setCookie('form_money_vznos',vzns,{expires:600000,path:'/'});
	$('input[name="money"]').val(summ);
	$('input[name="money_vznos"]').val(vzns);
	var res = '';
	
	res += '<div class="label">Ежемесячный платеж</div>';
	res += '<div class="value">'+paym+' руб.</div>';
	res += '<div class="label">Mаксимальный размер кредита</div>';
	res += '<div class="value">'+summ+' руб.</div>';
	res += '<div class="label">Срок выплат</div>';
	res += '<div class="value">'+srok+'</div>';
	res += '<div class="label">Стоимость недвижимости</div>';
	res += '<div class="value">'+nedv+' руб.</div>';
	res += '<div class="label">Сумма выплат по кредиту</div>';
	res += '<div class="value">'+smpr+' руб.</div>';
	res += '<div class="label">Eжемесячный доход</div>';
	res += '<div class="value">'+earn+' руб.</div>';
	
	$('#calc_result').html(res);
}
