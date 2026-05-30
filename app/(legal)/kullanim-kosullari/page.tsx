import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Eagle QR",
  description: "Eagle QR dijital menü platformu kullanım koşulları.",
};

export default function TermsPage() {
  return (
    <>
      <h1>Kullanım Koşulları</h1>
      <p className="!mt-2 text-sm !text-ink/45">Son güncelleme: 30 Mayıs 2026</p>

      <h2>1. Taraflar ve Kapsam</h2>
      <p>
        Bu Kullanım Koşulları, Eagle QR dijital menü platformunu (“Platform”)
        kullanan işletmeler ve son kullanıcılar ile Platform sahibi arasındaki
        ilişkiyi düzenler. Platforma kayıt olarak veya Platformu kullanarak bu
        koşulları kabul etmiş sayılırsınız.
      </p>

      <h2>2. Hizmet Tanımı</h2>
      <p>
        Eagle QR; işletmelerin dijital menü oluşturmasını, QR kod ile
        yayınlamasını, ürünlerine görsel, video ve 3D/AR içerik eklemesini, çok
        dilli sunum ve temel analitik gibi özelliklerden yararlanmasını sağlayan
        bir yazılım hizmetidir (SaaS).
      </p>

      <h2>3. Hesap ve İşletme Sorumlulukları</h2>
      <ul>
        <li>İşletme, hesap bilgilerinin gizliliğinden ve hesabı altında
          gerçekleştirilen tüm işlemlerden sorumludur.</li>
        <li>İşletme, menüde yayınladığı tüm içeriğin (ürün adları, açıklamalar,
          fiyatlar, görseller, videolar, 3D modeller) doğruluğundan, güncelliğinden
          ve üçüncü kişilerin haklarını ihlal etmemesinden tek başına sorumludur.</li>
        <li>İşletme, yüklediği medya içeriğine ilişkin gerekli tüm haklara sahip
          olduğunu beyan ve taahhüt eder.</li>
      </ul>

      <h2>4. İçerik Doğruluğu ve Alerjen Bilgisi</h2>
      <p>
        Menüdeki alerjen bilgileri tamamen ilgili işletme tarafından girilir ve
        güncellenir. Eagle QR bu bilgilerin doğruluğundan, eksikliğinden veya
        güncelliğinden sorumlu değildir. Platformda sunulan alerjen filtresi
        yalnızca işletmenin girdiği verilere dayanır; bir üründe alerjen
        belirtilmemiş olması o ürünün ilgili alerjeni içermediği anlamına gelmez.
      </p>
      <p>
        Alerjisi veya gıda hassasiyeti olan kullanıcıların sipariş öncesinde
        işletme personeline danışması önerilir. Alerjen bilgisinin eksik veya
        hatalı girilmesinden doğabilecek her türlü zarardan ilgili işletme
        sorumludur.
      </p>

      <h2>5. Kabul Edilmeyen Kullanım</h2>
      <p>
        Platform; yasa dışı, yanıltıcı, telif veya marka haklarını ihlal eden ya
        da üçüncü kişilere zarar veren içerikler yayınlamak için kullanılamaz. Bu
        tür kullanımlar tespit edildiğinde hesap askıya alınabilir.
      </p>

      <h2>6. Ücretlendirme</h2>
      <p>
        Abonelik planları ve ücretlendirme koşulları ayrıca belirlenecek olup,
        yürürlüğe girdiğinde Platform üzerinden duyurulacaktır. Ücretli planlara
        ilişkin şartlar bu koşulların ayrılmaz bir parçası olacaktır.
      </p>

      <h2>7. Hizmetin Sürekliliği ve Askıya Alma</h2>
      <p>
        Eagle QR, bakım, güncelleme veya teknik zorunluluklar nedeniyle hizmette
        geçici kesintiler yaşanabileceğini ve koşulları ihlal eden hesapları
        önceden bildirimde bulunarak ya da bulunmaksızın askıya alma hakkını saklı
        tutar.
      </p>

      <h2>8. Sorumluluğun Sınırlandırılması</h2>
      <p>
        Platform “olduğu gibi” sunulmaktadır. Eagle QR; işletme içeriğinden,
        işletme ile son kullanıcı arasındaki ilişkiden, dolaylı zararlardan ve
        işletmenin yükümlülüklerini yerine getirmemesinden kaynaklanan
        sonuçlardan sorumlu tutulamaz.
      </p>

      <h2>9. Değişiklikler</h2>
      <p>
        Eagle QR bu koşulları zaman zaman güncelleyebilir. Güncel sürüm bu sayfada
        yayımlandığı tarihte yürürlüğe girer.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Sorularınız için: <a href="mailto:info@eagleqr.com">info@eagleqr.com</a>
      </p>
    </>
  );
}
