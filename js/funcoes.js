let minutosDeFoco;
let minutosDeDescanso;
let dadosDoCronometro;

let quantidadeVoltasCronometro = {foco: 0, descanso: 0};
let tipoCronometro = 'F';
let tempoSelecionado = 'P'
let timerWW = null;

const temposPadroes = [
    {id: 'P', foco: 25, descanso: 5},
    {id: 'M', foco: 40, descanso: 8},
    {id: 'H', foco: 60, descanso: 15}
];
const segundosValorPadrao = -1;
const audio = new Audio('../audio/alert01.mp3');

window.onload = function() {
    selecionarTempoPadrao(tempoSelecionado);
    document.getElementById('fraseMotivacional').innerHTML = (document.cookie != "") ? document.cookie : "Insira sua frase motivacional!";
}

function cronometro() {
    if (window.Worker) {
        timerWW = new Worker("js/web-worker.js");
        timerWW.postMessage(dadosDoCronometro);
        contarCadaVoltaDoCronometro(tipoCronometro);
        alterarImagemTipoCronometro(tipoCronometro);
        alterarBackGroundPeloTipoCronometro(tipoCronometro);
        timerWW.onmessage = function(event) {
            dadosDoCronometro = event.data;
            mostrarCronometroNaTela(dadosDoCronometro.minutos, dadosDoCronometro.segundos);
            if (dadosDoCronometro.minutos == 0 && dadosDoCronometro.segundos == 0) {
                timerWW.terminate();
                alertarFimDoTempo();
                tipoCronometro = modificarTipoCronometro(tipoCronometro);
                cronometro();
            }
        };
    } else {
        alert("Seu navegador não suporta trabalhos em segundo plano, deixe está janela sempre em primeiro plano!")
    }
}

function selecionarTempoPadrao(tempoSelecionado){
    const tempo = temposPadroes.find(idTempo => idTempo.id === tempoSelecionado);
    if (timerWW != null) {
        reniciarCronometro();
    }
    if (tempo != null) {
        minutosDeFoco = tempo.foco;
        minutosDeDescanso = tempo.descanso;
    } else {
        alert("Tempo incorreto! Será inserido o tempo popular.");
        minutosDeFoco = temposPadroes[0].foco;
        minutosDeDescanso = temposPadroes[0].descanso;
    }
    alterarImagemTipoCronometro(null);
    alterarBackGroundPeloTipoCronometro(null);
    alterarDadosCronometro(minutosDeFoco, segundosValorPadrao);
    mostrarCronometroNaTela(dadosDoCronometro.minutos, 0);
}

function iniciarCronometro() {
    let btnPlay = document.getElementById("btn-play");
    btnPlay.innerHTML = "stop_circle";
    btnPlay.setAttribute("onclick", "pararCronometro()");
    cronometro();
}

function pararCronometro() {
    let btnPlay = document.getElementById("btn-play"); 
    btnPlay.innerHTML = "play_circle"
    btnPlay.setAttribute("onclick", "iniciarCronometro()");
    timerWW.terminate();
    alterarDadosCronometro(minutosDeFoco, segundosValorPadrao)
    mostrarCronometroNaTela(dadosDoCronometro.minutos, 0);
    alterarImagemTipoCronometro(null);
    alterarBackGroundPeloTipoCronometro(null);
}

function reniciarCronometro(){
    timerWW.terminate();
    let btnPlay = document.getElementById("btn-play"); 
    btnPlay.innerHTML = "play_circle";
    btnPlay.setAttribute("onclick", "iniciarCronometro()");
}

function alterarDadosCronometro(minutos, segundos){
    dadosDoCronometro = {minutos: minutos, segundos: segundos}; 
}

function alertarFimDoTempo() {
    audio.play();
}

