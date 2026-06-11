import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // আগের ধাপে তৈরি করা ফাইল

export default function LoginScreen({ navigation }) {
  
  // Google Sign-In কনফিগার করা (আপনার Web Client ID দিয়ে)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      // Firebase-এ ক্রেডেনশিয়াল পাঠানো
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      // চেক করা ইউজার আগে থেকে ডাটাবেসে আছে কি না
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        Alert.alert("লগইন সফল!", "স্বাগতম ফিরে আসার জন্য।");
        // navigation.replace('Home'); // পুরাতন ইউজার হলে Home-এ যাবে
      } else {
        Alert.alert("নতুন একাউন্ট", "অনুগ্রহ করে আপনার প্রোফাইল তৈরি করুন।");
        // navigation.replace('ProfileSetup', { uid: user.uid }); // নতুন ইউজার হলে Profile Setup-এ যাবে
      }

    } catch (error) {
      console.error(error);
      Alert.alert("লগইন ব্যর্থ", "দয়া করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureChat App</Text>
      
      <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
        <Text style={styles.buttonText}>Google দিয়ে লগইন করুন</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
