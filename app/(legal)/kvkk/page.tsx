import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Eagle QR",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <>
      <h1>KVKK Aydınlatma Metni</h1>
      <p className="!mt-2 text-sm !text-ink/45">Son güncelleme: 30 Mayıs 2026</p>

      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, veri
        sorumlusu sıfatıyla Eagle QR tarafından kişisel verilerinizin nasıl
        işlendiğine ilişkin olarak sizi bilgilendirmek isteriz.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        Veri sorumlusu Eagle QR’dır. İletişim:{" "}
        <a href="mailto:info@eagleqr.com">info@eagleqr.com</a>
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>Kimlik ve iletişim verileri (ör. e-posta adresi).</li>
        <li>İşlem güvenliği verileri (oturum ve giriş kayıtları).</li>
        <li>İşletme tarafından oluşturulan menü ve içerik verileri.</li>
      </ul>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Hizmetin sunulması ve sözleşmenin ifası.</li>
        <li>Hesap güvenliğinin sağlanması.</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
      </ul>

      <h2>4. Hukuki Sebepler</h2>
      <p>
        Kişisel verileriniz; bir sözleşmenin kurulması veya ifasıyla doğrudan
        ilgili olması, hukuki yükümlülüğün yerine getirilmesi ve veri
        sorumlusunun meşru menfaati hukuki sebeplerine dayanılarak işlenir.
      </p>

      <h2>5. Aktarım</h2>
      <p>
        Verileriniz, hizmetin sunulması için gerekli olduğu ölçüde barındırma ve
        altyapı hizmet sağlayıcılarıyla, mevzuata uygun şekilde paylaşılabilir.
      </p>

      <h2>6. Haklarınız (KVKK m.11)</h2>
      <p>
        Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna
        ilişkin bilgi talep etme, işlenme amacını öğrenme, eksik veya yanlış
        işlenmişse düzeltilmesini, şartları oluştuğunda silinmesini isteme ve
        işlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir
        sonuç doğmasına itiraz etme haklarına sahipsiniz.
      </p>

      <h2>7. Başvuru</h2>
      <p>
        Haklarınızı kullanmak için{" "}
        <a href="mailto:info@eagleqr.com">info@eagleqr.com</a> adresine
        başvurabilirsiniz.
      </p>
    </>
  );
}
