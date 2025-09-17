export default {
  getCurrentPosition: jest.fn((success, error) => {
    // Retorna coordenadas fictícias
    success({ coords: { latitude: 0, longitude: 0 } });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
};
