// Import React and Component
import * as React from 'react';

//Style global
import styles from '../Components/Style';

import { View, FlatList, Text, Dimensions, ActivityIndicator } from 'react-native';

import { TabView, TabBar } from 'react-native-tab-view';

const renderTabBar = props => (
	<TabBar
		{...props}
		activeColor='#323F4B'
		inactiveColor='#999999'
		labelStyle={{ textTransform: 'capitalize', fontSize: 16 }}
		indicatorStyle={{ backgroundColor: '#323F4B' }}
		style={{ backgroundColor: '#fff' }}
		tabStyle={{ width: 'auto' }}
		scrollEnabled={true}
	/>
);

export default class GenreScreen extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			categoryId: (this.props.route.params.data) ? this.props.route.params.data : false,
			categoryData: false,
			categoryDataAll: false,
			index: 0,
			selectedId: null,
			routes: (this.props.route.params.data) ? this.props.route.params.data.tags : [],

		}
	}

	componentDidMount() {
		this.props.navigation.setOptions({ title: this.state.categoryId.title });
		this.getData();
	}

	getData() {
		fetch(global.site_url, {
			method: 'POST',
			body: JSON.stringify({
				form: 'category',
				id: this.state.categoryId.id,
				tags: this.state.routes[this.state.index].title
			})
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == 1) {
					let list_data = responseJson.data;
					let list_data_all = responseJson.all;
					this.setState({ categoryData: list_data, categoryDataAll: list_data_all });
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	homeRoute = (array) => {

		if (array) {

			return (
				<View style={styles.body}>
					<FlatList
						contentContainerStyle={[styles.carouselBox, styles.lightBody]}
						removeClippedSubviews={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						data={array}
						renderItem={global.product_mini}
						keyExtractor={(item) => item.id}
						extraData={this.state.selectedId}
						initialNumToRender={4}
						maxToRenderPerBatch={4}
						updateCellsBatchingPeriod={100}
						windowSize={4}
						numColumns={2}
					/>
				</View>
			);
		} else {
			return (<View style={styles.nopage}><Text style={styles.nopageText}>Нет товаров</Text></View>);
		}
	};
	renderScenes = ({ route }) => {

		if (this.state.routes[route.key].key == route.key) {
			if (this.state.routes[route.key].title == 'все') {
				const array = this.state.categoryDataAll;
				return this.homeRoute(array);

			} else {
				const array = this.state.categoryData[this.state.routes[route.key].title];
				return this.homeRoute(array);
			}

		}

	};
	render() {
		if (!this.state.routes || !this.state.categoryDataAll) {
			return (<View style={styles.nopage}><ActivityIndicator size="large" color="#BE5B26" /></View>);
		}

		return (
			<TabView
				lazy={true}
				removeClippedSubviews={true}
				renderTabBar={renderTabBar}
				navigationState={this.state}
				renderScene={this.renderScenes}
				onIndexChange={index => this.setState({ index })}
				initialLayout={{ width: Dimensions.get('window').width }}
			/>
		);
	}
}