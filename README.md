<br>
<p align="center">
    <img src="https://github.com/Mugen-Builders/.github/assets/153661799/7ed08d4c-89f4-4bde-a635-0b332affbd5d" align="center" width="20%">
</p>
<br>
<div align="center">
    <i>EVM Linux Coprocessor as an AI Agent</i>
</div>
<div align="center">
<b>Cartesi Coprocessor AI Agent powered by EigenLayer cryptoeconomic security</b>
</div>
<br>
<p align="center">
	<img src="https://img.shields.io/github/license/Mugen-Builders/coprocessor-llama-agent?style=default&logo=opensourceinitiative&logoColor=white&color=79F7FA" alt="license">
	<img src="https://img.shields.io/github/last-commit/Mugen-Builders/coprocessor-llama-agent?style=default&logo=git&logoColor=white&color=868380" alt="last-commit">
</p>

##  Table of Contents

- [Prerequisites](#prerequisites)
- [Running](#running)
- [Demo](#demo)

###  Prerequisites

1. [Install Docker Desktop for your operating system](https://www.docker.com/products/docker-desktop/).

    To install Docker RISC-V support without using Docker Desktop, run the following command:
    
   ```shell
    docker run --privileged --rm tonistiigi/binfmt --install all
   ```

2. [Download and install the latest version of Node.js](https://nodejs.org/en/download)

3. Cartesi CLI is an easy-to-use tool to build and deploy your dApps. To install it, run:

   ```shell
   npm i -g @cartesi/cli
   ```

4. [Install the Cartesi Coprocessor CLI](https://docs.mugen.builders/cartesi-co-processor-tutorial/installation)

###  Running

1. Start the devnet coprocessor infrastructure + Llama.cpp server:

> [!CAUTION]
> In the devnet environment, this project was only tested on Linux x86-64, MacOS users may encounter issues.

```bash
git clone https://github.com/zippiehq/cartesi-coprocessor
cd cartesi-coprocessor
docker compose -f docker-compose-devnet.yaml --profile llm up --build
```

2. Build and Publish the application:

```sh
cd coprocessor
cartesi-coprocessor publish --network devnet
```

3. Deploy the `LlamaAgent.sol` contract:

> [!WARNING]
> 
> Before deploy the contract, create a `.env` file like this
> ```bash
> RPC_URL=http://localhost:8545
> PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
> MACHINE_HASH=""
> TASK_ISSUER_ADDRESS=""
> ```
> 
> - You can see the machine hash running `cartesi hash` in the folder `/coprocessor`;
> - You can see the task issuer address for the devnet enviroment running `cartesi-coprocessor address-book`;
   
```sh
cd contracts
make agent
```

4. Run the frontend:

> [!WARNING]
> Before run the frontend, please update the `.env.local` file with the LlamaAgent address deployed:
> ```bash
> NEXT_PUBLIC_PROJECT_ID="e47c5026ed6cf8c2b219df99a94f60f4"
> NEXT_PUBLIC_COPROCESSOR_ADAPTER=""
> ```

```sh
cd frontend
npm run dev
```

> [!NOTE]
> Although this README provides instructions for the devnet environment, this application can be deployed on testnet and hosted on an infrastructure provided for the Experimental Week, which even has a Llama.cpp server available for communication via GIO. Follow the intructions provided [here](https://docs.mugen.builders/cartesi-co-processor-tutorial/deploy).

### Demo
