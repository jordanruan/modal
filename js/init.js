let onDemand = new OnDemandModal(
	'trigger-modal-meus-materiais',
	'modal-meus-materiais',
	'/profissional/meus_materiais/',
	'iframe-modal-meus-materiais',
);

$(document).ready(function(){
	onDemand.init();
})	