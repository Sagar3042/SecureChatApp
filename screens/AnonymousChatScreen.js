import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AnonymousChatScreen({ route }) {
  // আসল অ্যাপে LoginScreen থেকে এই UID আসবে
  const uid = route?.params?.uid || "TEST_UID_123"; 

  const [messages, setMessages] = useState([]);

  // ইউজারের ইউনিক লিংক (যা সে ইন্সটাগ্রাম বা অন্য কোথাও শেয়ার করবে)
  const anonymousLink = `https://securechat.app/msg/${uid}`;

  // ফায়ারবেস থেকে রিয়েলটাইমে অ্যানোনিমাস মেসেজগুলো পড়া
  useEffect(() => {
    const q = query(
      collection(db, "users", uid, "anonymous_messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [uid]);

  // লিংক শেয়ার করার ফাংশন
  const shareMyLink = async () => {
    try {
      await Share.share({
        message: `আমাকে সম্পূর্ণ গোপনে যেকোনো কিছু বলুন! কে পাঠাচ্ছে তা আমি জানতে পারবো না। লিংক: ${anonymousLink}`
      });
    } catch (error) {
      Alert.alert("ত্রুটি", "লিংক শেয়ার করা যায়নি।");
    }
  };

  // প্রতিটি মেসেজ রেন্ডার করার ডিজাইন (কাগজের চিরকুটের মতো)
  const renderMessage = ({ item }) => (
    <View style={styles.messageNote}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>
        {item.timestamp?.toDate().toLocaleString() || "Just now"}
      </Text>
    </View>
  );

  return (
    <View style={styles.paperBackground}>
      <Text style={styles.sketchTitle}>সিক্রেট ইনবক্স</Text>

      {/* লিংক শেয়ার করার বক্স */}
      <View style={styles.linkBox}>
        <Text style={styles.linkTitle}>আপনার অ্যানোনিমাস লিংক:</Text>
        <Text style={styles.linkText}>{anonymousLink}</Text>
        <TouchableOpacity style={styles.pencilButtonOutlineRed} onPress={shareMyLink}>
          <Text style={styles.pencilButtonTextRed}>লিংকটি শেয়ার করুন</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inboxTitle}>আপনার মেসেজগুলো:</Text>

      {/* মেসেজ লিস্ট */}
      {messages.length === 0 ? (
        <Text style={styles.emptyText}>এখনো কোনো গোপন মেসেজ আসেনি। লিংকটি বন্ধুদের সাথে শেয়ার করুন!</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paperBackground: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    padding: 20,
  },
  sketchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  linkBox: {
    borderWidth: 2,
    borderColor: '#E15554',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 5,
  },
  linkText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    textAlign: 'center',
  },
  pencilButtonOutlineRed: {
    width: '100%',
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E15554',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  pencilButtonTextRed: {
    color: '#E15554',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inboxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 15,
  },
  messageNote: {
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    // হালকা শ্যাডো
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 10,
    lineHeight: 24,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  }
});
