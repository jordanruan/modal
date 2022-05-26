<?php require_once __DIR__ . '/../../_common/minimal_header_profissional.php'?>

<link rel="stylesheet" type="text/css" href="css/main.css">

<!-- <div id="chat-loader">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8z" opacity=".5" fill="currentColor"/><path d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8z" fill="currentColor"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>
</div>-->

<div class="col-12" id="menu-modulos-materiais"></div>
    
<div class="col-12 label-modulo-materiais-container" id="container-name-module-materiais"></div>

<div class="col-12" style="display: none" id="container-warning-modulo-materiais"><i class='iconify' data-icon='akar-icons:triangle-alert'></i><span id='container-warning-modulo-message-materiais'></span></div>

<div class="col-12" style="display: none;" id="container-historico-modulos-materiais"></div>

<div class="col-12" id="container-action-buttons-materiais"></div>


<?php require_once __DIR__ . '/../../_common/minimal_footer_imports_profissional.php'?>

<script type="text/javascript" src="js/modulos/ModuloMateriais.js?v=<?=APP_VERSION?>"></script>
<script type="text/javascript" src="js/modulos/MeusAlimentosModulo.js?v=<?=APP_VERSION?>"></script>
<script type="text/javascript" src="js/modulos/MeusComentariosModulo.js?v=<?=APP_VERSION?>"></script>

<script type="text/javascript" src="js/ModalMateriaisHelper.js?v=<?=APP_VERSION?>"></script>
<script type="text/javascript" src="js/ModulosMateriaisController.js?v=<?=APP_VERSION?>"></script>

<script type="text/javascript" src="js/main.js?v=<?=APP_VERSION?>"></script>

<?php require_once __DIR__ . '/../../_common/minimal_footer_profissional.php'?>