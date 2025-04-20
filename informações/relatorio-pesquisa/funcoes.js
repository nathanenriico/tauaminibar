document.addEventListener("DOMContentLoaded", () => {
    const lista = document.querySelector(".stock-list");
    const sugestoes = JSON.parse(localStorage.getItem("sugestoes")) || [];
  
    if (sugestoes.length === 0) {
      lista.innerHTML = "<p>Nenhuma sugestão enviada ainda.</p>";
    } else {
      sugestoes.forEach((item, index) => {
        const sugestaoDiv = document.createElement("div");
        sugestaoDiv.className = "suggestion-item";
        sugestaoDiv.innerHTML = `
          <strong>Apto:</strong> ${item.apartamento} - <strong>Item:</strong> ${item.sugestao}
          <button class="btn-excluir" onclick="excluirSugestao(${index})">🗑️ Excluir</button>
        `;
        lista.appendChild(sugestaoDiv);
      });
    }
  });
  

  function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const sugestoes = JSON.parse(localStorage.getItem("sugestoes")) || [];
  
    if (sugestoes.length === 0) {
      alert("Nenhuma sugestão para gerar o PDF.");
      return;
    }
  
    doc.setFontSize(16);
    doc.text("Sugestões para o Frigobar - Hotel Tauá", 20, 20);
  
    doc.setFontSize(12);
    sugestoes.forEach((item, index) => {
      doc.text(`${index + 1}. Apto ${item.apartamento} - ${item.sugestao}`, 20, 30 + index * 10);
    });
  
    doc.save("sugestoes-frigobar.pdf");
  }
  
  function excluirSugestao(index) {
    let sugestoes = JSON.parse(localStorage.getItem("sugestoes")) || [];
    
    // Confirmação
    if (confirm("Tem certeza que deseja excluir esta sugestão?")) {
      sugestoes.splice(index, 1); // Remove o item do array
      localStorage.setItem("sugestoes", JSON.stringify(sugestoes)); // Atualiza localStorage
      location.reload(); // Recarrega a página para atualizar a lista
    }
  }
  
  