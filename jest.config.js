module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest', // transpila JS e TS
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    // Libs que precisam ser transformadas pelo Babel
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|@react-native-community|react-native-vector-icons|react-native-image-picker)/)',
  ],
  moduleNameMapper: {
    // Mock do AsyncStorage
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',

    // Mock dos ícones
    '^react-native-vector-icons/(.*)$':
      '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'], // ignora pastas nativas
  cacheDirectory: '.jest/cache', // pasta de cache
};
