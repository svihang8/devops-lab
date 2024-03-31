import { login } from '../src/controllers/auth/login';
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
    });

    test('missing parameters', async () => {
        expectedResponseJson = {
            'message': 'error',
            'error': 'missing email or password',
        };
        expectedResponseStatus = 422;
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('invalid email', async () => {
        expectedResponseJson = {
            'message': 'error',
            'error': 'invalid email',
        }
        expectedResponseStatus = 400;
        mockRequest = {
            body: {
                'email': 'test2@email.com',
                'password': testAccount['password'],
            }
        }
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('invalid password', async () => {
        expectedResponseJson = {
            'message': 'error',
            'error': 'invalid password',
        }
        expectedResponseStatus = 400;
        mockRequest = {
            body: {
                'email': testAccount['email'],
                'password': 'test2',
            }
        }
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('successful request', async () => {
        expectedResponseJson = {
            'message': 'success',
            'user': 'account successfully logged in'
        };
        expectedResponseStatus = 200;
        mockRequest = {
            body: {
                'email': testAccount['email'],
                'password': testAccount['password'],
            }
        }
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

});