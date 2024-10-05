import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlaceRow from "./PlaceRow";
import { useNavigation } from "@react-navigation/native";

const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

const DestinationSearch = () => {
    const [originPlace, setOriginPlace] = useState(null);
    const [destinationPlace, setDestinationPlace] = useState(null);

    const navigation = useNavigation();

    const checkNavigation = () => {
        if (originPlace && destinationPlace) {
          navigation.navigate('SearchResults', {
            originPlace,
            destinationPlace,
          })
        }
      }
    
      useEffect(() => {
        checkNavigation();
      }, [originPlace, destinationPlace]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.circle}/>
                <View style={styles.line}/>
                <View style={styles.square}/>
                <View style={styles.autocompleteContainer}>

                    <GooglePlacesAutocomplete
                        placeholder='Where From'
                        onPress={(data, details = null) => {
                            setOriginPlace({data, details},checkNavigation);
                          }}
                        query={{
                            key: "AIzaSyB8SDuL-vEKer19D3XBIrNmO8-uuYN_mkI",
                            language: 'en',
                        }}
                        renderRow={(data) => <PlaceRow data={data} />}
                        predefinedPlaces={[homePlace, workPlace]}
                        onFail={(error) => console.log(error)}
                        suppressDefaultStyles
                        currentLocation={true}
                        currentLocationLabel='Current location'
                        enablePoweredByContainer={false}
                        styles={{
                            textInputContainer: styles.googleTextInputContainer,
                            textInput: styles.googleTextInput,
                            predefinedPlacesDescription: styles.googlePredefinedPlacesDescription,
                            container: {
                                position: 'absolute',
                                top: 55,
                                left: 30,
                                right: 10,
                            },
                            listView: {
                                position: 'absolute',
                                top: 105
                            },
                            separator: {
                                backgroundColor: '#797979',
                                height: 1
                            }
                        }}
                    />
                    <GooglePlacesAutocomplete
                        placeholder='Where To'
                        onPress={(data, details = null) => {
                            setDestinationPlace({data, details},checkNavigation);
                          }}
                        query={{
                            key: "AIzaSyB8SDuL-vEKer19D3XBIrNmO8-uuYN_mkI",
                            language: 'en',
                        }}
                        renderRow={(data) => <PlaceRow data={data} />}
                        renderDescription={(data) => data.description || data.vicinity}
                        onFail={(error) => console.log(error)}
                        enablePoweredByContainer={false}
                        suppressDefaultStyles
                        styles={{
                            textInputContainer: styles.googleTextInputContainer,
                            textInput: styles.googleTextInput,
                            predefinedPlacesDescription: styles.googlePredefinedPlacesDescription,
                            container: {
                                position: 'absolute',
                                top: 130,
                                left: 30,
                                right: 10,
                            },
                            listView: {
                                position: 'absolute',
                                top: 180
                            },
                            separator: {
                                backgroundColor: 'black',
                                height: 1
                            }
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        padding: 20,
        backgroundColor: "#f2f2f2",
        flex: 1,
        position: 'relative',
    },
    autocompleteContainer: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    googleTextInputContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    googleTextInput: {
        backgroundColor: '#fff', 
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    googlePredefinedPlacesDescription: {
        color: '#1faadb',
    },
    circle: {
        width: 5,
        height: 5,
        backgroundColor: 'black',
        position: 'absolute',
        top: 190,
        left: 15,
        borderRadius: 5,
    },
    line: {
        width: 5,
        height: 70,
        backgroundColor: 'black',
        position: 'absolute',
        top: 122,
        left: 17,
    },
    square: {
        width: 5,
        height: 5,
        backgroundColor: 'black',
        position: 'absolute',
        top: 115,
        left: 15,
    },
});

export default DestinationSearch;