function modificarTipoCronometro(tipoCronometro) {
    tipoCronometro = (tipoCronometro == 'F') ? 'D' : 'F';
    if (tipoCronometro == 'F') { //FOCO
        alterarDadosCronometro(minutosDeFoco, segundosValorPadrao);
    } else if (tipoCronometro == 'D') { //DESCANSO
        alterarDadosCronometro(minutosDeDescanso, segundosValorPadrao);
    } else {
        alert("Ops! Houve um erro ao escolher o tipo de cronômetro.");
        alterarDadosCronometro(minutosDeFoco, 0);
    }
    return tipoCronometro;
}

function mostrarCronometroNaTela(minutos, segundos) {
    document.getElementById('minutos').innerHTML = inserirZeroEmDigitoUnitario(minutos);
    document.getElementById('segundos').innerHTML = inserirZeroEmDigitoUnitario(segundos);
}

function contarCadaVoltaDoCronometro(tipoCronometro){
    if(tipoCronometro == 'F'){ //FOCO
        quantidadeVoltasCronometro.foco++;
        document.getElementById('quantidade-foco').innerHTML = quantidadeVoltasCronometro.foco;
    } else if(tipoCronometro == 'D'){ //DESCANSO
        quantidadeVoltasCronometro.descanso++;
        document.getElementById('quantidade-descanso').innerHTML = quantidadeVoltasCronometro.descanso;
    }
}

function alterarImagemTipoCronometro(nome){
    const imagem = document.getElementById('imagem-tipo-cronometro');
    const url = (nome != null) ? 'img/' + nome + '.gif' : "";
    imagem.src = url;
}

function alterarBackGroundPeloTipoCronometro(tipoCronometro){
    const docBody = document.body;
    let background;
    let size;
    if(tipoCronometro == 'F'){ //FOCO
        background = {cor1: "#65FDF0", cor2: "#1D6FA3", timeanimacao: 8};
    } else if(tipoCronometro == 'D'){ //DESCANSO
        background = {cor1: "#C2FFD8", cor2: "#465EFB", timeanimacao: 4};
    } else { //PARADO
        background = {cor1: "#FFE985", cor2: "#FA742B", timeanimacao: 0};
    }

    size = (background.timeanimacao == 0) ? "100%" : "250%";
    docBody.setAttribute(
        
            "style", 
            "background-image: linear-gradient( 135deg, " + background.cor1 + " 10%, " + background.cor2 + " 100%);" +
            "animation-duration: " + background.timeanimacao + "s;" + 
            "background-size: " + size + ";"
        );
}

function inserirZeroEmDigitoUnitario(digito) {
    let novoDigito = digito.toString().length == 1 ? '0' + digito : digito;
    return novoDigito;
}

function editarFraseMotivacional(){
    if (document.getElementById('campo-alterar-frase-motivacional') == null) {
        var fraseMotivacional = document.getElementById('fraseMotivacional');
        var campoDigitacao = document.createElement('input');
        campoDigitacao.setAttribute('id', 'campo-alterar-frase-motivacional');
        campoDigitacao.setAttribute('maxlength', '200');
        campoDigitacao.setAttribute('autocomplete', 'off');
        campoDigitacao.setAttribute('onblur', 'salvarFraseMotivacional(this.value)');
        campoDigitacao.value = fraseMotivacional.textContent;
        document.getElementById('fraseMotivacional').innerHTML = null;
        fraseMotivacional.appendChild(campoDigitacao);
        document.getElementById('campo-alterar-frase-motivacional').focus();
    }
}

function salvarFraseMotivacional(frase){
    if (frase != "") {
        document.cookie = frase;
    }
    document.getElementById('fraseMotivacional').innerHTML = document.cookie; 
}

function mostrarPlaylist(){
    const playlist = document.getElementById("playlist");
    const ativarPlaylist = document.getElementById("ativar-playlist");
    playlist.style.display = (playlist.style.display === "none") ? "block" : "none";
    ativarPlaylist.innerHTML =(playlist.style.display === "none") ? "music_note" : "music_off";
}


