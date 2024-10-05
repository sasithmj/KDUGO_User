import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { storage, db } from '../../firebase';
import MyFilesList from './MyList';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';

const NewLost = () => {
  const [imageData, setImageData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const listRef = ref(storage, 'images/');
        const listResp = await listAll(listRef);
        const files = await Promise.all(listResp.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);

          // Fetch the corresponding text from Firestore
          const uploadsRef = collection(db, 'uploads');
          const q = query(uploadsRef);
          const querySnapshot = await getDocs(q);
          let textData = '';
          querySnapshot.forEach((doc) => {
            if (doc.data().imageUrl === downloadURL) {
              textData = doc.data().text;
            }
          });

          return { name: itemRef.name, url: downloadURL, text: textData };
        }));
        setFiles(files);
      } catch (error) {
        console.log('Failed to retrieve files:', error.message || error);
      }
    };

    fetchFiles();
  }, []);

  const openCamera = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result && !result.didCancel && !result.error) {
      setImageData(result);
    } else {
      console.log('Image selection was canceled or failed:', result.error);
    }
  };

  const uploadImage = async () => {
    if (imageData && text) {
      const fileName = imageData.assets[0].fileName;
      const pathToFile = imageData.assets[0].uri;

      try {
        const response = await fetch(pathToFile);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            console.log(`Upload is ${progress}% done`);
          }, 
          (error) => {
            console.log('Upload failed:', error.message || error);
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);

            // Save text and image URL to Firestore
            try {
              const valRef = collection(db, 'uploads');
              await addDoc(valRef, { text, imageUrl: downloadURL });
              Alert.alert('Data added successfully');
              
              // Update the state to include the new file
              setFiles((prevFiles) => [...prevFiles, { name: fileName, url: downloadURL, text }]);
              setText(''); // Reset the text input
              setImageData(null); // Reset the image data
            } catch (error) {
              console.log('Failed to add document to Firestore:', error.message || error);
            }
          }
        );
      } catch (error) {
        console.log('Upload failed:', error.message || error);
      }
    } else {
      console.log('No image selected or text provided');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {imageData && (
        <Image source={{ uri: imageData.assets[0].uri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      )}
      <TextInput
        placeholder="Enter text here"
        value={text}
        onChangeText={(text) => setText(text)}
        style={{
          width: '100%',
          height: 50,
          borderWidth: 0.5,
          borderRadius: 10,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#007bff',
          marginTop: 10,
        }}
        onPress={openCamera}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#28a745',
          marginTop: 20,
        }}
        onPress={uploadImage}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Upload Image</Text>
      </TouchableOpacity>
      {uploadProgress > 0 && <Text>Upload Progress: {uploadProgress.toFixed(2)}%</Text>}
      <MyFilesList files={files} />
    </View>
  );
};

export default NewLost;
