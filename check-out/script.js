document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio do formulário normal
    
    let consumoSim = document.getElementById("consumo-sim").checked;
    
    if (consumoSim) {
        window.location.href = "https://nathanenriico.github.io/tauaminibarmelhorias/home/index.html"; // Redireciona para a página de lançamento de consumo
    } else {
        alert("Checkout realizado com sucesso!"); // Alerta para o usuário
    }
});