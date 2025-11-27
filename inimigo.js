export class Inimigo {
    constructor(level = 1) {
        this.level = level;

        this.largura = 90;
        this.altura = 90;

        // imagem do inimigo por nível: nave1..nave9, e naveinimiga no nível 10
        this.imagem = new Image();
        if (this.level >= 1 && this.level <= 9) {
            this.imagem.src = `./imagens/nave${this.level}.png`;
        } else {
            this.imagem.src = "./imagens/naveinimiga.png";
        }

        // posição inicial (topo, x aleatório)
        this.x = Math.random() * (600 - this.largura);
        this.y = 30 + Math.random() * 40;


        // movimento base — aumenta levemente a cada nível (inimigo fica mais ágil)
        this.moveAmplitudeX = 80; // amplitude do movimento horizontal
        this.moveSpeed = 1 + (level - 1) * 0.15;
        this.moveSpeedY = 0.25 + (level - 1) * 0.05;

        // tiro
        this.shootCooldown = 0;
        // cooldown menor => ataca mais rápido conforme o nível aumenta
        this.shootCooldownMax = Math.max(10, 60 - (level - 1) * 5);

        // vida em 'número de tiros do jogador' necessários
        // agora começa em 3 no nível 1 e aumenta 1 por nível (level 1 -> 3, level 2 -> 4, ...)
        this.shotsToDie = level + 2;
        this.shotsReceived = 0;

        // estado para animação
        this.spawnFrame = 0;
    }

    atualizar(frame, jogador, listaTirosInimigo) {
        // movimento horizontal senoidal + descida lenta
        this.x += Math.sin((frame + this.spawnFrame) / 40) * this.moveSpeed;
       // this.y += this.moveSpeedY;

        // manter dentro da tela
        if (this.x < 0) this.x = 0;
        if (this.x + this.largura > 600) this.x = 600 - this.largura;

        // atirar aleatoriamente em direção ao jogador
        if (this.shootCooldown > 0) this.shootCooldown--;
        else {
            // chance de atirar a cada frame (pequena) — porém garantimos ao menos um tiro quando cooldown acabar
            if (Math.random() < 0.6) {
                const tiros = this.dispararEmDirecaoDoJogador(jogador);
                listaTirosInimigo.push(...tiros);
                this.shootCooldown = this.shootCooldownMax;
            } else {
                // espera um pouco mais
                this.shootCooldown = Math.floor(this.shootCooldownMax / 3);
            }
        }
    }

    dispararEmDirecaoDoJogador(jogador) {
        const cx = this.x + this.largura / 2;
        const cy = this.y + this.altura / 2;
        const tx = jogador.x + jogador.largura / 2;
        const ty = jogador.y + jogador.altura / 2;

        const dx = tx - cx;
        const dy = ty - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // velocidade do projétil aumenta levemente com o nível
        const baseSpeed = 2 + (this.level - 1) * 0.3;

        // O jogo existente trata tiros com {velX, velY} onde o código faz t.x += velX; t.y -= velY;
        // Para que o tiro vá na direção do jogador, calculamos velX normal e velY invertido.
        const vx = (dx / dist) * baseSpeed;
        const vy = -(dy / dist) * baseSpeed;

        return [{ x: cx, y: cy, largura: 12, altura: 12, velX: vx, velY: vy, tipo: 'tiro-inimigo' }];
    }

    receberTiro() {
        this.shotsReceived++;
        return this.shotsReceived >= this.shotsToDie;
    }

    desenhar(ctx) {
        ctx.save();

        // desenha imagem se carregada, senão fallback para retângulo
        if (this.imagem && this.imagem.complete && this.imagem.naturalWidth > 0) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        } else {
            ctx.fillStyle = "darkred";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }

        // mostrar vidas como ícones (imagem coracao) acima da nave
        const vidas = Math.max(0, this.shotsToDie - this.shotsReceived);
        const iconSize = 14;
        const spacing = 6;
        const totalWidth = vidas * iconSize + Math.max(0, vidas - 1) * spacing;
        const startX = this.x + this.largura / 2 - totalWidth / 2;
        const centerY = this.y - 12;

        if (window.__coracaoImg === undefined) {
            window.__coracaoImg = new Image();
            window.__coracaoImg.src = './imagens/coracao.png';
        }
        const heart = window.__coracaoImg;

        for (let i = 0; i < vidas; i++) {
            const sx = startX + i * (iconSize + spacing);
            if (heart && heart.complete && heart.naturalWidth > 0) {
                ctx.drawImage(heart, sx, centerY - iconSize / 2, iconSize, iconSize);
            } else {
                // fallback: círculo vermelho
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(sx + iconSize / 2, centerY, iconSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }
}
