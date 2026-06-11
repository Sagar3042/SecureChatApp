import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen({ navigation, route }) {
  // টেস্টিংয়ের জন্য ডিফল্ট UID। আসল অ্যাপে LoginScreen থেকে UID পাস করতে হবে।
  const uid = route?.params?.uid || "TEST_UID_123"; 

  const [referralCount, setReferralCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  // রিয়েলটাইমে ডাটাবেস থেকে ইউজারের রেফারেল কাউন্ট চেক করা
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReferralCount(data.referral_count || 0);
        setIsPremium(data.is_premium || false);
      }
    });
    return () => unsub(); // ক্লিনআপ
  }, [uid]);

  // রেফারেল লিংক শেয়ার করার ফাংশন
  const shareReferralLink = async () => {
    try {
      // ইউনিক রেফারেল লিংক তৈরি (এখানে ডোমেইন নাম আপনার পছন্দমতো দিতে পারেন)
      const refLink = `https://securechat.app/invite?ref=${uid}`;
      const message = `হ্যালো! আমার রেফারেল লিংক ব্যবহার করে SecureChat অ্যাপটি ইন্সটল করো। লিংক: ${refLink}`;
      
      await Share.share({ message: message });
    } catch (error) {
      Alert.alert("ত্রুটি", "লিংক শেয়ার করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <View style={styles.paperBackground}>
      <Text style={styles.sketchTitle}>ড্যাশবোর্ড</Text>

      {/* প্রিমিয়াম স্ট্যাটাস ও রেফারেল সেকশন */}
      <View style={styles.premiumBox}>
        {isPremium ? (
          <Text style={styles.premiumTextSuccess}>⭐ আপনি এখন Premium ইউজার! ⭐</Text>
        ) : (
          <View>
            <Text style={styles.premiumText}>প্রিমিয়াম আনলক করতে ৫ জনকে রেফার করুন!</Text>
            <Text style={styles.referralCountText}>আপনার বর্তমান রেফারেল: {referralCount} / 5</Text>
            <TouchableOpacity style={styles.shareBtn} onPress={shareReferralLink}>
              <Text style={styles.shareBtnText}>🔗 আপনার রেফারেল লিংক শেয়ার করুন</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.pencilButtonOutlineBlue}
        onPress={() => navigation.navigate('SecureShare')}
      >
        <Text style={styles.pencilButtonTextBlue}>নোট ও ছবি শেয়ার (Secure)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.pencilButtonOutlineGreen}
        onPress={() => navigation.navigate('FileReader')}
      >
        <Text style={styles.pencilButtonTextGreen}>ফাইল ও PDF রিডার</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.pencilButtonOutlineOrange}
        onPress={() => navigation.navigate('FileReader')}
      >
        <Text style={styles.pencilButtonTextOrange}>ইন-বিল্ট ব্রাউজার</Text>
      </TouchableOpacity>

      {/* অ্যানোনিমাস চ্যাট বাটন (এটি প্রিমিয়াম ফিচার হিসেবে লক করে রাখা যায়) */}
      <TouchableOpacity 
        style={[styles.pencilButtonOutlineRed, !isPremium && styles.lockedButton]}
        onPress={() => {
          if (isPremium) {
            // navigation.navigate('AnonymousChat'); // অ্যানোনিমাস চ্যাট স্ক্রিনে যাবে
            Alert.alert("Premium Feature", "Anonymous Chat-এ স্বাগতম!");
          } else {
            Alert.alert("লকড ফিচার", "এই ফিচারটি ব্যবহার করতে ৫ জনকে রেফার করে প্রিমিয়াম আনলক করুন।");
          }
        }}
      >
        <Text style={styles.pencilButtonTextRed}>
          অ্যানোনিমাস চ্যাট {isPremium ? '' : '🔒'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  paperBackground: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    padding: 20,
    justifyContent: 'center',
  },
  sketchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  premiumBox: {
    borderWidth: 2,
    borderColor: '#E15554',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  premiumTextSuccess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37', // গোল্ডেন কালার
  },
  premiumText: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  referralCountText: {
    fontSize: 18,
    color: '#E15554',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  shareBtn: {
    backgroundColor: '#2C2C2C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  // বাটন স্টাইলস (আগের মতোই)
  pencilButtonOutlineBlue: { borderWidth: 2, borderColor: '#4A90E2', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  pencilButtonTextBlue: { color: '#4A90E2', fontSize: 18, fontWeight: 'bold' },
  pencilButtonOutlineGreen: { borderWidth: 2, borderColor: '#50E3C2', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  pencilButtonTextGreen: { color: '#50E3C2', fontSize: 18, fontWeight: 'bold' },
  pencilButtonOutlineRed: { borderWidth: 2, borderColor: '#E15554', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  pencilButtonTextRed: { color: '#E15554', fontSize: 18, fontWeight: 'bold' },
  pencilButtonOutlineOrange: { borderWidth: 2, borderColor: '#F5A623', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  pencilButtonTextOrange: { color: '#F5A623', fontSize: 18, fontWeight: 'bold' },
  lockedButton: { opacity: 0.6, borderColor: '#888' }, // লক থাকলে বাটন কিছুটা ঝাপসা দেখাবে
});
