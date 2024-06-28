const ethers = require('ethers');
const fs = require('fs');

async function getEtherscanUrl(provider, type, hash) {
    const network = await provider.getNetwork();
    const url = `https://${network.name}.etherscan.io`;

    if (network.name === 'sepolia') {
        return `https://sepolia.etherscan.io/${type}/${hash}`;
    } else {
        return `https://etherscan.io/${type}/${hash}`;
    }
}

function stringToHexUtf8(str) {
    return Array.from(new TextEncoder().encode(str))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function sendOnchainMessage(provider, wallet, message, address) {
    // 4 byte function selector is UUUU
    const selector = '0x55555555'
    

    // Construct a transaction.
    const tx = {
        from: wallet.address,
        to: address,
        data: selector + stringToHexUtf8("\n" + message)
    };

    // Get the network and make an etherscan url.
    // Log the transaction hash.
    const transactionResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction hash=${transactionResponse.hash} url=${await getEtherscanUrl(provider, 'tx', transactionResponse.hash)}`);

    // Wait for the transaction to be mined
    const receipt = await transactionResponse.wait();
    console.log(`Transaction was mined in block: blocknum=${receipt.blockNumber} url=${await getEtherscanUrl(provider, 'block', receipt.blockNumber)}`);

    return receipt;
}

async function main() {
    let PRIVATE_KEY = process.env.PRIVATE_KEY
    let NETWORK = process.env.NETWORK

    // Create a wallet using ethers.
    if (!PRIVATE_KEY) {
        const wallet = ethers.Wallet.createRandom();
        PRIVATE_KEY = wallet.privateKey;
    }

    if(!NETWORK) {
        NETWORK = 'sepolia';
    }

    console.log(`Connecting to network: ${NETWORK}`)
    const net = ethers.providers.getNetwork(NETWORK)
    if (!net) {
        console.log(`Network not found: ${NETWORK}`)
        return
    }

    const provider = ethers.getDefaultProvider(net);
    console.log(`Provider: ${provider}`)
    console.log()

    // Set wallet provider.
    const wallet = new (ethers.Wallet)(PRIVATE_KEY, provider);

    // Log the address and private key.
    console.log(`Address: ${wallet.address}`);
    console.log(`Private key: ${wallet.privateKey}`);

    console.log()

    // Load address list.
    let addys = (function(){
        if (NETWORK == 'sepolia') {
            // return [
            //     // ethers.constants.AddressZero,
            //     '0x55659dDEE6CB013c35301F6f3CC8482De857ea8E'
            // ]
            // Load from addys.txt.
            const data = fs.readFileSync('addys.txt', 'utf8')
            const list = data.split('\n').filter(x => x.length == 42)

            // Filter by addys we've already messaged.
            const msgdrop = fs.readFileSync('msgdrop.tsv', 'utf8')
            const msgdropList = msgdrop.split('\n').map(row => row.split('\t')).filter(cols => cols[1] == net.name).map(cols => cols[0])
            const included = list.filter(x => !msgdropList.includes(x))
            const ignored = list.filter(x => msgdropList.includes(x))

            // Addys to send to.
            return {
                list,
                included,
                ignored
            }

        } else {
            // Load from addys.txt.
            const data = fs.readFileSync('addys.txt', 'utf8')
            const list = data.split('\n').filter(x => x.length == 42)

            // Filter by addys we've already messaged.
            const msgdrop = fs.readFileSync('msgdrop.tsv', 'utf8')
            const msgdropList = msgdrop.split('\n').map(row => row.split('\t')).filter(cols => cols[1] == net.name).map(cols => cols[0])
            const included = list.filter(x => !msgdropList.includes(x))
            const ignored = list.filter(x => msgdropList.includes(x))

            // Addys to send to.
            return {
                list,
                included,
                ignored
            }
        }
    })()

    console.log(`Sending messages to ${addys.list.length} addresses`)
    for (let i = 0; i < addys.list.length; i++) {
        console.log(`#${i} -- Address: ${addys.list[i]} ${addys.ignored.includes(addys.list[i]) ? '(IGNORED)' : ''}`)
    }
    console.log()

    // Send a message.
    const message = `Gm sir, Lyra team here.

We just launched an invite only program for our new yield products. Your wallet is a similar profile to people who have deposited/appreciated the opportunity so we thought we'd reach out and see if you'd be interested. 

The strategies will boost your yield and allow you to capitalise on different types of market conditions.

If interested, please DM the Lyra Twitter account (https://x.com/lyrafinance) or email us (Team@Lyra.Finance). We'd love to jump on a call and run you through the private program to see if it's a fit for you.

Thanks!`
    console.log(addys.included)
    for (let i = 0; i < addys.included.length; i++) {
        const address = addys.included[i]
        console.log(`Sending message to address: ${address}`)
        const receipt = await sendOnchainMessage(provider, wallet, message, address.toLowerCase())
        
        // Append to TSV.
        const cols = [
            address,
            net.name,
            receipt.blockNumber,
            receipt.transactionHash,
            await getEtherscanUrl(provider, 'tx', receipt.transactionHash)
        ]
        const row = cols.join('\t')
        fs.appendFileSync('msgdrop.tsv', row + '\n')
    }

}

main().catch(err => {
    throw err
})