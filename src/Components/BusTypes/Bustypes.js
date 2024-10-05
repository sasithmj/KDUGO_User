import React from "react";
import { View, Text, Pressable } from "react-native";
import BustypeRow from "../BusTypeRow/BusTypeRow";

const Bustypes = () => {
    const confirm = () => {
        console.warn('confirm'); 
    }

    return (
        <View>    
            <BustypeRow />

            {/* <Pressable 
                onPress={confirm} 
                style={{
                    backgroundColor: "#FF8343", // Corrected background color
                    padding: 15, // Increased padding for better touch target
                    margin: 10,
                    alignItems: 'center', 
                    borderRadius: 8, // Rounded corners
                    shadowColor: "#000", // Shadow for iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginTop : 50 // Shadow for Android
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Confirm Service
                </Text>
            </Pressable> */}
        </View>
    );
}

export default Bustypes;
