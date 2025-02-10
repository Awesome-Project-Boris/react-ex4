import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLists } from '../context/ListsContext';
import { useNavigation } from '@react-navigation/native';

export default function MyLists() {
  const { lists, setLists } = useLists();
  const navigation = useNavigation();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const itemInputRef = useRef(null);

  const openEditModal = (list) => {
    setEditingList(list);
    setListName(list.name);
    setItems([...list.items]);
    setEditModalVisible(true);
  };

  const saveChanges = () => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === editingList.id
          ? { ...list, name: listName, items: [...items] }
          : list
      )
    );

    setEditModalVisible(false);
    setEditingList(null);
    setListName('');
    setItems([]);
  };

  const addItem = () => {
    if (itemName.trim() !== '') {
      setItems((prev) => [...prev, { name: itemName.trim(), checked: false }]);
      setItemName('');
      itemInputRef.current?.focus();
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDeletePress = (list) => {
    setListToDelete(list);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (listToDelete) {
      setLists((prevLists) =>
        prevLists.filter((list) => list.id !== listToDelete.id)
      );
    }

    setListToDelete(null);
    setDeleteModalVisible(false);
  };

  const cancelDelete = () => {
    setListToDelete(null);
    setDeleteModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.mainHeader}>My Lists</Text>

        <FlatList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listContainer}>
              <TouchableOpacity
                style={styles.listContent}
                onPress={() => navigation.navigate('item', { listId: item.id })}
              >
                <Text style={styles.listName}>{item.name || 'Unnamed List'}</Text>
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Text style={styles.editIcon}>✏</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePress(item)}>
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No lists available</Text>
          }
        />

        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { padding: 20 }]}>
              <Text style={styles.modalTitle}>
                Are you sure you want to delete{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {listToDelete?.name || 'this list'}
                </Text>
                ?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={confirmDelete}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={editModalVisible} animationType="slide" transparent>
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <View style={styles.formContainer}>
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
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <TouchableOpacity onPress={() => removeItem(index)}>
                        <Text style={styles.deleteItemText}>✖</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
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
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f4ea', 
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c6e49',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 22,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  editIcon: {
    fontSize: 25,
    color: '#FFFFFF',
  },
  deleteIcon: {
    fontSize: 25,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c6e49',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
  
  
  formContainer: {
    width: '90%',
    backgroundColor: '#e6f4ea', 
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ff5252',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  
  
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#28a745',
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
    color: '#ffffff',
  },
  deleteItemText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});



