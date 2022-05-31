const axios = require("axios").default;
const ethers = require("ethers");

const ABI = [
    "function claim(uint256 index, address account, uint256 amount, bytes32[] merkleProof)"
]


const PRIVATE_KEY = ""

async function main() {
    const provider = new ethers.providers.StaticJsonRpcProvider("https://opt-mainnet.g.alchemy.com/v2/RhvZElGdXE-YPVQCx5EzJ2_YDd9lABsG");
    
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const address = await wallet.getAddress();

    const claim = await axios.get(`https://gateway-backend-mainnet.optimism.io/proof/${address}`);
    const {index, amount, proof} = claim.data;

    const contract = new ethers.Contract("0xfedfaf1a10335448b7fa0268f56d2b44dbd357de", ABI, wallet);
    const transaction = await contract.claim(index, address, amount, proof);
    
    console.log(`Submitted transaction - https://optimistic.etherscan.io/tx/${transaction.hash}`);

    await transaction.wait();

    console.log("Claimed Optmisim airdrop");
}

main();