import { View, Text, SafeAreaView, ScrollView, FlatList } from "react-native";
import React, { useContext } from "react";
import FaunaCard from "../../components/FaunaCard/FaunaCard";
import {
  ClassifierContext,
  CurrentUserContext,
} from "../../contexts/AppContext";
import colors from "../../constants/colors";

const Explore = () => {
  const [classificationHistory, setClassificationHistory] =
    useContext(ClassifierContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {classificationHistory && (
        <FlatList
          style={{ flex: 1 }}
          data={classificationHistory}
          renderItem={({ item }) => (
            <FaunaCard classification={item} showProfile />
          )}
          ItemSeparatorComponent={<View style={{ height: 14 }}></View>}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
              }}
            >
              <Text
                style={{
                  color: colors.textAndIcons,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                No faunas identified in the wild.
              </Text>
            </View>
          )}
          ListFooterComponent={<View style={{ height: 100 }}></View>}
          initialNumToRender={3}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
};

export default Explore;
