const PASSWORD_1 = 'password_1'
const HASHED_PASSWORD_1 = '$2a$10$7okJvKk14pi8UF/VzdEqr.mma68ocOKAp/uRwFcO2pk5xwVYRa5OW';
const PASSWORD_2 = 'password_2'

/*
for function encrypt, test if PASSWORD_1's encryptions is HASED_PASSWORD_1

for function compare, test if
-- PASSWORD_1, HASHED_PASSWORD_1 is true
-- PASSWORD_2, HASHED_PASSWORD_1 is false.
*/

const { encrypt, compare } = require('../utils/bcrypt');

test('password encrypted successfully', async () => {
    expect(typeof await encrypt(PASSWORD_1)).toBe("string");
});

test('password and hash match', async () => {
    expect(await compare(PASSWORD_1, HASHED_PASSWORD_1)).toBe(true);
})

test('password and hash don\'t match', async () => {
    expect(await compare(PASSWORD_2, HASHED_PASSWORD_1)).toBe(false);
})