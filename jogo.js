import { Jogador } from "./jogador.js";
import { Arma } from "./arma.js";
<<<<<<< HEAD
import { Inimigo } from "./inimigo.js";
=======
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb

// Variaveis do jogo
const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");

const jogador = new Jogador();
const tiros = [];
<<<<<<< HEAD
const tirosInimigo = [];
let inimigo = new Inimigo(1);
let inimigoLevel = 1;

let gameOver = false;

let frame = 0;

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

=======

let frame = 0;

>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb
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

    // TIRO ONDA zig-zag
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


function atualizar() {
<<<<<<< HEAD
    if (gameOver) return;

    jogador.atualizar(tiros);

    // atualizar inimigo
    if (!inimigo) inimigo = new Inimigo(inimigoLevel);
    inimigo.atualizar(frame, jogador, tirosInimigo);

    // Atualizar tiros do jogador
    for (let i = tiros.length - 1; i >= 0; i--) {
        let t = tiros[i];

        if (t.velX !== undefined && t.velY !== undefined) {
            t.x += t.velX;
            t.y -= t.velY;
        }
=======
    jogador.atualizar(tiros);

    // Atualizar tiros
    for (let i = tiros.length - 1; i >= 0; i--) {
        let t = tiros[i];

        // se o tiro usa velX/velY diagonais
        if (t.velX !== undefined) {
            t.x += t.velX;
            t.y -= t.velY;
        }
        // se é laser ou tiro normal
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb
        else {
            t.y -= t.velocidade;
        }

<<<<<<< HEAD
        // colisão com inimigo
        if (inimigo && rectsOverlap(t.x, t.y, t.largura, t.altura, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura)) {
            // remove o tiro
            tiros.splice(i, 1);
            const morreu = inimigo.receberTiro();
            if (morreu) {
                // spawnar novo inimigo com vida fixa: o próximo inimigo terá +1 de vida
                inimigoLevel++;
                inimigo = new Inimigo(inimigoLevel);
                // interrompe o loop de verificação de tiros deste frame para evitar
                // que outros tiros remanescentes na mesma frame atinjam o novo inimigo
                break;
            }
            // se não morreu, apenas continue verificando outros tiros
            continue;
        }

        // remover se sair da tela
        if (t.y < -100 || t.y > 1000) tiros.splice(i, 1);
    }

    // Atualizar tiros inimigos
    for (let i = tirosInimigo.length - 1; i >= 0; i--) {
        let t = tirosInimigo[i];
        if (t.velX !== undefined && t.velY !== undefined) {
            t.x += t.velX;
            t.y -= t.velY;
        } else {
            t.y += (t.velocidade || 3);
        }

        // colisão com jogador (usar hitbox reduzida)
        const hb = (typeof jogador.getHitbox === 'function') ? jogador.getHitbox() : { x: jogador.x, y: jogador.y, largura: jogador.largura, altura: jogador.altura };
        if (rectsOverlap(t.x, t.y, t.largura, t.altura, hb.x, hb.y, hb.largura, hb.altura)) {
            // jogador atingido: fim de jogo
            gameOver = true;
            tirosInimigo.splice(i, 1);
            break;
        }

        // remover se fora da tela
        if (t.y < -200 || t.y > 1200 || t.x < -200 || t.x > 900) tirosInimigo.splice(i, 1);
=======
        // remover se sair da tela
        if (t.y < -100) tiros.splice(i, 1);
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb
    }
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // jogador
    jogador.desenhar(ctx);

    // tiros
    tiros.forEach(t => desenharTiro(ctx, t));
<<<<<<< HEAD

    // desenhar inimigo
    if (inimigo) inimigo.desenhar(ctx);

    // desenhar tiros inimigos
    tirosInimigo.forEach(t => desenharTiro(ctx, t));

    // se fim de jogo
    if (gameOver) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "48px sans-serif";
        ctx.fillText("Game Over", 200, 400);
        ctx.restore();
    }
=======
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb
}

// loop principal

function loop() {
<<<<<<< HEAD
    frame++;
    atualizar();
    desenhar();
    if (!gameOver) requestAnimationFrame(loop);
=======
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
>>>>>>> 0f28ba609719570195cfef2c2217cd1737059dbb
}

loop();
