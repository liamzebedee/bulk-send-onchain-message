

gasUsed = 30_500
GWEI = 10**9
gasPrice = 3 * GWEI
gasCostEther = gasUsed * gasPrice / 10**18
ethPrice = 3450

# convert ether to decimal string
print("1x onchain message cost: {:.10f} ether".format(gasCostEther))

# count lines in addys.txt
num = 0
with open('addys.txt', 'r') as f:
    for line in f:
        num += 1
totalcost = num * gasCostEther

print(f"Number of addresses: {num}")
print(f"Cost in ETH: {totalcost}")
print(f"Cost in USD: {totalcost * ethPrice}")