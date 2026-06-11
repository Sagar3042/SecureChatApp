import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ProfileSetupScreen({ route, navigation }) {
  // LoginScreen থেকে পাঠানো ইউজারের uid রিসিভ করা (আপাতত টেস্টিংয়ের জন্য একটি ডিফল্ট দেওয়া হলো)
  const uid = route?.params?.uid || "TEST_UID_123"; 

  const [name, setName] = useState('');
  const [igUsername, setIgUsername] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // গ্যালারি থেকে ছবি বেছে নেওয়ার ফাংশন
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // ছবিটি স্কয়ার সাইজের হবে
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ImageKit-এ ছবি আপলোড করার ফাংশন
  const uploadImageToImageKit = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'profile_pic.jpg',
        type: 'image/jpeg'
      });
      formData.append('fileName', 'profile_pic.jpg');
      
      // .env ফাইল থেকে আপনার ImageKit Public Key নেওয়া হচ্ছে
      formData.append('publicKey', process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY);

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.url; // আপলোড হওয়ার পর ক্লাউড লিংক রিটার্ন করবে

    } catch (error) {
      console.error("ImageKit Upload Error:", error);
      return null;
    }
  };

  // প্রোফাইল সেভ করার ফাংশন
  const saveProfile = async () => {
    if (!name || !igUsername || !imageUri) {
      Alert.alert("সতর্কতা", "দয়া করে আপনার নাম, ইনস্টাগ্রাম ইউজারনেম এবং ছবি দিন।");
      return;
    }

    setLoading(true);
    try {
      // ১. ImageKit-এ ছবি আপলোড করা
      const photoUrl = await uploadImageToImageKit(imageUri);
      
      if (!photoUrl) {
        Alert.alert("ত্রুটি", "ছবি আপলোড ব্যর্থ হয়েছে। আপনার ইন্টারনেট কানেকশন চেক করুন।");
        setLoading(false);
        return;
      }

      // ২. ফায়ারবেস ডাটাবেসে ইউজারের ডেটা সেভ করা
      await setDoc(doc(db, "users", uid), {
        name: name,
        instagram_username: igUsername,
        photo_url: photoUrl, // ক্লাউডে থাকা ছবির লিংক সেভ হবে
        referral_count: 0,
        is_premium: false,
        created_at: new Date(),
      });

      Alert.alert("সফল!", "আপনার প্রোফাইল তৈরি সম্পন্ন হয়েছে।");
      navigation.replace('Home'); // এরপর হোম স্ক্রিনে নিয়ে যাবে

    } catch (error) {
      console.error(error);
      Alert.alert("ত্রুটি", "প্রোফাইল সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.paperBackground}>
      <Text style={styles.sketchTitle}>প্রোফাইল তৈরি</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>ছবি যুক্ত করুন</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.pencilInput}
        placeholder="আপনার নাম"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.pencilInput}
        placeholder="Instagram Username (@ছাড়া)"
        placeholderTextColor="#888"
        value={igUsername}
        onChangeText={setIgUsername}
      />

      <TouchableOpacity style={styles.pencilButtonOutlineGreen} onPress={saveProfile} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#50E3C2" />
        ) : (
          <Text style={styles.pencilButtonTextGreen}>সেভ করুন</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// স্কেচবুক থিমের স্টাইল
const styles = StyleSheet.create({
  paperBackground: {
    flex: 1,
    backgroundColor: '#FDFBF7', // কাগজের মতো রঙ
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sketchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 30,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed',
    backgroundColor: '#FDFBF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden'
  },
  profileImage: { width: '100%', height: '100%' },
  imagePickerText: { color: '#666', fontSize: 14, textAlign: 'center', fontWeight: 'bold' },
  pencilInput: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed', // পেন্সিলের দাগের মতো বর্ডার
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#2C2C2C',
    backgroundColor: '#FDFBF7',
  },
  pencilButtonOutlineGreen: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#50E3C2',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pencilButtonTextGreen: {
    color: '#50E3C2',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
