// Import React and Component
import React, { useState, createRef } from 'react';
//Style global
import styles from './Components/Style';
import {
	Alert,
	StyleSheet,
	TextInput,
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	Keyboard,
	ScrollView,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';

export default class RegisterScreen extends React.Component {
	constructor(props) {

		super(props);
		this.state = {
			userName: '',
			userPhone: '',
			userEmail: '',
			userPassword: '',
			passwordView: true,
			loading: false,
			user: null
		}
		this.phoneInputRef = createRef();
		this.emailInputRef = createRef();
		this.passwordInputRef = createRef();
	}
	saveData = async (array) => {
		try {
			await AsyncStorage.setItem('user_data', JSON.stringify(array));
			global.data_user = array;
			this.props.navigation.replace('NavigationRoutes');
		} catch (error) {
			console.error(error);
		}
	};
	handleSubmitButton = () => {
		if (!this.state.userName) {
			Alert.alert(
				"Ошибка",
				"Заполните поле имя",
				[{ text: "OK" }], { cancelable: true }
			);
			return;
		}
		if (!this.state.userPhone) {
			Alert.alert(
				"Ошибка",
				"Заполните поле Номер телефона",
				[{ text: "OK" }], { cancelable: true }
			);
			return;
		}
		if (!this.state.userPassword) {
			Alert.alert(
				"Ошибка",
				"Заполните поле пароль",
				[{ text: "OK" }], { cancelable: true }
			);
			return;
		}

		this.setState({ loading: true });
		let formData = new FormData();
		formData.append('form', 'reg');
		formData.append('name', this.state.userName);
		formData.append('phone', this.state.userPhone);
		formData.append('email', this.state.userEmail);
		formData.append('password', this.state.userPassword);

		fetch(global.site_url, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == 1) {
					this.saveData(responseJson.data);
				} else {
					if (responseJson.text) {
						Alert.alert(
							"Ошибка",
							responseJson.text,
							[{ text: "OK" }], { cancelable: true }
						);
					} else {
						Alert.alert(
							"Ошибка",
							"Произошла неизвестная ошибка",
							[{ text: "OK" }], { cancelable: true }
						);
					}
				}
				this.setState({ loading: false });
			})
			.catch((error) => {
				console.error(error);
				this.setState({ loading: false });
			});
	};
	render() {
		return (
			<View style={styles.mainBody}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						flex: 1,
						justifyContent: 'center',
						alignContent: 'center',
					}}>
					<KeyboardAvoidingView enabled>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ alignSelf: 'center', fontSize: 30, marginBottom: 20 }}>Регистрация</Text>
						</View>
						<View style={styles.sectionStyle}>
							<Text style={styles.form_label}>Имя</Text>

							<View style={{ flexDirection: 'row', position: 'relative' }}>
								<View style={styles.iconInput}>
									<Icon
										name='person-outline'
										type='ionicon'
										color='#8D8D8D'
									/>
								</View>
								<TextInput
									style={[styles.inputStyle, styles.inputPaddingLeft]}
									onChangeText={(UserName) => this.setState({ userName: UserName })}
									placeholder="Ваше имя"
									placeholderTextColor={styles.inputTextStyle}
									autoCapitalize="sentences"
									returnKeyType="next"
									onSubmitEditing={() =>
										this.phoneInputRef.getElement().focus()
									}
									blurOnSubmit={false}
								/>
							</View>
							<Text style={styles.form_label}>Телефон</Text>
							<View style={{ flexDirection: 'row', position: 'relative' }}>
								<View style={styles.iconInput}>
									<Icon
										name='call-outline'
										type='ionicon'
										color='#8D8D8D'
									/>
								</View>
								<TextInputMask
									style={[styles.inputStyle, styles.inputPaddingLeft]}
									placeholder="+7(999)000-00-00"
									type={'custom'}
									options={{
										mask: '+7(999)999-99-99'
									}}
									ref={ref => this.phoneInputRef = ref}
									value={this.state.userPhone}
									keyboardType="phone-pad"
									returnKeyType="next"
									blurOnSubmit={false}
									autoCompleteType="tel"
									onChangeText={(UserPhone) => this.setState({ userPhone: UserPhone })}
									onSubmitEditing={() =>
										this.emailInputRef.current && this.emailInputRef.current.focus()
									}
								/>
							</View>
							<Text style={styles.form_label}>E-mail</Text>
							<View style={{ flexDirection: 'row', position: 'relative' }}>
								<View style={styles.iconInput}>
									<Icon
										name='mail-outline'
										type='ionicon'
										color='#8D8D8D'
									/>
								</View>
								<TextInput
									style={[styles.inputStyle, styles.inputPaddingLeft]}
									onChangeText={(UserEmail) => this.setState({ userEmail: UserEmail })}
									placeholder="Электронная почта"
									placeholderTextColor={styles.inputTextStyle}
									keyboardType="email-address"
									ref={this.emailInputRef}
									returnKeyType="next"
									onSubmitEditing={() =>
										this.passwordInputRef.current && this.passwordInputRef.current.focus()
									}
									blurOnSubmit={false}
								/>
							</View>

							<Text style={styles.form_label}>Пароль</Text>
							<View style={styles.form_group}>
								<View style={{ flexDirection: 'row', position: 'relative' }}>
									<View style={styles.iconInput}>
										<Icon
											name='lock-closed-outline'
											type='ionicon'
											color='#8D8D8D'
										/>
									</View>
									<TextInput
										style={[styles.inputStyle, styles.inputPaddingLeft]}
										onChangeText={(UserPassword) => this.setState({ userPassword: UserPassword })}
										placeholder="Придумайте пароль"
										placeholderTextColor={styles.inputTextStyle}
										keyboardType="default"
										ref={this.passwordInputRef}
										onSubmitEditing={Keyboard.dismiss}
										blurOnSubmit={false}
										secureTextEntry={this.state.passwordView}
										returnKeyType="next"
									/>
									<View style={styles.iconInputRight}>
										<Icon
											onPress={() => { this.setState({ passwordView: !this.state.passwordView }) }}
											name='eye-outline'
											type='ionicon'
											color='#8D8D8D'
										/>
									</View>
								</View>
							</View>
						</View>
						<Button
							title="Зарегистрироватся"
							buttonStyle={styles.buttonStyle}
							activeOpacity={0.8}
							TouchableComponent={TouchableOpacity}
							onPress={() => this.handleSubmitButton()}
							loading={this.state.loading}
						/>
						<TouchableOpacity
							style={[styles.mt_3, { alignSelf: 'center', paddingVertical: 10 }]}
							activeOpacity={0.6}
							onPress={() => this.props.navigation.navigate('LoginScreen')}>
							<Text style={{ color: '#7B8794' }}>
								У вас уже есть аккаунт? <Text style={{ color: '#BE5B26' }}>Войти</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.mt_3, { alignSelf: 'center', paddingVertical: 5 }]}
							activeOpacity={0.6}
							onPress={() => this.props.navigation.navigate('PolicyUsers')}>
							<Text style={{ color: '#7B8794' }}>
								Политика конфиденциальности
							</Text>
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</ScrollView>
			</View>
		);
	}
}