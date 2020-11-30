![logo](/assets/logo-nearswap.png)


## Web interface for NEARswap smart-contract.

NEARswap is part of [NEAR-CLP](https://github.com/near-clp/contracts) - a set of protocols for decentralized finance. With a ground research and solid experience in smart-contract development we define our mission to provide common goods for NEAR DeFi.


## Quick Start


To run this project locally:

1. Prerequisites: Make sure you've installed Node.js ≥ 14 and Yarn >= 1.22
2. Install dependencies: `yarn install`
3. Run the local development server: `yarn start` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)

Now you'll have a local development environment backed by the NEAR TestNet!

Go ahead and play with the app and the code. As you make code changes, the app will automatically reload.


## Develop

Every smart contract in NEAR has its [own associated account][NEAR accounts]. When you run `yarn start`, your smart contract gets deployed to the live NEAR TestNet with a throwaway account. When you're ready to make it permanent, here's how.


### Step 0: Install near-cli (optional)


[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `yarn install`, but for best ergonomics you may want to install it globally:

    yarn install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


### Step 1: Create an account for the contract

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `nearswap-interface.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `nearswap-interface.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account nearswap-interface.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet


### Step 2: set contract name in code


Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'nearswap-interface.YOUR-NAME.testnet'


### Step 3: deploy!

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.


LICENSE
==========

We create foundations for DeFi, hence an open access is the key.

We build the Open Source software and knowledge base. All our work is licensed with a Mozilla Public License (MPL) version 2.0. Refer to [LICENSE](LICENSE) for terms.

The MPL is a simple copyleft license. The MPL's "file-level" copyleft is designed to encourage contributors to share modifications they make to your code, while still allowing them to combine your code with code under other licenses (open or proprietary) with minimal restrictions.

[Authors](https://github.com/robert-zaremba/near-clp/graphs/contributors)
