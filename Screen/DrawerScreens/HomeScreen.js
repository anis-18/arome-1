// Import React and Component
import * as React from 'react';

//Style global
import styles from '../Components/Style';

import { View, ScrollView, FlatList, Text, ActivityIndicator, AsyncStorage, BackHandler } from 'react-native';

export default class HomeScreen extends React.PureComponent {

	constructor(props) {

		super(props);

		this.state = {
			category: false,
			sale: false,
			activeIndex: 0,
			selectedId: 0
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

			if (this.props.navigation.canGoBack()) {
				this.props.navigation.goBack();
			} else {
				BackHandler.exitApp();
			}

		}
		return true;
	}
	async getHome() {
		const category = await AsyncStorage.getItem("category");
		const sale = await AsyncStorage.getItem("sale");

		if (category) {
			this.setState({ category: JSON.parse(category) });
		}
		if (sale) {
			this.setState({ sale: JSON.parse(sale) });
		}
	}
	componentDidMount() {

		this.getHome();
		this.props.navigation.addListener('focus', () => {
			this.getData();
		});
	}


	getData() {
		if (!this.state.category) {
			fetch(global.site_url, {
				method: 'POST',
				body: JSON.stringify({
					form: 'home',
				})
			})
				.then((response) => response.json())
				.then((responseJson) => {

					if (responseJson.status == 1) {
						let list_data_category = responseJson.data.category;
						let list_data_sale = responseJson.data.sale;

						if (list_data_category) {
							this.setState({ category: list_data_category });
							AsyncStorage.setItem('category', JSON.stringify(list_data_category));
						}
						if (list_data_sale) {
							this.setState({ sale: list_data_sale });
							AsyncStorage.setItem('sale', JSON.stringify(list_data_sale));
						}
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}

	render() {
		if (this.state.category) {
			return (
				<ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} style={styles.body}>
					<FlatList
						contentContainerStyle={styles.carouselBox}
						removeClippedSubviews={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						data={this.state.sale}
						renderItem={global.sale_mini}
						keyExtractor={(item) => item.id}
						extraData={this.state.selectedId}
						initialNumToRender={1}
						maxToRenderPerBatch={1}
						updateCellsBatchingPeriod={100}
						windowSize={1}
						horizontal={true}
					/>

					<Text style={styles.bookListLabel}>Меню</Text>
					<FlatList
						contentContainerStyle={styles.carouselBox}
						removeClippedSubviews={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						data={this.state.category}
						renderItem={global.category_mini}
						keyExtractor={(item) => item.id}
						extraData={this.state.selectedId}
						initialNumToRender={2}
						maxToRenderPerBatch={2}
						updateCellsBatchingPeriod={100}
						windowSize={2}
						numColumns={2}
					/>

				</ScrollView>
			);
		} else {
			return (<View style={styles.nopage}><ActivityIndicator size="large" color="#BE5B26" /></View>);
		}
	}
}