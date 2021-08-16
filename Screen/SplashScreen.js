// Import React and Component
import React, { useState } from 'react';
import { Alert, ActivityIndicator, ImageBackground, View, StyleSheet, AsyncStorage } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  AsyncStorage.getItem('user_data').then(function (value) {
    let parse = JSON.parse(value);
    if (parse) {
      global.data_user = parse;
    }
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let formData = new FormData();
        formData.append('form', 'auth');
        formData.append('auth_update', 'login');
        formData.append('phone', (parse.phone) ? parse.phone : false);
        formData.append('password', (parse.password) ? parse.password : false);

        fetch(global.site_url, {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == 1) {
              global.data_user = responseJson.data;
              AsyncStorage.setItem('user_data', JSON.stringify(responseJson.data));
            } else {
              delete global.data_user;
              AsyncStorage.removeItem('user_data');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        Alert.alert(
          'Ошибка соединения',
          'У вас нет подключения к интернету. Восстановите соединение и попробуйте войти снова.',
          [{ text: 'OK' }], { cancelable: false },
        )
      }
    })
    return navigation.replace(value === null ? 'Auth' : 'NavigationRoutes');
  });

  return (
    <ImageBackground fadeDuration={0} source={require('app/Image/splash.png')} style={styles.image}>
      <View style={styles.container}>
        <ActivityIndicator
          animating={animating}
          color="#FFFFFF"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
    justifyContent: "center"
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
    bottom: '15%',
    height: 80,
  },
});
