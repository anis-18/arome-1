import * as React from 'react';

import styles from '../Components/Style';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Button, ListItem } from 'react-native-elements';

export default class BookScreen extends React.PureComponent {

	constructor(props) {

		super(props)

		this.state = {
			productData: [],
			expandedIndex: false
		}
	}


	componentDidMount() {
		this.props.navigation.setOptions({
			title: this.props.route.params.data.title,
			headerRight: () => (
				<View style={styles.iconMenuRight}></View>
			)
			/*
			headerRight: () => (
			<Icon
				containerStyle={styles.iconMenuRight}
				name='stats-chart-outline'
				type='ionicon'
				onPress={() => {}}
			/>
			), */
		});
		this.setState({ productData: this.props.route.params.data });
	}

	render() {
		return (
			<ScrollView style={styles.body}>
				<ImageBackground
					fadeDuration={0}
					source={{ uri: (this.state.productData.image) ? this.state.productData.image : 'app/Image/imagebook.png' }}
					style={styles.fonBookImage}>
				</ImageBackground>

				<View style={[styles.main, styles.mt_3]}>
					<Text style={{ fontSize: 22, marginBottom: 10, fontWeight: 'bold' }}>{this.state.productData.title} <Text style={{ color: '#C96E37', fontWeight: 'normal', fontSize: 15 }}>{Math.round(this.state.productData.weight * 1000)} грамм</Text></Text>
					<Text style={{ fontSize: 16, marginBottom: 10, color: '#777' }}>{this.state.productData.desc}</Text>
				</View>

				<ListItem.Accordion
					content={
						<ListItem.Content>
							<ListItem.Title>Подробнее</ListItem.Title>
						</ListItem.Content>
					}
					isExpanded={this.state.expandedIndex}
					onPress={() => {
						this.setState({ expandedIndex: !this.state.expandedIndex });
					}}
				>
					{
						(this.state.productData.tags) ?
							this.state.productData.tags.map((item, i) => (
								<ListItem activeOpacity={0.96} key={i} onPress={() => (item.exit) ? this.exit_account() : (item.id) ? this.props.navigation.navigate('SettingScreen', { data: item }) : null} bottomDivider>
									<ListItem.Content>
										<ListItem.Title style={{ color: '#222' }}>{item.title}: {item.value}</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							))
							: null
					}
				</ListItem.Accordion>
				<View style={[styles.main, { paddingVertical: 20 }]}>
					<Button
						activeOpacity={0.8}
						TouchableComponent={TouchableOpacity}
						title={"В корзину за " + this.state.productData.price + " руб"}
						buttonStyle={styles.button}
						onPress={() => { global.addCartProduct(this.state.productData) }}
						loading={this.state.loading}
					/>
				</View>
			</ScrollView>
		);
	}
}