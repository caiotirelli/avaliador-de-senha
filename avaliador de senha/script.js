document.getElementById("avaliarBtn").addEventListener("click", function () {
    const senha = document.getElementById("senha").value;
    const resultadoDiv = document.getElementById("resultado");

    let pontuacao = 0;
    const tamanho = senha.length;
    const maiusculas = (senha.match(/[A-Z]/g) || []).length;
    const minusculas = (senha.match(/[a-z]/g) || []).length;
    const numeros = (senha.match(/[0-9]/g) || []).length;
    const simbolos = (senha.match(/[^a-zA-Z0-9]/g) || []).length;
    const caracteresNoMeio = (senha.slice(1, -1).match(/[^a-zA-Z0-9]/g) || []).length;

    
    pontuacao += tamanho * 4;
    pontuacao += (tamanho - maiusculas) * 2;
    pontuacao += (tamanho - minusculas) * 2;
    pontuacao += numeros * 4;
    pontuacao += simbolos * 6;
    pontuacao += caracteresNoMeio * 2;

    
    const regrasAtendidas = [
        tamanho >= 8,
        maiusculas > 0,
        minusculas > 0,
        numeros > 0,
        simbolos > 0,
    ].filter(Boolean).length;
    pontuacao += regrasAtendidas * 2;

    
    if (maiusculas + minusculas === tamanho) pontuacao -= tamanho;
    if (numeros === tamanho) pontuacao -= tamanho; 

    const repeticoes = senha.length - new Set(senha.toLowerCase()).size;
    pontuacao -= repeticoes;

    const sequencial = (str) => {
        let count = 0;
        for (let i = 0; i < str.length - 2; i++) {
            if (
                str.charCodeAt(i) + 1 === str.charCodeAt(i + 1) &&
                str.charCodeAt(i + 1) + 1 === str.charCodeAt(i + 2)
            ) {
                count++;
            }
        }
        return count;
    };

    pontuacao -= sequencial(senha.match(/[a-zA-Z]/g)?.join("") || "") * 3;
    pontuacao -= sequencial(senha.match(/[0-9]/g)?.join("") || "") * 3;
    pontuacao -= sequencial(senha.match(/[^a-zA-Z0-9]/g)?.join("") || "") * 3;

    
    let classificacao = "";
    let classe = "";
    if (pontuacao < 20) {
        classificacao = "Muito fraca";
        classe = "muito-fraca";
    } else if (pontuacao < 40) {
        classificacao = "Fraca";
        classe = "fraca";
    } else if (pontuacao < 60) {
        classificacao = "Boa";
        classe = "boa";
    } else if (pontuacao < 80) {
        classificacao = "Forte";
        classe = "forte";
    } else {
        classificacao = "Muito forte";
        classe = "muito-forte";
    }

    
    resultadoDiv.className = `result ${classe}`;
    resultadoDiv.innerHTML = `Pontuação: ${pontuacao}<br>A senha é: ${classificacao}`;
});


document.getElementById("toggleSenha").addEventListener("click", function (e) {
    e.preventDefault();
    const senhaInput = document.getElementById("senha");
    const toggleButton = document.getElementById("toggleSenha");

    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        toggleButton.textContent = "Ocultar";
    } else {
        senhaInput.type = "password";
        toggleButton.textContent = "Mostrar";
    }
});
