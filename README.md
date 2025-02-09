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
	<img src="https://img.shields.io/github/license/henriquemarlon/coprocessor-llama-agent?style=default&logo=opensourceinitiative&logoColor=white&color=79F7FA" alt="license">
	<img src="https://img.shields.io/github/last-commit/henriquemarlon/coprocessor-llama-agent?style=default&logo=git&logoColor=white&color=868380" alt="last-commit">
</p>

> [!CAUTION]
> placeholder.

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

1. Start the devnet coprocessor infrastructure:

```bash
cartesi-coprocessor start-devnet
```

2. Build and Publish the application:

```sh
cd coprocessor
cartesi-coprocessor publish --network devnet
```

3. Deploy the `LlamaAgent.sol` contract:

> [!WARNING]
> placeholder.
   
```sh
cd contracts
make agent
```

4. Run the frontend:

> [!WARNING]
> placeholder.

```sh
cd frontend
npm run dev
```

> [!NOTE]
> placeholder.

### Demo
