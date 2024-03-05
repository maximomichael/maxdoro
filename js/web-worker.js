onmessage = function(event) {
    let dadosDoCronometro = {minutos: event.data.minutos, segundos: event.data.segundos}; 
    loopTimer = setInterval(() => {
        dadosDoCronometro.segundos = (dadosDoCronometro.segundos == -1 || dadosDoCronometro.segundos == 0) ? 59 : dadosDoCronometro.segundos-1,
        dadosDoCronometro.minutos = (dadosDoCronometro.segundos == 59) ? dadosDoCronometro.minutos-1 : dadosDoCronometro.minutos;
        this.postMessage(dadosDoCronometro);
    }, 1000);
}