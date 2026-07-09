// ============================================
// app/login.tsx
// CrossPuzzle uygulamasının 1. ekranı: e-posta ile giriş
//
// ÖNEMLİ: Bu proje Expo Router kullanıyor.
// Bu dosyanın "app" klasöründeki adı, uygulama içindeki adresi belirliyor.
// Yani bu dosya app/login.tsx olduğu için, uygulama içinde "/login"
// adresine gidince bu ekran açılacak.
// ============================================

// React'in kendisini ve state (hafıza) yönetimi için useState'i içeri alıyoruz
import React, { useState } from 'react';

// React Native'in hazır bileşenlerini (component) içeri alıyoruz
import {
  SafeAreaView,     // Ekranın çentik/çıkıntı gibi güvenli alanına saygı gösterir
  View,              // HTML'deki <div> gibi düşün, sadece bir kutu/kapsayıcı
  Text,              // Yazı göstermek için (React Native'de yazılar mutlaka <Text> içinde olmalı)
  TextInput,         // Kullanıcının yazı yazabileceği kutu
  TouchableOpacity,  // Basılabilir alan (buton için kullanıyoruz)
  StyleSheet,        // Stilleri (renk, boşluk, vs.) düzenli tanımlamak için
} from 'react-native';

// expo-router'ın "router" nesnesini alıyoruz.
// Bunu, bir ekrandan başka bir ekrana KOD İÇİNDEN geçiş yapmak için kullanacağız
// (örn. "Kod gönder" butonuna basınca kod doğrulama ekranına gitmek gibi)
import { router } from 'expo-router';

// Bu fonksiyon = ekranımızın kendisi.
// Expo Router'da her route dosyası bir "default export" fonksiyon döndürmeli.
export default function LoginScreen() {
  // ---- STATE (HAFIZA) ----
  // eposta: kullanıcının şu an input kutusuna yazdığı metin
  // setEposta: bu metni güncellemek için kullanacağımız fonksiyon
  const [eposta, setEposta] = useState('');

  // ---- FONKSİYONLAR ----
  // "Kod gönder" butonuna basılınca bu fonksiyon çalışır
  const kodGonder = () => {
    // Şimdilik sadece konsola yazdırıyoruz, ileride burada
    // gerçek bir sunucuya (backend'e) istek atacağız (örn. fetch ile)
    console.log('Kod gönderiliyor, hedef e-posta:', eposta);

    // Kod doğrulama ekranına geçiş yapıyoruz.
    // Bunu 2. ekranı (app/verify.tsx) oluşturduğumuzda aktif hale getireceğiz.
    // router.push('/verify');
  };

  // ---- GÖRÜNÜM (JSX) ----
  return (
    // SafeAreaView: içeriğin telefonun çentiği/kenarlarıyla çakışmamasını sağlar
    <SafeAreaView style={styles.container}>

      {/* Beyaz, yuvarlak köşeli ana kart */}
      <View style={styles.card}>

        {/* Logo için yuvarlak, açık yeşil çerçeve */}
        <View style={styles.logoCerceve}>
          <View style={styles.logo} />
        </View>

        {/* Başlık ve alt açıklama */}
        <Text style={styles.baslik}>CrossPuzzle</Text>
        <Text style={styles.altBaslik}>
          Notlarından bulmaca, bulmacadan öğrenme
        </Text>

        {/* E-posta etiketi */}
        <Text style={styles.etiket}>E-posta</Text>

        {/* E-posta yazma kutusu */}
        <TextInput
          style={styles.input}
          placeholder="ad@universite.edu.tr" // Kutu boşken görünen soluk yazı
          placeholderTextColor="#a0a0a0"
          value={eposta}                      // Kutunun şu anki değeri = state'imiz
          onChangeText={setEposta}             // Her harf yazıldığında state'i güncelle
          keyboardType="email-address"         // Telefonda e-posta klavyesi açılsın
          autoCapitalize="none"                // Otomatik büyük harfe çevirmesin
        />

        {/* "Kod gönder" butonu */}
        <TouchableOpacity style={styles.buton} onPress={kodGonder}>
          <Text style={styles.butonYazi}>Kod gönder</Text>
        </TouchableOpacity>

        {/* Alt açıklama yazısı */}
        <Text style={styles.aciklama}>
          Şifre yok — e-postana tek kullanımlık giriş kodu göndeririz.
        </Text>

      </View>
    </SafeAreaView>
  );
}

// ============================================
// STİLLER
// Web'deki CSS'e benzer ama JavaScript objesi şeklinde yazılır.
// Her View/Text'in style={} özelliğiyle buradaki tanımlara bağlanır.
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Ekranın tamamını kapla
    backgroundColor: '#f5f5f5', // Açık gri arka plan
    justifyContent: 'center',   // Dikeyde ortala
    alignItems: 'center',       // Yatayda ortala
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,               // Kart çok genişlemesin (tablet için)
    backgroundColor: '#ffffff',
    borderRadius: 16,            // Yuvarlak köşeler
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  logoCerceve: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#d7f0e6',  // Açık mint yeşili
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#9ed6bd',
  },
  baslik: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  altBaslik: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,
  },
  etiket: {
    alignSelf: 'flex-start',  // Kartın soluna yasla
    fontSize: 13,
    color: '#555555',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  buton: {
    width: '100%',
    backgroundColor: '#2f9e78',  // Ana yeşil renk
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  butonYazi: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  aciklama: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
