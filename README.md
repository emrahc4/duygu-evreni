Duygu Evreni (Mood Universe)
"Kelimeler, duyguların haritasıdır."

Duygu Evreni, kullanıcının o anki ruh haline göre dinamik ve atmosferik bir deneyim sunan interaktif bir web uygulamasıdır. Seçilen duyguya (Huzurlu, Melankolik, Enerjik vb.) uygun, ekranın farklı yerlerinde beliren ve kaybolan, ilham verici felsefi sözler gösterir.

✨ Ana Özellikler
Bu proje, basit bir animasyon fikrinden yola çıkarak tam özellikli, kişiselleştirilebilir bir web deneyimine dönüştürülmüştür.

1. Dinamik Deneyim
Duyguya Duyarlı Arayüz: Kullanıcının seçtiği 8 farklı duyguya (Huzurlu, Melankolik, Enerjik, Cesur vb.) göre tüm arayüzün atmosferi değişir.

Animasyonlu Temalar: Her duygu için özel olarak tasarlanmış, hareketli ve akışkan CSS Gradient Animasyonları arka planı canlandırır.

Akıllı Söz Akışı: Sözler, setInterval ile belirlenen bir hızda, ekranın rastgele konumlarında belirir ve zarif bir animasyonla (@keyframes etherealDrift) kaybolur.

Tekrarsız Gösterim: Bir söz gösterildikten sonra, (mümkün olduğunca) bir sonraki sözün farklı olması sağlanır.

2. Gelişmiş Kişiselleştirme (Ayarlar Paneli)
Kullanıcılar, sağ üstteki dişli ikonuna tıklayarak deneyimi tamamen özelleştirebilir:

Yazı Tipi Seçimi: Sözlerin fontunu "El Yazısı" (Caveat) ve "Standart" (Lato) arasında anında değiştirme.

Animasyon Hızı: Sözlerin akış hızını "Yavaş", "Normal" veya "Hızlı" olarak ayarlama.

Arka Plan Efekti: particles.js ile oluşturulan parçacık efektini performans veya sadelik tercihi için açıp kapatma.

3. Kalıcı Hafıza & Etkileşim
🌓 Açık/Koyu Tema: Tek tıkla tema değiştirme. Kullanıcının seçimi localStorage'a kaydedilir ve site tekrar ziyaret edildiğinde tercih edilen tema ile açılır.

❤️ Favori Sistemi:

Söz akışını Duraklatma (Pause).

Duraklatılan sözü Beğenme (kalp animasyonuyla) ve localStorage'a kaydetme.

Favorilerim Ekranı: Kaydedilen tüm sözleri listeleme, silme ve kopyalama.

📋 Panoya Kopyalama:

Hem duraklatılan anlık sözü hem de favoriler listesindeki sözleri (navigator.clipboard API'si ile) tek tıkla panoya kopyalama.

Başarılı kopyalamada "Kopyalandı!" bildirimi.

4. Profesyonel Arayüz ve Kullanıcı Deneyimi
🔀 Beni Şaşırt! Modu: Ana ekrandaki bu buton, tüm kategorilerdeki yüzlerce söz arasından tamamen rastgele bir tanesini seçer ve gösterir.

🔊 Atmosferik Sesler:

Arka planda çalan sakinleştirici yağmur sesi (<audio>).

Tüm buton tıklamaları için tatmin edici ses efektleri.

Sesleri tamamen açıp kapatmak için global "Mute" butonu.

⏳ Yükleme Ekranı: Tüm varlıklar (fontlar, JSON, sesler) yüklenene kadar gösterilen, CSS ile animasyonlu bir "preloader".

🧭 Akıllı Navigasyon: Tüm ekranlar arası (Ana Ekran, Duygu Seçimi, Gösterim Ekranı, Favoriler) tutarlı ve kolay gezinme sağlayan geri butonları ve global kontroller.

✒️ Geliştirici İmzası: Uygulamanın kime ait olduğunu gösteren ve sosyal medya linklerini içeren profesyonel bir footer bölümü.

Aşağıda özelliklerin bir özeti tablo halinde verilmiştir:

🛠️ Kullanılan Teknolojiler
Bu proje, harici kütüphanelere minimum düzeyde bağımlı kalarak, modern web teknolojilerinin gücünü göstermektedir.

HTML5: Anlamsal (semantic) elementler ve modern yapı.

CSS3 (Modern):

CSS Değişkenleri (Variable) (Temalar ve Ayarlar için temel)

@keyframes (Gelişmiş Arka Plan ve Element Animasyonları için)

Flexbox & Grid (Modern Arayüz Yerleşimi)

backdrop-filter (Panellerde bulanıklık efekti için)

::before, ::after (UI detayları için)

JavaScript (ES6+):

Asenkron Programlama: async/await (Harici quotes.json verisi için fetch API)

Web API'leri:

localStorage (Ayarlar, Favoriler ve Tema hafızası için)

HTML5 Audio API (Ses kontrolleri)

Navigator.Clipboard API (Panoya kopyalama)

Modern DOM Manipülasyonu: (Element oluşturma, sınıf yönetimi)

Olay Yönetimi: addEventListener ve event delegation (Favori listesi gibi dinamik içerikler için)

Harici Kütüphaneler:

Particles.js: Ayarlardan kapatılabilen, isteğe bağlı arka plan parçacık efekti için.

⚙️ Kurulum ve Çalıştırma
Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

Projeyi klonlayın veya indirin:

Proje dizinine gidin:

Gerekli Varlıklar (Assets):

Proje kök dizininde assets adında bir klasör oluşturun.

İçine rain.mp3 (arka plan müziği) ve click.mp3 (tıklama sesi) dosyalarınızı ekleyin.

(ÖNEMLİ) Projeyi Çalıştırma: Bu proje, harici quotes.json dosyasını fetch API'si ile okuduğu için tarayıcı güvenlik politikaları (CORS) nedeniyle doğrudan file:/// protokolü üzerinden çalışmayacaktır.

Projeyi mutlaka bir yerel sunucu (local server) üzerinden çalıştırmalısınız.

Tavsiye Edilen Yöntem (VS Code):

VS Code kullanıyorsanız, "Live Server" adlı eklentiyi kurun.

Eklentiyi kurduktan sonra index.html dosyasına sağ tıklayın ve "Open with Live Server" seçeneğini seçin.

Projeniz otomatik olarak http://127.0.0.1:5500 (veya benzeri) bir adreste açılacak ve tüm özellikler çalışacaktır.

