import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';

export default function FileReaderScreen() {
  const [url, setUrl] = useState('');
  const [currentViewUrl, setCurrentViewUrl] = useState('https://www.google.com'); // ডিফল্ট ব্রাউজার লিংক
  const [showWebView, setShowWebView] = useState(false);

  // ইন-বিল্ট ব্রাউজারে লিংক ওপেন করার ফাংশন
  const openBrowser = () => {
    if (!url) {
      Alert.alert("সতর্কতা", "দয়া করে একটি লিংক দিন।");
      return;
    }
    // লিংকের শুরুতে http/https না থাকলে যোগ করে নেওয়া
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    setCurrentViewUrl(formattedUrl);
    setShowWebView(true);
  };

  // ফোন থেকে PDF, Excel বা Word ফাইল সিলেক্ট করার ফাংশন
  const pickAndOpenFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        
        // Expo-তে লোকাল Word/Excel সরাসরি WebView-তে দেখানো কঠিন, 
        // তাই প্রফেশনাল অ্যাপে ফাইলটি আগে স্টোরেজে আপলোড করে তার লিংক Google Docs Viewer-এ পাস করা হয়।
        // আপাতত আমরা ব্রাউজারে ফাইলটির লোকাল URI সেট করে দিচ্ছি।
        setCurrentViewUrl(fileUri);
        setShowWebView(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("ত্রুটি", "ফাইল ওপেন করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <View style={styles.paperBackground}>
      {!showWebView ? (
        <View style={styles.menuContainer}>
          <Text style={styles.sketchTitle}>ব্রাউজার ও ফাইল রিডার</Text>

          {/* ওয়েবসাইট ব্রাউজ করার অপশন */}
          <TextInput
            style={styles.pencilInputBox}
            placeholder="www.example.com"
            placeholderTextColor="#888"
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.pencilButtonOutlineOrange} onPress={openBrowser}>
            <Text style={styles.pencilButtonTextOrange}>ব্রাউজ করুন</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>অথবা</Text>

          {/* ফাইল ওপেন করার অপশন */}
          <TouchableOpacity style={styles.pencilButtonOutlineGreen} onPress={pickAndOpenFile}>
            <Text style={styles.pencilButtonTextGreen}>ফোন থেকে ফাইল (PDF/Word/Excel) খুলুন</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // অ্যাপের ভেতরে ওয়েবসাইট বা ফাইল দেখানোর ভিউ
        <View style={{ flex: 1, width: '100%' }}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowWebView(false)}>
            <Text style={styles.closeButtonText}>✖ বন্ধ করুন</Text>
          </TouchableOpacity>
          <WebView 
            source={{ uri: currentViewUrl }} 
            style={{ flex: 1 }} 
            startInLoadingState={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paperBackground: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sketchTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 40,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  pencilInputBox: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#2C2C2C',
    backgroundColor: '#FDFBF7',
  },
  pencilButtonOutlineOrange: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#F5A623',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilButtonTextOrange: {
    color: '#F5A623',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
    fontStyle: 'italic',
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
  },
  pencilButtonTextGreen: {
    color: '#50E3C2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E15554',
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
