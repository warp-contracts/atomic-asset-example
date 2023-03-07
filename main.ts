import { AtomicAssetContractImpl, AtomicAssetState } from "atomic-asset-js-bindings";
import { Warp, WarpFactory } from "warp-contracts";
import { ArweaveSigner, DeployPlugin } from 'warp-contracts-plugin-deploy';
import { build } from 'esbuild';
import * as path from 'node:path';

const deployAtomicAsset = async (warp: Warp, data: { body: string, 'Content-Type': string }, wallet: ArweaveSigner) => {
    const bundledContractSrc = await build({
        entryPoints: [path.join(__dirname, 'contract.ts')],
        bundle: true,
        write: false,
        outfile: 'bundled.js'
    });

    const initState: AtomicAssetState = {
        symbol: "420",
        decimals: 8,
        totalSupply: 1,
        balances: {},
        allowances: {}
    }

    return await warp.deploy({
        wallet: wallet,
        initState: JSON.stringify(initState),
        src: bundledContractSrc.outputFiles[0].text,
        data
    })
}

(async () => {
    const warp = WarpFactory.forMainnet().use(new DeployPlugin());
    const wallet = await warp.generateWallet();

    const { contractTxId } = await deployAtomicAsset(warp, { "Content-Type": "text/html", "body": "<h1>Elo</h1>" }, new ArweaveSigner(wallet.jwk));

    const contract = new AtomicAssetContractImpl(contractTxId, warp);


    console.log(await contract.readState());
})();

