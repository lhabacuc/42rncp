import { Card, CardContent } from "@/components/ui/card";
import { getRequestLocale } from "@/lib/i18n";

function PrivacyPolicyEn() {
  return (
    <article className="prose max-w-none text-justify prose-headings:text-foreground prose-p:text-muted-foreground">
      <h1>Privacy Policy</h1>
      <h2>Effective Date: 26/06/2024</h2>
      <p>
        Welcome to 42calculator. Your privacy is important to us. This Privacy
        Policy explains how we collect, use, disclose, and safeguard your
        information when you visit https://42calculator.fr.
      </p>
      <h2>1. Information We Collect</h2>
      <h3>&#x2022; Temporary Data Storage</h3>
      <p>
        We do not permanently store personal information. Data retrieved from
        the 42 API, including the user&apos;s cursus and projects, is stored
        temporarily in Redis for up to 24 hours.
      </p>
      <h3>&#x2022; Cookies</h3>
      <p>
        We use cookies only for user session management and proper website
        functioning.
      </p>
      <h2>2. How We Use Your Information</h2>
      <h3>&#x2022; Session Management</h3>
      <p>
        Temporary Redis data is used to fetch relevant information from the 42
        API during your visit and is deleted after the retention period.
      </p>
      <h2>3. Disclosure of Your Information</h2>
      <p>
        We do not share, sell, or disclose your information to third parties.
      </p>
      <h2>4. Cookies and Tracking Technologies</h2>
      <h3>&#x2022; Cookies</h3>
      <p>
        Cookies are essential for session handling and do not track personal
        information beyond the session duration.
      </p>
      <h2>5. Security of Your Information</h2>
      <p>
        We apply administrative, technical, and physical safeguards to protect
        temporary data, but no system is completely secure.
      </p>
      <h2>6. Data Deletion</h2>
      <p>
        Users can delete their stored data through the user management section.
      </p>
      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy from time to time. Changes are effective when
        posted on this page.
      </p>
    </article>
  );
}

function PrivacyPolicyPt() {
  return (
    <article className="prose max-w-none text-justify prose-headings:text-foreground prose-p:text-muted-foreground">
      <h1>Política de Privacidade</h1>
      <h2>Data de Vigência: 26/06/2024</h2>
      <p>
        Bem-vindo ao 42calculator. A sua privacidade é importante para nós.
        Esta política explica como recolhemos, usamos, divulgamos e protegemos
        as suas informações ao visitar https://42calculator.fr.
      </p>
      <h2>1. Informações que Recolhemos</h2>
      <h3>&#x2022; Armazenamento Temporário de Dados</h3>
      <p>
        Não armazenamos informações pessoais de forma permanente. Os dados
        obtidos pela API da 42, incluindo cursus e projetos, são guardados
        temporariamente em Redis por até 24 horas.
      </p>
      <h3>&#x2022; Cookies</h3>
      <p>
        Usamos cookies apenas para gestão de sessão e funcionamento correto do
        site.
      </p>
      <h2>2. Como Usamos as Suas Informações</h2>
      <h3>&#x2022; Gestão de Sessão</h3>
      <p>
        Os dados temporários no Redis são usados para obter informações
        relevantes da API da 42 durante a visita e são removidos após o período
        de retenção.
      </p>
      <h2>3. Divulgação das Suas Informações</h2>
      <p>
        Não partilhamos, vendemos nem divulgamos as suas informações a
        terceiros.
      </p>
      <h2>4. Cookies e Tecnologias de Rastreamento</h2>
      <h3>&#x2022; Cookies</h3>
      <p>
        Os cookies são essenciais para a sessão e não rastreiam dados pessoais
        além da duração da sessão.
      </p>
      <h2>5. Segurança das Suas Informações</h2>
      <p>
        Aplicamos medidas administrativas, técnicas e físicas para proteger os
        dados temporários, mas nenhum sistema é totalmente seguro.
      </p>
      <h2>6. Eliminação de Dados</h2>
      <p>
        O utilizador pode eliminar os dados armazenados na secção de gestão de
        utilizador.
      </p>
      <h2>7. Alterações desta Política</h2>
      <p>
        Podemos atualizar esta política periodicamente. As alterações entram em
        vigor quando publicadas nesta página.
      </p>
    </article>
  );
}

export default async function PrivacyPolicy() {
  const locale = await getRequestLocale();

  return (
    <main className="container grow justify-center p-4 md:p-12 lg:p-24">
      <Card className="w-full bg-card/5 backdrop-blur-sm">
        <CardContent className="p-0 md:p-6">
          {locale === "pt" ? <PrivacyPolicyPt /> : <PrivacyPolicyEn />}
        </CardContent>
      </Card>
    </main>
  );
}
