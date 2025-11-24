export class Arma {
    constructor(tipo) {
        this.tipo = tipo;
        this.cooldown = 0;

        // Define cooldown base para cada tipo
        switch (tipo) {
            case "simples": this.cooldownMax = 10; break;
            case "simples_rapida": this.cooldownMax = 8; break;
            case "dupla_frente": this.cooldownMax = 10; break;
            case "dupla_rapida": this.cooldownMax = 6; break;
            case "diagonal_dupla": this.cooldownMax = 10; break;
            case "tripla_frente": this.cooldownMax = 9; break;
            case "espalhamento_5": this.cooldownMax = 10; break;
            case "espalhamento_7": this.cooldownMax = 10; break;
            case "rajada": this.cooldownMax = 5; break;
            case "onda": this.cooldownMax = 10; break;
            case "laser_fino": this.cooldownMax = 2; break;
            case "laser_grosso": this.cooldownMax = 20; break;
            default: this.cooldownMax = 10;
        }
    }

    disparar(x, y) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return [];
        }

        this.cooldown = this.cooldownMax;

        switch (this.tipo) {
            case "simples":
                return [{ x: x - 2, y, largura: 4, altura: 10, velocidade: 7, tipoVisual: ".tiro-simples" }];
            case "simples_rapida":
                return [{ x: x - 2, y, largura: 4, altura: 10, velocidade: 12, tipoVisual: ".tiro-rapido" }];
            case "dupla_frente":
                return [
                    { x: x - 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" },
                    { x: x + 10, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-duplo" }
                ];
            case "dupla_rapida":
                return [
                    { x: x - 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" },
                    { x: x + 12, y, largura: 4, altura: 10, velocidade: 13, tipoVisual: ".tiro-duplo-rapido" }
                ];
            case "diagonal_dupla":
                return [
                    { x, y, largura: 5, altura: 5, velX: -4, velY: 8, tipoVisual: ".tiro-diagonal" },
                    { x, y, largura: 5, altura: 5, velX: 4, velY: 8, tipoVisual: ".tiro-diagonal" }
                ];
            case "tripla_frente":
                return [
                    { x: x - 2, y, largura: 4, altura: 10, velocidade: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: -3, velY: 9, tipoVisual: ".tiro-triplo" },
                    { x, y, largura: 5, altura: 5, velX: 3, velY: 9, tipoVisual: ".tiro-triplo" }
                ];
            case "espalhamento_5":
                return [
                    { x, y, largura: 4, altura: 10, velX: 0, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 2, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: -4, velY: 10, tipoVisual: ".tiro-esp5" },
                    { x, y, largura: 4, altura: 10, velX: 4, velY: 10, tipoVisual: ".tiro-esp5" }
                ];
            case "espalhamento_7":
                const tiros = [];
                for (let angulo = -3; angulo <= 3; angulo++) {
                    tiros.push({ x, y, largura: 4, altura: 10, velX: angulo * 2, velY: 10, tipoVisual: ".tiro-esp7" });
                }
                return tiros;
            case "rajada":
                return [
                    { x: x - 2, y, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" },
                    { x: x - 2, y: y + 5, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" },
                    { x: x - 2, y: y + 10, largura: 4, altura: 10, velocidade: 14, tipoVisual: ".tiro-rajada" }
                ];
            case "onda":
                return [{ x, y, largura: 8, altura: 8, ondaFrame: 0, velocidade: 10, tipoEspecial: "onda", tipoVisual: ".tiro-onda" }];
            case "laser_fino":
                return [{ x: x - 1, y, largura: 2, altura: 40, velocidade: 20, tipoVisual: ".tiro-laser-fino" }];
            case "laser_grosso":
                return [{ x: x - 5, y, largura: 10, altura: 80, velocidade: 20, tipoVisual: ".tiro-laser-grosso" }];
            default:
                return [];
        }
    }
}
