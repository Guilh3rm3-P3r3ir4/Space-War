import { Jogador } from "./jogador.js";
import { Arma } from "./arma.js";
import { Inimigo } from "./inimigo.js";

// Variaveis do jogo
const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");

const jogador = new Jogador();
const tiros = [];
const tirosInimigo = [];
let inimigo = new Inimigo(1);
let inimigoLevel = 1;

let gameOver = false;
let gameWin = false;

let frame = 0;

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function desenharTiro(ctx, tiro) {
    ctx.save();

    // tiro inimigo com sprite
    if (tiro.tipo === 'tiro-inimigo') {
        if (window.__tiroInimigoImg === undefined) {
            window.__tiroInimigoImg = new Image();
            window.__tiroInimigoImg.src = './imagens/tiro.png';
        }
        const img = window.__tiroInimigoImg;
        if (img && img.complete && img.naturalWidth > 0) {
            const w = tiro.largura || 10;
            const h = tiro.altura || 10;
            ctx.drawImage(img, tiro.x - w / 2, tiro.y - h / 2, w, h);
            ctx.restore();
            return;
        }
        // fallback pequeno ponto
        ctx.fillStyle = 'orange';
        ctx.fillRect(tiro.x - 3, tiro.y - 3, 6, 6);
        ctx.restore();
        return;
    }

    // ----- efeitos por tipo -----
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

    if (tiro.tipoEspecial === "onda") {
        ctx.fillStyle = "cyan";
        const deslocamento = Math.sin(tiro.ondaFrame / 5) * 10;
        ctx.fillRect(tiro.x + deslocamento, tiro.y, tiro.largura, tiro.altura);
        tiro.ondaFrame++;
        ctx.restore();
        return;
    }

    if (tiro.altura >= 40 && tiro.largura <= 3) {
        const grad = ctx.createLinearGradient(tiro.x, tiro.y, tiro.x, tiro.y + tiro.altura);
        grad.addColorStop(0, "white");
        grad.addColorStop(1, "cyan");
        ctx.fillStyle = grad;
        ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
        ctx.restore();
        return;
    }

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

    ctx.fillStyle = "white";
    ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura);
    ctx.restore();
}

function atualizar() {
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
        } else {
            t.y -= t.velocidade;
        }

        // colisão com inimigo
        if (inimigo && rectsOverlap(t.x, t.y, t.largura, t.altura, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura)) {
            tiros.splice(i, 1);
            const morreu = inimigo.receberTiro();
            if (morreu) {
                // se era a última fase (10), jogador vence
                if (inimigoLevel >= 10) {
                    gameOver = true;
                    gameWin = true;
                    inimigo = null;
                } else {
                    inimigoLevel++;
                    inimigo = new Inimigo(inimigoLevel);
                }
                break;
            }
            continue;
        }

        // remover se sair da tela
        if (t.y < -100 || t.y > canvas.height + 200) tiros.splice(i, 1);
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

        // colisão com jogador (fallback se getHitbox não existir)
        const hb = (typeof jogador.getHitbox === 'function') ? jogador.getHitbox() : { x: jogador.x, y: jogador.y, largura: jogador.largura, altura: jogador.altura };
        if (rectsOverlap(t.x, t.y, t.largura, t.altura, hb.x, hb.y, hb.largura, hb.altura)) {
            gameOver = true;
            tirosInimigo.splice(i, 1);
            break;
        }

        if (t.y < -200 || t.y > canvas.height + 400 || t.x < -200 || t.x > canvas.width + 200) tirosInimigo.splice(i, 1);
    }

    frame++;
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    jogador.desenhar(ctx);

    tiros.forEach(t => desenharTiro(ctx, t));

    if (inimigo) inimigo.desenhar(ctx);

    tirosInimigo.forEach(t => desenharTiro(ctx, t));

    if (gameOver) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "48px sans-serif";
        if (gameWin) {
            ctx.fillText("Você venceu!", Math.floor(canvas.width / 2 - 140), Math.floor(canvas.height / 2));
        } else {
            ctx.fillText("Game Over", Math.floor(canvas.width / 2 - 120), Math.floor(canvas.height / 2));
        }
        ctx.restore();
    }
}

function loop() {
    if (!gameOver) requestAnimationFrame(loop);
    atualizar();
    desenhar();
}

loop();
