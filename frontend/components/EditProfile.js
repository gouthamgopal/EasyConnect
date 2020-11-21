import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  profileName,
  profileScholarLink,
  profileInterests,
} from "../Actions/ProfileAction";
import { storeJwtToken } from "../Actions/LoginAction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // backgroundColor: "#F0FFF0",
    alignItems: "center",
    paddingTop: 40,
  },
  input: {
    borderStartWidth: 2,
    borderEndWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 20,
    padding: 10,
    fontSize: 20,
    // textAlign: "center",
    backgroundColor: "#fff",
    borderColor: "#aaa",
    width: 350,
    marginTop: 5,
  },
  editbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  editbutton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    width: 150,
    backgroundColor: "#00BFFF",
    marginVertical: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#90EE90",
    alignItems: "flex-start",
  },
});

export default function EditProfile(props) {
  const dispatch = useDispatch();

  const jwtToken = useSelector((state) => state.login.jwtToken);
  //   const user = jwt_decode(jwtToken)["user"];

  const fullname = useSelector((state) => state.profile.fullname);
  const scholar_link = useSelector((state) => state.profile.scholars_link);
  const interests = useSelector((state) => state.profile.interests);

  const [fullnameError, setfullnameError] = useState(false);
  const [scholar_linkError, setscholar_linkError] = useState(false);
  const [register_error, setregister_error] = useState(false);
  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });
  const validate = () => {
    let fullname_error = null;
    if (fullname == "") {
      fullname_error = true;
    } else {
      fullname_error = false;
    }
    setfullnameError(fullname_error);

    let scholar_link_error = null;
    let scholar_linkArr = scholar_link.split("=");

    if (
      scholar_link.length != 0 &&
      (scholar_linkArr[0] !== "https://scholar.google.com/citations?user" ||
        scholar_linkArr[1].length !== 12)
    ) {
      scholar_link_error = true;
    } else {
      scholar_link_error = false;
    }
    setscholar_linkError(scholar_link_error);

    if (fullname_error || scholar_link_error) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate) {
      let payload = {
        full_name: fullname,
        scholars_link: scholar_link,
        interests: interests.split(","),
      };

      console.log(payload);

      axios
        .put("http://10.0.2.2:5000/profile", payload, {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          if (response.status == 403) {
            console.log("Error from backend", reponse);
            setregister_error(true);
          } else {
            console.log("Updated Succesfully.", response);
            let jwt_token = response["data"]["token"];
            setregister_error(false);
            dispatch(storeJwtToken(jwt_token));
            props.navigation.navigate("UserProfile");
          }
        })
        .catch((error) => {
          setregister_error(true);
          console.log("Invalid Register Attempt ", error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Full Name: </Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullname}
        onChange={(text) => dispatch(profileName(text))}
      />
      <Text style={styles.label}>Google Scholar Link: </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(profileScholarLink(text.trim()))}
        value={scholar_link}
        placeholder="Google Scholar link, if applicable"
      />
      <Text style={styles.label}>Interests: </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(profileInterests(text))}
        value={interests}
        placeholder="Add your research interests"
      />
      <TouchableOpacity
        style={styles.editbutton}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.editbuttonText}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
