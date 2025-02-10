import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLists } from '../context/ListsContext'; 

export default function HomeScreen() {
  
  const { lists } = useLists();
  const totalLists = lists.length;
  
  const incompleteListsCount = lists.filter((list) =>
    list.items.some((item) => !item.checked)
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>Urge-anizer</Text>

      <Text style={styles.secondaryHeader}>Urging for a solution to your forgetfullness? look no further!</Text>

      <Image
        style={styles.image}
        source={{
          uri: 'https://www.personalizationmall.com/cat_image/600/19230-45335-200130124846.jpg',
        }}
      />

      <Text style={styles.paragraph}>
        This application is set on helping you remember your tasks, fullfill your goals, and celebrate your successes!
      </Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Total lists: {totalLists}</Text>
        <Text style={styles.detailsText}>Incomplete lists: {incompleteListsCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f4ea', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c6e49', 
    textAlign: 'center',
    marginBottom: 10,
  },
  secondaryHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4c956c', 
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10, 
    backgroundColor: '#c8e6c9', 
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    color: '#3a5a40', 
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  detailsContainer: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  detailsText: {
    fontSize: 16,
    color: '#2c6e49',
    marginBottom: 5,
  },
});
