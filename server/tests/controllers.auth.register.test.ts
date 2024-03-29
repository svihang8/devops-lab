import { register } from '../src/controllers/auth/register';
import { Request, Response, NextFunction } from 'express';
import { Account } from '../src/models/Account';
import { mongo } from '../src/utils/mongo';

describe('testing registration of account', () => {
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
    });

    afterAll(async () => {
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
        await Account.deleteMany({});
    });

    afterEach(async () => {
        await Account.deleteMany({});
    });

    test('missing parameters', async () => {
        expectedResponseJson = {
            'message': 'error',
            'error': 'missing username, email, or password',
        };
        expectedResponseStatus = 422;
        await register(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('account already exists', async () => {
        expectedResponseJson = {
            'message': 'error',
            'error': 'account already exists',
        }
        expectedResponseStatus = 409;
        mockRequest = {
            body: {
                'username': testAccount['username'],
                'email': testAccount['email'],
                'password': testAccount['password'],
            }
        }
        await Account.create(testAccount);
        await register(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('successful request', async () => {
        expectedResponseJson = {
            'message': 'success',
            'user': 'account successfully created'
        };
        expectedResponseStatus = 200;
        mockRequest = {
            body: {
                'username': testAccount['username'],
                'email': testAccount['email'],
                'password': testAccount['password'],
            }
        }
        await register(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

});