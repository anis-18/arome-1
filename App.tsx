import 'react-native-gesture-handler';

// Import React and Component
import * as React from 'react';

// Import Navigators from React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import PolicyUsers from './Screen/PolicyUsers';
import NavigationRoutes from './Screen/NavigationRoutes';

const Stack = createStackNavigator();

global.site_url = 'https://arome16.ru/apiapp/index.php';
global.data_user;

const Auth = () => {

	return (
		<Stack.Navigator initialRouteName="LoginScreen">
			<Stack.Screen
				name="LoginScreen"
				component={LoginScreen}
				options={{
					animationEnabled: false, headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
				}}
			/>
			<Stack.Screen
				name="RegisterScreen"
				component={RegisterScreen}
				options={{
					headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
				}}
			/>
			<Stack.Screen
				name="PolicyUsers"
				component={PolicyUsers}
				options={{
					title: 'Политика конфиденциальности',
					headerStyle: {
						elevation: 0,
						shadowOpacity: 0,
					},
					cardStyle: { backgroundColor: '#ffffff' }
				}}
			/>
		</Stack.Navigator>
	);
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="SplashScreen">
					<Stack.Screen
						name="SplashScreen"
						component={SplashScreen}
						options={{ animationEnabled: false, headerShown: false, cardStyle: { backgroundColor: '#333333' } }}
					/>

					<Stack.Screen
						name="Auth"
						component={Auth}
						options={{ animationEnabled: false, headerShown: false }}

					/>

					<Stack.Screen
						name="NavigationRoutes"
						component={NavigationRoutes}
						options={{ animationEnabled: false, headerShown: false }}
					/>

				</Stack.Navigator>
			</NavigationContainer>
		);
	}
};
