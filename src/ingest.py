import os

addys = set()

# ls all files in ingest-data
# for each file, extract addys
# - for files export-tokenholders, extract tsv
# - for pt-weth-golders, extract json array

files = os.listdir('ingest-data')
print(files)

for file in files:
    count_before = len(addys)

    if file.startswith('export-tokenholders'):
        with open(f'ingest-data/{file}', 'r') as f:
            # get content
            content = f.read()
            # split by newline
            lines = content.split('\n')

            for line in lines[1:200]:
                addys.add(line.split(',')[0].strip("\""))
    elif file.startswith('pt-weeth-holders.json'):
        f = open(f'ingest-data/{file}', 'r')
        # read parse json
        content = f.read()
        f.close()
        import json
        data = json.loads(content)
        for addr in data:
            addys.add(addr)
    else:
        print(f"Unknown file type: {file}")
        continue
    
    count_after = len(addys)
    print(f"File: {file}, Added: {count_after - count_before}")
    

print(len(addys)) # 1000

# write addys to file
with open('addys.txt', 'w') as f:
    for addy in addys:
        # check addy is 42 chars
        if len(addy) != 42 and addy != "":
            print(f"Invalid address: {addy}")
            continue
        f.write(addy + '\n')