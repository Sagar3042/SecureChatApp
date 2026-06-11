import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

export default function SecureShareScreen() {
  const [secretNote, setSecretNote] = useState('');

  useEffect(() => {
    // স্ক্রিনে প্রবেশ করলেই স্ক্রিনশট ও রেকর্ড ব্লক হয়ে যাবে
    const preventCapture = async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync();
      } catch (e) {
        console.warn("Screen capture prevention is not supported on this device/emulator.");
      }
    };
    
    preventCapture();

    // ইউজার যখন এই স্ক্রিন থেকে বেরিয়ে যাবে, তখন আবার স্ক্রিনশট চালু হবে
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const sendSecretMessage = () => {
    if (!secretNote) {
      Alert.alert("খালি নোট!", "দয়া করে কিছু লিখুন।");
      return;
    }
    // এখানে ফায়ারবেসে মেসেজ পাঠানোর লজিক থাকবে (One-time view)
    Alert.alert("সফল", "আপনার সিক্রেট মেসেজ পাঠানো হয়েছে!");
    setSecretNote('');
  };

  return (
    <View style={styles.paperBackground}>
      <Text style={styles.sketchTitle}>সিক্রেট মেসেজ</Text>
      
      <Text style={styles.warningText}>
        ⚠️ এই স্ক্রিনটি সুরক্ষিত। এখানে কোনো স্ক্রিনশট বা স্ক্রিন রেকর্ড করা যাবে না।
      </Text>

      <TextInput
        style={styles.pencilInputBox}
        placeholder="আপনার গোপন মেসেজ লিখুন..."
        placeholderTextColor="#888"
        multiline={true}
        numberOfLines={6}
        value={secretNote}
        onChangeText={setSecretNote}
      />

      <TouchableOpacity style={styles.pencilButtonOutlineBlue} onPress={sendSecretMessage}>
        <Text style={styles.pencilButtonTextBlue}>সিক্রেট মেসেজ পাঠান</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paperBackground: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sketchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 20,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  warningText: {
    fontSize: 14,
    color: '#E15554', // লাল কালির মতো
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#E15554',
    borderStyle: 'dashed',
    padding: 10,
    borderRadius: 8,
  },
  pencilInputBox: {
    width: '100%',
    minHeight: 150,
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#2C2C2C',
    backgroundColor: '#FDFBF7',
    textAlignVertical: 'top',
  },
  pencilButtonOutlineBlue: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilButtonTextBlue: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
