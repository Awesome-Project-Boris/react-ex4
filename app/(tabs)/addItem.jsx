import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useLists } from '../context/ListsContext';
import { useNavigation } from '@react-navigation/native';

export default function AddItemScreen() {
  const navigation = useNavigation();
  const { lists, setLists } = useLists();
  const [listName, setListName] = useState('');
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);

  const itemInputRef = useRef(null);

  const addItem = () => {
    if (itemName.trim() !== '') {
      setItems((prev) => [...prev, { name: itemName.trim(), checked: false }]);
      setItemName('');
      itemInputRef.current?.focus();
    }
  };

  const createList = () => {
    if (listName.trim() !== '' && items.length > 0) {
      const newList = {
        id: lists.length ? lists[lists.length - 1].id + 1 : 1,
        name: listName.trim(),
        items,
      };
      setLists((prev) => [...prev, newList]);
      setItems([]);
      setItemName('');
      setListName('');
      navigation.navigate('list');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>List Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter list name"
          value={listName}
          onChangeText={setListName}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <TextInput
          style={styles.input}
          placeholder="Add an item"
          value={itemName}
          onChangeText={setItemName}
          onSubmitEditing={addItem}
      
          ref={itemInputRef}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={createList}
        disabled={listName.trim() === '' || items.length === 0}
      >
        <Text style={styles.buttonText}>Create List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f4ea'
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c6e49',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#a8d5ba',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    backgroundColor: '#1b6ca8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#b0d9b1',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#2c6e49',
  },
});
