import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRecommendations } from "../Actions/RecommendationsAction.js";
import { logout } from "../Actions/LoginAction.js";
import { Icon } from "react-native-elements";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    height: 70,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
  },
  pageTitle: {
    fontSize: 30,
    color: "#008000",
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
    flex: 1,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 5,
  },
  titleview: {
    marginRight: 60,
  },
});
export default function Home(props) {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const recommendations = useSelector(
    (state) => state.recommendations.recommendations
  );

  useEffect(() => {
    if (jwtToken != "") {
      axios
        .get("http://10.0.2.2:5000/recommendations", {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          dispatch(updateRecommendations(response["data"]["researchers"]));
        })
        .catch((err) => {
          console.log("Error fetching data");
        });
    } else {
      props.navigation.push("Login");
    }
  }, []);

  const onProfileClick = (item) => {
    props.navigation.push("Profile", { item });
  };

  const logOut = () => {
    dispatch(logout());
    props.navigation.push("Login");
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <View style={styles.item}>
        <Image source={{ uri: item.url_picture }} style={styles.imageStyle} />
        <View style={styles.titleview}>
          <Text style={styles.title}>{item.researcher}</Text>
          <Text style={styles.subtitle}>
            {item["interests"] &&
              item["interests"].length != 0 &&
              (item["interests"].join(", ").length > 50
                ? item["interests"].join(", ").substring(0, 49 - 3) + "..."
                : item["interests"].join(", "))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => onProfileClick(item)} />;
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Recommendations</Text>
      <FlatList
        data={recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
      />
    </SafeAreaView>
  );
}
