import { render } from '@testing-library/react-native';
import React from 'react';
import { DetailScreen } from '../src/screen';

describe('DetailScreen', () => {
  const mockRoute = {
    params: {
      uri: 'https://example.com/photo.jpg',
      date: '16/09/2025',
      coords: { latitude: 10, longitude: 20 },
    },
  };

  it('renders image and information correctly', () => {
    const { getByText, getByTestId } = render(
      <DetailScreen route={mockRoute as any} navigation={{} as any} />,
    );

    // Verifica se a data aparece
    expect(getByText(/16\/09\/2025/)).toBeTruthy();

    // Verifica se as coordenadas aparecem
    expect(getByText(/10.000000, 20.000000/)).toBeTruthy();
  });

  it('renders correctly without coordinates', () => {
    const routeWithoutCoords = {
      params: {
        uri: 'https://example.com/photo.jpg',
        date: '16/09/2025',
      },
    };

    const { queryByText } = render(
      <DetailScreen route={routeWithoutCoords as any} navigation={{} as any} />,
    );

    // Coordenadas não devem aparecer
    expect(queryByText(/Coordenadas:/)).toBeNull();
  });
});
