import random

# Choose a single letter with a readable and repeating hex value
letters = 'AaBbCcDdEeFf'
letter = random.choice(letters)

# Repeat the chosen letter 4 times to create the selector
selector = letter * 4

# Print the UTF-8 data and its hex representation
print(f"UTF-8 data: {selector}")
print(f"Hex encoding: {selector.encode('utf-8').hex()}")


# (base) ➜  msgdrop python src/selector.py
# UTF-8 data: ffff
# Hex encoding: 66666666

# Define the range of ASCII characters
ascii_chars = ''.join(chr(i) for i in range(32, 127))

# Filter characters whose hex representation is also in the range of ASCII characters or numbers
overlap_chars = [char for char in ascii_chars if all(c in '0123456789abcdefABCDEF' for c in format(ord(char), '02x'))]

# Print the overlapping characters
print("Overlapping ASCII characters: ", ''.join(overlap_chars))
strrr = "########"
print(f"Hex encoding: {strrr.encode('utf-8').hex()}")

# print all the hex codes for the ascii characters
for i in range(32, 127):
    # only if the hex representation has two repeatig chars
    if format(i, '02x')[0] == format(i, '02x')[1]:
        print(f"{chr(i)}: {format(i, '02x')}")


# Hex string to decode
hex_string = "55555555"  # This is the hex representation of "UUUUU"

# Decode hex string to bytes
bytes_data = bytes.fromhex(hex_string)

# Decode bytes to ASCII string
ascii_string = bytes_data.decode('ascii')

print(ascii_string)