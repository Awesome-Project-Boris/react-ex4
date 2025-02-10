import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useLists } from './context/ListsContext';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ItemScreen() {
  const route = useRoute();
  const { listId } = route.params || {};
  const { lists, toggleItemChecked } = useLists();

  const list = lists.find((list) => list.id === listId);

  if (!list) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>List not found!</Text>
      </View>
    );
  }

  const hasItems = list.items.length > 0;
  const allChecked = hasItems && list.items.every((item) => item.checked);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* List Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{list.name}</Text>
        </View>

        {/* Items List */}
        <View style={styles.itemsContainer}>
          <FlatList
            data={list.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <Switch
                  value={item.checked}
                  onValueChange={() => toggleItemChecked(listId, index)}
                  trackColor={{ false: 'lightgray', true: '#2c6e49' }}
                  thumbColor="#fff"
                />
                <Text
                  style={[
                    styles.itemText,
                    item.checked && styles.itemChecked,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            )}
            // Prevent FlatList from scrolling independently
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No items on list</Text>
            }
          />
        </View>

        {/* Confetti when all items checked */}
        {allChecked && (
          <ConfettiCannon
            count={150}
            origin={{ x: 200, y: -10 }}
            fadeOut={true}
            fallSpeed={2000}
            explosionSpeed={800}
            colors={['#ff6347', '#ffa500', '#1e90ff', '#32cd32', '#ffff00']}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#e6f4ea',
  },
  headerContainer: {
    paddingVertical: 20,
    backgroundColor: '#a8d5ba',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c6e49',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#b0d9b1',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 8,
    color: '#2c6e49',
  },
  itemChecked: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
