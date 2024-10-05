import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DriverDetails = () => {
    const [driver, setDriver] = useState(null);

    const getData = async () => {
        const driverCollection = await firestore().collection('DriverDetails').get();
        if (driverCollection.docs.length > 0) {
            setDriver(driverCollection.docs[0].data());
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (!driver) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={{ uri: driver.ImageUrl }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.text}>Driver {driver.driverId} | {driver.Name}</Text>
                    <Text style={styles.text}>Tel: {driver.Tel}</Text>
                    <Text style={styles.text}>Email: {driver.Email}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    info: {
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
});

export default DriverDetails;
