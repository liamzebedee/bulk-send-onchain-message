bulk-send-onchain-message
=========================

A small tool to bulk send on-chain messages to an EVM network from a list of accounts.

Onchain messages are sent with the data field containing UTF-8 text. To better grab attention, we encode the function selector as the ASCII-compatible "UUUU", which shows up as a not ordinary selector "0x55555555".

**Costs**: 0.1e to message ~1000 addresses, $0.36c/addy at eth price of $3450. Cheaper than Debank.

**Example tx**: [https://sepolia.etherscan.io/tx/0x06792dbfb5d1832681629d25cf425d8423e77492520bb6224ce96e85a93d09f8](https://sepolia.etherscan.io/tx/0x06792dbfb5d1832681629d25cf425d8423e77492520bb6224ce96e85a93d09f8)

## Run.

Put your addresses into addys.txt in the root project directory. `addys.txt` example:

```txt
0xe27f08a01a3b1380866919ff768dfcf8cd7f3488
0xc4b3bc88fd167937ace0f1442a7d0c9f0c985af6
0x4b4c085f6ad6396ee4da344200205b0401e4a62b
0xf6853c77a2452576eae5af424975a101ffc47308
0x28d664b3d47c7f5980f94ba97adb9f2c9462560c
0x886d87047dd967f5d03cc40822b73bd3902471e0
0xa0f2e2f7b3ab58e3e52b74f08d94ae52778d46df
0xdccd62fa244b463e17b8beb7b7b9d8490f9e70ed
0xa6e86f46598fdcb259b704bb080ca6f468a5f3a0
0x048aec9db462dadb5a493873aa37c231440dc698
0x6db7dcf200c2a26ab93a7a15e8c51714769785b6
0x9423537eef8d00d9beff5955035448e8519024e5
0xba146536cc1585b2e192358263197ac1dfb87639
0x578bedf58b1294774c1ebc45ce9f5d8a7633828e
0x995c88154bcdd9688501306214c9bbe899172ce4
```

Then run the script:

```sh
# `NETWORK` is one of `sepolia` or `mainnet`.
NETWORK=sepolia PRIVATE_KEY=0x node src/index.js
NETWORK=mainnet PRIVATE_KEY=0x node src/index.js
```

Results (transaction receipts) will be stored in `msgdrop.tsv`. You can stop and resume the script and it will pick up where it left off.

## Ingest.

There is a script to ingest files in `ingest-data/`, which are TSV and JSON. It will load them into `addys.txt`.

## Costs

TL;DR: 0.1e to message ~1000 addresses, $0.36c/addy at eth price of $3450.

```
For 1 onchain-message
Gas used is 30_500
At a gas price of 3 gwei
1x onchain message cost: 0.0000915000 ether
For number of addresses: 1143
Total Cost in ETH: 0.1045845
Total Cost in USD: 360.816525
```

To run/play with the model:

```sh
python src/cost.py
```