class ModuloMateriais{

	constructor(e){
		this.FIXED = 1;
		this.updateCallback = e;

		this.AUX_ACTION_ICON = "fa-edit";

		this.QUESTION_DELETE_ROW = [
			'Deseja realmente excluir?',
			'Essa operação não poderá ser desfeita!',
			'Excluir!',
			'Cancelar',
		]

		this.SUCC_DELETE_ROW = [
			'success',
			'Excluído com sucesso!',
			'',
		]

		this.ERRO_DELETE_ROW = [
			'error',
			'Falha ao excluir',
			'Ocorreu um erro ao tentar excluir, tente novamente mais tarde.'
		]

		this.LOADING_DELETE_ROW = "Aguarde, excluindo...";
		this.LOADING_GET_MODELO = "Aguarde, carregando modelos...";
		this.LOADING_SAVE_SETTINGS = "Aguarde, salvando configurações...";
		this.LOADING_UPDATE_ROW = 'Aguarde, atualizando dados...';

		this.ERRO_GET_MODELO = [
			'error',
			'Falha ao consultar modelos',
			'Ocorreu um erro ao consultar os modelos, tente novamente mais tarde.'
		]

		this.SUCC_SAVE_SETTINGS = [
			'success',
			'Salvo!',
			'As configurações foram salvas com sucesso',
		]
		
		this.ERRO_SAVE_SETTINGS = [
			'error',
			'Falha ao salvar',
			'Ocorreu um erro ao salvar as configurações, tente novamente mais tarde.',
		]

		this.SUCC_UPDATE_ROW = [
			'success',
			'Atualizado!',
			'Os dados foram atualizados com sucesso.'
		]

		this.ERRO_UPDATE_ROW = [
			'error',
			'Falha ao atualizar',
			'Ocorreu um erro ao tentar atualizar, tente novamente mais tarde',
		]

		this.init();
	}

	init(){
		this.initModule();
		this.VIEW_BTN = this.ROW_ACTION_PREFIX + '-view';
		this.EDIT_BTN = this.ROW_ACTION_PREFIX + '-edit';
		this.DELETE_BTN = this.ROW_ACTION_PREFIX + '-remove';
		this.COMPARE_BTN = this.ROW_ACTION_PREFIX + "-compare";
		this.SETTINGS_BTN = this.ROW_ACTION_PREFIX + "-settings";

		this.CREATE_BTN = this.ROW_ACTION_PREFIX + "-btn-create";
		this.IMPRIMIR_PDF_BTN = this.ROW_ACTION_PREFIX + "-btn-pdf";
		this.MODELO_BTN = this.ROW_ACTION_PREFIX + "-btn-modelo";

		this.registerActionCallbacks();
		this.registerActionButtons();
	}

	initModule(){

	}

	callDeleteAction(){

	}

	settings(){

	}

	getButtons(){
		return [];
	}

	registerActionButtons(){
		ModalMateriaisHelper.onClick(this.CREATE_BTN, () => this.create());
		
		ModalMateriaisHelper.onClick(this.IMPRIMIR_PDF_BTN, () => {
			if(this.pdfParamsCallback != undefined){
				ModalMateriaisHelper.callPdf(this.pdfParamsCallback());	
			}
		});

		ModalMateriaisHelper.onClick(this.MODELO_BTN, () => {
			this.makeModeloRequest();
		})
	}
	
	getTitleLabel(){
		return this.titleLabel;
	}

	getIcon(){
		return this.icon;
	}

	getCreateButton(name = "Novo"){
		return {id: this.CREATE_BTN, name: name, icon: 'fas fa-plus'}
	}

	getPDFButton(name = "Imprimir PDF"){
		return {id: this.IMPRIMIR_PDF_BTN, name: name, icon: 'fas fa-file-pdf'}
	}

	getModeloButton(name = "Usar modelo"){
		return {id: this.MODELO_BTN, name: name, icon: 'fas fa-list'}
	}

	edit(idr){
		this.makeEditRequest(idr);
	}

	view(idr){
		this.makeEditRequest(idr);	
	}

	delete(idr){
		ModalMateriaisHelper.notifyQuestion(this.QUESTION_DELETE_ROW, confirm => {
			if(confirm){
				this.makeDeleteRequest(idr);
			}
		})
	}

	create(){
		this.makeCreateRequest();
	}

	getParentTrData(reference){
		return ModalMateriaisHelper.getTrData(reference);
	}

	getAuxActionParams(id){
		return {rowid: btoa(id), icon: this.AUX_ACTION_ICON};
	}

	setPdfRequestParamsCallback(e){
		this.pdfParamsCallback = e;
	}

	registerActionCallbacks(){

		ModalMateriaisHelper.onClickClass(this.EDIT_BTN, btn => {
			this.edit(btn.id);
		})

		ModalMateriaisHelper.onClickClass(this.DELETE_BTN, btn => {
			this.delete(btn.id);
		})

		ModalMateriaisHelper.onClickClass(this.VIEW_BTN, btn => {
			this.view(btn.id);
		})

		ModalMateriaisHelper.onClickClass(this.SETTINGS_BTN, btn => {
			this.settings(btn);
		})
	}

	makeEditRequest(idr){
		ModalMateriaisHelper.makePacienteModuloRequest(APP_PATH + this.MODULE_URL, {p: btoa(ModuloController.ID_PACIENTE), m: idr});
	}

	makeCreateRequest(){
		ModalMateriaisHelper.makePacienteModuloRequest(APP_PATH + this.MODULE_URL, {p: btoa(ModuloController.ID_PACIENTE), m: btoa(-1)});
	}

	makeUseModeloRequest(idm){
		ModalMateriaisHelper.makePacienteModuloRequest(APP_PATH + this.MODULE_URL, {p: btoa(ModuloController.ID_PACIENTE), u: btoa(true), m: idm});
	}

	makeDeleteRequest(idr){
		
		let call = this.getDeleteParams(idr);

		if(call == undefined){
			return;
		}

		call.success = response => {
			ModalMateriaisHelper.notifyStd(this.SUCC_DELETE_ROW);
			this.updateCallback();
		}

		call.error = code => {
			ModalMateriaisHelper.notifyStd(this.ERRO_DELETE_ROW);	
		}

		call.beforeSend = () => {
			ModalMateriaisHelper.loading(this.LOADING_DELETE_ROW);
		}

		ModalMateriaisHelper.stdCall(call, false, true);

	}

	makeModeloRequest(idr){
		
		let call = this.getModeloParams(idr);

		if(call == undefined){
			return;
		}

		call.success = response => {
			ModalMateriaisHelper.moduleModalModelo(this, response, idm => {
				this.makeUseModeloRequest(idm);
			})
		}

		call.error = code => {
			ModalMateriaisHelper.notifyStd(this.ERRO_GET_MODELO);	
		}

		call.beforeSend = () => {
			ModalMateriaisHelper.loading(this.LOADING_GET_MODELO);
		}

		ModalMateriaisHelper.stdCall(call, false, true);

	}

}