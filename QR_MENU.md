# QR Menü Sistemi — MVP Dokümanı

**Versiyon 1.0 • Mayıs 2026**  
15+ rakip analizi ile hazırlanmıştır.

---

# 1. Yönetici Özeti

QR Menü Sistemi, restoran ve cafe işletmelerinin fiziksel menü ihtiyacını ortadan kaldıran, hem işletme sahibi hem de müşteri için uçtan uca kişiselleştirilmiş bir dijital menü platformudur.

Piyasadaki 15+ rakip analiz edilmiş; mevcut çözümlerin hiçbirinin sunmadığı kullanıcı kimlik profili ve çapraz restoran öneri motoru bu sistemin temel rekabet avantajını oluşturmaktadır.

| Analiz edilen rakip | Toplam özellik | Fark yaratan | Hedef kullanıcı    |
| ------------------- | -------------- | ------------ | ------------------ |
| 15+                 | 80+            | 6 benzersiz  | Restoran & Müşteri |

---

# 2. Problem & Fırsat

## 2.1 Mevcut Sorunlar

- Basılı menüler: güncelleme maliyeti yılda 200–500$, baskı süresi kayıpları
- PDF menüler: mobilde okunaksız, zoom gerektirir, statik yapı
- Mevcut QR menü rakipleri: işletme odaklı — müşteriyi anonim ziyaretçi görür
- Alerjen bilgisi eksik ya da yetersiz — AB regülasyonu uyumsuzluk riski
- Çok dil desteği ya yok ya da makine çevirisiyle kötü kalitede

## 2.2 Pazar Fırsatı

- QR kod menü pazarı 2026 itibarıyla yıllık %20 büyüyor
- Tüketicilerin %78'i QR menüleri fiziksel menüye tercih ediyor
- Rakip platformlar 50–200$/ay/lokasyon alıyor
- Kullanıcı profili + çapraz restoran önerisi: rakiplerin hiçbiri yapmıyor

---

# 3. Ürün Vizyonu & Farklılaştırıcılar

Hedef: Hem restorana hem müşteriye değer katan, rakiplerin ortalamasındaki tüm özellikleri barındıran ve hiçbirinin sunmadığı kullanıcı profil katmanını içeren tek QR menü platformu olmak.

## 3.1 Rakiplerden Fark Yaratan 6 Özellik

| Özellik                      | Açıklama                                   | Rakiplerde durumu |
| ---------------------------- | ------------------------------------------ | ----------------- |
| Kullanıcı profil sistemi     | Alerjen, dil, favori mutfak, acı toleransı | Hiçbirinde yok    |
| Çapraz restoran öneri motoru | Kişiye özel öneriler                       | Hiçbirinde yok    |
| AI menü mühendisliği         | Marj odaklı öneriler                       | Çok azında        |
| Ürün hazırlanış videosu      | 30 sn kısa clip                            | Hemen hiçbirinde  |
| Menü versiyonlama            | Tek tıkla geri dönüş                       | Yok               |
| Eşleşen içecek önerisi       | Yemek–içecek pairing                       | Yok               |

---

# 4. Kullanıcı Profil Sistemi

## 4.1 Profil İçeriği

| Veri alanı       | Açıklama                     | Kullanım amacı      |
| ---------------- | ---------------------------- | ------------------- |
| Alerjen listesi  | 14 AB kategorisi + tercihler | Otomatik filtreleme |
| Favori mutfaklar | Çoklu seçim                  | Otomatik sıralama   |
| Acı toleransı    | Hiç / Az / Orta / Çok        | Kişisel uyarı       |
| Puanlama geçmişi | Yıldız verileri              | Öneri motoru        |
| Dil tercihi      | Tek seçim                    | Global kullanım     |
| Ziyaret geçmişi  | Restoran ziyaretleri         | Sadakat & öneri     |

## 4.2 Kullanıcı Yolculuğu

1. QR tara → anonim menü açılır
2. “Alerjenimi kaydet” daveti
3. Menü otomatik filtrelenir
4. Sistem öğrenmeye başlar
5. Collaborative filtering devreye girer

---

