import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../App';
import { CameraComponent } from '../../components/';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Galeria'>;

interface PhotoData {
  uri: string;
  date: string;
  coords?: { latitude: number; longitude: number };
}

const STORAGE_KEY = '@photos';

const HomeScreen: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [searchText, setSearchText] = useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation<HomeScreenProp>();

  // Animação do botão da câmera
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateCameraButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleCameraPress = () => {
    animateCameraButton();
    setShowCamera(true);
  };

  // Carrega fotos do AsyncStorage
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setPhotos(JSON.parse(json));
      } catch (error) {
        console.error('Erro ao carregar fotos:', error);
      }
    };
    loadPhotos();
  }, []);

  // Salva fotos no AsyncStorage
  const savePhotos = async (newPhotos: PhotoData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
    } catch (error) {
      console.error('Erro ao salvar fotos:', error);
    }
  };

  // Trata foto tirada
  const handlePhotoTaken = (
    uri: string,
    coords?: { latitude: number; longitude: number },
  ) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const newPhoto: PhotoData = { uri, date: formattedDate, coords };
    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);
    savePhotos(updatedPhotos);
    setShowCamera(false);
  };

  // Filtra fotos por data/hora
  const filteredPhotos = useMemo(
    () =>
      photos.filter(photo =>
        photo.date.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [photos, searchText],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#222222' : '#fff' },
      ]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity testID="camera-button" onPress={handleCameraPress}>
            <Ionicons
              name="camera"
              size={40}
              color={isDarkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          testID="theme-button"
          onPress={() => setIsDarkMode(prev => !prev)}
          style={styles.themeButton}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={35}
            color={isDarkMode ? 'yellow' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {/* Componente da câmera */}
      {showCamera && (
        <View style={StyleSheet.absoluteFill}>
          <CameraComponent
            onPhotoTaken={handlePhotoTaken}
            onClose={() => setShowCamera(false)}
          />
        </View>
      )}

      {/* Campo de busca */}
      <View style={{ width: '90%', marginVertical: 20 }}>
        <TextInput
          placeholder="Buscar por data..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#000'}
          style={{
            backgroundColor: isDarkMode ? '#1A1A40' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000',
            padding: 10,
            borderRadius: 8,
          }}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de fotos */}
      <FlatList
        data={filteredPhotos}
        keyExtractor={item => item.uri}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 2 }}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Detalhes', {
                  uri: item.uri,
                  date: item.date,
                  coords: item.coords,
                  onDelete: (uri: string) => {
                    const updatedPhotos = photos.filter(p => p.uri !== uri);
                    setPhotos(updatedPhotos);
                    savePhotos(updatedPhotos);
                  },
                })
              }
            >
              <Image source={{ uri: item.uri }} style={styles.image} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  themeButton: {},
  photoContainer: {
    flexBasis: '48%',
    margin: 2,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
});

export default HomeScreen;
