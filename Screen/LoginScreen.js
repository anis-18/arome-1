import React, { useState, createRef } from 'react';

//Style global
import styles from './Components/Style';
import {
	Alert,
	StyleSheet,
	TextInput,
	View,
	Text,
	ScrollView,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	AsyncStorage,
	TouchableOpacity,
	Modal,
	Dimensions
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { TextInputMask } from 'react-native-masked-text';

const windowWidth = Dimensions.get('window').width;
export default class LoginScreen extends React.Component {
	constructor(props) {

		super(props);
		this.state = {
			userPhone: '',
			userPassword: '',
			loading: false,
			user: null,
			modalVisible: [
				{
					active: true,
					title: '«A Rome» - это',
					desc: 'Ваше маленькое и незабываемое путешествие в Италию. Место, где вы всегда сможете отвлечься от городской суеты, при этом находясь в историческом центре Казани.',
					data: [{ image: require('../Image/modal1.jpg') }]
				},
				{
					active: false,
					title: 'Атмосфера и меню',
					desc: 'Наших посетителей приятно порадуют дружелюбная атмосфера, заботливое отношение персонала к каждому гостю, демократичные цены и широкий выбор блюд. ',
					data: [{ image: require('../Image/modal2.jpg') }]
				},
				{
					active: false,
					title: 'Пицца из печи',
					desc: '«A Rome» славится своей пиццей, которая готовится в дровяной печи в зале. Каждый гость может воочию увидеть процесс приготовления этого блюда. А большой ассортимент позволит всем насладиться любимой пиццей!',
					data: [{ image: require('../Image/modal3.jpg') }]
				}
			],
			activeIndex: 0,
			activeModal: 0
		}
		this.passwordInputRef = createRef();
	}

	setModalVisible(id) {
		if (this.state.modalVisible[id + 1]) {
			this.state.modalVisible[id].active = false;
			this.state.modalVisible[id + 1].active = true;
			this.setState({ modalVisible: this.state.modalVisible, activeModal: this.state.activeModal + 1 });
		} else {
			this.state.modalVisible[id].active = false;
			this.setState({ modalVisible: this.state.modalVisible });
		}
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
	handleSubmitPress = (array) => {
		if (!array) {
			if (!this.state.userPhone) {
				Alert.alert(
					"Ошибка",
					"Заполните поле логин или Email",
					[
						{ text: "OK" }
					],
					{ cancelable: true }
				);
				return;
			}
			if (!this.state.userPassword) {
				Alert.alert(
					"Ошибка",
					"Заполните поле пароль",
					[
						{ text: "OK" }
					],
					{ cancelable: true }
				);
				return;
			}

			this.setState({ loading: true });

		} else {
			this.setState({ loading_google: true });
		}


		let formData = new FormData();
		formData.append('form', 'auth');
		formData.append('phone', (this.state.userPhone.length > 0) ? this.state.userPhone : false);
		formData.append('password', (this.state.userPassword.length > 0) ? this.state.userPassword : false);

		fetch(global.site_url, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == 1) {
					this.saveData(responseJson.data);
				} else {
					Alert.alert(
						"Ошибка",
						(responseJson.text.length > 0) ? responseJson.text : "Неверный логин или пароль",
						[{ text: "OK" }], { cancelable: true }
					);
				}
				this.setState({ loading: false });

			})
			.catch((error) => {
				this.setState({ loading: false });
				console.error(error);
			});
	};
	renderImages = ({ item }) => {
		return (<Image fadeDuration={0} resizeMode="cover" style={[styles.postImage, { width: windowWidth, height: windowWidth }]} source={item.image} />);
	}
	modalView(id) {
		return (
			<Modal animated animationType="fade" transparent={false} visible={this.state.modalVisible[id].active}>
				<ScrollView style={styles.modalView}>
					<Carousel
						layout={"default"}
						inactiveSlideOpacity={1}
						inactiveSlideScale={1}
						inactiveSlideShift={1}
						ref={ref => this.carousel = ref}
						data={this.state.modalVisible[id].data}
						renderItem={this.renderImages}
						sliderWidth={windowWidth}
						itemWidth={windowWidth}
						onSnapToItem={index => this.setState({ activeIndex: index })}
					/>
					<Pagination dotsLength={this.state.modalVisible[id].data.length}
						activeDotIndex={this.state.activeIndex}
						containerStyle={{ position: 'absolute', width: '100%', top: windowWidth - 70 }}
						inactiveDotStyle={{
							backgroundColor: 'transparent',
							borderWidth: 1,
							borderColor: 'rgba(255, 255, 255, 0.92)'
						}}
						dotStyle={{ width: 8, height: 8, backgroundColor: 'rgba(255, 255, 255, 0.92)' }}
						inactiveDotScale={1}
						inactiveDotOpacity={0.7}
					/>
					<View style={styles.modalContent}>
						<Text style={{ fontSize: 25, marginBottom: 20 }}>{this.state.modalVisible[id].title}</Text>
						<Text style={{ fontSize: 17 }}>{this.state.modalVisible[id].desc}</Text>
					</View>
					<View style={styles.modalBottom}>
						<TouchableOpacity
							activeOpacity={0.6}
							style={styles.buttonBorder}
							onPress={() => this.setModalVisible(id)}>
							<Text style={styles.buttonBorderText}>Пропустить</Text>
							<Icon name='chevron-forward-outline' size={17} type='ionicon' style={{ marginLeft: 10 }} color='#333' />
						</TouchableOpacity>
					</View>
				</ScrollView>
			</Modal>
		);
	}
	render() {
		return (
			<View style={styles.mainBody}>
				{this.modalView(this.state.activeModal)}
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						flex: 1,
						justifyContent: 'center',
						alignContent: 'center',
					}}>
					<View>
						<KeyboardAvoidingView enabled>
							<View style={{ alignItems: 'center' }}>
								<Text style={{ alignSelf: 'center', fontSize: 30, marginBottom: 20 }}>Вход</Text>
							</View>
							<View style={styles.sectionStyle}>
								<Text style={styles.form_label}>Номер телефона</Text>
								<View style={styles.form_group}>
									<View style={{ flexDirection: 'row', position: 'relative' }}>
										<View style={styles.iconInput}>
											<Icon
												name='mail-outline'
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
											returnKeyType="next"
											blurOnSubmit={false}
											autoCompleteType="tel"
											onChangeText={text => {
												this.setState({
													userPhone: text
												})
											}}
											onSubmitEditing={() =>
												this.passwordInputRef.current && this.passwordInputRef.current.focus()
											}
										/>
									</View>
									<Text style={styles.form_label}>Пароль</Text>
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
											placeholder="Введите пароль"
											placeholderTextColor={styles.inputTextStyle}
											keyboardType="default"
											ref={this.passwordInputRef}
											onSubmitEditing={Keyboard.dismiss}
											blurOnSubmit={false}
											secureTextEntry={true}
											returnKeyType="next"
										/>
									</View>
								</View>
							</View>
							<Button
								title="Войти"
								activeOpacity={0.8}
								TouchableComponent={TouchableOpacity}
								buttonStyle={styles.buttonStyle}
								onPress={() => { this.handleSubmitPress(false) }}
								loading={this.state.loading}
							/>
							<TouchableOpacity
								style={[styles.mt_3, { alignSelf: 'center', paddingVertical: 10 }]}
								activeOpacity={0.6}
								onPress={() => this.props.navigation.navigate('RegisterScreen')}>
								<Text style={{ color: '#7B8794' }}>
									У вас еще нет аккаунта? <Text style={{ color: '#BE5B26' }}>Регистрация</Text>
								</Text>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					</View>
				</ScrollView>
			</View>
		);
	}
}