# 5. Müşteri Deneyimi Özellikleri

## 5.1 Menüye Erişim & Navigasyon

- PWA destekli anlık açılış
- Masa bazlı QR sistemi
- Offline önbellekleme
- Karanlık/Aydınlık mod
- NFC desteği (Faz 2)

## 5.2 Ürün Listeleme & Filtreleme

- Anlık arama
- Alerjen filtreleri
- Kalori ve besin değerleri
- Fiyat filtreleme
- Popüler / Chef's Special etiketleri
- Dinamik öneri bandı

## 5.3 Çok Dil & Lokalizasyon

Desteklenen diller:

- TR
- EN
- DE
- FR
- AR
- RU
- ZH
- JA
- ES
- IT

## 5.4 Ürün Detay & Geri Bildirim

- Büyük ürün görselleri
- Eşleşen içecek önerisi
- Hazırlanış videosu
- Yıldız puanı ve yorum
- “Diğerleri de baktı” alanı

---

# 6. İşletme Sahibi Paneli

## 6.1 Menü Yönetimi

- Sürükle-bırak editör
- Excel/CSV import
- Sold-out yönetimi
- Menü versiyonlama
- AI destekli açıklama oluşturma

## 6.2 Çoklu Menü Yönetimi

- Sabah/öğle/akşam menüsü
- Mevsimlik menü
- Özel gün menüsü

## 6.3 Analitik & Raporlama

- Tarama sayısı
- Ürün görüntüleme analizi
- Heatmap
- Masa analizi
- Menü mühendisliği
- PDF/Excel export

---

# 7. Teknik Mimari

## 7.1 Performans Hedefleri

| Metrik          | Hedef         |
| --------------- | ------------- |
| LCP             | < 1.5 saniye  |
| Kurulum → yayın | < 15 dakika   |
| Offline çalışma | Destekleniyor |

## 7.2 Teknoloji Kararları

- PWA mimarisi
- WebP + CDN
- Dinamik QR
- GDPR uyumluluğu
- 2FA zorunluluğu

---

# 8. MVP Kapsamı

## 8.1 MVP’ye Girecekler (0–3 ay)

| Özellik             | Öncelik |
| ------------------- | ------- |
| QR menü görüntüleme | Kritik  |
| Menü editörü        | Kritik  |
| Çok dil desteği     | Kritik  |
| Alerjen filtreleme  | Kritik  |
| Temel analitik      | Yüksek  |
| Kullanıcı profili   | Yüksek  |

## 8.2 Faz 2

- Menü versiyonlama
- Çoklu şube
- Kampanya sistemi
- Video desteği
- WhatsApp entegrasyonu

## 8.3 Faz 3

- POS entegrasyonu
- White-label
- API erişimi
- NFC
- Sesli erişilebilirlik

---

# 9. Fiyatlandırma

| Plan        | Fiyat |
| ----------- | ----- |
| Ücretsiz    | $0    |
| Başlangıç   | $9    |
| Profesyonel | $19   |
| Kurumsal    | $49   |

---

# 10. Başarı Metrikleri

| Metrik              | Ay 3 Hedef |
| ------------------- | ---------- |
| Kayıtlı işletme     | 50         |
| Ödeme yapan işletme | 20         |
| Son kullanıcı       | 5.000      |
| Aylık QR tarama     | 30.000     |

---

# 11. Riskler

| Risk                | Çözüm              |
| ------------------- | ------------------ |
| Kayıt sürtünmesi    | Anonim kullanım    |
| Alerjen sorumluluğu | Veri doğrulama     |
| GDPR riski          | Veri minimizasyonu |
| Büyük rakipler      | Veri hendeği       |

---

# 12. Sonuç

QR Menü Sistemi, klasik QR menü çözümlerinden farklı olarak kullanıcı profil katmanını merkeze alan bir platform yaklaşımı sunmaktadır.

En güçlü tarafı:

- Çapraz restoran kullanıcı profili
- Ölçeklendikçe güçlenen öneri motoru

Bu yapı uzun vadede ciddi bir veri avantajı ve rekabet hendeği oluşturabilir.
