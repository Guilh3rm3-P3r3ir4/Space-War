export class Arma {
    constructor(tipo) {
        this.tipo = tipo;
        this.cooldown = 0;
        this.cooldownMax = 10;
    }

    disparar(x, y) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return [];
        }

        this.cooldown = this.cooldownMax;

        switch (this.tipo) {

            // 1 — tiro simples
            case "simples":
                return [{
                    x: x - 2,
                    y, largura: 4, altura: 10,
                    velocidade: 7,
                    tipoVisual: ".tiro-simples"
                }];

            // 2 — tiro simples mais rápido
            case "simples_rapida":
                return [{
                    x: x - 2,
                    y, largura: 4, altura: 10,
                    velocidade: 12,
                    tipoVisual: ".tiro-rapido"
                }];

            // 3 — dois tiros paralelos
            case "dupla_frente":
                return [
                    { x: x - 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" },
                    { x: x + 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" }
                ];

            // 4 — dupla mais rápida
            case "dupla_rapida":
                return [
                    { x: x - 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" },
                    { x: x + 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" }
                ];

            // 5 — dois tiros diagonais
            case "diagonal_dupla":
                return [
                    { x, y, largura: 5, altura: 5, velX: -4, velY: 8, tipoVisual: ".tiro-diagonal" },
                    { x, y, largura: 5, altura: 5, velX: 4, velY: 8, tipoVisual: ".tiro-diagonal" }
                ];

            // 6 — três tiros
            case "tripla_frente":
                return [
                    { x: x - 2, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: -3, velY: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: 3, velY: 9, tipoVisual: ".tiro-triplo" }
                ];

            // 7 — espalhamento 5
            case "espalhamento_5":
                return [
                    { x, y, largura: 4, altura: 10, velX: 0, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -4, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 4, velY: 10, tipoVisual: ".tiro-esp5" },
                ];

            // 8 — espalhamento 7
            case "espalhamento_7":
                const tiros = [];
                for (let angulo = -3; angulo <= 3; angulo++) {
                    tiros.push({
                        x,
                        y,
                        largura: 4,
                        altura: 10,
                        velX: angulo * 2,
                        velY: 10,
                        tipoVisual: ".tiro-esp7"
                    });
                }
                return tiros;

            // 9 — rajada
            case "rajada":
                this.cooldownMax = 5;
                return [
                    { x: x - 2, y, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" },
                    { x: x - 2, y: y + 5, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" },
                    { x: x - 2, y: y + 10, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" },
                ];

            // 10 — onda
            case "onda":
                return [{
                    x,
                    y,
                    largura: 8,
                    altura: 8,
                    ondaFrame: 0,
                    velocidade: 10,
                    tipoEspecial: "onda",
                    tipoVisual: ".tiro-onda"
                }];

            // 11 — laser fino
            case "laser_fino":
                this.cooldownMax = 2;
                return [{
                    x: x - 1,
                    y,
                    largura: 2,
                    altura: 40,
                    velocidade: 20,
                    tipoVisual: ".tiro-laser-fino"
                }];

            // 12 — laser grosso
            case "laser_grosso":
                this.cooldownMax = 20;
                return [{
                    x: x - 5,
                    y,
                    largura: 10,
                    altura: 80,
                    velocidade: 20,
                    tipoVisual: ".tiro-laser-grosso"
                }];

            default:
                return [];
        }
    }
}
