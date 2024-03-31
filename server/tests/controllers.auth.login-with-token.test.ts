import { loginWithToken } from '../src/controllers/auth/login-with-token';
import { signToken, verifyToken } from '../src/middlewares/jsonwebtoken';
import { encrypt } from '../src/utils/bcrypt';
import { Request, Response, NextFunction } from 'express';
import { Account } from '../src/models/Account';
import { mongo } from '../src/utils/mongo';

describe('testing login of account', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
    let expectedResponseJson: object;
    let expectedResponseStatus: number;
    const testAccount = {
        'username': 'test',
        'email': 'test@email.com',
        'password': 'test',
    };

    beforeAll(async () => {
        await mongo.connect();
        await Account.deleteMany({});
        const hashedPassword = await encrypt(testAccount['password']);
        await Account.create({
            'username': testAccount['username'],
            'email': testAccount['email'],
            'password': hashedPassword
        });
    });

    afterAll(async () => {
        await Account.deleteMany({});
        await mongo.mongoose.disconnect();
    });

    beforeEach(async () => {
        mockRequest = {
            body: jest.fn(),
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const testPayload: string | object | Buffer = {
            'email': 'test@email.com',
        }
        const token = signToken(testPayload);
        mockRequest = {
            body: {
                'token': token,
            }
        }
        verifyToken(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
    });

    test('successful request', async () => {
        expectedResponseJson = {
            'message': 'success',
            'user': 'account successfully logged in'
        };
        expectedResponseStatus = 200;
        await loginWithToken(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

});