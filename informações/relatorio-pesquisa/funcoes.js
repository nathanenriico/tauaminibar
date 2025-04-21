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
        <strong>Apto:</strong> ${item.apartamento} 
        <strong>Categoria:</strong> ${item.categoria} 
        <strong>Item:</strong> ${item.sugestao}
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

  // Agrupar por categoria
  const categorias = {};

  sugestoes.forEach(item => {
    if (!categorias[item.categoria]) {
      categorias[item.categoria] = [];
    }
    categorias[item.categoria].push(item);
  });

  let y = 30;

  for (const categoria in categorias) {
    doc.setFontSize(14);
    doc.text(`Categoria: ${categoria}`, 20, y);
    y += 10;

    doc.setFontSize(12);
    categorias[categoria].forEach((item, index) => {
      doc.text(`- Apto ${item.apartamento}: ${item.sugestao}`, 25, y);
      y += 8;
    });

    y += 5; // espaço extra entre categorias
  }

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
