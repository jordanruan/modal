class ModalMateriaisHelper{

	constructor(){
		this.SUCC = 'success';
		this.WARN = 'warning';
		this.ERRO = 'error';
		this.INFO = 'info';
	}

	static OK = 200;
	static NOT_FOUND = 404;
	static ERROR = 500;
	static cepSearchInProgress = false;

	static MDAJAX(ctll){
		return {
			url: APP_PATH + 'php/GenericWrapper.php',
			method: 'POST',
			dataType: 'json',
			data: { controller: ctll}
		}
	}

	static ajaxCall(params, callSuccess, callError, callBefore, callComplete, hasFile){

		let MAJAX = ModalHelper.MDAJAX();
		MAJAX.data = params;

		MAJAX.beforeSend = () => callBefore();
		MAJAX.success = response => callSuccess(response);
		MAJAX.error = error => callError(error);
		MAJAX.complete = () => callComplete();

		if(hasFile){
			MAJAX.enctype = 'multipart/form-data';
			MAJAX.processData = false;
			MAJAX.contentType = false;
		}

		$.ajax(MAJAX);
	}

	static stdCall(args, hasFile = false, externalController = false){

		if(!externalController){
			args.data.controller = ModalHelper.CONTROLLER;	
		}
		
		ModalHelper.call(args.data, args.success, args.error, args.beforeSend, args.complete, hasFile);
	}

	static call(params, callSuccess, callError, callBefore, callComplete, hasFile = false){

		ModalHelper.ajaxCall(params, (response) => {

			if(response.code == ModalHelper.OK){

				if(response.text instanceof Object || response.text instanceof Array){
					callSuccess(response.text);
				}else{

					let res_data = "";

					try{
						res_data = JSON.parse(response.text);
					}catch(e){
						res_data = response.text;
					}

					callSuccess(res_data);
				}
				
			}else{
				callError(response.code);
			}

		}, (error) => {
			callError(501);

		}, () => {
			if(callBefore != undefined){
				callBefore();
			}
		}, () => {
			if(callComplete != undefined){
				callComplete();
			}
		}, hasFile);

	}

	static isPremiumUser(callback){

		let params = {};
		params.action = 12;
		params.controller = 'PremiumHandler';

		ModalHelper.call(params, response => callback(true), error => callback(false));

	}

	static isEmpty(str){
		return (!str || /^\s*$/.test(str));
	}

	static isValidEmail(email) {
    	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	}

	static isValidPhone(number){
		const re = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/g;
		return re.test(String(number));
	}

	static isValidCPF(cpf){

		cpf = String(cpf);
		cpf = cpf.replace(/\./g, "");
		cpf = cpf.replace(/-/g, "");

		if(isNaN(parseInt(cpf))){
			return false;
		}

		let digitos_verificadores = Array.from(cpf).slice(9, 11);
		cpf = Array.from(cpf).slice(0, 9).reverse();


		let allSame = true;

		for(let z = 0; z < cpf.length; z++){

			if(cpf[0] != cpf[z]){
				allSame = false;
				break;
			}

		}

		if(allSame){
			return false;
		}

		if(cpf.length != 9 || digitos_verificadores.length != 2){
			return false;
		}

		let v1 = 0;
		let v2 = 0;

		for(let i = 0; i < 9; i++){
			v1 += parseInt(cpf[i]) * (9 - (i % 10));
			v2 += parseInt(cpf[i]) * (9 - ((i + 1) % 10));
		}

		 v1 = (v1 % 11) % 10;
		 v2 += v1 * 9;
		 v2 = (v2 % 11) % 10;

		 return parseInt(digitos_verificadores[0]) == v1 && parseInt(digitos_verificadores[1]) == v2;

	}

	static isValidDate(data){

		data = new Date(data + "T" + "00:00:00");
		let today = new Date()
		today.setHours(0,0,0,0);

		return data <= today;
	}    

	static isLink(link){
		const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
		return re.test(String(link));
	}

	static testHTMLInText(text){
		const re = /<[^>]*>?>/gm;
		return re.test(text);
	}

	static testEscapedHtmlInText(text){
		const re = /([^"]*)\&[gt]t;([^"]*)/gm;
		return re.test(text);
	}

	static removeHTMLEscapedFromText(text){
		const re = /([^"]*)\&[gt]t;([^"]*)/gm;
		return text.replace(re, '');
	}

	static removeHTMLfromText(text){
		const re = /<[^>]*>?>/gm;
		return text.replace(re, '');
	}

	static getAnchor(id, name, link = "#"){
		return "<a href='" + link + "' id='" + id + "'>" + name + "</a>";
	}

	static notify(type, ttl, msg = "", okbtn = "Ok"){

		if(ttl instanceof Object){
			let objmsg = ttl;
			ttl = objmsg.t;
			msg = objmsg.d;
		}

		Swal.fire({
		    type: type,
		    title: ttl,
		    text: msg,
		    showCancelButton: false,
		    confirmButtonText: okbtn,
		})

	}

	static notifyStd(dados){
		ModalHelper.notify(dados[0], dados[1], dados[2]);
	}

	static Mdclose(id){
		$('#' + id).modal("hide");

		ModalHelper.clearInputsModal(id);

	}

	static clearInputsModal(id){

		id = '#' + id;

		let fields_prefix = $(id).attr("cleanOnClose");
		let form = $(id).attr("cleanOnCloseForm");

		if(fields_prefix){
			$('.' + fields_prefix).val("");
		}else if(form){
			$('#' + form).trigger("reset");
		}	

	}

	static Mdopen(id, useBackdrop = true){

		if(useBackdrop){
			$('#' + id).modal({backdrop:"static", keyboard: false});
		}else{
			$('#' + id).modal("show");
		}
		
	}

	static getEmpty(msg){
		return "<div style='margin-top: 25px' class='col-12 text-center'><img class='empty-standard-img' src='" + APP_PATH + "assets/images/vazio.gif'></div><div style='font-family: Montserrat, sans-serif !important; font-weight: 600 !important; font-size: 0.9em; margin-top: 10px; margin-bottom: 35px;' class='col-12 text-center'>" + msg + "</div>";
	}

	static getSmallEmpty(msg){
		return "<div class='col-12 text-center'><img class='emptyImg' src='" + APP_PATH + "assets/images/vazio.gif'></div><div style='font-family: Montserrat, sans-serif !important; font-weight: 600 !important; font-size: 0.8em; margin-top: 5px;' class='col-12 text-center'>" + msg + "</div>";
	}

	static fillSelect(select, data, namek, valuek, selected){

		let temp = "";

		if(data instanceof Object){

			let keys = Object.keys(data);

			for(let i = 0; i < keys.length; i++){

				let key = keys[i];

				if(data[key][valuek] == selected){
					temp += "<option selected value='" + data[key][valuek] + "'>" + data[key][namek] + "</option>";	
				}else{
					temp += "<option value='" + data[key][valuek] + "'>" + data[key][namek] + "</option>";
				}

			}


		}else{

			for(let i = 0; i < data.length; i++){

				if(data[i][valuek] == selected){
					temp += "<option selected value='" + data[i][valuek] + "'>" + data[i][namek] + "</option>";	
				}else{
					temp += "<option value='" + data[i][valuek] + "'>" + data[i][namek] + "</option>";
				}
			
			}

		}


		$('#' + select).html(temp);

	}

	static updateNiceSelect(select){
		$('#' + select).niceSelect("update");
	}

	static niceSelect(select){
		$('#' + select).niceSelect();
	}

	static disableNiceSelect(select){
		$('#' + select).prop("disabled", true);
		ModalHelper.updateNiceSelect(select);
	}

	static enableNiceSelect(select){
		$('#' + select).prop("disabled", false);
		ModalHelper.updateNiceSelect(select);	
	}

	static mask(id, mask){
 		$('#' + id).mask(mask);
	}

	static updateMask(id){
		$('#' + id).trigger('input');
	}

	static removeWithKey(a, k, v){
		
		for(let i = 0; a.length; i++){

			if(a[i][k] == v){
				a.splice(i, 1);
				break;
			}
		}

		return a;
	}

	static getWithKey(a, k, v){
		
		for(let i = 0; a.length; i++){

			if(a[i][k] == v){
				return a[i];
				break;
			}
		}

		return a;
	}

	static existsWithKey(a, k, v){
		
		for(let i = 0; a.length; i++){

			if(a[i][k] == v){
				return true;
				break;
			}
		}

		return false;
	}

	static setValue(id, content, isNiceSelect = false){
		$('#' + id).val(content).change();

		if(isNiceSelect){
			$('#' + id).niceSelect("update");
		}
	}

	static setValueSilent(id, content, isNiceSelect = false){
		$('#' + id).val(content);
	}

	static setContent(id, content){
		$('#' + id).html(content);
	}

	static getContent(id){
		return $('#' + id).html();
	}

	static appendContent(id, content){
		$('#' + id).append(content);
	}

	static setAttr(id, attr, value){
		$('#' + id).attr(attr, value);
	}

	static getAttr(id, attr){
		return $('#' + id).attr(attr);
	}

	static setImage(id, href){
		ModalHelper.setAttr(id, "src", href);
	}

	static getValue(id){
		return $('#' + id).val();
	}

	static getText(id){
		return $('#' + id).text();
	}

	static getSelectText(id){
		return $('#' + id + " option:selected").text();
	}

	static hide(id){
		$('#' + id).css("display", 'none');
	}

	static noHide(id, display = "block"){
		$('#' + id).css("display", display);	
	}

	static hideClass(cll){
		$('.' + cll).css("display", 'none');
	}

	static noHideClass(cll, display = "block"){
		$('.' + cll).css("display", display);	
	}

	static addClass(id, cll){
		$('#' + id).addClass(cll);		
	}

	static remClass(id, cll){
		$('#' + id).removeClass(cll);		
	}

	static check(id){
		$('#'  + id).prop("checked", true);
	}

	static changeCheck(id, value){
		
		if(value){
			ModalHelper.check(id);
		}else{
			ModalHelper.unCheck(id);
		}

	}

	static unCheck(id){
		$('#'  + id).prop("checked", false);
	}

	static isChecked(id){
		return $('#' + id).prop("checked");
	}

	static loading(title, msg = ""){

		if(title instanceof Array){
			msg = title[1];
			title = title[0];
		}

		Swal.fire({
			title: title,
			text: msg,
			allowOutsideClick: false,
			onBeforeOpen: () => {
			    Swal.showLoading()
			}
		})
	}

	static removeLoading(){
		Swal.close();
	}

	static removeElement(id){
		$('#' + id).remove();
	}

	static iterateClassElement(c, f){

		let elements = $('.' + c);

		for(let i = 0; i < elements.length; i++){
			f(elements[i]);
		}

	}

	static isInDOM(id){
		return $('#' + id)[0] != undefined;
	}

	static arrayToObject(a, k){

		let obj = {};

		for(let i = 0; i < a.length; i++){
			obj[a[i][k]] = a[i];
		}

		return obj;
	}

	static tooltip(id, content){
		$('#' + id).tooltip();
		ModalHelper.updateTooltipContent(id, content);
	}

	static updateTooltipContent(id, content){
		ModalHelper.setAttr(id, "data-original-title", content);
	}

	static selectizeSetValue(id, value){
		$('#' + id)[0].selectize.setValue(value, true);
	}

	static toggleWindowLoader(t){

		if(t){
			$('.loaderWindow').css("display", "block");
		}else{
			$('.loaderWindow').css("display", "none");
		}

	}

	static hideByClass(classe){
		$('.' + classe).css("display", "none");
	}

	static noHideBlock(id){
		$('#' + id).css("display", "block");
	}

	static disable(id){
		$('#' + id).attr("disabled", "disabled");
	}

	static enable(id){
		$('#' + id).removeAttr("disabled", "disabled");
	}


	static notifyQuestion(dados, callback){
		Swal.fire({
			type: 'question',
			title: dados[0],
			text: dados[1],
			showCancelButton: true,
			confirmButtonText: dados[2],
			cancelButtonText: dados[3],
		}).then((result) => {
		  	callback(result.value);    
		});
	}

	static notifyTriggerQuestion(dados, callback){
		Swal.fire({
			type: dados[0],
			title: dados[1],
			text: dados[2],
			showCancelButton: false,
			confirmButtonText: dados[3],
		}).then((result) => {
		  	callback(result.value);    
		});
	}

	static notifyQuestionIfOkDo(dados, callback){
		
		Swal.fire({
			type: 'question',
			title: dados[0],
			text: dados[1],
			showCancelButton: true,
			confirmButtonText: dados[2],
			cancelButtonText: dados[3],
		}).then((result) => {
			if(result.value){
				callback();	
			}
		});
	}

	static getIndicator(type, msg){
		return "<div class='table-indicator indicator-" + type + "'>" + msg + "</di>";
	}

	static getAnchorModelo(item){
		return "<a href='#' class='btn-usar-modelo-formulario' id='mpfr-" + item.id + "' tipo='" + item.tipo + "'>" + item.nome + "</a>";
	}

	static scapeString(input){
		return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
	}

	static removeNewLine(target){
		return target.replace(/\\n/g, '');
	}

	static getIdPaciente(){
		return $('#pid').val();
	}

	static replaceCRLFfromtext(input, replace, replace2){

		const re = new RegExp(String.fromCharCode(10), 'gm');
		const re2 = new RegExp(String.fromCharCode(13), 'gm');
		input = input.replace(re2, replace2) 
		return input.replace(re, replace);
	}

	static click(id){
		$('#' + id).click();
	}

	static onChangeSelect(id, callback){
		$(document).on('change', '#' + id, function(){
			callback(this.value);
		})
	}

	static onChange(id, callback){
		$(document).on('change', '#' + id, function(){
			callback(this);
		})
	}

	static onClick(id, callback){
		$(document).on('click', '#' + id, function(){
			callback(this);
		})
	}

	static onKeyup(id, callback){
		$(document).on('keyup', '#' + id, function(){
			callback(this.value);
		})
	}

	static onClickClass(id, callback){
		$(document).on('click', '.' + id, function(){
			callback(this);
		})
	}

	static onCloseModal(id, callback){

		$(document).on('hide.bs.modal', '#' + id, function(){
			callback();
		})

	}

	static offClick(id){
		$(document).off('click', '#' + id);
	}

	static offClickClass(clss){
		$('.' + clss).off('click');
	}

	static registerTabs(){
		$(document).on('click', '.auto-tabs-btn', function(){
			ModalHelper.hideByClass(this.getAttribute("tab-cl"));
			ModalHelper.noHide(this.getAttribute("tab-tg"));
		})

	}

	static getElement(id){
		return $('#' + id)[0];
	}

	static initSearchTratamentoInput(input_id, query_callback, selectCallback){

		return $('#' + input_id).selectize({
            create: false,
            searchField: 'descricao',
            valueField: 'descricao',
            labelField: 'descricao',
            createOnBlur: false,
            render:{
				item: function(item, scape){
					return "<div>" + item.descricao + "</div>";
				},
			},
			onItemAdd: function(id){
				selectCallback(this.options[id], isNaN(parseInt(id)));
			},
			onFocus: function(){
				this.load((callback) => query_callback('', callback));
			},
            load: (query, callback) => query_callback(query, callback),
        })[0];

	}

	static reverseWords(q){

		let qAr = q.split(" ");
		let rev = [];

		for(let i = (qAr.length) - 1; i >= 0; i--){
			rev.push(qAr[i]);
		}

		return rev.join(" ");

	}

	static searchTratamento(q, tratamentos, callSuccess){

		if(q == undefined){
			return;
		}else if(ModalHelper.isEmpty(q)){
			callSuccess(tratamentos);
			return;
		}
		
		let r = [];
		let r0 = new RegExp(q + ".*", "gi");
		
		let hasAnyResult = false;

		for(let i = 0; i < tratamentos.length; i++){

			if(tratamentos[i].descricao.match(r0)){
				r.push(tratamentos[i]);
				hasAnyResult = true;
			}

		}

		if(hasAnyResult){
			callSuccess(r);
			return;
		}

	}

	static execDisableContent(selector, disable = false){

		if(disable){
			$(selector).addClass('disabled-content');
		}else{
			$(selector).removeClass('disabled-content');
		}
		
	}

	static enableContent(id){
		ModalHelper.execDisableContent('#' + id);
	}

	static enableContentClass(cl){
		ModalHelper.execDisableContent('.' + cl);
	}

	static disableContent(id){
		ModalHelper.execDisableContent('#' + id, true);
	}

	static disableContentClass(cl){
		ModalHelper.execDisableContent('.' + cl, true);
	}

	static getCurrentDate(){

		let date = new Date();
		return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
	}

	static getFormatedDate(data){

		data = new Date(data + "T" + "00:00:00");
		return data.getDate().toString().padStart(2, '0') + "/" + (data.getMonth() + 1).toString().padStart(2, '0') + "/" + data.getFullYear();
	}

	static setPacienteModalActionLabels(edit = false){

		if(edit){
			ModalHelper.setContent('txt-header-modal-paciente', 'Editar cadastro paciente');
			ModalHelper.setContent('btn-save-paciente', '<i class="fas fa-edit"></i>&nbsp Atualizar');
			return;
		}else{
			ModalHelper.setContent('txt-header-modal-paciente', 'Cadastrar paciente');
			ModalHelper.setContent('btn-save-paciente', '<i class="fas fa-save"></i>&nbsp Cadastrar');
		}
	
	}

	static getEnderecoByCEP(cep, callSuccess, callError){

		if(cep.length != 8){
			callError();
			return false;
		}

		let params = {
			url: 'https://viacep.com.br/ws/' + cep + '/json/',
			method: 'GET',
			dataType: 'JSON',
			success: (response) => callSuccess(response),
			error: (error) => callError(error),
		}

		$.ajax(params);

	}

	static registerFieldsForSearchCEP(fields, isNiceSelect = false){

		$('#' + fields.search).mask("00000-000");

		$(document).on('keyup', '#' + fields.search, function(){
			ModalHelper.callbackCEP(this.value, fields, isNiceSelect);
		})

		$(document).on('change', '#' + fields.search, function(){
			ModalHelper.callbackCEP(this.value, fields, isNiceSelect);
		})		

	}

	static callbackCEP(cep, fields, isNiceSelect = false){
		
		cep = cep.replace("-", "");

		if(ModalHelper.cepSearchInProgress){
			return;
		}

		ModalHelper.cepSearchInProgress = true;

		ModalHelper.getEnderecoByCEP(cep, (response) => {

			ModalHelper.setValue(fields.cidade, response.localidade);
			ModalHelper.setValue(fields.uf, response.uf);
			ModalHelper.setValue(fields.logradouro, response.logradouro);
			ModalHelper.setValue(fields.complemento, response.complemento);
			ModalHelper.setValue(fields.bairro, response.bairro);

			if(isNiceSelect){
				ModalHelper.updateNiceSelect(fields.uf);
			}

			ModalHelper.cepSearchInProgress = false;

		}, (error) => {
				
			ModalHelper.setValue(fields.cidade, "");
			ModalHelper.setValue(fields.logradouro, "");
			ModalHelper.setValue(fields.complemento, "");
			ModalHelper.setValue(fields.bairro, "");

			if(isNiceSelect){
				ModalHelper.updateNiceSelect(fields.uf);
			}

			ModalHelper.cepSearchInProgress = false;

		})	
	}

	static showIfMatch(testValue, trueValue, target){

		if(testValue == trueValue){
			ModalHelper.noHide(target);
		}else{
			ModalHelper.hide(target);
		}

	}

	static setOnChangeIsGestante(selector, callback){
		$(document).on('click', '.' + selector, function(){

			if(this.getAttribute("for") == "paciente-gestante-yes"){
				$('#paciente-gestante-no').prop("checked", false);
				$('#paciente-gestante-yes').prop("checked", true);
			}else{
				$('#paciente-gestante-yes').prop("checked", false);
				$('#paciente-gestante-no').prop("checked", true);
			}

		})
	}

	static verifyImage(file, mstr){

		if(file == undefined){
			return;
		}

		if(!ModalHelper.isValidType(file)){
			ModalHelper.notifyStd(mstr.TIPO_ARQUIVO_NAO_SUPORTADO);
			return false;
		}

		if(!ModalHelper.isValidExtension(file)){
			ModalHelper.notifyStd(mstr.TIPO_IMAGEM_NAO_SUPORTADA);
			return false;
		}

		if(!ModalHelper.isInSizeRange(file)){
			ModalHelper.notifyStd(mstr.IMAGEM_LIMITE_TAMANHO);
			return false;
		}

		return true;

	}

	static isInSizeRange(file){
		return ModalHelper.getSizeInMb(file) <= 2;
	}

	static isValidType(file){
		return file.type.split("/")[0] == "image";
	}

	static isValidExtension(file){
		return ["JPEG", "JPG", "PNG"].includes(file.type.split("/")[1].toUpperCase());
	}

	static getSizeInMb(file){
		let size = parseFloat((file.size / 1000) / 1000);
		return size;
	}

	static setImageLabel(id, file){
		ModalHelper.setContent(id, file.name);
	}

	static setImagePreview(id, file){

		let reader = new FileReader();

		reader.onload = img => ModalHelper.setAttr(id, 'src', img.target.result);

		reader.readAsDataURL(file);

	}

	static removeFile(id){
		$('#' + id).val("");
	}

	static setDataInativarApp(id){
		let data = new Date();
		data.setHours(0,0,0,0);

		data = (data.getFullYear() + 1) + "-" + (data.getMonth() + 1).toString().padStart(2, '0') + "-" + data.getDate().toString().padStart(2, '0');
		ModalHelper.setValue(id, data);
	}

	static setLoadingGetInstagramImage(show){

		if(show){
			$('#icon-search-instagram-image').removeClass("fa-search");
			$('#icon-search-instagram-image').addClass("fa-cog");
			$('#icon-search-instagram-image').addClass("fa-spin");
		}else{
			$('#icon-search-instagram-image').removeClass("fa-cog");
			$('#icon-search-instagram-image').removeClass("fa-spin");
			$('#icon-search-instagram-image').addClass("fa-search");
		}

	}


	static getPacienteImage(paciente){
		return ModalHelper.isEmpty(paciente['foto']) ? 'assets/images/paciente-default-image.jpg' : paciente['foto'];
	}

	static rowMenuBox(content){
		return "<div class='row menu-box-row'>" + content + "</div>";
	}

	static menuBox(modulo, index){
		return "<div class='menu-box' data-toggle='tooltip' id='" + modulo.id + "' title='' data-original-title='" + modulo.desc + "'><label class='btn-modulo-materiais' mdi='" + btoa(index) + "' href='" + modulo.href + "'><i class='" + modulo.icon + "'></i>&nbsp&nbsp" + modulo.name + "</label></div>";
	}

	static toggleActiveModulo(btn){
		$('.btn-modulo-materiais').removeClass("active");
		$(btn).addClass("active");
	}

	static toggleActiveModuloPill(btn){
		$('.btn-modulo-materiais').removeClass("active");
		$('#' + btn  + ' .btn-modulo-materiais').addClass("active");
	}

	static inflateNameAndDateTd(name, date){
		return '<span>' + name + '</span><br><small>' + date + '</small>';
	}

	static menus(){

		return {
			r: {name: 'remove', title: 'Excluir', icon: 'fa fa-trash'},
			e: {name: 'edit', title: 'Editar', icon: 'fa fa-edit'},
			v: {name: 'view', title: 'Visualizar', icon: 'far fa-eye'},
			c: {name: 'compare', title: 'Comparar', icon: 'fas fa-chart-line'},
			s: {name: 'settings', title: 'Configurar', icon: 'fas fa-cog'},
		}

	}

	static inflateCellAction(action, prefix, rowParams){

		let payload = "";

		if(rowParams instanceof Object){

			let keys = Object.keys(rowParams);
			payload = [];

			for(let i = 0; i < keys.length; i++){
				payload.push(keys[i] + "='" + btoa(rowParams[keys[i]]) + "'");
			}

			payload = payload.join(" ");

		}else{
			payload = "id='" + btoa(rowParams) + "'";
		}

		return '<i ' + payload + ' class="ligthtab-action-icon ' + action.icon + ' ' + prefix + '-' + action.name + '"></i>'
	}

	static inflateStdMenus(menus, prefix, rowParams){

		let actions = ModalHelper.menus();
		let html = "";
		
		for(let i = 0; i < menus.length; i++){
			if(actions[menus[i]] != undefined){
				html += ModalHelper.inflateCellAction(actions[menus[i]], prefix, rowParams);	
			}
		}

		return html;

	}

	static makePacienteModuloRequest(target_url, params){

		var form = $('<form>', {
			'id': 'modulomateriaistempform',
	        'method': 'get',
	        'action': target_url,
	    });

		let names = Object.keys(params);
		let cs = btoa(Object.values(params).join("::"));

	    for(var i = 0; i < names.length; i++){

	    	form.append($('<input>', {
			    name: names[i],
			    value: params[names[i]],
			    type: 'hidden'
			}));
	    }

	    form.append($('<input>', {
		    name: 'cs',
		    value: cs,
		    type: 'hidden'
		}));
		
		$(document.body).append(form); 
		form.submit();
		$('#modulomateriaistempform').remove();
	}

	static getFloat(value){
		value = parseFloat(value);
		return isNaN(value) || !isFinite(value) ? 0 : value;
	}

	static getfixedFloat(value, fixed){
		value = ModalHelper.getFloat(value);
		return ModalHelper.getFloat(value.toFixed(fixed));
	}

	static getFixedFloat(value, fixed){
		return ModalHelper.getfixedFloat(value, fixed);
	}
	
	static makeButton(btn){
		return "<button id=" + btn.id + " class='btn btn-square'><i class='" + btn.icon + "'></i>&nbsp " + btn.name + "</button>";
	}

	static callPdf(params){

		if(params == undefined){
			return;
		}

		var form = $('<form>', {
			'id': 'utiltempform',
	        'method': 'post',
	        'action': params.url,
	        'target': '_blank'
	    });

	    delete params.url;

		let names = Object.keys(params);

	    for(var i = 0; i < names.length; i++){

	    	form.append($('<input>', {
			    name: names[i],
			    value: params[names[i]],
			    type: 'hidden'
			}));

	    }
		
		$(document.body).append(form); 
		form.submit();
		$('#utiltempform').remove();

	}

	static notifyTriggerQuestionAvaliacao(callback){
		Swal.fire({
			type: 'question',
			title: 'Qual tipo de avaliação você deseja criar?',
			showCancelButton: true,
			confirmButtonText: 'Manual',
			cancelButtonText: 'Bioimpedância',
			cancelButtonColor: '#22b14c',
			allowEscapeKey: false,
			allowOutsideClick: false,
			customClass: 'swal-tipo-avaliacao',
		}).then((result) => {
		  	callback(result.value);
		});
	}

	static moduleNameInput(title, callback, data = undefined, btn_text = 'Criar'){

		ModalHelper.onClick('sin-button-id', () => {

			ModalHelper.offClick('sin-button-id');
			
			if(ModalHelper.isEmpty(ModalHelper.getValue("sin-input-id"))){

				ModalHelper.notifyTriggerQuestion(['info', 'Preencha corretamente os campos', '', 'Ok'], () => {
					ModalHelper.moduleNameInput(title, callback, btn_text);
				});

				return;
			}

			Swal.close();
			callback(ModalHelper.getValue("sin-input-id"));
		})

		Swal.fire({
			title: '',
			html: '<div class="col-12 sin-icon"><i class="fas fa-quote-right"></i></div><div class="col-12 sin-title"><label>' + title + '</label></div><div class="col-10 offset-1 bx-input sin-input"><input class="form-control" id="sin-input-id" type="text"></div><div class="col-12 sin-buttons"><button id="sin-button-id" class="btn btn-square"><i class="fas fa-check"></i>&nbsp ' + btn_text + '</button></div>',
			showCloseButton: false,
            showConfirmButton: false,
            allowEscapeKey: true,
			allowOutsideClick: true,
			customClass: 'swal-input-name',
			onOpen: () => {
				if(data != undefined){
					ModalHelper.setValue('sin-input-id', data.name);
				}
			}
		});
	}

	static moduleNameAndDaysInput(callback, data = undefined){

		let btn_id = data == undefined ? 'sin-button-id' : 'sin-button-id-update';
		let btn_label = data == undefined ? 'Criar' : 'Atualizar';

		ModalHelper.onClick('dias-0', checkbox => {
			$('.dias-refeicao-plano').prop("checked", checkbox.checked);		
		})

		ModalHelper.onClickClass('trigger-dias', () => {

			if($('#dias-0').prop("checked")){
				$('#dias-0').prop("checked", false);
			}

		})

		ModalHelper.onClick(btn_id, () => {

			ModalHelper.offClick(btn_id);

			if(ModalHelper.isEmpty(ModalHelper.getValue("sin-input-id"))){

				ModalHelper.notifyTriggerQuestion(['info', 'Preencha corretamente os campos', '', 'Ok'], () => {
					ModalHelper.moduleNameAndDaysInput(callback, data);
				});

				return;
			}

			if(!ModalHelper.verficarDiasPlanoAlimentar()){

				ModalHelper.notifyTriggerQuestion(['info', 'Selecione os dias para os quais o plano será aplicado', '', 'Ok'], () => {
					ModalHelper.moduleNameAndDaysInput(callback, data);
				});

				return;
			}

			Swal.close();
			callback(ModalHelper.getValue("sin-input-id"), ModalHelper.getDiasPlano());
		})

		Swal.fire({
			title: '',
			html: '<div class="col-12 sin-icon"><i class="fas fa-quote-right"></i></div><div class="col-12 bx-input bx-input-std bx-name-plano"><span>Identificação do plano alimentar</span><input type="text"  id="sin-input-id" class="form-control text-left"></div><div class="col-12" id="container-dias-refeicao-plano"><span>O plano alimentar deve ser realizado nos dias:</span><input type="checkbox" class="dias-refeicao-plano" id="dias-0"><label for="dias-0">Todos</label><input type="checkbox" class="dias-refeicao-plano" id="dias-1"><label for="dias-1" class="trigger-dias">Domingos</label><input type="checkbox" class="dias-refeicao-plano" id="dias-2"><label for="dias-2" class="trigger-dias">Segundas-feiras</label><input type="checkbox" class="dias-refeicao-plano" id="dias-3"><label for="dias-3" class="trigger-dias">Terças-feiras</label><input type="checkbox" class="dias-refeicao-plano" id="dias-4"><label for="dias-4" class="trigger-dias">Quartas-feiras</label><input type="checkbox" class="dias-refeicao-plano" id="dias-5"><label for="dias-5" class="trigger-dias">Quintas-feiras</label><input type="checkbox" class="dias-refeicao-plano" id="dias-6"><label for="dias-6" class="trigger-dias">Sextas-feiras</label><input type="checkbox" class="dias-refeicao-plano" id="dias-7"><label for="dias-7" class="trigger-dias">Sábados</label></div><div class="col-12 sin-buttons"><button id="' + btn_id + '" class="btn btn-square"><i class="fas fa-check"></i>&nbsp ' + btn_label + '</button></div>',
			showCloseButton: false,
            showConfirmButton: false,
            allowEscapeKey: true,
			allowOutsideClick: true,
			customClass: 'swal-input-name swal-input-days',
			onOpen: () => {
				if(data != undefined){
					ModalHelper.setValue("sin-input-id", data.name);
					ModalHelper.selectDiasRefeicao(data.days);	
				}
			},
			onClose: () => {
				ModalHelper.offClick(btn_id);
			}
		});

	}

	static moduleDateInput(title, callback, data = undefined, btn_text = 'Atualizar'){

		ModalHelper.onClick('sin-button-id', () => {

			ModalHelper.offClick('sin-button-id');
			
			if(ModalHelper.isEmpty(ModalHelper.getValue("sin-date-input-id"))){

				ModalHelper.notifyTriggerQuestion(['info', 'Selecione uma data para atualizar', '', 'Ok'], () => {
					ModalHelper.moduleDateInput(title, callback, data, btn_text);
				});

				return;
			}

			Swal.close();
			callback(ModalHelper.getValue("sin-date-input-id"));
		})

		Swal.fire({
			title: '',
			html: '<div class="col-12 sin-icon"><i class="fas fa-calendar-alt"></i></div><div class="col-12 sin-title"><label>' + title + '</label></div><div class="col-6 offset-3 bx-input sin-input"><input class="form-control" id="sin-date-input-id" type="date"></div><div class="col-12 sin-buttons"><button id="sin-button-id" class="btn btn-square"><i class="fas fa-check"></i>&nbsp ' + btn_text + '</button></div>',
			showCloseButton: false,
            showConfirmButton: false,
            allowEscapeKey: true,
			allowOutsideClick: true,
			customClass: 'swal-input-name',
			onOpen: () => {
				if(data != undefined){
					ModalHelper.setValue('sin-date-input-id', data);
				}
			}
		});
	}

	static verficarDiasPlanoAlimentar(){

		let dias = $('.dias-refeicao-plano');

		if(dias == undefined){
			return false;
		}

		for(let i = 0; i < dias.length; i++){
			if(dias[i].checked){
				return true;
			}
		}

		return false;
	}

	static getDiasPlano(){

		let dias = $('.dias-refeicao-plano');
		let response = [];

		if(dias == undefined){
			return response;
		}

		for(let i = 0; i < dias.length; i++){

			if(i == 0 && dias[i].checked){
				return [1,1,1,1,1,1,1];
			}else if(i == 0){
				continue;
			}

			response[i - 1] = dias[i].checked ? 1 : 0;
		}

		return response;
	}

	static selectDiasRefeicao(dias){

		for(let i = 0; i < dias.length; i++){

			if(parseInt(dias[i]) == 1){
				$('#dias-' + (i + 1)).prop("checked", true);
			}else{
				$('#dias-' + (i + 1)).prop("checked", false);
			}

		}

	}

	static setTitleLabel(container, icon, text){
		ModalHelper.setContent(container, "<i class='"+ icon + "'></i><label id='label-modulo-materiais'>" + text + "</label><div class='text-under'></div>");
	}

	static onOpenModal(id, callback){
		$(document).on('show.bs.modal', '#' + id, function(){
			callback();
		})
	}

	static makeModelosCategoria(categorias_modelo){

		let html = "";

		for(let i = 0; i < categorias_modelo.length; i++){
			html += '<label id="module-modelo-categoria-' + categorias_modelo[i] + '" class="module-modelo-categoria ' + (i == 0 ? 'active' : '') + ' dietsystem-std-tab" ct="' + categorias_modelo[i] + '">' + categorias_modelo[i] + '</label>';
		}

		return html;
	}

	static moduleModalModelo(moduleC, modelos, callback){

		let categorias_html = ModalHelper.makeModelosCategoria(modelos.categorias);

		let table = new ligthTab({
			table_id: 'tabela-module-modelos',
			renderContainer: 'mmmd-tabela-modelos-container',
			table_class: 'table dietsystem-table',
		})

		table.initTable();
		table.setRowFunction(moduleC.getModeloRowFunction(table));

		ModalHelper.onClickClass('module-modelo-categoria', btn => {
			$('.module-modelo-categoria').removeClass("active")
			$(btn).addClass("active");
			table.update(modelos[btn.getAttribute("ct")]);
		})

		ModalHelper.onClickClass(moduleC.USE_MODELO_BTN, btn => {
			let data = btn.dataset.lightdt != undefined ? JSON.parse(atob(btn.dataset.lightdt)) : '';
			callback(data);
		})

		Swal.fire({
			title: '',
			html: '<div class="row"><div class="col-12 mmmd-title"><i class="fas fa-database"></i><label>Selecione um modelo</label></div></div><div class="col-12 mmmd-categorias-container">' + categorias_html + '</div><div class="col-12" id="mmmd-tabela-modelos-container"></div>',
			showCloseButton: false,
            showConfirmButton: false,
            allowEscapeKey: true,
			allowOutsideClick: true,
			customClass: 'swal-input-name swal-modal-modelo',
			onOpen: () => {
				table.update(modelos[modelos.categorias[0]]);
			}
		});

	}

	static getTrData(reference){
		return JSON.parse(atob($($(reference)[0].parentElement.parentElement).data('lightdt')));
	}

	static activeSubModuleTab(tab, useId = false){

		$('.modal-modulos-paciente-submodule-pill').removeClass('active');

		if(useId){
			$('#' + tab).addClass('active');	
		}else{
			$(tab).addClass('active');	
		}
	}

	static makeSubMenu(modulos){

		let html = "";

		for(let i = 0; i < modulos.length; i++){
			html += '<label class="modal-modulos-paciente-submodule-pill" id="modal-modulos-paciente-submodule-pill-subid-' + i + '" subid="'+ btoa(i) +'">' + modulos[i].name + '</label>';
		}

		return html;

	}

	static removeBodyScroll(){
		$('body').css("overflow-y", 'hidden');
	}

	static restoreBodyScroll(){
		$('body').css("overflow-y", 'auto');
	}

	static fadeTransition(hide, show, callback){
		ModalHelper.fadeOut(hide, () => {
			callback();
			ModalHelper.fadeIn(show);
		});
	}

	static fadeOut(container, callback){
		if(ModalHelper.isEmpty(container)){
			callback();
			return;
		}

		$('#' + container).fadeOut(200, () => {
			callback();
		})
	}

	static fadeIn(container){
		if(ModalHelper.isEmpty(container)){
			return;
		}

		$('#' + container).fadeIn(200);
	}

}