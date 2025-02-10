import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const ListsContext = createContext({
  lists: [],
  setLists: () => {},
  addListItem: () => {},
  toggleItemChecked: () => {},
});

export function ListsProvider({ children }) {

  const [lists, setLists] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    async function loadLists() {
      try {
        const storedLists = await AsyncStorage.getItem('@my_lists');
        if (storedLists !== null) {
          setLists(JSON.parse(storedLists));
        } else {
          setLists([
            {
              id: 1,
              name: 'Grocery store list',
              items: [
                { name: 'Cake', checked: false },
                { name: 'Potato', checked: false },
                { name: 'Slim Jim', checked: false },
                {  name: 'Watermelon', checked: false },
                {  name: 'Ding Dongs', checked: false },
                {  name: 'Sugar', checked: false },
                {  name: 'Pepper', checked: false },
                { name: 'Burekas', checked: false }
              ],
            },
          ]);
        }
      } catch (error) {
        console.log('Error loading lists from AsyncStorage:', error);
      } finally {
        setIsInitialized(true);
      }
    }

    loadLists();
  }, []);


  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem('@my_lists', JSON.stringify(lists)).catch((error) => {
        console.log('Error saving lists to AsyncStorage:', error);
      });
    }
  }, [lists, isInitialized]);


  const addListItem = (listId, item) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [...list.items, { name: item, checked: false }],
            }
          : list
      )
    );
  };

  const toggleItemChecked = (listId, itemIndex) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item, index) =>
                index === itemIndex
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : list
      )
    );
  };

  return (
    <ListsContext.Provider value={{ lists, setLists, addListItem, toggleItemChecked }}>
      {children}
    </ListsContext.Provider>
  );
}

ListsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useLists() {
  return useContext(ListsContext);
}
