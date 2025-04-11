let consumption = [];

function addItem(name, price) {
    consumption.push({ name, price });
    updateSummary();
}

function updateSummary() {
    let summaryList = document.getElementById("summary-list");
    let totalElement = document.getElementById("total");
    summaryList.innerHTML = "";
    let total = 0;
    
    consumption.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} <button onclick="removeItem(${index})">Remover</button>`;
        summaryList.appendChild(li);
        total += item.price;
    });
    
    totalElement.textContent = total.toFixed(2);
}

function removeItem(index) {
    consumption.splice(index, 1);
    updateSummary();
}

function confirmConsumption() {
    const apartmentNumber = document.getElementById('apartment-number').value.trim();

    if (apartmentNumber === "") {
        // Exibir o popup de aviso se o número do apartamento não for inserido
        document.getElementById('warning-popup').style.display = 'flex';
    } else {
        // Lógica para confirmar o consumo
        const summaryList = document.getElementById('summary-list');
        const popupList = document.getElementById('popup-list');
        const total = document.getElementById('total').innerText;

        // Preencher o popup com os dados do resumo
        popupList.innerHTML = summaryList.innerHTML;
        document.getElementById('popup-total').innerText = total;
        document.getElementById('popup-apartment').innerText = apartmentNumber;

        // Exibir o popup de confirmação
        document.getElementById('popup').style.display = 'flex';
    }
}

function closeWarningPopup() {
    document.getElementById('warning-popup').style.display = 'none';
}
    
    let popup = document.getElementById("popup");
    let popupList = document.getElementById("popup-list");
    let popupTotal = document.getElementById("popup-total");
    let popupApartment = document.getElementById("popup-apartment");

    popupList.innerHTML = "";
    let total = 0;
    
    consumption.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} <button onclick="removeItem(${index}); confirmConsumption();">Remover</button>`;
        popupList.appendChild(li);
        total += item.price;
    });
    
    popupTotal.textContent = total.toFixed(2);
    popupApartment.textContent = apartmentNumber;
    popup.style.display = "block";


function openEditMode() {
    document.getElementById("popup").style.display = "none";
}

function finalizeConsumption() {
    const apartmentNumber = document.getElementById("apartment-number").value.trim();
    const total = document.getElementById("popup-total").innerText; // Obtém o total
    
    // URL de pagamento (exemplo)
    const paymentURL = `https://seuservicodepagamento.com/pagar?apartamento=${apartmentNumber}&total=${total}`;
        
    // Gera o QR Code
    $('#qrcode').empty(); // Limpa QR Code anterior
    $('#qrcode').qrcode(paymentURL); // Gera novo QR Code
    
    // Limpa o consumo e atualiza o resumo
    consumption = [];
    updateSummary();
    
    // Fecha o popup principal
    closePopup();
    
    // Abre o novo popup de pagamento
    openPaymentPopup();
}

function openPaymentPopup() {
    document.getElementById("payment-popup").style.display = "block";
}

function closePaymentPopup() {
    document.getElementById("payment-popup").style.display = "none";
}

// Função para fechar o popup principal (exemplo)
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function toggleChat() {
    let chatbot = document.getElementById("chatbot");
    chatbot.style.display = chatbot.style.display === "none" ? "flex" : "none";
}

function sendMessage(message) {
    let chatBody = document.getElementById("chat-body");
    let response = getResponse(message);
    
    let userMessage = document.createElement("p");
    userMessage.innerHTML = `<strong>Você:</strong> ${message}`;
    chatBody.appendChild(userMessage);
    
    let botMessage = document.createElement("p");
    botMessage.innerHTML = `<strong>Bot:</strong> ${response}`;
    chatBody.appendChild(botMessage);
    
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getResponse(message) {
    switch (message) {
        case " Posso usar o app para lançar consumo após a conferência do frigobar?":
            return "Sim, o app registra consumo em tempo real, evitando perdas e mantendo sua conta atualizada";
        default:
            return "Sim, o app registra consumo em tempo real, evitando perdas e mantendo sua conta atualizada";
    }
}

function redirectToWhatsApp() {
    window.location.href = "https://wa.me/5511941716617?text=Olá, tenho uma dúvida sobre o frigobar.";
}