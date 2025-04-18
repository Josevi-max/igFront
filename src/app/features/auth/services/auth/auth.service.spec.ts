import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { config } from '../../../../config/config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    jest.restoreAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería loguear correctamente y guardar datos en signals y localStorage', () => {
    const mockCredentials = { email: 'test@example.com', password: '123456' };
    const mockResponse = {
      access_token: 'fake-token',
      user: { id: 1, name: 'Test User' }
    };

    service.login(mockCredentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockResponse.user));
      expect(service.token()).toBe('fake-token');
      expect(service.userData()).toEqual(mockResponse.user);
    });

    const req = httpMock.expectOne(`${config.api.URL_BACKEND}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería manejar errores y no actualizar datos', () => {
    const mockCredentials = { email: 'test@example.com', password: 'wrongpass' };
    const mockError = { status: 401, statusText: 'Unauthorized' };

    service.login(mockCredentials).subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err) => {
        expect(err.status).toBe(401);
        expect(service.token()).toBe('');
        expect(service.userData()).toBe(null);
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userData')).toBeNull();
      },
    });

    const req = httpMock.expectOne(`${config.api.URL_BACKEND}/auth/login`);
    req.flush(null, mockError);
  });

  it('should register user', () => {
    const mockCredentials = { email: 'test@example.com', password: '123456789', username: 'testuser', name: 'Test User' };
    const mockResponse = { message: 'User registered successfully' };

    service.register(mockCredentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${config.api.URL_BACKEND}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should fail to register user', () => {
    const mockCredentials = { email: 'test', password: '123', username: 'testuser', name: 'Test User' };
    const mockResponse = { error: '500', message: 'wrong data user' };

    service.register(mockCredentials).subscribe({
      next: () => {
        fail('La petición debería haber fallado');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toEqual(mockResponse);
      }
    });

    const req = httpMock.expectOne(`${config.api.URL_BACKEND}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse, { status: 500, statusText: 'Server Error' });
  });


  it('should logout and clear localStorage and reset signals', () => {
    service.token.set('fake-token');
    service.userData.set({ id: 1, name: 'Test User' });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    service.logout();

    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(removeItemSpy).toHaveBeenCalledWith('userData');
    expect(removeItemSpy).toHaveBeenCalledTimes(2);

    expect(service.token()).toBe('');
    expect(service.userData()).toBeNull();
  });



});
