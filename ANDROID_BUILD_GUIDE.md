# 📱 Panduan Build APK Aurora Launcher

Dokumen ini menjelaskan cara mem-build Aurora Launcher menjadi file APK yang dapat diinstal di HP Android Anda.

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

1. **Java Development Kit (JDK) 11 atau lebih baru**
   - Download dari: https://www.oracle.com/java/technologies/downloads/
   - Atau gunakan OpenJDK: `sudo apt-get install openjdk-11-jdk`

2. **Android SDK**
   - Download Android Studio dari: https://developer.android.com/studio
   - Atau gunakan command-line tools saja

3. **Gradle** (biasanya sudah termasuk dalam Android Studio)

4. **Node.js dan npm** (sudah terinstal jika Anda menjalankan proyek web)

---

## 🔧 Langkah-Langkah Build

### 1. Persiapan Environment

Pastikan variabel lingkungan sudah diatur dengan benar:

```bash
# Di Linux/Mac
export JAVA_HOME=/path/to/jdk
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Di Windows (gunakan setx atau environment variables)
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
```

### 2. Build Web Assets

Pastikan file web sudah di-build ke folder `dist`:

```bash
npm run build
```

### 3. Sinkronisasi dengan Android

Sinkronisasi perubahan web ke proyek Android:

```bash
npx cap sync android
```

### 4. Build APK Debug (untuk testing)

Masuk ke folder `android` dan jalankan Gradle:

```bash
cd android
./gradlew assembleDebug
```

File APK debug akan berada di: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Build APK Release (untuk production)

Untuk membuat APK yang siap didistribusikan:

```bash
cd android
./gradlew assembleRelease
```

**Catatan:** Anda perlu membuat keystore terlebih dahulu untuk menandatangani APK release.

#### Membuat Keystore (hanya sekali):

```bash
keytool -genkey -v -keystore aurora-launcher.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias aurora-launcher
```

Kemudian, edit file `android/app/build.gradle` dan tambahkan konfigurasi signing:

```gradle
signingConfigs {
    release {
        storeFile file('../aurora-launcher.keystore')
        storePassword 'your_password'
        keyAlias 'aurora-launcher'
        keyPassword 'your_password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

File APK release akan berada di: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📲 Instalasi di HP Android

### Menggunakan ADB (Android Debug Bridge)

1. **Hubungkan HP ke Komputer** via USB
2. **Aktifkan USB Debugging** di HP:
   - Buka Settings → About Phone
   - Ketuk Build Number 7 kali hingga "Developer Mode" aktif
   - Buka Settings → Developer Options
   - Aktifkan "USB Debugging"

3. **Instal APK**:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Menggunakan File Manager

1. **Transfer file APK** ke HP Anda
2. **Buka File Manager** di HP
3. **Cari file APK** dan ketuk untuk menginstal
4. **Izinkan instalasi dari sumber tidak dikenal** jika diminta

---

## 🏠 Mengatur sebagai Launcher Default

Setelah aplikasi terinstal:

1. **Buka aplikasi Aurora Launcher** dari laci aplikasi
2. **Tekan tombol Home** (tombol rumah di HP)
3. **Pilih "Aurora Launcher"** sebagai launcher default
4. **Pilih "Always"** untuk menggunakan sebagai default selamanya

---

## 🐛 Troubleshooting

### Error: "JAVA_HOME is not set"
```bash
# Pastikan JAVA_HOME sudah diatur
echo $JAVA_HOME

# Jika kosong, atur secara manual
export JAVA_HOME=/path/to/jdk
```

### Error: "Android SDK not found"
```bash
# Pastikan ANDROID_HOME sudah diatur
echo $ANDROID_HOME

# Jika kosong, atur secara manual
export ANDROID_HOME=$HOME/Android/Sdk
```

### Error: "Gradle build failed"
```bash
# Bersihkan build cache
cd android
./gradlew clean
./gradlew assembleDebug
```

### APK tidak muncul di HP setelah instalasi
- Pastikan Anda telah mengizinkan instalasi dari sumber tidak dikenal
- Coba instal ulang dengan `adb install -r` (force reinstall)

---

## 📚 Referensi Lebih Lanjut

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/docs)
- [Gradle Build System](https://gradle.org/)

---

## 💡 Tips

- **Untuk development:** Gunakan APK debug, lebih cepat di-build
- **Untuk production:** Gunakan APK release dengan signing yang tepat
- **Untuk testing:** Gunakan emulator Android Studio atau HP fisik dengan USB Debugging

---

Selamat mem-build! 🚀
