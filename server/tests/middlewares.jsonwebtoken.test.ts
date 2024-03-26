import { signToken, verifyToken } from '../src/middlewares/jsonwebtoken';
import { constants } from '../src/constants';
import { Request, Response, NextFunction } from 'express';
/*
signToken should return a string type value
verifyToken use cases:
--> signed token generated should return proper credentials within req.body.auth
--> missing token should return 401 error
--> expired token should return 401 error
**/

test('JWT_TOKEN value', () => {
    expect(constants['JWT_SECRET']).toBe('test');
})

const testPayload: string | object | Buffer = {
    'email': 'test@email.com',
}

describe('testing signing of token', () => {
    test('payload returns string type value', () => {
        expect(typeof signToken(testPayload)).toBe('string');
    })
})

describe('testing verification of token', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
    let expectedResponseJson: object;
    let expectedResponseStatus: number;

    beforeEach(() => {
        mockRequest = {
            body: jest.fn(),
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    })

    test('missing token', () => {
        expectedResponseJson = {
            message: 'token missing'
        };
        expectedResponseStatus = 401;
        verifyToken(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);
    });

    test('expired token', async () => {
        jest.useFakeTimers();

        expectedResponseJson = {
            message: 'token expired'
        }

        expectedResponseStatus = 401;

        const token = signToken(testPayload, '1000');
        mockRequest = {
            body: {
                'token': token,
            }
        }

        jest.advanceTimersByTime(1000);

        verifyToken(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponseJson);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedResponseStatus);

    });

    test('valid token', async () => {
        expectedResponseJson = {}
        const token = signToken(testPayload);
        mockRequest = {
            body: {
                'token': token,
            }
        }
        verifyToken(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(nextFunction).toHaveBeenCalledTimes(1);

    });

})