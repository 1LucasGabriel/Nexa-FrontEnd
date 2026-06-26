# Nexa 🚀

<p align="center">
  <img src="public/images/logo-white.png" alt="Nexa Logo" width="200" style="background-color: #1a1a1a; padding: 10px; border-radius: 8px;" />
</p>

A **Nexa** é uma plataforma corporativa interna desenvolvida para otimizar e centralizar o **gerenciamento logístico de equipes, frotas de veículos e alojamentos**. Projetada especialmente para empresas com operações distribuídas em múltiplas cidades ou países (como uma operação baseada na Bélgica com filiais e canteiros de obras transfronteiriços), a Nexa assegura controle, rastreabilidade, planejamento inteligente e eficiência operacional no dia a dia.

---

## 📌 Objetivo do Projeto

O principal objetivo da Nexa é solucionar a complexidade de coordenar recursos humanos e físicos em operações geograficamente descentralizadas. A plataforma visa:

* 🎯 **Centralizar as informações**: Evitar a dispersão de dados em planilhas ou sistemas isolados.
* 🚗 **Otimizar o uso de frotas**: Controlar quem está com qual veículo, prevenindo conflitos de reservas e acompanhando o status de manutenção/utilização dos ativos.
* 🏢 **Gerenciar alojamentos de forma eficiente**: Garantir que as equipes tenham hospedagem reservada de forma organizada e rastreável, evitando overbooking ou leitos ociosos.
* 📍 **Controlar movimentações de equipes**: Facilitar o acompanhamento de viagens, transferências e alocações temporárias entre diferentes bases ou regiões operacionais.

---

## ✨ Funcionalidades Principais

O sistema é estruturado em módulos específicos que cobrem as principais necessidades do fluxo de gerenciamento:

* **📊 Dashboard Operacional**: Painel analítico geral com indicadores de uso de veículos, ocupação de alojamentos, mapas dinâmicos e alertas em tempo real.
* **👥 Gestão de Funcionários**: Cadastro completo e administração de colaboradores operacionais e administrativos.
* **🚗 Gestão de Frotas**: Cadastro, controle de status (disponível, em uso, manutenção) e histórico de uso dos veículos.
* **🏢 Gerenciamento de Alojamentos**: Cadastro de locais de hospedagem, quantidade de quartos/leitos e mapeamento geográfico.
* **🔑 Alocação de Veículos**: Módulo para designar qual colaborador está responsável por determinado veículo durante um período específico.
* **🏠 Alocação de Alojamentos**: Vinculação de funcionários às vagas disponíveis nos alojamentos cadastrados.
* **📍 Controle de Movimentações**: Registro estruturado de saídas e chegadas de colaboradores entre bases geográficas operacionais.
* **⚙️ Configurações**: Ajustes de parâmetros globais e configurações do sistema.

---

## 🛠️ Tecnologias Utilizadas

A Nexa foi construída utilizando o que há de mais moderno e robusto no ecossistema web para desenvolvimento de SPAs (Single Page Applications):

* **[Angular v20](https://angular.dev/)**: Framework principal do frontend, estruturado com componentes independentes (*standalone*) e reatividade de alta performance.
* **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança, legibilidade e facilidade de refatoração do código.
* **[PrimeNG v20](https://primeng.org/)**: Biblioteca de componentes ricos de UI, garantindo design consistente, responsividade e componentes modernos prontos para uso.
* **[PrimeIcons](https://primeng.org/icons)**: Conjunto de ícones vetoriais modernos integrados ao tema do sistema.
* **[Leaflet](https://leafletjs.com/)**: Biblioteca open-source leve para mapas interativos, permitindo a visualização espacial de alojamentos, rotas e frotas.
* **[SCSS / Sass](https://sass-lang.com/)**: Pré-processador de estilos para modularização, variáveis e organização CSS avançada.
* **[RxJS](https://rxjs.dev/)**: Gerenciamento de fluxos de dados assíncronos e programação reativa baseada em Observables.

---

## ⚙️ Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter instalado em sua máquina:

1. **[Node.js](https://nodejs.org/)** (Versão 18.20+, 20.10+ ou 22.x recomendada)
2. **[npm](https://www.npmjs.com/)** (normalmente vem com a instalação do Node.js)
3. **[Angular CLI](https://angular.dev/tools/cli)** (instalável globalmente via `npm install -g @angular/cli`, ou utilizável via scripts locais)

---

## 🚀 Como Baixar e Executar o Projeto

Siga o passo a passo abaixo para rodar a aplicação em seu ambiente local:

### 1. Clonar o Repositório

Execute o comando abaixo no terminal da sua máquina:

```bash
git clone https://github.com/1LucasGabriel/Nexa-FrontEnd.git
cd Nexa-FrontEnd
```

### 2. Instalar as Dependências

Instale todos os pacotes necessários especificados no arquivo `package.json`:

```bash
npm install
```

### 3. Rodar o Servidor de Desenvolvimento

Inicie o servidor local do Angular:

```bash
npm start
```
ou utilizando o Angular CLI diretamente:
```bash
ng serve
```

### 4. Acessar a Aplicação

Após o terminal indicar que a compilação foi concluída com sucesso, abra o navegador e acesse:

```text
http://localhost:4200
```

*O servidor suporta Hot Module Replacement (HMR), recarregando a página automaticamente sempre que você fizer alterações no código fonte.*

---

## 📦 Build para Produção

Para gerar os arquivos estáticos compilados, otimizados e prontos para distribuição em produção:

```bash
npm run build
```
ou:
```bash
ng build
```

Os arquivos gerados serão salvos no diretório `dist/nexa-front-end/`.

---

## 📂 Estrutura de Pastas Principal

```text
Nexa-FrontEnd/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes compartilhados e reutilizáveis
│   │   ├── dtos/               # Objetos de Transferência de Dados (Data Transfer Objects)
│   │   ├── enums/              # Enumerações de tipos e status do sistema
│   │   ├── interceptors/       # Interceptadores HTTP (ex: token de autenticação)
│   │   ├── models/             # Classes, interfaces e modelos de dados
│   │   ├── pages/              # Telas principais associadas às rotas
│   │   ├── services/           # Regras de negócio e consumo de endpoints da API
│   │   ├── app.routes.ts       # Definição e títulos das rotas do projeto
│   │   └── app.ts / app.html   # Componente raiz do projeto
│   ├── assets/                 # Recursos e arquivos estáticos compilados
│   └── index.html              # HTML base da aplicação
├── public/                     # Arquivos estáticos servidos diretamente (logo-white.png, background-geral.png, etc)
├── angular.json                # Configuração global do Angular CLI
└── package.json                # Dependências do projeto e scripts de execução
```

