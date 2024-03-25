import * as bcrypt from 'bcrypt';
const saltRounds: number = 10;

export const encrypt = async (data: string | Buffer = "") => {
    try {
        const hash = await bcrypt.hash(data, saltRounds);
        return hash;
    } catch (error) {
        console.error(error);
    }
};


export const compare = async (data: string | Buffer = "", hash: string = "") => {
    try {
        const isMatching: boolean = await bcrypt.compare(data, hash);
        return isMatching;
    } catch (error) {
        console.error(error);
    }
};