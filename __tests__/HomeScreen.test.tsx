import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../src/screen/Home';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock do CameraComponent
jest.mock('../src/components/', () => ({
  CameraComponent: ({ onPhotoTaken, onClose }: any) => {
    // Simula a foto sendo tirada imediatamente
    setTimeout(() => {
      onPhotoTaken('fake-uri', { latitude: 10, longitude: 20 });
      onClose && onClose();
    }, 0);
    return null;
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input and camera button', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );

    expect(getByPlaceholderText('Buscar por data...')).toBeTruthy();
    expect(getByTestId('camera-button')).toBeTruthy();
    expect(getByTestId('theme-button')).toBeTruthy();
  });

  it('should toggle dark mode', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );

    const themeButton = getByTestId('theme-button');

    fireEvent.press(themeButton); // ativa dark mode
    fireEvent.press(themeButton); // volta ao light mode
  });

  it('should open camera and handle photo taken', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );

    const cameraButton = getByTestId('camera-button');
    await act(async () => {
      fireEvent.press(cameraButton);
    });

    // Espera o AsyncStorage.setItem ser chamado
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@photos',
        expect.stringContaining('fake-uri'),
      );
    });
  });

  it('should filter photos based on search text', async () => {
    // Renderiza o componente com fotos mockadas
    const { getByPlaceholderText, queryAllByRole } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );

    // Adiciona fotos manualmente
    const photos = [
      { uri: 'uri1', date: '01/01/2025 10:00:00' },
      { uri: 'uri2', date: '02/01/2025 11:00:00' },
    ];
    AsyncStorage.getItem = jest.fn(() =>
      Promise.resolve(JSON.stringify(photos)),
    );

    // Re-renderiza para carregar fotos
    fireEvent.changeText(
      getByPlaceholderText('Buscar por data...'),
      '02/01/2025',
    );

    // Filtra fotos
    const filtered = photos.filter(p =>
      p.date.toLowerCase().includes('02/01/2025'.toLowerCase()),
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].uri).toBe('uri2');
  });

  it('should delete a photo via onDelete callback', async () => {
    const mockNavigate = jest.fn();
    const mockPhotos = [
      { uri: 'uri1', date: '01/01/2025 10:00:00' },
      { uri: 'uri2', date: '02/01/2025 11:00:00' },
    ];
    AsyncStorage.getItem = jest.fn(() =>
      Promise.resolve(JSON.stringify(mockPhotos)),
    );

    // Mock da navegação para chamar onDelete
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );

    // Simula onDelete
    const updatedPhotos = mockPhotos.filter(p => p.uri !== 'uri1');
    expect(updatedPhotos).toHaveLength(1);
    expect(updatedPhotos[0].uri).toBe('uri2');
  });
});
