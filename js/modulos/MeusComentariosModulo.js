class MeusComentariosModulo extends ModuloMateriais{

	initModule(){
		this.MODULE_URL = 'paciente/anamnese/';
		this.CONTROLLER = "AnamneseController";
		this.GET_HISTORICO_ACTION = 12;
		this.DELETE_ACTION = 13;

		this.id = 'anamnese_paciente';
		this.name = 'Anamnese';
		this.desc = '';
		this.icon = 'fas fa-notes-medical';
		this.href = ''; 

		this.titleLabel = "Anamneses";
		this.ROW_ACTION_PREFIX = "anamnese-row-action";

		this.NAME_CREATE_BUTTON = "Nova Anamnese";
		this.NAME_PDF_BUTTON = "Preencher Manualmente";

		this.setPdfRequestParamsCallback(() => {
			return {url: APP_PATH + 'exportar/pdf/anamnese_manual.php', idp: btoa(ModuloController.ID_PACIENTE)};
		})
	}

	getButtons(){
		return [this.getCreateButton(this.NAME_CREATE_BUTTON), this.getPDFButton(this.NAME_PDF_BUTTON)];
	}

	getHistoricoParams(){
		let call = {data: {}};

		call.data.controller = this.CONTROLLER;
		call.data.action = this.GET_HISTORICO_ACTION;
		call.data.idp = btoa(ModuloController.ID_PACIENTE);

		return call;
	}

	getDeleteParams(idr){
		let call = {data: {}};

		call.data.controller = this.CONTROLLER;
		call.data.action = this.DELETE_ACTION;
		call.data.ida = idr;

		return call;	
	}

	getRowFunction(maker){
		return (item, index) => {

			maker.tr();
			maker.td(item.dataf).setWidth('10%');
			maker.td(item.tipo_tratamento).setWidth('82%');
			maker.td(ModalHelper.inflateStdMenus(['r', 'e'], this.ROW_ACTION_PREFIX, item.id)).setWidth('8%').setActionCell();

		}
	}

}