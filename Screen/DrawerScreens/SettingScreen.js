import React, { useState, useEffect } from 'react';

import styles from '../Components/Style';

import {
	Alert,
	View,
	ScrollView,
	Text,
	TextInput,
	SafeAreaView,
	AsyncStorage,
	BackHandler,
	TouchableOpacity
} from 'react-native';

import { Button, Icon, ListItem, CheckBox } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import * as Location from 'expo-location';

export default class SettingScreen extends React.PureComponent {
	constructor(props) {

		super(props)

		this.state = {
			optionId: (this.props.route.params.data.id) ? this.props.route.params.data.id : 1,
			optionData: (this.props.route.params.data) ? this.props.route.params.data : false,
			userName: (global.data_user.name) ? global.data_user.name : '',
			userPhone: (global.data_user.phone) ? global.data_user.phone : '',
			userEmail: (global.data_user.email) ? global.data_user.email : '',
			userDR: (global.data_user.birthday) ? global.data_user.birthday : '',

			list_address: [],

			address_title: (this.props.route.params.location) ? this.props.route.params.location[0].street + ' ' + this.props.route.params.location[0].name : null,
			address_street: (this.props.route.params.location) ? this.props.route.params.location[0].street : null,
			address_dom: (this.props.route.params.location) ? this.props.route.params.location[0].name : null,
			address_kv: '',
			address_pod: '',
			address_etaz: '',
			address_comment: '',
			address_checkbox: false,

			list_history: [],

			/*cards: [],
			card_number: '',
			card_date: '',
			card_cvc: '',
			card_save: false*/
		}
		this.backButtonClick = this.backButtonClick.bind(this);
	}
	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
	}
	backButtonClick() {
		if (this.props.navigation && this.props.navigation.goBack) {
			if (this.props.route.params && this.props.route.params.action) {
				this.props.navigation.replace('SettingScreen', { data: this.state.optionData });
			} else {
				this.props.navigation.goBack();
			}
			return true;
		} else {
			return false;
		}
	}
	getSaveData(key) {
		if (key) {
			AsyncStorage.getItem(key).then(async (data) => {
				const data_value = await data;
				if (data_value) {
					let data_new = {};
					data_new[key] = JSON.parse(data_value);
					this.setState(data_new);
				} else {
					return false;
				}
			});
		} else {
			return false;
		}
	}
	getLocation = async () => {
		let { status } = await Location.requestPermissionsAsync();

		if (status !== 'granted') {
			Alert.alert(
				'Разрешение геолокации',
				'Разрешите приложению использовать службу определения местоположения.',
				[{ text: 'OK' }],
				{ cancelable: false }
			);
		}

		let { coords } = await Location.getCurrentPositionAsync();

		if (coords) {
			const { latitude, longitude } = coords;
			let response = await Location.reverseGeocodeAsync({
				latitude,
				longitude
			});
			if (response.length > 0) {
				setTimeout(() => {
					global.location(response);
					this.props.navigation.navigate('SettingScreen', { data: this.state.optionData, action: 'add', location: response });
				}, 2000);
			}
		}
	};
	componentDidMount() {
		this.props.navigation.setOptions({ title: this.state.optionData.title });
		if (this.state.optionId == 1) {
			this.props.navigation.setOptions({
				title: (this.state.optionData.title) ? this.state.optionData.title : 'Личные данные',
				headerTitleStyle: {
					alignSelf: 'center',
				},
				headerRight: () => (
					<Icon
						containerStyle={styles.iconMenuRight}
						name='checkmark'
						type='ionicon'
						onPress={() => { this.loadPage('edit') }}
					/>
				)
			});
		} else if (this.state.optionId == 2) {
			if (this.props.route.params.action == 'edit') {
				this.props.navigation.setOptions({
					title: 'Изменить адрес',
					headerTitleStyle: {
						alignSelf: 'center',
					},
					headerRight: () => (
						<Icon
							containerStyle={styles.iconMenuRight}
							name='trash-outline'
							type='ionicon'
							onPress={() => {
								Alert.alert(
									'Удалить адрес',
									'Вы точно хотите удалить адрес "' + this.props.route.params.address.title + '"?',
									[
										{
											text: 'Отмена',
											onPress: () => {
												return null;
											},
										},
										{
											text: 'Удалить',
											onPress: () => {
												this.loadPage('delete');
											},
										},
									], { cancelable: false },
								)
							}}

						/>
					)
				});
			} else if (this.props.route.params.action == 'add') {
				this.getLocation();
			} else {
				this.props.navigation.setOptions({
					title: (this.state.optionData.title) ? this.state.optionData.title : 'Адреса доставки',
					headerTitleStyle: {
						alignSelf: 'center',
					},
					headerRight: () => (
						<Icon
							containerStyle={styles.iconMenuRight}
							name='add-circle-outline'
							type='ionicon'
							onPress={() => { this.props.navigation.navigate('SettingScreen', { data: this.state.optionData, action: 'add' }) }}
						/>
					)
				});
				this.getSaveData('list_address');
				this.loadPage();
			}

		} else if (this.state.optionId == 3) {
			if (this.props.route.params.action == 'edit') {
				this.props.navigation.setOptions({
					title: 'Изменить данные',
					headerTitleStyle: {
						alignSelf: 'center',
					},
					headerRight: () => (
						<Icon
							containerStyle={styles.iconMenuRight}
							name='trash-outline'
							type='ionicon'
							onPress={() => {
								Alert.alert(
									'Удалить способ оплаты',
									'Вы точно хотите удалить способ оплаты "' + this.props.route.params.card.card_number + '"?',
									[
										{
											text: 'Отмена',
											onPress: () => {
												return null;
											},
										},
										{
											text: 'Удалить',
											onPress: () => {
												this.deleteCard(this.props.route.params.card.id);
											},
										},
									], { cancelable: false },
								)
							}}

						/>
					)
				});
			} else {
				this.props.navigation.setOptions({
					title: (this.state.optionData.title) ? this.state.optionData.title : 'Способы оплаты',
					headerTitleStyle: {
						alignSelf: 'center',
					},
					headerRight: () => (
						<Icon
							containerStyle={styles.iconMenuRight}
							name='add-circle-outline'
							type='ionicon'
							onPress={() => { this.props.navigation.navigate('SettingScreen', { data: this.state.optionData, action: 'add' }) }}
						/>
					)
				});
			}
			this.getSaveData('cards');
		} else if (this.state.optionId == 4) {
			this.getSaveData('list_history');
			this.loadPage();
		} else if (this.state.optionId == 5) {
			this.getSaveData('list_points');
			this.loadPage();
		} else {
			this.props.navigation.setOptions({
				headerRight: () => (
					<View style={styles.iconMenuRight}></View>
				)
			});
		}
	}
	/*
	saveCard = async () => {
		if (this.state.card_number.length < 18) {
			Alert.alert("Ошибка", "Заполните поле с номером карты", [{ text: "OK" }], { cancelable: true });
			return false;
		}
		if (this.state.card_date.length < 5) {
			Alert.alert("Ошибка", "Заполните поле с датой", [{ text: "OK" }], { cancelable: true });
			return false;
		}
		if (this.state.card_cvc.length < 3) {
			Alert.alert("Ошибка", "Заполните поле с кодом cvc", [{ text: "OK" }], { cancelable: true });
			return false;
		}
		let data = this.state.cards;
		data.push({
			'id': (this.state.cards) ? this.state.cards.length + 1 : 1,
			'card_number': this.state.card_number,
			'card_date': this.state.card_date,
			'card_cvc': this.state.card_cvc,
			'card_save': this.state.card_save
		});
		try {
			await AsyncStorage.setItem('cards', JSON.stringify(data));
		} catch (err) {
			console.log(err);
		}
		this.props.navigation.replace('SettingScreen', { data: this.state.optionData });
	}
	deleteCard = (id) => {
		if (id) {
			let data = this.state.cards;
			if (data) {
				data.forEach(function (el, i) {
					if (el.id == id) data.splice(i, 1)
				});
				this.setState({ cards: data });
				AsyncStorage.setItem('cards', JSON.stringify(data));
			}
		}
	}*/
	loadPage = (array) => {

		let formData = new FormData();
		if (this.state.optionId == 1) {
			if (array == 'edit') {
				formData.append('form', 'edit_user');
				formData.append('name', this.state.userName);
				if (this.state.userPhone && this.state.userPhone.length > 8) {
					formData.append('phone', this.state.userPhone);
				} else {
					Alert.alert("Ошибка", "Заполните поле телефона", [{ text: "OK" }], { cancelable: true });
					return false;
				}
				formData.append('email', this.state.userEmail);
				formData.append('birthday', this.state.userDR);
			} else {
				return false;
			}
		} else if (this.state.optionId == 2) {
			formData.append('form', 'address');
			if (array == 'add') {
				formData.append('action', 'add');
				formData.append('address_title', this.state.address_title);
				if (this.state.address_street && this.state.address_street.length > 0) {
					formData.append('address_street', this.state.address_street);
				} else {
					Alert.alert("Ошибка", "Заполните поле улицы", [{ text: "OK" }], { cancelable: true });
					return false;
				}
				if (this.state.address_dom && this.state.address_dom.length > 0) {
					formData.append('address_dom', this.state.address_dom);
				} else {
					Alert.alert("Ошибка", "Заполните поле дома", [{ text: "OK" }], { cancelable: true });
					return false;
				}
				if (this.state.address_kv && this.state.address_kv.length > 0) {
					formData.append('address_kv', this.state.address_kv);
				} else {
					Alert.alert("Ошибка", "Заполните поле квартиры", [{ text: "OK" }], { cancelable: true });
					return false;
				}
				formData.append('address_pod', this.state.address_pod);
				formData.append('address_etaz', this.state.address_etaz);
				formData.append('address_comment', this.state.address_comment);
				formData.append('address_checkbox', this.state.address_checkbox);
			} else if (array == 'delete' && this.props.route.params.address.id) {
				formData.append('action', 'delete');
				formData.append('id', this.props.route.params.address.id);
			}
		} else if (this.state.optionId == 4) {
			formData.append('form', 'history');
		} else if (this.state.optionId == 5) {
			formData.append('form', 'points');
		} else {
			return false;
		}

		formData.append('user_id', global.data_user.id);

		fetch(global.site_url, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((responseJson) => {

				if (responseJson.status == 1) {
					if (this.state.optionId == 1) {
						if (responseJson.data) {
							global.data_user = responseJson.data;
							AsyncStorage.setItem('user_data', JSON.stringify(responseJson.data));
						}
						Alert.alert("Уведомление", "Данные успешно сохранены", [{ text: "OK" }], { cancelable: true });
					} else if (this.state.optionId == 2) {
						if (responseJson.data && array == 'add') {
							global.data_user.address = responseJson.data;
							AsyncStorage.setItem('user_data', JSON.stringify(global.data_user));
							this.props.navigation.replace('SettingScreen', { data: this.state.optionData });
						} else if (responseJson.data && array == 'delete') {
							let data = responseJson.data[0];
							if (data) {
								data.forEach(function (el, i) {
									if (el.id == data.id) data.splice(i, 1)
								});
								this.setState({ list_address: data });
								AsyncStorage.setItem('list_address', JSON.stringify(data));
							} else {
								this.setState({ list_address: [] });
								AsyncStorage.setItem('list_address', JSON.stringify(null));
							}

							this.props.navigation.replace('SettingScreen', { data: this.state.optionData });
						} else {
							this.setState({ list_address: responseJson.data });
							AsyncStorage.setItem('list_address', JSON.stringify(responseJson.data));
						}
					} else if (this.state.optionId == 4) {
						this.setState({ list_history: responseJson.data });
						AsyncStorage.setItem('list_history', JSON.stringify(responseJson.data));
					} else if (this.state.optionId == 5) {
						this.setState({ list_points: responseJson.data });
						AsyncStorage.setItem('list_points', JSON.stringify(responseJson.data));
					} else {
						return false;
					}
				} else {
					if (responseJson.text) {
						Alert.alert("Ошибка", responseJson.text, [{ text: "OK" }], { cancelable: true });
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	render() {
		if (this.state.optionId == 1) {
			return (
				<SafeAreaView style={styles.body}>
					<ScrollView>
						<View style={[styles.main, styles.mt_3]}>
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
									defaultValue={(global.data_user.name) ? global.data_user.name : null}
									autoCapitalize="sentences"
									autoCompleteType="name"
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
									value={this.state.userPhone}
									keyboardType="phone-pad"
									autoCompleteType="tel"
									onChangeText={text => {
										this.setState({
											userPhone: text
										})
									}}
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
									defaultValue={(global.data_user.email) ? global.data_user.email : null}
									keyboardType="email-address"
									autoCompleteType="email"
								/>
							</View>
							<Text style={styles.form_label}>Дата рождения</Text>
							<View style={{ flexDirection: 'row', position: 'relative' }}>
								<View style={styles.iconInput}>
									<Icon
										name='calendar-outline'
										type='ionicon'
										color='#8D8D8D'
									/>
								</View>
								<TextInputMask
									style={[styles.inputStyle, styles.inputPaddingLeft]}
									placeholder="00.00.0000"
									type={'datetime'}
									options={{
										format: 'DD.MM.YYYY'
									}}
									value={this.state.userDR}
									onChangeText={text => {
										this.setState({
											userDR: text
										})
									}}
								/>
							</View>
							<Button
								activeOpacity={0.8}
								TouchableComponent={TouchableOpacity}
								title="Сохранить"
								buttonStyle={styles.button}
								onPress={() => { this.loadPage('edit') }}
								loading={this.state.loading}
							/>
						</View>
					</ScrollView>
				</SafeAreaView>
			);
		} else if (this.state.optionId == 2) {
			if (this.props.route.params.action == 'edit') {
				return (
					<SafeAreaView style={[styles.body, styles.main]}>
						<ScrollView>
							<Text style={{ fontSize: 22, fontWeight: 'bold' }}>{this.props.route.params.address.title}</Text>
							<Text style={{ fontSize: 17, marginTop: 10 }}>{this.props.route.params.address.subtitle}</Text>
						</ScrollView>
					</SafeAreaView>
				);
			} else if (this.props.route.params.action == 'add') {
				return (
					<SafeAreaView style={[styles.body, styles.main]}>
						<ScrollView>
							<View style={styles.mt_2}>
								<View>
									<Text style={styles.form_label}>Название адреса</Text>
									<TextInput
										style={styles.inputStyle}
										maxLength={100}
										onChangeText={(title) => this.setState({ address_title: title })}
										placeholder="Введите название"
										autoCompleteType="street-address"
										defaultValue={(this.props.route.params.location) ? this.props.route.params.location[0].street + ' ' + this.props.route.params.location[0].name : null}
									/>
								</View>
								<View>
									<Text style={styles.form_label}>Улица</Text>
									<TextInput
										maxLength={250}
										style={styles.inputStyle}
										onChangeText={(street) => this.setState({ address_street: street })}
										placeholder="Введите улицу"
										autoCompleteType="street-address"
										defaultValue={(this.props.route.params.location) ? this.props.route.params.location[0].street : null}
									/>
								</View>
							</View>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ flexBasis: '50%', paddingRight: 5 }}>
									<Text style={styles.form_label}>Дом</Text>
									<TextInput
										maxLength={4}
										style={styles.inputStyle}
										onChangeText={(dom) => this.setState({ address_dom: dom })}
										placeholder="Введите дом"
										defaultValue={(this.props.route.params.location) ? this.props.route.params.location[0].name : null}
									/>
								</View>
								<View style={{ flexBasis: '50%', paddingLeft: 5 }}>
									<Text style={styles.form_label}>Квартира</Text>
									<TextInput
										maxLength={4}
										style={styles.inputStyle}
										onChangeText={(kv) => this.setState({ address_kv: kv })}
										placeholder="Введите квартиру"
										keyboardType="number-pad"
									/>
								</View>
							</View>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ flexBasis: '50%', paddingRight: 5 }}>
									<Text style={styles.form_label}>Подъезд</Text>
									<TextInput
										maxLength={2}
										style={styles.inputStyle}
										onChangeText={(pod) => this.setState({ address_pod: pod })}
										placeholder="Введите подъезд"
										keyboardType="number-pad"
									/>
								</View>
								<View style={{ flexBasis: '50%', paddingLeft: 5 }}>
									<Text style={styles.form_label}>Этаж</Text>
									<TextInput
										maxLength={3}
										style={styles.inputStyle}
										onChangeText={(etaz) => this.setState({ address_etaz: etaz })}
										placeholder="Введите этаж"
										keyboardType="number-pad"
									/>
								</View>
							</View>
							<View>
								<Text style={styles.form_label}>Комментарий</Text>
								<TextInput
									maxLength={500}
									style={styles.inputStyle}
									onChangeText={(comment) => this.setState({ address_comment: comment })}
									placeholder="Комментарий к адресу"
								/>
							</View>
							<CheckBox
								title='выбрать этот адрес по умолчанию'
								iconType='ionicon'
								containerStyle={styles.checkbox}
								activeOpacity={0.8}
								checkedIcon='checkbox'
								uncheckedIcon='square-outline'
								checkedColor='#BE5B26'
								checked={this.state.address_checkbox}
								onPress={() => this.setState({ address_checkbox: !this.state.address_checkbox })}
							/>
							<View style={styles.mt_2}>
								<Button
									activeOpacity={0.8}
									TouchableComponent={TouchableOpacity}
									title="Сохранить адрес"
									buttonStyle={styles.button}
									onPress={() => { this.loadPage('add') }}
									loading={this.state.loading}
								/>
							</View>
						</ScrollView>
					</SafeAreaView>
				);

			} else {
				if (this.state.list_address && this.state.list_address.length > 0) {
					return (
						<SafeAreaView style={styles.body}>
							<ScrollView>
								{this.state.list_address.map((item, i) => (
									<ListItem activeOpacity={0.96} key={i} onPress={() => { this.props.navigation.replace('SettingScreen', { data: this.state.optionData, action: 'edit', address: item }) }} bottomDivider>
										<ListItem.Content>
											<ListItem.Title>{item.title}</ListItem.Title>
											<ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
										</ListItem.Content>
										<ListItem.Chevron />
									</ListItem>
								))
								}
							</ScrollView>
						</SafeAreaView>
					);
				} else {
					return (<View style={styles.nopage}><Text style={styles.nopageText}>Нет адресов</Text></View>);
				}
			}
			/*
		} else if (this.state.optionId == 3) {
			if (this.props.route.params.action == 'edit') {
				return (
					<SafeAreaView style={[styles.body, styles.main]}>
						<ScrollView>
							<Text style={{ fontSize: 22, fontWeight: 'bold' }}>{this.props.route.params.card.card_number}</Text>
							{(this.props.route.params.card.card_save) ? <Text style={{ color: 'green' }}>Карта по умолчанию</Text> : null}
						</ScrollView>
					</SafeAreaView>
				);
			} else if (this.props.route.params.action == 'add') {
				return (
					<SafeAreaView style={[styles.body, styles.main]}>
						<ScrollView>
							<View style={styles.mt_2}>
								<View>
									<Text style={styles.form_label}>Номер карты</Text>
									<TextInputMask
										style={styles.inputStyle}
										placeholder="1234 5678 9012 3456"
										type={'credit-card'}
										options={{
											mask: '9999 9999 9999 9999'
										}}
										value={this.state.card_number}
										keyboardType="number-pad"
										onChangeText={text => {
											this.setState({
												card_number: text
											})
										}}
										maxLength={19}
									/>
								</View>
							</View>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ flexBasis: '50%', paddingRight: 5 }}>
									<Text style={styles.form_label}>Срок действия</Text>
									<TextInputMask
										style={styles.inputStyle}
										placeholder="01/23"
										type={'datetime'}
										options={{
											format: 'MM/YY'
										}}
										value={this.state.card_date}
										keyboardType="number-pad"
										onChangeText={text => {
											this.setState({
												card_date: text
											})
										}}
										maxLength={5}
									/>
								</View>
								<View style={{ flexBasis: '50%', paddingLeft: 5 }}>
									<Text style={styles.form_label}>CVC</Text>
									<TextInputMask
										style={styles.inputStyle}
										placeholder="123"
										type={'only-numbers'}
										options={{
											mask: '999'
										}}
										maxLength={3}
										value={this.state.card_cvc}
										keyboardType="number-pad"
										onChangeText={text => {
											this.setState({
												card_cvc: text
											})
										}}
									/>
								</View>
							</View>
							<CheckBox
								title='сохранить данные карты в личном кабинете'
								iconType='ionicon'
								containerStyle={styles.checkbox}
								activeOpacity={0.8}
								checkedIcon='checkbox'
								uncheckedIcon='square-outline'
								checkedColor='#BE5B26'
								checked={this.state.card_save}
								onPress={() => this.setState({ card_save: !this.state.card_save })}
							/>
							<View style={styles.mt_2}>
								<Button
									activeOpacity={0.8}
									TouchableComponent={TouchableOpacity}
									title="Сохранить способ оплаты"
									buttonStyle={styles.button}
									onPress={() => { this.saveCard() }}
									loading={this.state.loading}
								/>
							</View>
						</ScrollView>
					</SafeAreaView>
				);
			} else {
				if (this.state.cards && this.state.cards.length > 0) {
					return (
						<SafeAreaView style={styles.body}>
							<ScrollView>
								{this.state.cards.map((item, i) => (
									<ListItem activeOpacity={0.96} key={i} onPress={() => { this.props.navigation.replace('SettingScreen', { data: this.state.optionData, action: 'edit', card: item }) }} bottomDivider>
										<ListItem.Content>
											<ListItem.Title>**** **** **** {item.card_number.substr(15)}</ListItem.Title>
											<ListItem.Subtitle>{item.card_date} {(item.card_save) ? <Text style={{ color: 'green' }}>Карта по умолчанию</Text> : null}</ListItem.Subtitle>
										</ListItem.Content>
										<ListItem.Chevron />
									</ListItem>
								))
								}
							</ScrollView>
						</SafeAreaView>
					);
				} else {
					return (<View style={styles.nopage}><Text style={styles.nopageText}>Нет сохраненных способов оплаты</Text></View>);
				}
			}
			*/
		} else if (this.state.optionId == 4) {
			if (this.state.list_history && this.state.list_history.length > 0) {
				return (
					<SafeAreaView style={styles.body}>
						<ScrollView>
							{
								(this.state.list_history) ?
									this.state.list_history.map((item) => (
										<ListItem activeOpacity={0.96} key={item.id} bottomDivider>
											<ListItem.Content>
												<ListItem.Subtitle>Номер заказа {item.session_id}</ListItem.Subtitle>
												<ListItem.Title>Сумма {item.all_price} руб</ListItem.Title>
												<ListItem.Title>{(item.street) ? 'Адрес доставки: ' + item.street : 'Самовывоз'}</ListItem.Title>
												<ListItem.Subtitle>{item.date}</ListItem.Subtitle>
											</ListItem.Content>
										</ListItem>
									))
									: null
							}
						</ScrollView>
					</SafeAreaView>
				);
			} else {
				return (<View style={styles.nopage}><Text style={styles.nopageText}>Нет истории заказов</Text></View>);
			}

		} else if (this.state.optionId == 5) {
			return (
				<SafeAreaView style={styles.body}>
					<ScrollView>
						<ListItem key={1} onPress={() => { }} bottomDivider>
							<ListItem.Content>
								<ListItem.Title>Процент начисления</ListItem.Title>
								<ListItem.Subtitle>13%</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
						<ListItem key={2} onPress={() => { }} bottomDivider>
							<ListItem.Content>
								<ListItem.Title>Общее количество баллов</ListItem.Title>
								<ListItem.Subtitle>{(global.data_user) ? global.data_user.point : 0}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider>
							<ListItem.Content>
								<ListItem.Title>История списаний и начислений</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						{
							(this.state.list_points) ?
								this.state.list_points.map((item) => (
									<ListItem activeOpacity={0.96} key={item.id} bottomDivider>
										<ListItem.Content>
											<ListItem.Subtitle>{item.date}</ListItem.Subtitle>
											<ListItem.Title style={{ color: (item.type == 1) ? 'red' : 'green' }}>{(item.type == 1) ? '-' : '+'}{item.value}</ListItem.Title>
											<ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
										</ListItem.Content>
									</ListItem>
								))
								: null
						}
					</ScrollView>
				</SafeAreaView>
			);

		} else {
			return (<View style={styles.nopage}><Text style={styles.nopageText}>Раздел в разработках</Text></View>);
		}
	}

}
