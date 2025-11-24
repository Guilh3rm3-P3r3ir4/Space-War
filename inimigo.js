export class Inimigo {
    constructor(level = 1) {
        this.level = level;

        this.largura = 90;
        this.altura = 90;

        // imagem do inimigo (se existir em imagens/naveinimiga.png)
        this.imagem = new Image();
        this.imagem.src = "./imagens/naveinimiga.png";

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

        // vida em 'número de tiros do jogador' necessários (1,2,3...)
        this.shotsToDie = level;
        this.shotsReceived = 0;

        // estado para animação
        this.spawnFrame = 0;
    }

    atualizar(frame, jogador, listaTirosInimigo) {
        // movimento horizontal senoidal + descida lenta
        this.x += Math.sin((frame + this.spawnFrame) / 40) * this.moveSpeed;
        this.y += this.moveSpeedY;

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
        const baseSpeed = 3 + (this.level - 1) * 0.3;

        // O jogo existente trata tiros com {velX, velY} onde o código faz t.x += velX; t.y -= velY;
        // Para que o tiro vá na direção do jogador, calculamos velX normal e velY invertido.
        const vx = (dx / dist) * baseSpeed;
        const vy = -(dy / dist) * baseSpeed;

        return [{ x: cx, y: cy, largura: 8, altura: 8, velX: vx, velY: vy, tipoVisual: ".tiro-inimigo" }];
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

        // mostrar nível do inimigo em vez de barra de vida
        ctx.fillStyle = "white";
        ctx.font = "18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Lv " + this.level, this.x + this.largura / 2, this.y - 10);

        ctx.restore();
    }
}
