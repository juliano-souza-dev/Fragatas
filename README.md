# ⚓ Fragatas

Protótipo naval mobile-first em paisagem: oceano 3D com shader WebGL, navio controlável e sistema híbrido de LOD (3D próximo / sprite 2.5D distante).

## Executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Controles

Mobile: joystick virtual e botão de disparo demonstrativo. Desktop: WASD ou setas. Qualidade Padrão/Ultra no HUD.

## Arquitetura

- `src/world/Ocean.ts`: oceano procedural via GLSL.
- `src/ships/Ship.ts`: embarcação 3D provisória e movimentação.
- `src/ships/HybridFleet.ts`: troca 3D/sprite com histerese de distância.
- `src/main.ts`: ciclo de renderização, câmera, entrada e HUD.

Esta é a primeira etapa técnica. Sprites atuais são placeholders, sem atlas de múltiplos ângulos; disparo apenas mostra efeito visual, sem combate. Otimização e FPS devem ser validados em aparelhos reais.
