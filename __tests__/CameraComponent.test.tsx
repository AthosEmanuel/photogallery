import * as ImagePicker from 'react-native-image-picker';

import { render, waitFor } from '@testing-library/react-native';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import React from 'react';
import { CameraComponent } from '../src/components/';

// --- Mocks ---
// Mock do Geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

// Mock do launchCamera
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
}));

// Mock do Alert para não abrir popups
jest.spyOn(Alert, 'alert');

describe('CameraComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call onClose if camera permission is denied (Android)', async () => {
    if (Platform.OS === 'android') {
      jest
        .spyOn(PermissionsAndroid, 'request')
        .mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

      const onCloseMock = jest.fn();
      render(<CameraComponent onClose={onCloseMock} />);
      await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permissão negada',
        'Não será possível usar a câmera',
      );
    }
  });

  it('should call onPhotoTaken and onClose when photo is taken (Android/iOS)', async () => {
    // Permissão concedida
    if (Platform.OS === 'android') {
      jest
        .spyOn(PermissionsAndroid, 'request')
        .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
    }

    // Mock Geolocation
    (Geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success: any) => success({ coords: { latitude: 10, longitude: 20 } }),
    );

    // Mock câmera
    (ImagePicker.launchCamera as jest.Mock).mockImplementation(
      (_options, callback) =>
        callback({
          assets: [{ uri: 'photo-uri' }],
        }),
    );

    const onPhotoTakenMock = jest.fn();
    const onCloseMock = jest.fn();

    render(
      <CameraComponent onPhotoTaken={onPhotoTakenMock} onClose={onCloseMock} />,
    );

    await waitFor(() =>
      expect(onPhotoTakenMock).toHaveBeenCalledWith('photo-uri', {
        latitude: 10,
        longitude: 20,
      }),
    );
    await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
  });

  it('should call onClose if user cancels the camera', async () => {
    if (Platform.OS === 'android') {
      jest
        .spyOn(PermissionsAndroid, 'request')
        .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
    }

    (Geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success: any) => success({ coords: { latitude: 0, longitude: 0 } }),
    );

    (ImagePicker.launchCamera as jest.Mock).mockImplementation(
      (_options, callback) => callback({ didCancel: true }),
    );

    const onCloseMock = jest.fn();
    render(<CameraComponent onClose={onCloseMock} />);
    await waitFor(() => expect(onCloseMock).toHaveBeenCalled());
  });

  it('should show alert if camera returns an error', async () => {
    if (Platform.OS === 'android') {
      jest
        .spyOn(PermissionsAndroid, 'request')
        .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
    }

    (Geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success: any) => success({ coords: { latitude: 0, longitude: 0 } }),
    );

    (ImagePicker.launchCamera as jest.Mock).mockImplementation(
      (_options, callback) =>
        callback({ errorCode: 'ERROR', errorMessage: 'Camera error' }),
    );

    render(<CameraComponent onClose={jest.fn()} />);
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Camera error'),
    );
  });

  it('should handle geolocation error gracefully', async () => {
    if (Platform.OS === 'android') {
      jest
        .spyOn(PermissionsAndroid, 'request')
        .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
    }

    // Geolocation falha
    (Geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (_success, error) => error({ message: 'Location error' }),
    );

    (ImagePicker.launchCamera as jest.Mock).mockImplementation(
      (_options, callback) => callback({ assets: [{ uri: 'photo-uri' }] }),
    );

    const onPhotoTakenMock = jest.fn();
    render(<CameraComponent onPhotoTaken={onPhotoTakenMock} />);
    await waitFor(() =>
      expect(onPhotoTakenMock).toHaveBeenCalledWith('photo-uri', undefined),
    );
  });
});
