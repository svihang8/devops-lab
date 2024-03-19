const bcrypt = require('bcrypt')
const saltRounds = 10;
/*
encrypt inputs a string and returns a hash of a string using bcrypt.
*/
const encrypt = async (data = "") => {
    try {
        const hash = await bcrypt.hash(data, saltRounds);
        return hash;
    } catch (error) {
        console.error(error);
    }
};

/*
verify inputs a string and a hash, compares them and returns boolean.
*/
const compare = async (data = "", hash = "") => {
    try {
        const isMatching = await bcrypt.compare(data, hash);
        return isMatching;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { encrypt, compare };