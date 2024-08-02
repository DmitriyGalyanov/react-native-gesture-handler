import React, { useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';

const Item = ({ title }: { title: string }) => (
  <View>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const windowHeight = Dimensions.get('window').height;
export default function Example() {
  const [modalVisible, setModalVisible] = useState(false);

  const DATA: { id: number; title: string }[] = useMemo(() => {
    const newData = [];

    for (let i = 0; i < 100; i++) {
      newData.push({ id: i, title: `hello - ${i}` });
    }

    return newData;
  }, []);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <GestureHandlerRootView style={styles.rootContainer}>
          <Animated.View style={styles.animatedContainer}>
            <NativeViewGestureHandler>
              <FlatList
                data={DATA}
                renderItem={({ item }) => <Item title={item.title} />}
                keyExtractor={(item) => item.id.toString()}
              />
            </NativeViewGestureHandler>
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  rootContainer: {
    width: '100%',
    height: '100%',
  },
  animatedContainer: {
    backgroundColor: 'white',
    overflow: 'hidden',
    flexShrink: 1,
    width: '100%',
    opacity: 1,

    height: windowHeight / 2,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    backgroundColor: 'black',
  },
});
