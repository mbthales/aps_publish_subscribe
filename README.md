## Sistema de Monitoramento de Saúde
Este projeto é um sistema de monitoramento de saúde em tempo real, desenvolvido para acompanhar os sinais vitais de pacientes, como batimentos cardíacos, pressão arterial e níveis de oxigênio. 
O sistema utiliza `Flask` no backend para simular dados de pacientes e `React` no frontend para exibir esses dados em um dashboard interativo.

## Funcionalidades
- **Monitoramento em Tempo Real**: Exibe os sinais vitais dos pacientes (batimentos cardíacos, pressão arterial e oxigenação) em tempo real.
- **Priorização de Alertas**: Classifica os dados recebidos como de alta ou baixa prioridade, com base em limites pré-definidos.
- **Dashboard Interativo**: Gráficos e cards para visualização dos dados de forma clara e organizada.
- **Modal de Alerta**: Exibe um modal quando um paciente apresenta sinais vitais críticos.
- **Seleção de Pacientes**: Permite alternar entre diferentes pacientes para visualizar seus dados específicos.

## Como Executar o Projeto
### Pré-requisitos
- **Python 3.10+**: Para executar o backend.
- **Node.js 16+**: Para executar o frontend.
- **Git**: Para clonar o repositório.

### Passos para Execução
1. **Clone o repositório**:
```bash
git clone https://github.com/mbthales/aps_publish_subscribe.git
cd aps_publish_subscribe
```

2. **Configuração do Backend**:
  - Navegue até a pasta `backend`:
    ```bash
     cd backend
    ```
  - Instale as dependências:
    ```bash
     pip install -r requirements.txt
    ```
  - Execute o servidor Flask:
    ```bash
     python server.py
    ```
  - O backend estará rodando em `http://127.0.0.1:5000`.

3. **Configuração do Frontend**
  - Navegue até a pasta `frontend`:
    ```bash
     cd ..\frontend
    ```
  - Instale as dependências:
    ```bash
     npm install
    ```
  - Execute o servidor de desenvolvimento:
    ```bash
     npm run dev
    ```
  - O backend estará rodando em `http://localhost:3000`.

4. **Acesse o Sistema**:
  - Abra o navegador e acesse `http://localhost:3000`.
  - Selecione um paciente para visualizar seus sinais vitais em tempo real.


