class ModulosMateriaisController{

	constructor(){
		this.modulos = undefined;
		this.table_historico = undefined;

		this.MODAL_MODULOS = "modal-modulos-materiais";

		this.MENU_PACIENTES = "menu-modulos-materiais";
		this.CONTAINER_TABELA_HISTORICO = "container-historico-modulos-materiais";
		this.BUTTONS_CONTAINER = "container-action-buttons-materiais";
		this.WARNING_MESSAGE_CONTAINER = "container-warning-modulo-materiais"


		this.TABELA_HISTORICO = "tabela-historico-modulo-materiais";
		this.CONTAINER_TITLE_LABEL = "container-name-module-materiais";
		this.TITLE_LABEL = "label-modulo-paciente-materiais";
		this.WARNING_MESSAGE_TEXT = "container-warning-modulo-message-materiais";

		this.BTN_MODULO_PACIENTE = "btn-modulo-materiais";
		this.BTN_TRIGGER_MODAL = "btn-trigger-modal-modulos-materiais";
		this.BTN_TRIGGER_IN_PACIENTE = "btn-trigger-modal-modulos-paciente-inside";

		this.SUBMODULE_STYLE = "submodule-style";

		this.last_module_index = undefined;

		this.updateCallback = () => {
			this.list(this.last_module_index);
		}

		this.submoduleCallback = (controller) => {
			this.loadModuleData(controller)
		}

	}

	static ID_PACIENTE;

	start(){
		this.init();
		this.renderMenu();
	}

	init(){
		this.initModulos();
		this.initTable();
		this.registerActionCallbacks();
	}

	initTable(){

		this.table_historico = new ligthTab({
			table_id: this.TABELA_HISTORICO,
			table_class: 'table dietsystem-table',
			renderContainer: this.CONTAINER_TABELA_HISTORICO,
			pagginate: true,
		});

		this.table_historico.initTable();
	}

	initModulos(){

		this.modulos = [
			new MeusAlimentosModulo(this.updateCallback),
			new MeusComentariosModulo(this.updateCallback),
		];

	}

	list(modulo){
		if(modulo == undefined){
			return;
		}

		this.last_module_index = modulo;
		let controller = this.getModulo(modulo);

		if(controller instanceof SubmoduloPaciente){
			this.listSubModules(controller);
			return;
		}

		this.removeSubmoduleStyle();

		this.getData(controller, 
			response => {
				this.table_historico.update(response);
			},
			() => this.renderActionButtons(controller.getButtons()),
		);

		this.table_historico.setRowFunction(controller.getRowFunction(this.table_historico));
		this.setTitleLabel(controller.getIcon(), controller.getTitleLabel());
		this.showWarningMessageIfExists(controller.warningMessage);
	}

	loadModuleData(controller){

		this.getData(controller, 
			response => {
				this.table_historico.update(response);
			},
			() => this.renderActionButtons(controller.getButtons()),
		);

		this.table_historico.setRowFunction(controller.getRowFunction(this.table_historico));
		this.showWarningMessageIfExists(controller.warningMessage);
	}

	listSubModules(controller){
		this.setSubmoduloMenu(controller.makeMenu());
		controller.selectLast();
	}

	setSubmoduloMenu(menu){
		this.setSubmoduleStyle();
		ModalMateriaisHelper.setContent(this.CONTAINER_TITLE_LABEL, menu);
	}

	setSubmoduleStyle(){
		ModalMateriaisHelper.addClass(this.CONTAINER_TITLE_LABEL, this.SUBMODULE_STYLE);
	}

	removeSubmoduleStyle(){
		ModalMateriaisHelper.remClass(this.CONTAINER_TITLE_LABEL, this.SUBMODULE_STYLE);
	}

	setTitleLabel(icon, label){
		ModalMateriaisHelper.setTitleLabel(this.CONTAINER_TITLE_LABEL, icon, label);
	}

	showWarningMessageIfExists(message){

		if(message == undefined){

			ModalMateriaisHelper.fadeTransition(this.WARNING_MESSAGE_CONTAINER, '', () => {
				ModalMateriaisHelper.setContent(this.WARNING_MESSAGE_TEXT, '');	
			});

			return;
		}

		ModalMateriaisHelper.fadeTransition('', this.WARNING_MESSAGE_CONTAINER, () => {
			ModalMateriaisHelper.setContent(this.WARNING_MESSAGE_TEXT, message);	
		});
	}

	getData(controller, callback, onFinish){

		let call = controller.getHistoricoParams();

		call.success = response => {
			callback(response);
			onFinish();
		}

		call.error = code => {
			this.table_historico.empty();
			onFinish();
		}

		call.beforeSend = () => {
			this.table_historico.loading();
		}

		ModalMateriaisHelper.stdCall(call, false, true);
	}

	getModulo(key){
		if(this.modulos[key] == undefined){
			console.log("controller não encontrado");
		}

		return this.modulos[key];
	}

	renderActionButtons(btns){
		let html = "";

		for(let i = 0; i < btns.length; i++){
			html += ModalMateriaisHelper.makeButton(btns[i]);
		}

		ModalMateriaisHelper.setContent(this.BUTTONS_CONTAINER, html);
	}

	makeMenu(){
		let html = "";
		this.modulos.map((modulo, index) => html += ModalMateriaisHelper.menuBox(modulo, index));

		console.log(html);
		return ModalMateriaisHelper.rowMenuBox(html);
	}

	renderMenu(){
		ModalMateriaisHelper.setContent(this.MENU_PACIENTES, this.makeMenu());
	}

	activePill(index){
		ModalMateriaisHelper.toggleActiveModuloPill(this.modulos[index].id);
	}

	onOpenModal(){
		ModalMateriaisHelper.removeBodyScroll();

		if(this.last_module_index == undefined){
			this.last_module_index = 0;
		}

		this.activePill(this.last_module_index);
		this.list(this.last_module_index);
	}

	onCloseModal(){
		ModalMateriaisHelper.restoreBodyScroll();
	}

	static showModal(){
		ModalMateriaisHelper.Mdopen("modal-modulos-paciente", false);
	}

	registerActionCallbacks(){
		ModalMateriaisHelper.onClickClass(this.BTN_MODULO_PACIENTE, btn => {
			ModalMateriaisHelper.toggleActiveModulo(btn);
			this.list(atob(btn.getAttribute('mdi')));
		})

		ModalMateriaisHelper.onClickClass(this.BTN_TRIGGER_MODAL, btn => {
			ModuloController.showModal();
		})

		ModalMateriaisHelper.onOpenModal(this.MODAL_MODULOS, () => this.onOpenModal());
		ModalMateriaisHelper.onCloseModal(this.MODAL_MODULOS, () => this.onCloseModal());
	}

}