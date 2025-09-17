# 📸 PhotoGallery App

Aplicativo mobile desenvolvido em **React Native (CLI)** que permite capturar, visualizar e gerenciar fotos.  
Conta com suporte a **modo claro/escuro**, busca por data, visualização de detalhes e exclusão de imagens.

---

## ✨ Funcionalidades

- 📷 **Captura de fotos** usando a câmera do dispositivo.  
- 🖼️ **Galeria local** para armazenar e visualizar as fotos tiradas.  
- 🌗 **Tema claro e escuro** com alternância via botão.  
- 🔍 **Busca por data** para filtrar rapidamente imagens.  
- 📌 **Visualização detalhada** de cada foto (com data e coordenadas GPS).  
- 🗑️ **Exclusão de fotos** direto da tela de detalhes.  
---

## 🛠️ Tecnologias utilizadas

- [React Native CLI](https://reactnative.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [React Navigation](https://reactnavigation.org/)  
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)  
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (persistência das fotos)  
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)  
- [React Native Community Geolocation](https://github.com/react-native-geolocation/react-native-geolocation)  

---

## ▶️ Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/photo-gallery-app.git
cd photo-gallery-app
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
```

### 3. Instalar dependências nativas (Android)
```bash
npx pod-install
```

### 4. Rodar no Metro Bundler

```bash
npx react-native start
```

### 5. Rodar no emulador/dispositivo

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

### 5. Gerar APK release
```bash
cd android
./gradlew assembleRelease
```
O APK será gerado em:  
`android/app/build/outputs/apk/release/app-release.apk`

---

### 6. Rodar os testes

```bash
npm test
```
