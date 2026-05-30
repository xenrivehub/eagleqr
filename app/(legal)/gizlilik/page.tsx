import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Eagle QR",
  description: "Eagle QR gizlilik politikası ve veri kullanımı.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Gizlilik Politikası</h1>
      <p className="!mt-2 text-sm !text-ink/45">Son güncelleme: 30 Mayıs 2026</p>

      <p>
        Bu politika, Eagle QR’ı (“Platform”) kullanırken hangi verilerin nasıl
        işlendiğini açıklar. Gizliliğinize önem veriyor ve veri minimizasyonu
        ilkesini benimsiyoruz.
      </p>

      <h2>1. İşlenen Veriler</h2>
      <ul>
        <li><strong>Hesap verileri:</strong> İşletme yetkilisinin e-posta adresi
          ve şifre özeti (hash) gibi kayıt bilgileri.</li>
        <li><strong>İşletme içeriği:</strong> Menü, ürün, görsel, video ve 3D
          model gibi işletmenin oluşturduğu içerikler.</li>
        <li><strong>Anonim kullanım verileri:</strong> QR tarama ve ürün
          görüntüleme gibi kişiyle ilişkilendirilmeyen analitik veriler.</li>
        <li><strong>Tarayıcıda saklanan tercihler:</strong> Alerjen filtresi gibi
          tercihler yalnızca kullanıcının cihazında (localStorage) tutulur,
          sunucularımıza gönderilmez.</li>
      </ul>

      <h2>2. Verilerin Kullanım Amacı</h2>
      <ul>
        <li>Hizmeti sunmak, hesabı yönetmek ve menüyü yayınlamak.</li>
        <li>Platform performansını ölçmek ve işletmeye temel analitik sağlamak.</li>
        <li>Güvenliği sağlamak ve kötüye kullanımı önlemek.</li>
      </ul>

      <h2>3. Çerezler ve Yerel Depolama</h2>
      <p>
        Oturum yönetimi için zorunlu çerezler ve kullanıcı tercihlerini hatırlamak
        için tarayıcı yerel depolaması (localStorage) kullanılır. Alerjen filtresi
        tercihleri anonimdir ve yalnızca cihazınızda saklanır.
      </p>

      <h2>4. Üçüncü Taraf Hizmet Sağlayıcılar</h2>
      <p>
        Platform; barındırma ve medya depolama için altyapı sağlayıcılarından
        (ör. bulut barındırma ve içerik dağıtım hizmetleri) yararlanır. Bu
        sağlayıcılar yalnızca hizmetin sunulması için gerekli verilere erişir.
      </p>

      <h2>5. Veri Saklama</h2>
      <p>
        Veriler, hizmetin sunulması için gereken süre boyunca ve yasal
        yükümlülükler kapsamında saklanır. Hesabın kapatılması halinde ilgili
        veriler makul süre içinde silinir veya anonimleştirilir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>
        Kişisel verilerinize erişme, düzeltme ve silinmesini talep etme
        haklarına sahipsiniz. Bu haklara ilişkin ayrıntılar için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> sayfasını inceleyebilirsiniz.
      </p>

      <h2>7. İletişim</h2>
      <p>
        Gizlilikle ilgili talepleriniz için:{" "}
        <a href="mailto:info@eagleqr.com">info@eagleqr.com</a>
      </p>
    </>
  );
}
