import React, { useState, useEffect } from 'react';

import styles from '../Components/Style';

import {
	Alert,
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';

import { ListItem } from 'react-native-elements';

export default class ProfileScreen extends React.Component {

	constructor(props) {

		super(props);

		this.list = [
			{
				id: 1,
				title: 'Личные данные'
			},
			{
				id: 2,
				title: 'Адреса доставки'
			},
			/*
			{
				id: 3,
				title: 'Способы оплаты'
			},*/
			{
				id: 4,
				title: 'История заказов'
			},
			{
				id: 5,
				title: 'Бонусные баллы'
			},
			{
				title: 'Выйти',
				color: '#f05f5f',
				exit: true
			}
		];
	}

	exit_account = () => {
		Alert.alert(
			'Выход',
			'Вы точно хотите выйти?',
			[
				{
					text: 'Отмена',
					onPress: () => {
						return null;
					},
				},
				{
					text: 'Да, выйти',
					onPress: () => {
						AsyncStorage.removeItem('user_data');
						//AsyncStorage.removeItem('cards');
						AsyncStorage.removeItem('list_address');
						delete global.data_user;
						this.props.navigation.replace('Auth');
					},
				},
			],
			{ cancelable: false },
		);
	};

	render() {
		return (
			<ScrollView style={styles.body}>
				<View>
					{
						this.list.map((item, i) => (
							<ListItem activeOpacity={0.96} key={i} onPress={() => (item.exit) ? this.exit_account() : (item.id) ? this.props.navigation.navigate('SettingScreen', { data: item }) : null} bottomDivider>
								<ListItem.Content>
									<ListItem.Title style={{ color: (item.color) ? item.color : '#222' }}>{item.title}</ListItem.Title>
								</ListItem.Content>
								<ListItem.Chevron />
							</ListItem>
						))
					}
				</View>
			</ScrollView>
		);
	}

}
