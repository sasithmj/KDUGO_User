import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const BusDetails = () => {
    const [bus, setBus] = useState(null);

    const getData = async () => {
        const busCollection = await firestore().collection('BusDetails').get();
        if (busCollection.docs.length > 0) {
            setBus(busCollection.docs[0].data());
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (!bus) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                
                <Image 
                    source={{ uri: bus.ImageUrl || '/mnt/data/image.png' }} // Use your uploaded image if bus.ImageUrl is not available
                    style={styles.image} 
                />
                <View style={styles.info}>
                    <Text style={styles.text}>Reg No. {bus.RegNo || 'N/A'}</Text>
                    <Text style={styles.text}>Tel: {bus.Tel || 'N/A'}</Text>
                    <Text style={styles.text}>{bus.Name || 'Transport Service'}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F4EB', // Light cream background like in the image
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        width: '90%',
    },
    image: {
        width: 300, // Adjust the width of the image
        height: 200, // Adjust the height of the image
        borderRadius: 12,
        marginBottom: 20, // Space between image and text
    },
    info: {
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#333', // Darker text for better readability
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 4, // Space between text items
    },
});

export default BusDetails;
