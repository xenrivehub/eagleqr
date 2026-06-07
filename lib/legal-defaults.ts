// ============================================================================
// Yasal sayfaların (Kullanım Koşulları, Gizlilik, KVKK) varsayılan içerikleri.
// İlk açılışta Page kaydı olarak oluşturulur (ensureLegalPages); sonra
// /admin/pages'ten blok editörüyle düzenlenebilir.
// ============================================================================

import type { Block } from "@/lib/page-blocks";

type LegalDoc = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  blocks: Block[];
};

const rt = (id: string, heading: string, body: string): Block => ({ id, type: "richText", heading, body });

export const LEGAL_SLUGS = ["kullanim-kosullari", "gizlilik", "kvkk"];

export const LEGAL_DEFAULTS: LegalDoc[] = [
  {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    seoTitle: "Kullanım Koşulları — Eagle Menu",
    seoDescription: "Eagle Menu dijital menü platformu kullanım koşulları.",
    blocks: [
      rt("kk-0", "Kullanım Koşulları", "Son güncelleme: 30 Mayıs 2026"),
      rt("kk-1", "1. Taraflar ve Kapsam", "Bu Kullanım Koşulları, Eagle Menu dijital menü platformunu (“Platform”) kullanan işletmeler ve son kullanıcılar ile Platform sahibi arasındaki ilişkiyi düzenler. Platforma kayıt olarak veya Platformu kullanarak bu koşulları kabul etmiş sayılırsınız."),
      rt("kk-2", "2. Hizmet Tanımı", "Eagle Menu; işletmelerin dijital menü oluşturmasını, QR kod ile yayınlamasını, ürünlerine görsel, video ve 3D/AR içerik eklemesini, çok dilli sunum ve temel analitik gibi özelliklerden yararlanmasını sağlayan bir yazılım hizmetidir (SaaS)."),
      rt("kk-3", "3. Hesap ve İşletme Sorumlulukları", "• İşletme, hesap bilgilerinin gizliliğinden ve hesabı altında gerçekleştirilen tüm işlemlerden sorumludur.\n• İşletme, menüde yayınladığı tüm içeriğin (ürün adları, açıklamalar, fiyatlar, görseller, videolar, 3D modeller) doğruluğundan, güncelliğinden ve üçüncü kişilerin haklarını ihlal etmemesinden tek başına sorumludur.\n• İşletme, yüklediği medya içeriğine ilişkin gerekli tüm haklara sahip olduğunu beyan ve taahhüt eder."),
      rt("kk-4", "4. İçerik Doğruluğu ve Alerjen Bilgisi", "Menüdeki alerjen bilgileri tamamen ilgili işletme tarafından girilir ve güncellenir. Eagle Menu bu bilgilerin doğruluğundan, eksikliğinden veya güncelliğinden sorumlu değildir. Platformda sunulan alerjen filtresi yalnızca işletmenin girdiği verilere dayanır; bir üründe alerjen belirtilmemiş olması o ürünün ilgili alerjeni içermediği anlamına gelmez.\n\nAlerjisi veya gıda hassasiyeti olan kullanıcıların sipariş öncesinde işletme personeline danışması önerilir. Alerjen bilgisinin eksik veya hatalı girilmesinden doğabilecek her türlü zarardan ilgili işletme sorumludur."),
      rt("kk-5", "5. Kabul Edilmeyen Kullanım", "Platform; yasa dışı, yanıltıcı, telif veya marka haklarını ihlal eden ya da üçüncü kişilere zarar veren içerikler yayınlamak için kullanılamaz. Bu tür kullanımlar tespit edildiğinde hesap askıya alınabilir."),
      rt("kk-6", "6. Ücretlendirme", "Abonelik planları ve ücretlendirme koşulları Platform üzerinden duyurulur. Ücretli planlara ilişkin şartlar bu koşulların ayrılmaz bir parçasıdır."),
      rt("kk-7", "7. Hizmetin Sürekliliği ve Askıya Alma", "Eagle Menu, bakım, güncelleme veya teknik zorunluluklar nedeniyle hizmette geçici kesintiler yaşanabileceğini ve koşulları ihlal eden hesapları önceden bildirimde bulunarak ya da bulunmaksızın askıya alma hakkını saklı tutar."),
      rt("kk-8", "8. Sorumluluğun Sınırlandırılması", "Platform “olduğu gibi” sunulmaktadır. Eagle Menu; işletme içeriğinden, işletme ile son kullanıcı arasındaki ilişkiden, dolaylı zararlardan ve işletmenin yükümlülüklerini yerine getirmemesinden kaynaklanan sonuçlardan sorumlu tutulamaz."),
      rt("kk-9", "9. Değişiklikler", "Eagle Menu bu koşulları zaman zaman güncelleyebilir. Güncel sürüm bu sayfada yayımlandığı tarihte yürürlüğe girer."),
      rt("kk-10", "10. İletişim", "Sorularınız için: info@eaglemenu.com"),
    ],
  },
  {
    slug: "gizlilik",
    title: "Gizlilik Politikası",
    seoTitle: "Gizlilik Politikası — Eagle Menu",
    seoDescription: "Eagle Menu gizlilik politikası ve veri kullanımı.",
    blocks: [
      rt("gz-0", "Gizlilik Politikası", "Son güncelleme: 30 Mayıs 2026\n\nBu politika, Eagle Menu'yu (“Platform”) kullanırken hangi verilerin nasıl işlendiğini açıklar. Gizliliğinize önem veriyor ve veri minimizasyonu ilkesini benimsiyoruz."),
      rt("gz-1", "1. İşlenen Veriler", "• Hesap verileri: İşletme yetkilisinin e-posta adresi ve şifre özeti (hash) gibi kayıt bilgileri.\n• İşletme içeriği: Menü, ürün, görsel, video ve 3D model gibi işletmenin oluşturduğu içerikler.\n• Anonim kullanım verileri: QR tarama ve ürün görüntüleme gibi kişiyle ilişkilendirilmeyen analitik veriler.\n• Tarayıcıda saklanan tercihler: Alerjen filtresi gibi tercihler yalnızca kullanıcının cihazında tutulur, sunucularımıza gönderilmez."),
      rt("gz-2", "2. Verilerin Kullanım Amacı", "• Hizmeti sunmak, hesabı yönetmek ve menüyü yayınlamak.\n• Platform performansını ölçmek ve işletmeye temel analitik sağlamak.\n• Güvenliği sağlamak ve kötüye kullanımı önlemek."),
      rt("gz-3", "3. Çerezler ve Yerel Depolama", "Oturum yönetimi için zorunlu çerezler ve kullanıcı tercihlerini hatırlamak için tarayıcı yerel depolaması kullanılır. Alerjen filtresi tercihleri anonimdir ve yalnızca cihazınızda saklanır."),
      rt("gz-4", "4. Üçüncü Taraf Hizmet Sağlayıcılar", "Platform; barındırma ve medya depolama için altyapı sağlayıcılarından (ör. bulut barındırma ve içerik dağıtım hizmetleri) yararlanır. Bu sağlayıcılar yalnızca hizmetin sunulması için gerekli verilere erişir."),
      rt("gz-5", "5. Veri Saklama", "Veriler, hizmetin sunulması için gereken süre boyunca ve yasal yükümlülükler kapsamında saklanır. Hesabın kapatılması halinde ilgili veriler makul süre içinde silinir veya anonimleştirilir."),
      rt("gz-6", "6. Haklarınız", "Kişisel verilerinize erişme, düzeltme ve silinmesini talep etme haklarına sahipsiniz. Bu haklara ilişkin ayrıntılar için /kvkk (KVKK Aydınlatma Metni) sayfasını inceleyebilirsiniz."),
      rt("gz-7", "7. İletişim", "Gizlilikle ilgili talepleriniz için: info@eaglemenu.com"),
    ],
  },
  {
    slug: "kvkk",
    title: "KVKK Aydınlatma Metni",
    seoTitle: "KVKK Aydınlatma Metni — Eagle Menu",
    seoDescription: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
    blocks: [
      rt("kv-0", "KVKK Aydınlatma Metni", "Son güncelleme: 30 Mayıs 2026\n\n6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, veri sorumlusu sıfatıyla Eagle Menu tarafından kişisel verilerinizin nasıl işlendiğine ilişkin olarak sizi bilgilendirmek isteriz."),
      rt("kv-1", "1. Veri Sorumlusu", "Veri sorumlusu Eagle Menu'dur. İletişim: info@eaglemenu.com"),
      rt("kv-2", "2. İşlenen Kişisel Veriler", "• Kimlik ve iletişim verileri (ör. e-posta adresi).\n• İşlem güvenliği verileri (oturum ve giriş kayıtları).\n• İşletme tarafından oluşturulan menü ve içerik verileri."),
      rt("kv-3", "3. İşleme Amaçları", "• Hizmetin sunulması ve sözleşmenin ifası.\n• Hesap güvenliğinin sağlanması.\n• Yasal yükümlülüklerin yerine getirilmesi."),
      rt("kv-4", "4. Hukuki Sebepler", "Kişisel verileriniz; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki yükümlülüğün yerine getirilmesi ve veri sorumlusunun meşru menfaati hukuki sebeplerine dayanılarak işlenir."),
      rt("kv-5", "5. Aktarım", "Verileriniz, hizmetin sunulması için gerekli olduğu ölçüde barındırma ve altyapı hizmet sağlayıcılarıyla, mevzuata uygun şekilde paylaşılabilir."),
      rt("kv-6", "6. Haklarınız (KVKK m.11)", "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini, şartları oluştuğunda silinmesini isteme ve işlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonuç doğmasına itiraz etme haklarına sahipsiniz."),
      rt("kv-7", "7. Başvuru", "Haklarınızı kullanmak için info@eaglemenu.com adresine başvurabilirsiniz."),
    ],
  },
];
