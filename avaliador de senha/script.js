const senhaInput = document.getElementById("senha");
const progressBar = document.getElementById("progressBar");
const regrasList = document.querySelectorAll("#regras .list-group-item");
const resultadoDiv = document.getElementById("resultado");
const toggleSenha = document.getElementById("toggleSenha");
const pontosDiv = document.getElementById("pontos");

// Função para avaliar e calcular a pontuação
function calcularPontuacao(senha) {
    let pontuacao = 0;
    const tamanho = senha.length;
    const maiusculas = (senha.match(/[A-Z]/g) || []).length;
    const minusculas = (senha.match(/[a-z]/g) || []).length;
    const numeros = (senha.match(/[0-9]/g) || []).length;
    const simbolos = (senha.match(/[^a-zA-Z0-9]/g) || []).length;
    const meio = senha.slice(1, -1).match(/[^a-zA-Z0-9]/g)?.length || 0;

    // Adições
    pontuacao += tamanho * 4;
    pontuacao += (tamanho - maiusculas) * 2;
    pontuacao += (tamanho - minusculas) * 2;
    pontuacao += numeros * 4;
    pontuacao += simbolos * 6;
    pontuacao += meio * 2;

    // Regras extras
    const regrasExtras = [
        tamanho >= 8,
        maiusculas > 0,
        minusculas > 0,
        numeros > 0,
        simbolos > 0,
    ].filter(Boolean).length;
    pontuacao += regrasExtras * 2;

    // Deduções
    if (maiusculas + minusculas === tamanho) pontuacao -= tamanho; // Apenas letras
    if (numeros === tamanho) pontuacao -= tamanho; // Apenas números

    // Repetições e sequências
    const repetidos = senha.length - new Set(senha.toLowerCase()).size;
    pontuacao -= repetidos;
    pontuacao -= calcularSequencias(senha) * 3;

    return Math.max(0, pontuacao); // Evita valores negativos
}

// Calcula sequências (exemplo: abc, 123, !@#)
function calcularSequencias(senha) {
    let count = 0;
    const tipos = [/[a-z]/, /[0-9]/, /[^a-zA-Z0-9]/];
    tipos.forEach((regex) => {
        const chars = senha.match(regex)?.join("") || "";
        for (let i = 0; i < chars.length - 2; i++) {
            if (
                chars.charCodeAt(i) + 1 === chars.charCodeAt(i + 1) &&
                chars.charCodeAt(i + 1) + 1 === chars.charCodeAt(i + 2)
            ) {
                count++;
            }
        }
    });
    return count;
}

// Atualiza visualmente a validação
senhaInput.addEventListener("input", function () {
    const senha = senhaInput.value;
    const pontuacao = calcularPontuacao(senha);

    pontosDiv.textContent = `Pontuação: ${pontuacao}`;

    const tamanho = senha.length >= 8;
    const maiuscula = /[A-Z]/.test(senha);
    const minuscula = /[a-z]/.test(senha);
    const numero = /[0-9]/.test(senha);
    const simbolo = /[^a-zA-Z0-9]/.test(senha);

    // Atualiza visualmente as regras
    [tamanho, maiuscula, minuscula, numero, simbolo].forEach((valido, index) => {
        regrasList[index].classList.toggle("text-success", valido);
        regrasList[index].classList.toggle("text-danger", !valido);
    });

    // Atualiza a barra de progresso
    const forca = Math.min((pontuacao / 100) * 100, 100);
    progressBar.style.width = `${forca}%`;
    progressBar.setAttribute("aria-valuenow", forca);

    if (forca < 40) {
        progressBar.className = "progress-bar bg-danger";
    } else if (forca < 60) {
        progressBar.className = "progress-bar bg-warning";
    } else if (forca < 80) {
        progressBar.className = "progress-bar bg-info";
    } else {
        progressBar.className = "progress-bar bg-success";
    }
});

// Alternar visibilidade da senha
toggleSenha.addEventListener("click", function (e) {
    e.preventDefault();
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        toggleSenha.textContent = "Ocultar";
    } else {
        senhaInput.type = "password";
        toggleSenha.textContent = "Mostrar";
    }
});

// Exibe mensagem final ao validar
document.getElementById("avaliarBtn").addEventListener("click", function () {
    const senha = senhaInput.value;
    const pontuacao = calcularPontuacao(senha);
    if (pontuacao >= 80) {
        resultadoDiv.textContent = "Senha muito forte!";
        resultadoDiv.className = "result bg-success text-white";
    } else if (pontuacao >= 60) {
        resultadoDiv.textContent = "Senha forte.";
        resultadoDiv.className = "result bg-info text-white";
    } else if (pontuacao >= 40) {
        resultadoDiv.textContent = "Senha razoável.";
        resultadoDiv.className = "result bg-warning text-white";
    } else {
        resultadoDiv.textContent = "Senha fraca.";
        resultadoDiv.className = "result bg-danger text-white";
    }
});
