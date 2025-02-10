import { Stack } from 'expo-router';
import { ListsProvider } from './context/ListsContext';

export default function RootLayout() {

  
  return (
    <ListsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="item" options={{ title: 'List Details' }} />
      </Stack>
    </ListsProvider>
  );
}