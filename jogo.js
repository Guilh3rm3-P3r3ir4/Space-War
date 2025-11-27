import { Jogador } from "./jogador.js";
import { Arma } from "./arma.js";
import { Inimigo } from "./inimigo.js";


// imagem de fundo
const fundo = new Image();
fundo.src = "./imagens/fundo_game.png";

// música de fundo
const musicaFundo = new Audio("./audios/musica_fundo.mp3");
musicaFundo.loop = true;
musicaFundo.volume = 0.5;

let inimigosDerrotados = 0;
let nivelDaArma = 1;
const MAX_NIVEIS_ARMA = 7;

// Variaveis do jogo
const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");

let somLigado = true;

const imgSomLigado = new Image();
imgSomLigado.src = "./imagens/som_ligado.png";

const imgSomDesligado = new Image();
imgSomDesligado.src = "./imagens/som_desligado.png";

const botaoSom = { x: canvas.width - 60, y: 10, largura: 50, altura: 50 };
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (
        mx >= botaoSom.x && mx <= botaoSom.x + botaoSom.largura &&
        my >= botaoSom.y && my <= botaoSom.y + botaoSom.altura
    ) {
        somLigado = !somLigado;

        if (somLigado) {
            musicaFundo.play();
        } else {
            musicaFundo.pause();
        }
    }
});


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
                inimigosDerrotados++;

                // evolui arma a cada 3 inimigos
                if (inimigosDerrotados % 3 === 0) {
                    jogador.evoluirArma();
                }

                // fim do jogo após 30 inimigos
                if (inimigosDerrotados >= 30) {
                    gameOver = true;
                    gameWin = true;
                    inimigo = null;
                } else {
                    // calcula próximo nível de inimigo de 1 a 10 repetidamente
                    const proximoNivel = ((inimigosDerrotados - 1) % 10) + 1;
                    inimigo = new Inimigo(proximoNivel);
                }
                break; // sai do loop de tiros, pois o inimigo morreu
            }

            continue; // continua para o próximo tiro
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
            jogador.vida--;
            tirosInimigo.splice(i, 1);

            if (jogador.vida <= 0) {
                gameOver = true;
            }

        }

        if (t.y < -200 || t.y > canvas.height + 400 || t.x < -200 || t.x > canvas.width + 200) tirosInimigo.splice(i, 1);
    }

    frame++;
}

function desenhar() {
    // desenhar fundo
    ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);


    jogador.desenhar(ctx);
    jogador.desenharVidas(ctx);


    tiros.forEach(t => desenharTiro(ctx, t));

    if (inimigo) inimigo.desenhar(ctx);

    tirosInimigo.forEach(t => desenharTiro(ctx, t));

    // botão som
    const icon = somLigado ? imgSomLigado : imgSomDesligado;
    ctx.drawImage(icon, botaoSom.x, botaoSom.y, botaoSom.largura, botaoSom.altura);

    if (gameOver) {
        // Esconde o canvas do jogo
        canvas.style.display = "none";

        // Mostra a tela de Game Over
        const gameOverScreen = document.getElementById("gameover-screen");
        if (gameOverScreen) {
            gameOverScreen.style.display = "flex"; // assume que a div está com display: none por padrão
        }

        // Opcional: para quando o jogador venceu
        const titulo = document.getElementById("gameover-titulo");
        if (titulo) {
            if (gameWin) {
                titulo.textContent = "Você venceu!";
            } else {
                titulo.textContent = "Game Over";
            }
        }
    }


}

function loop() {
    if (!gameOver) requestAnimationFrame(loop);
    atualizar();
    desenhar();
}
musicaFundo.play();

// Função para reiniciar o jogo completamente
window.resetGame = function () {
    // Reset do jogador
    jogador.x = 300;
    jogador.y = 700;
    jogador.vida = 3;
    jogador.nivelArma = 1;
    jogador.arma = new Arma(jogador.tiposDeArma[jogador.nivelArma - 1]);

    // Reset do inimigo
    inimigoLevel = 1;
    inimigo = new Inimigo(inimigoLevel);

    // Limpar tiros
    tiros.length = 0;
    tirosInimigo.length = 0;

    // Reset das flags e frame
    gameOver = false;
    gameWin = false;
    frame = 0;
};

window.loop = loop;

loop();
