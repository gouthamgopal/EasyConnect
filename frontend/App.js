import "react-native-gesture-handler";
import * as React from "react";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Provider } from "react-redux";
import { store, persistor } from "./store.js";
import { PersistGate } from "redux-persist/integration/react";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PaperList from "./components/PaperList";
import PaperDetails from "./components/PaperDetails";
import Requests from "./components/Requests";
import Messages from "./components/Messages";
import Connections from "./components/Connections";
import MessageRoom from "./components/MessageRoom";
import UserProfile from "./components/UserProfile.js";
import { Button } from "react-native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { logout } from "./Actions/LoginAction.js";
import { useDispatch, useSelector } from "react-redux";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  // const dispatch = useDispatch();
  function homeStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3CB371",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
                title="Menu"
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  function requestStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3CB371",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Requests"
          component={Requests}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
                title="Menu"
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  function profileStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3CB371",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Profile"
          component={UserProfile}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
                title="Menu"
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  function messageStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3CB371",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Messages"
          component={Messages}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
                title="Menu"
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }

  const logOut = (navigation, dispatch) => {
    dispatch(logout());
    navigation.push("Login");
  };

  const LogoutDrawerContent = ({ props, dispatch }) => {
    console.log(props);
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={(props) => logOut(props.navigation, dispatch)}
        />
      </DrawerContentScrollView>
    );
  };

  function HomeDrawer(dispatch) {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={() => logOut(props.navigation, dispatch)}
            />
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen name="Home" component={homeStack} />
        <Drawer.Screen name="Requests" component={requestStack} />
        <Drawer.Screen name="UserProfile" component={profileStack} />
        <Drawer.Screen name="Messages" component={messageStack} />
      </Drawer.Navigator>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#3CB371",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="Home"
              component={() => HomeDrawer(useDispatch())}
              // options={({ navigation }) => ({
              //   headerLeft: () => (
              //     <Button
              //       onPress={() =>
              //         navigation.dispatch(DrawerActions.toggleDrawer())
              //       }
              //       title="Menu"
              //     />
              //   ),
              // })}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PaperList" component={PaperList} />
            <Stack.Screen name="PaperDetails" component={PaperDetails} />
            <Stack.Screen name="Connections" component={Connections} />
            <Stack.Screen name="MessageRoom" component={MessageRoom} />
            {/* <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PaperList" component={PaperList} />
            <Stack.Screen name="PaperDetails" component={PaperDetails} />
            <Stack.Screen name="Requests" component={Requests} />
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="Connections" component={Connections} />
            <Stack.Screen name="MessageRoom" component={MessageRoom} />
            <Stack.Screen name="UserProfile" component={UserProfile} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
