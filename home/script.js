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
        document.getElementById('warning-popup').style.display = 'flex';
    } else {
        const summaryList = document.getElementById('summary-list');
        const popupList = document.getElementById('popup-list');
        const total = document.getElementById('total').innerText;

        popupList.innerHTML = summaryList.innerHTML;
        document.getElementById('popup-total').innerText = total;
        document.getElementById('popup-apartment').innerText = apartmentNumber;

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
    if (!apartmentNumber) {
        document.getElementById("warning-popup").style.display = "block";
        return;
    }

    const total = parseFloat(document.getElementById("popup-total").innerText.replace(",", "."));
    const chavePix = "frigobartaua@gmail.com";
    const nomeRecebedor = "TAUAHOTEL"; // Nome cadastrado exato no Pix
    const cidade = "ATIBAIA"; // Cidade cadastrada exata no Pix

    function montaCampo(id, valor) {
        const tamanho = valor.length.toString().padStart(2, '0');
        return `${id}${tamanho}${valor}`;
    }

    function gerarCRC16(payload) {
        let polinomio = 0x1021;
        let resultado = 0xFFFF;
        for (let i = 0; i < payload.length; i++) {
            resultado ^= payload.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
                resultado &= 0xFFFF;
            }
        }
        return resultado.toString(16).toUpperCase().padStart(4, "0");
    }

    const merchantAccountInfo = 
        montaCampo("00", "BR.GOV.BCB.PIX") + 
        montaCampo("01", chavePix);

    const txid = "***"; // TXID padrão pra não dar erro no Santander

    const payloadSemCRC =
        montaCampo("00", "01") +
        montaCampo("26", merchantAccountInfo) +
        montaCampo("52", "0000") +
        montaCampo("53", "986") +
        montaCampo("54", total.toFixed(2)) +
        montaCampo("58", "BR") +
        montaCampo("59", nomeRecebedor.substring(0, 25)) +
        montaCampo("60", cidade.substring(0, 15)) +
        montaCampo("62", montaCampo("05", txid)) +
        "6304";

    const crc16 = gerarCRC16(payloadSemCRC);
    const payloadFinal = payloadSemCRC + crc16;

    // Gera o QR Code Pix
    $('#qrcode').empty();
    $('#qrcode').qrcode({
        text: payloadFinal,
        width: 256,
        height: 256
    });

    // Preenche campo Pix Copia e Cola
    document.getElementById("pix-code").value = payloadFinal;

    // Limpa consumo e mostra popup de pagamento
    consumption = [];
    updateSummary();
    closePopup();
    openPaymentPopup();
}



function copiarPix() {
    const pixTextarea = document.getElementById("pix-code");
    pixTextarea.select();
    pixTextarea.setSelectionRange(0, 99999); // Para mobile
    document.execCommand("copy");
    showCopySuccessPopup();
}

function enviarWhatsapp() {
    const numero = "5511941716617"; // DDI + DDD + número
    const apartamento = document.getElementById("apartment-number").value.trim();
    const total = document.getElementById("popup-total").innerText;
    const comprovanteInput = document.getElementById("comprovante");

    if (comprovanteInput.files.length === 0) {
        alert("Por favor, anexe o comprovante antes de enviar.");
        return;
    }

    const mensagem = `Olá! Sou do apartamento ${apartamento}. Segue o comprovante de pagamento do frigobar, no valor de R$ ${total}.`;

    // Abre o WhatsApp com a mensagem pronta
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    alert("Mensagem enviada para o WhatsApp. Não esqueça de anexar o comprovante manualmente no chat.");
}

// Novo popup de sucesso ao copiar
function showCopySuccessPopup() {
    const successPopup = document.createElement("div");
    successPopup.className = "copy-success-popup";
    successPopup.innerText = "Código Pix copiado com sucesso!";
    document.body.appendChild(successPopup);
    setTimeout(() => {
        successPopup.remove();
    }, 2000);
}



function openPaymentPopup() {
    document.getElementById("payment-popup").style.display = "block";
}

function closePaymentPopup() {
    document.getElementById("payment-popup").style.display = "none";
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
