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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
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
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 5,
  },
  titleview: {
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    flex: 1,
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
        .get("http://127.0.0.1:5000/recommendations", {
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
            {item["interests"].length != 0 &&
              `Interests: ${item["interests"].join(", ")}`}
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
      {/* <Text style={styles.pageTitle}>Recommendations</Text> */}
      <FlatList
        data={recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
      />
      <TouchableOpacity onPress={() => logOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.push("Requests")}>
        <Text>Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.push("Messages")}>
        <Text>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.push("UserProfile")}>
        <Text>My profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
