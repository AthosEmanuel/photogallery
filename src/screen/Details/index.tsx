import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../App';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detalhes'>;

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { uri, date, coords, onDelete } = route.params as {
    uri: string;
    date: string;
    coords?: { latitude: number; longitude: number };
    onDelete?: (uri: string) => void;
  };

  const handleDelete = () => {
    Alert.alert(
      'Deletar imagem',
      'Tem certeza que deseja deletar esta imagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            onDelete && onDelete(uri);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash" size={28} color="#fff" />
      </TouchableOpacity>

      <Image source={{ uri }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.labelText}>Informações:</Text>

        <Text style={styles.dateText}>
          <Text style={{ fontWeight: 'bold' }}>Data/hora: </Text>
          {date}
        </Text>

        {coords && (
          <Text style={styles.dateText}>
            <Text style={{ fontWeight: 'bold' }}>Coordenadas: </Text>
            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#222222',
    padding: 10,
    borderRadius: 8,
  },
  labelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(255,59,48,0.8)',
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
});

export default DetailScreen;
