// Import React and Component
import * as React from 'react';

//Style global
import styles from '../Components/Style';

import { Alert, ScrollView, Text, SafeAreaView, Image, View, AsyncStorage, TextInput, BackHandler, TouchableOpacity } from 'react-native';

import { Button, Icon, Avatar, ListItem, CheckBox } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import { WebView } from 'react-native-webview';
export default class CartScreen extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			cart: [],
			cards: [],
			userPhone: (global.data_user.phone) ? global.data_user.phone : '',
			delivery: 1,
			payment: 1,
			time: 1,
			visible: false,
			time_value: new Date().toLocaleTimeString().slice(0, -3),
			total: 0,
			point: 0,
			point_yes: false,
			point_user: (global.data_user.point) ? global.data_user.point : 0,
			comment: ''
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
			if (this.props.route.params && this.props.route.params.data == 'order') {
				this.props.navigation.replace('CartScreen');
			} else {
				this.props.navigation.goBack();
			}
			return true;
		} else {
			return false;
		}
	}
	async componentDidMount() {
		if (this.props.route.params && this.props.route.params.data == 'order') {
			this.props.navigation.setOptions({
				title: 'Оформление заказа',
				headerTitleStyle: {
					alignSelf: 'center',
				},
				headerRight: () => (
					<View style={styles.iconMenuRight}></View>
				)
			});
		} else {
			this.props.navigation.setOptions({
				headerRight: () => (
					<Icon
						containerStyle={styles.iconMenuRight}
						name='trash-outline'
						type='ionicon'
						onPress={() => { this.deleteCart('all') }}
					/>
				)
			});
		}
		this.props.navigation.addListener('focus', () => {
			this.getData();
		});

	}

	async getData() {
		let cart = await AsyncStorage.getItem("cart");
		let cards = await AsyncStorage.getItem("cards");
		let total = 0;
		JSON.parse(cart).map((item) => {
			let price_item = (item.price * item.count) + ((item.pack) ? item.pack.price * item.count : 0);
			total = total + price_item;
		});
		total = total - this.state.point;
		this.setState({ cart: (cart) ? JSON.parse(cart) : false, cards: (cards) ? JSON.parse(cards) : false, total: total });
	}

	plusCartItemCount = (item) => {
		let id_yes = Object.keys(this.state.cart).find(ids => this.state.cart[ids].id === item.id);
		if (id_yes) {
			if (this.state.cart[id_yes].count <= 100) {
				let price_item = Number(item.price) + ((item.pack) ? Number(item.pack.price) : 0);
				this.state.cart[id_yes].count = this.state.cart[id_yes].count + 1;
				AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
				this.state.total = Number(this.state.total) + Number(price_item);
				this.setState({ cart: this.state.cart, total: this.state.total });
			}
		}
	}
	minusCartItemCount = (item) => {
		let id_yes = Object.keys(this.state.cart).find(ids => this.state.cart[ids].id === item.id);
		if (id_yes) {
			if (this.state.cart[id_yes].count > 1) {
				let price_item = Number(item.price) + ((item.pack) ? Number(item.pack.price) : 0);
				this.state.cart[id_yes].count = this.state.cart[id_yes].count - 1;
				AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
				this.state.total = Number(this.state.total) - Number(price_item);
				this.setState({ cart: this.state.cart, total: this.state.total });
			}
		}
	}
	deleteCart = (item) => {
		if (item.id) {
			Alert.alert(
				'Удалить товар',
				'Вы точно хотите удалить товар "' + item.title + '"?',
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
							let price_item = Number(item.price) + ((item.pack) ? Number(item.pack.price) : 0);
							const new_array = this.state.cart.filter((product) => product.id !== item.id);
							this.state.total = Number(this.state.total) - Number(price_item);
							this.setState({ cart: new_array, total: this.state.total });
							global.cart_delete_item(new_array);
							AsyncStorage.setItem('cart', JSON.stringify(new_array));
						},
					},
				], { cancelable: false },
			);

		} else if (item == 'all') {
			Alert.alert(
				'Очистить корзину',
				'Вы точно хотите очистить корзину?',
				[
					{
						text: 'Отмена',
						onPress: () => {
							return null;
						},
					},
					{
						text: 'Очистить',
						onPress: () => {
							AsyncStorage.removeItem('cart');
							this.setState({ cart: [], point_yes: false, point: 0, total: 0 });
							global.cart_delete_all();
						},
					},
				], { cancelable: false },
			);
		}
	}
	sendOrder = (array) => {
		let formData = new FormData();
		formData.append('form', 'order');
		formData.append('action', 'add');
		formData.append('user_id', global.data_user.id);
		formData.append('user', JSON.stringify(global.data_user));
		formData.append('phone', JSON.stringify(this.state.userPhone));
		formData.append('cart', JSON.stringify(this.state.cart));
		formData.append('delivery', this.state.delivery);
		formData.append('payment', this.state.payment);
		formData.append('time', this.state.time);
		if (this.state.time == 2) {
			formData.append('time_value', this.state.time_value);
		}
		if (this.state.cards && this.state.payment == 1) {
			formData.append('cards', JSON.stringify(this.state.cards));
		}
		if (this.state.point > 0) {
			formData.append('point', this.state.point);
		}
		if (this.state.comment.length > 0) {
			formData.append('comment', JSON.stringify(this.state.comment));
		}
		formData.append('total', this.state.total);
		fetch(global.site_url, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((responseJson) => {

				if (responseJson.status == 1) {
					AsyncStorage.removeItem('cart');
					this.setState({ cart: [], point_yes: false, point: 0, total: 0 });
					global.cart_delete_all();
					//AsyncStorage.setItem('order_history', JSON.stringify(responseJson.data));
					this.props.navigation.replace('CartScreen', { action: 'success', value: responseJson.data, type: this.state.payment });

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

		if (this.state.cart && this.state.cart.length > 0) {
			if (this.props.route.params && this.props.route.params.data == 'order') {
				return (
					<SafeAreaView style={styles.body}>
						<ScrollView style={styles.main}>
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
							<CheckBox
								title={<View style={styles.checkboxBox}><Text style={styles.checkboxTitle}>Самовывоз</Text><Text style={styles.checkboxDesc}>ул.Театральная д.3</Text></View>}
								activeOpacity={0.8}
								iconType='ionicon'
								containerStyle={styles.checkbox}
								checkedIcon='checkbox'
								uncheckedIcon='square-outline'
								checkedColor='#BE5B26'
								checked={this.state.delivery === 1}
								onPress={() => this.setState({ delivery: 1 })}
							/>
							<CheckBox
								title={<View style={styles.checkboxBox}><Text style={styles.checkboxTitle}>Курьерская доставка</Text><Text style={styles.checkboxDesc}>{(global.data_user.address && global.data_user.address[0]) ? global.data_user.address[0].street : null}</Text></View>}
								activeOpacity={0.8}
								iconType='ionicon'
								containerStyle={styles.checkbox}
								checkedIcon='checkbox'
								uncheckedIcon='square-outline'
								checkedColor='#BE5B26'
								checked={this.state.delivery === 2}
								onPress={() => this.setState({ delivery: 2 })}
							/>
							<View style={{ borderTopWidth: 1, borderColor: '#eeeeee' }}>
								<CheckBox
									title={<View style={styles.checkboxBox}><Text style={styles.checkboxTitle}>Оплата картой</Text></View>}
									activeOpacity={0.8}
									iconType='ionicon'
									containerStyle={styles.checkbox}
									checkedIcon='checkbox'
									uncheckedIcon='square-outline'
									checkedColor='#BE5B26'
									checked={this.state.payment === 1}
									onPress={() => this.setState({ payment: 1 })}
								/>
								<CheckBox
									title={<View style={styles.checkboxBox}><Text style={styles.checkboxTitle}>Наличными при получении</Text><Text style={styles.checkboxDesc}>Курьеру либо в ресторане</Text></View>}
									activeOpacity={0.8}
									iconType='ionicon'
									containerStyle={styles.checkbox}
									checkedIcon='checkbox'
									uncheckedIcon='square-outline'
									checkedColor='#BE5B26'
									checked={this.state.payment === 2}
									onPress={() => this.setState({ payment: 2 })}
								/>
							</View>
							<View style={{ borderTopWidth: 1, borderColor: '#eeeeee' }}>
								<CheckBox
									title={<View style={styles.checkboxBox}><Text style={styles.checkboxTitle}>Как можно быстрее</Text></View>}
									activeOpacity={0.8}
									iconType='ionicon'
									containerStyle={styles.checkbox}
									checkedIcon='checkbox'
									uncheckedIcon='square-outline'
									checkedColor='#BE5B26'
									checked={this.state.time === 1}
									onPress={() => this.setState({ time: 1 })}
								/>
								<CheckBox
									title={<View style={styles.checkboxBox}>
										<Text style={styles.checkboxTitle}>В определенное время</Text>
										<TextInputMask
											placeholder="00:00"
											type={'datetime'}
											options={{
												format: 'HH:mm'
											}}
											maxLength={5}
											value={this.state.time_value}
											keyboardType={"numeric"}
											textContentType={'oneTimeCode'}
											onChangeText={value => {
												this.setState({
													time_value: value
												})
											}}
										/>
									</View>}
									activeOpacity={0.8}
									iconType='ionicon'
									containerStyle={styles.checkbox}
									checkedIcon='checkbox'
									uncheckedIcon='square-outline'
									checkedColor='#BE5B26'
									checked={this.state.time === 2}
									onPress={() => this.setState({ time: 2 })}
								/>
								<TextInput
									style={styles.textarea}
									maxLength={1500}
									onChangeText={(text) => this.setState({ comment: text })}
									placeholder="Комментарий к заказу"
									autoCompleteType="name"
									multiline
									editable
									numberOfLines={4}
								/>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View><Text style={{ paddingVertical: 15 }}>{this.props.route.params.cart.length} шт</Text></View>
								<View><Text style={{ paddingVertical: 15 }}>{this.props.route.params.total} руб</Text></View>
							</View>
							<View style={{ borderTopWidth: 1, borderColor: '#eeeeee', flexDirection: 'row', justifyContent: 'space-between' }}>
								<View><Text style={{ fontSize: 18, paddingVertical: 15, fontWeight: 'bold' }}>Стоимость заказа</Text></View>
								<View><Text style={{ fontWeight: 'bold', fontSize: 20, paddingVertical: 15 }}>{this.props.route.params.total} руб</Text></View>
							</View>
							<Button
								activeOpacity={0.8}
								TouchableComponent={TouchableOpacity}
								title={"Оформить заказ"}
								buttonStyle={[styles.button, styles.mt_3]}
								onPress={() => { this.sendOrder() }}
							/>
							<Button
								activeOpacity={0.8}
								TouchableComponent={TouchableOpacity}
								title={"Отмена"}
								buttonStyle={[styles.buttonGray, styles.mt_3, styles.mb_3]}
								titleStyle={styles.buttonBorderText}
								onPress={() => { this.props.navigation.replace('CartScreen') }}
							/>
						</ScrollView>
					</SafeAreaView>
				);
			} else {
				return (
					<SafeAreaView style={styles.body}>
						<ScrollView>
							<ScrollView style={{ maxHeight: 300 }}>
								{
									this.state.cart.map((item) => {
										if (item) {
											var price_item = (item.price * item.count) + ((item.pack) ? item.pack.price * item.count : 0);
											return (<ListItem key={item.id} onPress={() => { }} activeOpacity={0.96} bottomDivider>
												<ListItem.Content style={{ alignSelf: 'flex-start', paddingTop: 5 }}>
													<Avatar title={'NO'} style={{ width: '100%', height: 70 }} source={{ uri: item.image }} />
													<Text style={{ alignSelf: 'center', color: '#C96E37', fontSize: 12, fontWeight: 'normal' }}>{Math.round(item.weight * 1000)} грамм</Text>
												</ListItem.Content>
												<ListItem.Content style={{ alignSelf: 'flex-start', flexBasis: '35%' }}>
													<ListItem.Title style={{ fontWeight: 'bold', fontSize: 17 }}>{item.title}</ListItem.Title>
													<ListItem.Subtitle style={{ color: '#999', fontSize: 12 }}>{item.desc}{(item.pack) ? <Text style={{ color: '#333' }}>{'\n'}{item.pack.title}: {item.pack.price} руб {(item.count > 1) ? '*' + item.count : null}</Text> : null}</ListItem.Subtitle>
													<View style={{ flexDirection: 'row', paddingTop: 5 }}>
														<View><Button activeOpacity={0.8} TouchableComponent={TouchableOpacity} icon={{ name: 'remove-outline', type: 'ionicon', size: 20, color: '#fff' }} buttonStyle={[styles.button, styles.buttonCount]} onPress={() => { this.minusCartItemCount(item) }} /></View>
														<View><Text style={{ paddingVertical: 5, paddingHorizontal: 15 }}>{(item.count > 0) ? item.count : 0}</Text></View>
														<View><Button activeOpacity={0.8} TouchableComponent={TouchableOpacity} icon={{ name: 'add-outline', type: 'ionicon', size: 20, color: '#fff' }} buttonStyle={[styles.button, styles.buttonCount]} onPress={() => { this.plusCartItemCount(item) }} /></View>
													</View>
												</ListItem.Content>
												<ListItem.Content style={{ alignSelf: 'flex-start' }}>
													<ListItem.Title style={{ alignSelf: 'flex-end', fontWeight: 'bold' }}>{price_item} р</ListItem.Title>
													<View style={{ alignSelf: 'flex-end', marginTop: 30 }}><Icon
														name='trash-outline'
														type='ionicon'
														onPress={() => { this.deleteCart(item) }}
													/></View>
												</ListItem.Content>
											</ListItem>);
										}
									})
								}
							</ScrollView>
							<View style={[styles.main, { borderBottomWidth: 1, borderColor: '#eeeeee' }]}>
								<Text style={{ fontWeight: 'bold', fontSize: 20, paddingVertical: 15, alignSelf: 'flex-end' }}>Итого: {Math.round(this.state.total)} руб</Text>
							</View>
							<View style={styles.main}>
								{
									(Math.round(this.state.total) >= 700) ?
										(this.state.point_user > 0) ?
											<View>
												{
													(this.state.point_yes) ?
														<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
															<View>
																<Text style={{ fontSize: 18, paddingVertical: 15, fontWeight: 'bold' }}>Скидка</Text>
															</View>
															<View>
																<Text style={{ fontSize: 18, paddingVertical: 15, color: '#999999' }}>-{this.state.point} руб</Text>
															</View>
														</View>
														:
														<View>
															<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
																<View>
																	<Text style={{ fontSize: 18, paddingVertical: 15, fontWeight: 'bold' }}>Оплата баллами</Text>
																</View>
																<View>
																	<Text style={{ fontSize: 18, paddingVertical: 15, color: '#999999' }}>{(this.state.point > this.state.point_user) ? 0 : this.state.point_user - this.state.point} баллов</Text>
																</View>
															</View>
															<TextInput
																style={styles.inputStyle}
																placeholder="0 баллов"
																placeholderTextColor={styles.inputTextStyle}
																autoCapitalize="none"
																keyboardType="number-pad"
																onChangeText={value => {
																	if (value > 0 && value <= this.state.point_user) {
																		this.setState({ point: value });
																	}
																}}
															/>
															<Button
																disabled={(this.state.point > this.state.point_user) ? true : false}
																activeOpacity={0.8}
																TouchableComponent={TouchableOpacity}
																title={"Применить" + ((this.state.point > 0) ? " " + this.state.point + " баллов" : '')}
																buttonStyle={styles.button}
																onPress={() => {
																	let procent = Math.round(this.state.total - (this.state.total / 100) * 30);
																	let total_procent = this.state.total - this.state.point;
																	if (this.state.point <= procent && this.state.point > 0 && this.state.point <= this.state.point_user && total_procent >= 700) {
																		this.setState({ total: total_procent, point_yes: true });
																	} else {
																		if (total_procent < 700) {
																			Alert.alert(
																				'Ошибка',
																				'Минимальная сумма заказа 700 руб.',
																				[{ text: 'OK' }], { cancelable: false }
																			);
																		} else {
																			Alert.alert(
																				'Ошибка',
																				'Вы можете потратить баллы не более 30% от итоговой суммы (' + procent + ').',
																				[{ text: 'OK' }], { cancelable: false }
																			);
																		}
																	}
																}}
															/>
														</View>
												}
											</View>
											: null
										: <Text style={[{ alignSelf: 'center' }, styles.mt_3]}>Минимальная сумма заказа от 700 руб</Text>
								}
								<Button
									activeOpacity={0.8}
									disabled={(Math.round(this.state.total) < 700) ? true : false}
									TouchableComponent={TouchableOpacity}
									title={"Оформить заказ на " + Math.round(this.state.total) + " руб"}
									buttonStyle={[styles.button, styles.mt_3]}
									onPress={() => { this.props.navigation.replace('CartScreen', { data: 'order', cart: this.state.cart, total: Math.round(this.state.total) }) }}
								/>
							</View>
						</ScrollView>
					</SafeAreaView>
				);
			}
		} else if (this.props.route.params && this.props.route.params.action == 'success') {
			if (this.props.route.params.value && this.props.route.params.type == 1) {
				return (
					<WebView source={{ uri: this.props.route.params.value }} />
				)
			} else {
				return (
					<SafeAreaView style={styles.nopage}>
						<Text style={{ fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }}>Заказ оформлен</Text>
						<Text style={{ marginTop: 15, fontSize: 18, justifyContent: 'center', textAlign: 'center' }}>Информация о заказе во вкладке "<Text style={{ color: '#BE5B26' }} onPress={() => { this.props.navigation.navigate('SettingScreen', { data: { id: 4 } }) }}>История заказов</Text>" в вашем профиле</Text>
						<Button
							activeOpacity={0.8}
							TouchableComponent={TouchableOpacity}
							title={"Продолжить покупки"}
							buttonStyle={[styles.button, styles.mt_3]}
							onPress={() => {
								this.props.navigation.setParams({ action: null });
								this.props.navigation.replace('homeScreenStack');
							}}
						/>
					</SafeAreaView>
				)
			}
		} else {
			return (<View style={styles.nopage}><Text style={styles.nopageText}>Нет товаров</Text></View>);
		}
	}
}

