// Import React
import React from 'react';

//Style global
import styles from './Components/Style';

import { View, Text, Image, TouchableOpacity, Dimensions, AppState, AsyncStorage } from 'react-native';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, Button } from 'react-native-elements';

// Import Screens
import HomeScreen from './DrawerScreens/HomeScreen';
import NotificationScreen from './DrawerScreens/NotificationScreen';
import SearchScreen from './DrawerScreens/SearchScreen';

import CartScreen from './DrawerScreens/CartScreen';

import BookListGenreScreen from './DrawerScreens/BookListGenreScreen';
import BookScreen from './DrawerScreens/BookScreen';

import ProfileScreen from './DrawerScreens/ProfileScreen';
import SettingScreen from './DrawerScreens/SettingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default class NavigationRoutes extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedId: null,
			activeIndex: 0,
			appState: AppState.currentState,
			cart: [],
			cart_count: 0,
			location: (global.data_user.address && global.data_user.address[0]) ? global.data_user.address[0].street : 'Адрес доставки'
		};
	}
	async getData() {
		const cart = await AsyncStorage.getItem("cart");
		await AsyncStorage.getItem('user_data').then(function (value) {
			let parse = JSON.parse(value);
			if (parse) {
				global.data_user = parse;
			}
		});
		this.setState({ cart_count: JSON.parse(cart).length, cart: JSON.parse(cart) });
	}
	homeScreenStack = ({ navigation }) => {
		return (
			<Stack.Navigator initialRouteName="HomeScreen">
				<Stack.Screen
					name="Главная"
					component={HomeScreen}
					options={{
						headerTitle: () => (
							<Text style={styles.headerTitle} onPress={() => { navigation.navigate('SettingScreen', { data: { id: 2 } }) }}>{this.state.location}</Text>
						),
						headerLeft: () => (
							<Icon
								containerStyle={styles.iconMenuLeft}
								name='location-outline'
								type='ionicon'
								color='#F4BD7F'
								onPress={() => { }}
							/>
						),
						headerRight: () => (
							<Icon
								containerStyle={styles.iconMenuRight}
								name='search-outline'
								type='ionicon'
								onPress={() => { navigation.navigate('SearchScreen') }}
							/>
						),
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0
						},
					}}
				/>
				<Stack.Screen
					name="SettingScreen"
					component={SettingScreen}
					options={{
						title: 'Настройки',
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
					}}
				/>
				<Stack.Screen
					name="SearchScreen"
					component={SearchScreen}
					options={{
						title: 'Поиск',
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0
						},
					}}
				/>

				<Stack.Screen
					name="BookListGenreScreen"
					component={BookListGenreScreen}
					options={{
						title: 'Категория',
						headerTitleStyle: {
							alignSelf: 'center',
						},
						headerRight: () => (
							<Icon
								containerStyle={styles.iconMenuRight}
								name='search-outline'
								type='ionicon'
								onPress={() => { navigation.navigate('SearchScreen') }}
							/>
						),
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0
						},
					}}
				/>
				<Stack.Screen
					name="BookScreen"
					component={BookScreen}
					options={{
						title: 'Товар',
						headerTitleStyle: {
							alignSelf: 'center',
						},
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
					}}
				/>

			</Stack.Navigator>
		);
	};
	cartScreenStack = ({ navigation }) => {

		return (
			<Stack.Navigator initialRouteName="CartScreen">
				<Stack.Screen
					name="CartScreen"
					component={CartScreen}
					options={{
						title: 'Корзина',
						headerTitleStyle: {
							alignSelf: 'center',
						},
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
						headerLeft: () => (
							<View style={styles.iconMenuLeft}></View>
						),
					}}
				/>
			</Stack.Navigator>
		);
	};

	notificationScreenStack = ({ navigation }) => {

		return (
			<Stack.Navigator initialRouteName="NotificationScreen">
				<Stack.Screen
					name="NotificationScreen"
					component={NotificationScreen}
					options={{
						title: 'Уведомления',
						headerTitleStyle: {
							alignSelf: 'center',
						},
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
					}}
				/>
			</Stack.Navigator>
		);
	};
	profileScreenStack = ({ navigation }) => {
		return (
			<Stack.Navigator
				initialRouteName="ProfileScreen"
				screenOptions={{
					headerTitleStyle: {
						alignSelf: 'center',
					}
				}}>
				<Stack.Screen
					name="ProfileScreen"
					component={ProfileScreen}
					options={{
						title: 'Профиль',
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
					}}
				/>
				<Stack.Screen
					name="SettingScreen"
					component={SettingScreen}
					options={{
						title: 'Настройки',
						headerStyle: {
							elevation: 0,
							shadowOpacity: 0,
						},
					}}
				/>
			</Stack.Navigator>
		);
	};
	componentDidMount() {
		this.props.navigation.addListener('focus', () => {
			this.getData();
		});
		global.location = (info) => {
			if (info) {
				this.setState({ location: info[0] });
			}
		}
		global.cart_delete_all = () => {
			this.setState({ cart_count: 0, cart: [] });
		}
		global.cart_delete_item = (value) => {
			this.setState({ cart_count: (value) ? value.length : 0, cart: (value) ? value : [] });
		}
		global.addCartProduct = (item) => {
			if (item) {
				if (this.state.cart_count == 0) {
					this.state.cart = [item];
					AsyncStorage.setItem('cart', JSON.stringify([item]));
					this.setState({ cart: this.state.cart, cart_count: this.state.cart_count + 1 });
				} else {
					let id_yes = Object.keys(this.state.cart).find(ids => this.state.cart[ids].id === item.id);
					if (!id_yes) {
						this.state.cart.push(item);
						AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
						this.setState({ cart: this.state.cart, cart_count: this.state.cart_count + 1 });
					}
				}
			}
		}

		global.product_mini = ({ item }) => {
			if (item) {
				return (
					<View key={item.id} style={[styles.carouselItem, { width: screenWidth / 2 - 20 }]} >
						<TouchableOpacity style={styles.carouselItemBox} activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('BookScreen', { data: item }) }}>
							{
								item.image ?
									<Image style={styles.bookImageCarousel} source={{ uri: item.image }} /> :
									<Image style={styles.bookImageCarousel} source={require('app/Image/imagebook.png')} />
							}
							<View style={{ padding: 8 }}>
								<Text numberOfLines={1} style={{ fontSize: 15 }}>{item.title}</Text>
								<Text numberOfLines={2} style={{ fontSize: 13, marginVertical: 3, minHeight: 35, color: '#777' }}>{item.desc}</Text>
								<Text numberOfLines={1} style={{ fontSize: 13, color: '#C96E37' }}>{Math.round(item.weight * 1000)} грамм</Text>
								<Button
									activeOpacity={0.8}
									TouchableComponent={TouchableOpacity}
									title={item.price + " руб"}
									buttonStyle={[styles.buttonMini, styles.mt_2]}
									titleStyle={styles.buttonMiniTitle}
									onPress={() => { global.addCartProduct(item) }}
								/>
							</View>
						</TouchableOpacity>
					</View>
				);
			} else {
				return false;
			}
		}
		global.category_mini = ({ item }) => {
			if (item) {
				return (
					<View key={item.id} style={[styles.carouselItem, { width: screenWidth / 2 - 20 }]} >
						<TouchableOpacity style={styles.carouselItemBox} activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('BookListGenreScreen', { data: item }) }}>
							{
								item.image ?
									<Image style={styles.categoryImageCarousel} source={{ uri: item.image }} /> :
									<Image style={styles.categoryImageCarousel} source={require('app/Image/imagebook.png')} />
							}
							<View style={{ paddingHorizontal: 8, backgroundColor: 'rgba(50, 50, 50, 0.8)', paddingVertical: 13, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
								<Text numberOfLines={1} style={{ alignSelf: 'center', fontSize: 14, color: '#fff', fontWeight: 'bold' }}>{item.title}</Text>
							</View>
						</TouchableOpacity>
					</View>
				);
			} else {
				return false;
			}
		}
		global.sale_mini = ({ item }) => {
			if (item) {
				return (
					<View key={item.id} style={[styles.carouselItem, { width: screenWidth - 40 }]} >
						<TouchableOpacity style={styles.carouselItemBox} activeOpacity={0.7} onPress={() => { }}>
							{
								item.image ?
									<Image style={styles.categoryImageCarousel} source={{ uri: item.image }} /> :
									<Image style={styles.categoryImageCarousel} source={require('app/Image/imagebook.png')} />
							}
							<View style={{ alignSelf: 'flex-start', paddingHorizontal: 15, backgroundColor: 'rgba(50, 50, 50, 0.4)', paddingTop: 35, position: 'absolute', bottom: 0, top: 0, left: 0, right: 0 }}>
								<Text numberOfLines={2} style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>{item.title}</Text>
								<Text numberOfLines={2} style={{ fontSize: 15, color: '#fff' }}>{item.desc}</Text>
							</View>
						</TouchableOpacity>
					</View>
				);
			} else {
				return false;
			}
		}
	}

	render() {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'HomeScreen') {
							iconName = focused ? 'home' : 'home-outline';
						} else if (route.name === 'NotificationScreen') {
							iconName = focused ? 'notifications' : 'notifications-outline';
						} else if (route.name === 'ProfileScreen') {
							iconName = focused ? 'person' : 'person-outline';
						} else if (route.name === 'CartScreen') {
							iconName = focused ? 'cart' : 'cart-outline';
						}
						return <Icon name={iconName} type='ionicon' size={size} color={color} />;
					}
				})}
				tabBarOptions={{
					activeTintColor: '#BE5B26',
					inactiveTintColor: '#A0A0A0',
					labelStyle: { marginBottom: 2 },
					tabStyle: { fontWeight: 'bold', marginTop: 4 }
				}}
			>
				<Tab.Screen name="HomeScreen" component={this.homeScreenStack}
					options={{
						tabBarLabel: 'Главная',
					}}
				/>
				<Tab.Screen name="NotificationScreen" component={this.notificationScreenStack}
					options={{
						tabBarLabel: 'Уведомления'
					}}
				/>
				<Tab.Screen name="ProfileScreen" component={this.profileScreenStack}
					options={{
						tabBarLabel: 'Профиль'
					}}
				/>
				<Tab.Screen name="CartScreen" component={this.cartScreenStack}
					options={{
						tabBarLabel: 'Корзина',
						tabBarBadge: (this.state.cart_count > 0) ? (this.state.cart_count >= 50) ? '50+' : this.state.cart_count : null
					}}
				/>

			</Tab.Navigator>
		);
	}
}
