import React, { useEffect } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { CameraOptions, launchCamera } from 'react-native-image-picker';

import Geolocation from '@react-native-community/geolocation';

interface CameraComponentProps {
  onPhotoTaken?: (
    uri: string,
    coords?: { latitude: number; longitude: number },
  ) => void;
  onClose?: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  useEffect(() => {
    const openCamera = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permissão negada', 'Não será possível usar a câmera');
          onClose && onClose();
          return;
        }
      }

      let coords: { latitude: number; longitude: number } | undefined;
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const locationGranted =
          Platform.OS === 'android'
            ? await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              )
            : true;

        if (
          locationGranted === PermissionsAndroid.RESULTS.GRANTED ||
          Platform.OS === 'ios'
        ) {
          await new Promise<void>(resolve => {
            Geolocation.getCurrentPosition(
              (position: {
                coords: { latitude: number; longitude: number };
              }) => {
                coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                resolve();
              },
              error => {
                console.log('Erro ao pegar localização:', error.message);
                resolve();
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
            );
          });
        }
      }

      const options: CameraOptions = {
        mediaType: 'photo',
        saveToPhotos: true,
        cameraType: 'back',
      };

      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('Usuário cancelou a câmera');
        } else if (response.errorCode) {
          Alert.alert(
            'Erro',
            response.errorMessage || 'Erro ao acessar a câmera',
          );
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.uri) {
            onPhotoTaken && onPhotoTaken(asset.uri, coords);
          }
        }

        onClose && onClose();
      });
    };

    openCamera();
  }, []);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default CameraComponent;
