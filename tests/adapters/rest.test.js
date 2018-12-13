import Rest from '../../src/adapters/rest';
import authMock from '../__mocks__/authMock';

const BASE_URL = 'a non null base url';
let adapter = null;

describe('Rest adapter', () => {

  describe('Request Headers', () => {

    beforeEach(() => {
      adapter = new Rest({
        apiConfig: {
          getBaseUrl() {
            return BASE_URL;
          },
          getApiKey() {
            return 'an api key';
          }
        }
      });
    });

    afterEach(() => {
      adapter = null;
    });

    it('includes X-API-Key header', () => {
      const headers = adapter.getHeaders();
      expect(headers['X-API-Key']).toBeDefined();
    });

    it('includes Content-Type header as application/json if is a post', () => {
      const headers = adapter.getHeaders(true);
      expect(headers['Content-Type']).toBeDefined();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('includes X-Authorization header if there is a session', () => {
      adapter.token = 'token';
      const headers = adapter.getHeaders();
      expect(headers['X-Authorization']).toBeDefined();
      expect(headers['X-Authorization']).toBe('token');
    });

  });

  describe('REST URLs', () => {

    beforeEach(() => {
      adapter = new Rest({
        apiConfig: {
          getBaseUrl() {
            return BASE_URL;
          },
          getApiKey() {
            return 'an api key';
          }
        }
      });
    });

    afterEach(() => {
      adapter = null;
    });

    it('gets the correct baseUrl for the API', () => {
      expect(adapter.getBaseUrl()).toBe(BASE_URL);
    });

    it('throws an error if apiConfig.getBaseUrl returns an invalid url', () => {
      adapter.apiConfig.getBaseUrl = () => null;
      expect(() => {
        adapter.getBaseUrl()
      }).toThrow();
    });

    it('constructs the correct URL for the resource', () => {
      adapter.module = 'crowd';
      adapter.communityId = 'santacatalina';
      const expectedUrl = `${BASE_URL}/crowd/c/santacatalina/visitors/invitations`;
      expect(adapter.buildUrl('visitors/invitations')).toBe(expectedUrl);
    });

  });

  describe('Process response', () => {

    beforeEach(() => {
      fetch.resetMocks();

      adapter = new Rest({
        apiConfig: {
          getBaseUrl() {
            return BASE_URL;
          },
          getApiKey() {
            return 'an api key';
          }
        }
      });
    });

    afterEach(() => {
      adapter = null;
    });

    it('process a successful response', () => {
      expect.assertions(1);

      fetch.mockResponses([
        JSON.stringify(authMock),
        {
          status: 200
        }
      ]);

      return adapter.save('security/auth', {
        email: 'test@keenvil.com',
        password: '12345678'
      }).then((response) => {
        expect(response.id).toBe(authMock.id);
      });
    });

    it('process an unauthorized response', () => {
      expect.assertions(2);

      fetch.mockResponses([
        JSON.stringify([
          {
            "httpStatus": 417,
            "code": "tokenExpired",
            "title": "Authentication error",
            "detail": "Token expired.",
            "source": "com.keenvil.security.service.AuthService:auth:56(AuthService.java)...",
            "module": null,
            "uri": "/community/c/santacatalina/units",
            "httpMethod": "POST",
            "hostName": "api.qa.keenvil.com",
            "localHostName": "192.168.0.132"
          }
        ]),
        {
          status: 401
        }
      ]);

      return adapter.save('security/auth', {
        email: 'test@keenvil.com',
        password: '12345678'
      })
      .catch((error) => {
        expect(error.apiErrors[0].code).toBe('tokenExpired');
        expect(error.apiErrors[0].httpStatus).toBe(417);
      });

    });

    it('process validation errors response', () => {
      expect.assertions(2);

      fetch.mockResponses([
        JSON.stringify([
          {
            "httpStatus": 422,
            "code": "Size.loginRequest.password",
            "title": "Validation Errors",
            "detail": "el tamaño tiene que estar entre 8 y 16",
            "source": "com.keenvil.security.controller.AuthController:auth:123(AuthController.java)...",
            "module": "security",
            "uri": "/security/auth",
            "httpMethod": "POST",
            "hostName": "api.qa.keenvil.com",
            "localHostName": "172.17.0.7"
          }
        ]),
        {
          status: 422
        }
      ]);

      return adapter.save('security/auth', {
        email: 'test@keenvil.com',
        password: '123'
      }).catch((error) => {
        expect(error.apiErrors[0].code).toBe('Size.loginRequest.password');
        expect(error.apiErrors[0].httpStatus).toBe(422);
      });

    });

    it('process a redirection', () => {
      expect.assertions(1);

      fetch.mockResponses([
        JSON.stringify([
          {
            "httpStatus": 302
          }
        ]),
        {
          status: 302
        }
      ]);

      return adapter.save('security/auth', {
        email: 'test@keenvil.com',
        password: '12345678'
      }).catch((error) => {
        expect(error.apiErrors[0].httpStatus).toBe(302);
      });
    });

    it('process an internal server error', () => {
      expect.assertions(1);

      fetch.mockResponses([
        JSON.stringify([
          {
            "httpStatus": 500
          }
        ]),
        {
          status: 500
        }
      ]);

      return adapter.save('security/auth', {
        email: 'test@keenvil.com',
        password: '12345678'
      }).catch((error) => {
        expect(error.apiErrors[0].httpStatus).toBe(500);
      });
    });

    it('process an resource already exists error', () => {
      expect.assertions(1);

      fetch.mockResponses([
        JSON.stringify([
          {
            "httpStatus": 409
          }
        ]),
        {
          status: 409
        }
      ]);

      return adapter.save('units', {
        lotNumber: 1,
        unitNumber: 1,
        status: 'TAKEN',
        type: 'HOUSE'
      }).catch((error) => {
        expect(error.apiErrors[0].code).toBe('resourceAlreadyExists');
      });
    });


  });

});
