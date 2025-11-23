import { Jogador } from "./jogador.js";
import { Arma } from "./armas.js";

// =======================================================
// VARIÁVEIS DO JOGO
// =======================================================
const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");

const jogador = new Jogador();
const tiros = [];

let frame = 0;

// =======================================================
// DESENHO COM EFEITOS ESPECIAIS
// =======================================================
function desenharTiro(ctx, tiro) {
    ctx.save();

    // ----- efeitos por tipo -----

    // TIROS DIAGONAIS (pequenos)
    if (tiro.velX !== undefined) {
        const grad = ctx.createRadialGradient(
            tiro.x + tiro.largura / 2, tiro.y + tiro.altura / 2, 0,
            tiro.x + tiro.largura / 2, tiro.y + tiro.altura / 2, 10
        );
        grad.addColorStop(0, "yellow");
        grad.addColorStop(1, "orange");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tiro.x, tiro.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
    }

    // TIRO ONDA (zig-zag)
    if (tiro.tipoEspecial === "onda") {
        ctx.fillStyle = "cyan";

        const deslocamento = Math.sin(tiro.ondaFrame / 5) * 10;

        ctx.fillRect(tiro.x + deslocamento, tiro.y, tiro.largura, tiro.altura);
        tiro.ondaFrame++;
        ctx.restore();
        return;
    }

    // LASER FINO
    if (tiro.altura >= 40 && tiro.largura <= 3) {
        const grad = ctx.createLinearGradient(tiro.x, tiro.y, tiro.x, tiro.y + tiro.altura);
        grad.addColorStop(0, "white");
        grad.addColorStop(1, "cyan");

        ctx.fillStyle = grad;
        ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
        ctx.restore();
        return;
    }

    // LASER GROSSO
    if (tiro.altura >= 80) {
        const grad = ctx.createLinearGradient(tiro.x, tiro.y, tiro.x, tiro.y + tiro.altura);
        grad.addColorStop(0, "red");
        grad.addColorStop(1, "yellow");

        ctx.fillStyle = grad;
        ctx.shadowColor = "red";
        ctx.shadowBlur = 20;

        ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
        ctx.restore();
        return;
    }

    // TIRO NORMAL
    ctx.fillStyle = "white";
    ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
    ctx.restore();
}

// =======================================================
// ATUALIZA TUDO
// =======================================================
function atualizar() {
    jogador.atualizar(tiros);

    // Atualizar tiros
    for (let i = tiros.length - 1; i >= 0; i--) {
        let t = tiros[i];

        // se o tiro usa velX/velY (diagonais)
        if (t.velX !== undefined) {
            t.x += t.velX;
            t.y -= t.velY;
        }
        // se é laser ou tiro normal
        else {
            t.y -= t.velocidade;
        }

        // remover se sair da tela
        if (t.y < -100) tiros.splice(i, 1);
    }
}

// =======================================================
// DESENHA TUDO
// =======================================================
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // jogador
    jogador.desenhar(ctx);

    // tiros
    tiros.forEach(t => desenharTiro(ctx, t));
}

// =======================================================
// LOOP PRINCIPAL
// =======================================================
function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();
