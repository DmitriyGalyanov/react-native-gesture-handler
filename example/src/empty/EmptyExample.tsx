import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler';

export default function App() {
  const renderItem = React.useCallback(() => {
    return (
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => console.log('TouchableOpacity onPress called')}>
          <FlatList
            horizontal={true}
            pagingEnabled={true}
            data={['red', 'green', 'blue']}
            renderItem={(data) => {
              return (
                <View
                  style={[{ backgroundColor: data.item }, styles.container]}
                />
              );
            }}
          />
          <View>
            <Text style={styles.title}>Title</Text>
            <Text style={styles.subtitle}>Subtitle</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView>
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 20,
  },
  list: {
    padding: 20,
  },
  container: {
    width: 348,
    height: 348,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  touchable: {
    height: 300,
    width: 350,
    borderWidth: 1,
    borderColor: 'grey',
  },
});
