# 🤠 Cowboy Duelos - Jogo 2D Canvas

Jogo de duelo de cowboys desenvolvido em HTML5 Canvas, JavaScript e CSS para a disciplina de Programação Web.

## 📋 Sobre o Projeto

**Tema:** 23 - Cowboy Duelos  
**Dupla:** [Seu Nome] - [Nome do Parceiro]  
**LLMs Utilizadas:** Claude (Anthropic)

## 🎮 Como Jogar

### Controles
- **A / Seta Esquerda:** Mover para esquerda
- **D / Seta Direita:** Mover para direita
- **ESPAÇO:** Atirar

### Objetivo
Sobreviva às ondas de bandidos pelo maior tempo possível. Cada bandido derrotado vale 100 pontos. Você perde 10 pontos de vida a cada tiro inimigo. O jogo termina quando sua vida chega a zero.

## 🛠️ Recursos Técnicos Implementados

### ✅ Requisitos Obrigatórios (5/7)

1. **🎞️ Loop de Animação**
   - Implementação com `requestAnimationFrame`
   - Separação clara entre `update()` (lógica) e `draw()` (renderização)
   - Taxa de quadros consistente (~60 FPS)

2. **🎮 Eventos de Teclado**
   - Sistema de input responsivo com objeto `keys`
   - Suporte para WASD e teclas de seta
   - Controle de disparo com prevenção de spam

3. **🌄 Paralaxe**
   - 3 camadas de profundidade:
     - Camada 1: Montanhas distantes (velocidade 0.2x)
     - Camada 2: Montanhas médias (velocidade 0.5x)
     - Camada 3: Cactos e elementos próximos (velocidade 1x)
   - Sistema de repetição infinita (wrapping)

4. **💥 Detecção de Colisão**
   - Algoritmo AABB (Axis-Aligned Bounding Box)
   - Colisões implementadas:
     - Balas do jogador vs Inimigos
     - Balas dos inimigos vs Jogador
   - Feedback visual de impacto

5. **🧩 Spritesheet / Animação**
   - Sistema de frames para animação do personagem
   - Controle de velocidade com `frameTimer` e `frameDelay`
   - Animação de caminhada com movimento de pernas

### ✅ Recursos Extras Implementados

6. **✂️ Clipping / Renderização por Quadros**
   - Renderização otimizada de sub-regiões
   - Sistema de frames independente
   - Animações suaves

7. **🔫 Disparo / Projéteis**
   - Sistema completo de balas do jogador e inimigos
   - Criação dinâmica de projéteis
   - Remoção automática quando fora da tela
   - Pool de objetos para otimização

## 🎨 Características Adicionais

- **Sistema de Ondas:** Dificuldade progressiva
- **Sistema de Partículas:** Efeitos visuais de impacto
- **HUD Informativo:** Pontuação, vida e munição
- **Sistema de Game Over:** Reinício do jogo
- **IA dos Inimigos:** Movimento lateral e disparo automático
- **Feedback Visual:** Flash de dano e efeitos de colisão

## 📁 Estrutura do Projeto

```
cowboy-duelos/
├── index.html          # Estrutura HTML do jogo
├── style.css           # Estilos e layout
├── main.js             # Lógica principal do jogo
└── README.md           # Este arquivo
```

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
```

2. Abra o arquivo `index.html` em um navegador moderno

3. Use as teclas WASD ou setas para mover e ESPAÇO para atirar

## 📊 Organização do Código

### main.js - Estrutura

```javascript
// 1. Configuração Inicial
// 2. Sistema de Paralaxe
// 3. Entidades do Jogo
// 4. Sistema de Animação
// 5. Sistema de Inimigos
// 6. Sistema de Disparo
// 7. Detecção de Colisão (AABB)
// 8. Sistema de Partículas
// 9. Sistema de Ondas
// 10. Renderização
// 11. Update e Draw
// 12. Loop Principal (requestAnimationFrame)
// 13. Eventos de Teclado
// 14. Game Over e Restart
// 15. Inicialização
```

## 🤖 Prompts Utilizados

### Prompt Inicial
```
com o tema 23
```

Contexto: Foi fornecido o documento completo da atividade com todas as especificações técnicas.

### Resultado
A LLM Claude gerou todo o código base do jogo implementando todos os 7 recursos técnicos exigidos, com código limpo, comentado e organizado.

## 🎯 Créditos e Assets

- **Código:** Desenvolvido com auxílio de Claude (Anthropic)
- **Arte:** Gráficos procedurais gerados por código (sem sprites externos)
- **Tema:** Cowboy Duelos - inspirado no Velho Oeste

## 📝 Notas Técnicas

### Otimizações Implementadas
- Arrays de entidades gerenciados com splice reverso
- Culling de objetos fora da tela
- Reutilização de objetos (bullet pool preparado)
- Separação clara entre lógica e render

### Boas Práticas Aplicadas
- Código comentado e organizado por seções
- Nomenclatura clara e consistente
- Separação de responsabilidades (MVC-like)
- Event listeners otimizados
- Evita criação de objetos dentro do loop principal

## 🐛 Debugging e Melhorias Futuras

### Possíveis Melhorias
- [ ] Adicionar sons (tiros, explosões, música de fundo)
- [ ] Implementar power-ups (vida extra, disparo múltiplo)
- [ ] Sistema de ranking (localStorage)
- [ ] Sprites reais em vez de formas geométricas
- [ ] Mais tipos de inimigos
- [ ] Boss fights a cada 5 ondas
- [ ] Efeitos de partículas mais elaborados
- [ ] Animações de morte dos personagens

## 📸 Screenshots

_[Adicionar screenshots do jogo funcionando]_

## 📹 Demonstração

_[Adicionar link para GIF ou vídeo curto do gameplay]_

## 🎓 Aprendizados

### Desenvolvimento com LLM
- A Claude gerou código limpo e bem estruturado de primeira
- Todos os recursos técnicos foram implementados corretamente
- O código segue boas práticas de JavaScript moderno
- A documentação inline facilita manutenção

### Conceitos Aplicados
- Física básica de movimento e colisão
- Sistema de game states
- Loop de jogo profissional
- Gerenciamento de memória em jogos
- Programação orientada a objetos (classe Enemy)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Programação Web.

## 👥 Autores

- **[Seu Nome]** - Desenvolvimento com Claude LLM
- **[Nome do Parceiro]** - Testes e validação

---

**Disciplina:** Programação Web  
**Professor:** [Nome do Professor]  
**Data de Entrega:** 08/10/2025